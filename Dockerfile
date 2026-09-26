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
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
