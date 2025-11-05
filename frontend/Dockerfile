# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation de toutes les dépendances (dev + prod)
RUN npm ci

# Copie du code source
COPY . .

# Build de l'application
RUN npm run build

# Stage 2: Serveur de production avec nginx
FROM nginx:alpine

# Copie de la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers buildés depuis le stage builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposition du port
EXPOSE 80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]
