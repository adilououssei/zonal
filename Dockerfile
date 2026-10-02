# syntax=docker/dockerfile:1

# --- Étape 1 : build (Node, uniquement le temps de compiler) ---
FROM node:22-alpine AS build
WORKDIR /app

# Dépendances installées avant de copier le code : tant que package.json /
# package-lock.json ne changent pas, Docker réutilise cette couche en cache.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# IMPORTANT : Vite "grave en dur" l'URL de l'API et les clés "site" reCAPTCHA
# dans les fichiers JS au moment du build. Ces valeurs (publiques) viennent de
# .env.production, committé : pour les changer, modifier ce fichier puis
# reconstruire l'image. Ne pas les redéfinir ici avec ARG/ENV : une variable
# d'environnement, même vide, prend le pas sur le fichier .env.production.
RUN npm run build

# --- Étape 2 : servir les fichiers statiques avec Nginx (image finale, ni ---
# --- Node ni le code source n'y sont présents) ---
FROM nginx:1.27-alpine AS frontend

COPY --from=build /app/dist /usr/share/nginx/html
# Les fichiers de /etc/nginx/templates sont passés dans envsubst au démarrage
# par l'image officielle, puis écrits dans /etc/nginx/conf.d/ (sans .template).
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
RUN rm -f /etc/nginx/conf.d/default.conf

# Backend qui fournit les aperçus de liens partagés (voir nginx.conf.template) :
# la même API que celle du site, sauf si on la surcharge au lancement (-e OG_API_URL=...).
ARG VITE_API_URL=http://localhost:8000
ENV OG_API_URL=$VITE_API_URL

EXPOSE 80
