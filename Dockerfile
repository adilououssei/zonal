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

RUN npm run build

# --- Étape 2 : servir les fichiers statiques avec Nginx (image finale, ni ---
# --- Node ni le code source n'y sont présents) ---
FROM nginx:1.27-alpine AS frontend

COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
