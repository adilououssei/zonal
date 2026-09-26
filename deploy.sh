#!/bin/sh
# Déploie la branche `main` du frontend sur le VPS (conteneur Docker Nginx).
#
# Usage, sur le serveur :
#   cd ~/var/www/zonal && ./deploy.sh              # déployer origin/main
#   ./deploy.sh rollback zonal-frontend:prev-XXXX  # revenir à une sauvegarde
#
# Étapes : vérifie qu'on est sur `main` sans modification locale, récupère
# origin/main, construit l'image (URL API + clés reCAPTCHA lues dans
# .env.production), vérifie que les clés sont bien dans le site construit,
# sauvegarde l'image actuelle, remplace le conteneur, puis contrôle que le site
# répond. Si le site ne répond pas, retour automatique à la sauvegarde.
set -eu

BRANCH=main
CONTAINER=zonal-frontend
IMAGE=zonal-frontend
PORT=3000

cd "$(dirname "$0")"

run_container() {
  docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
  docker run -d --name "$CONTAINER" --restart unless-stopped -p "$PORT:80" "$1" >/dev/null
}

site_responds() {
  sleep 2
  curl -fsS -o /dev/null "http://localhost:$PORT/"
}

if [ "${1:-}" = "rollback" ]; then
  target="${2:?Indiquer l'image, ex : ./deploy.sh rollback $IMAGE:prev-2026-09-26}"
  echo "==> Retour à $target"
  run_container "$target"
  site_responds && echo "OK : $target est en ligne." || { echo "ERREUR : le site ne répond pas."; exit 1; }
  exit 0
fi

# --- 1. Contrôles -------------------------------------------------------------
current=$(git rev-parse --abbrev-ref HEAD)
if [ "$current" != "$BRANCH" ]; then
  echo "ERREUR : le dépôt est sur la branche '$current'. Seule '$BRANCH' se déploie."
  echo "Faire : git checkout $BRANCH"
  exit 1
fi
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "ERREUR : fichiers modifiés sur le serveur. Les mettre de côté avec : git stash"
  git status -s --untracked-files=no
  exit 1
fi

# --- 2. Code ------------------------------------------------------------------
echo "==> Récupération de origin/$BRANCH"
git fetch origin "$BRANCH"
git merge --ff-only "origin/$BRANCH"
echo "Version à déployer : $(git log --oneline -1)"

# --- 3. Construction (le site en ligne n'est pas touché si ça échoue) ----------
echo "==> Construction de l'image"
docker build -t "$IMAGE:new" .

echo "==> Vérification des clés reCAPTCHA dans le site construit"
for key in $(grep -E '^VITE_RECAPTCHA[A-Z0-9_]*=' .env.production | cut -d= -f2); do
  if ! docker run --rm "$IMAGE:new" sh -c "grep -rqF '$key' /usr/share/nginx/html/assets"; then
    echo "ERREUR : clé $key absente du site construit. Déploiement annulé."
    exit 1
  fi
done

# --- 4. Sauvegarde puis remplacement -------------------------------------------
backup=""
if docker container inspect "$CONTAINER" >/dev/null 2>&1; then
  backup="$IMAGE:prev-$(date +%Y-%m-%d-%H%M)"
  docker tag "$(docker inspect "$CONTAINER" --format '{{.Image}}')" "$backup"
  echo "Sauvegarde de la version actuelle : $backup"
fi

echo "==> Remplacement du conteneur"
run_container "$IMAGE:new"

if site_responds; then
  docker tag "$IMAGE:new" "$IMAGE:latest"
  echo ""
  echo "OK : nouvelle version en ligne ($(git log --oneline -1))."
  [ -n "$backup" ] && echo "En cas de problème : ./deploy.sh rollback $backup"
else
  echo "ERREUR : le site ne répond pas."
  if [ -n "$backup" ]; then
    echo "Retour automatique à $backup"
    run_container "$backup"
  fi
  exit 1
fi
