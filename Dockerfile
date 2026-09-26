# syntax=docker/dockerfile:1

# --- Étape 1 : build (Node, uniquement le temps de compiler) ---
FROM node:22-alpine AS build
WORKDIR /app

# Dépendances installées avant de copier le code : tant que package.json /
# package-lock.json ne changent pas, Docker réutilise cette couche en cache.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# IMPORTANT : Vite "grave en dur" VITE_API_URL dans les fichiers JS au moment
# du build (import.meta.env n'existe plus une fois le site compilé). Pour
# pointer vers une autre API, il faut reconstruire l'image avec un autre
# --build-arg, pas juste changer une variable d'environnement au lancement.
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

# Idem pour la clé "site" reCAPTCHA v3 (publique) : changer de clé nécessite
# aussi un rebuild de l'image.
ARG VITE_RECAPTCHA_SITE_KEY=
ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY
ARG VITE_RECAPTCHA_V2_SITE_KEY=
ENV VITE_RECAPTCHA_V2_SITE_KEY=$VITE_RECAPTCHA_V2_SITE_KEY

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
