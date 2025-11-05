# Stage 1: Build
FROM node:18-slim AS builder

WORKDIR /app

# Installation des dépendances de build nécessaires pour bcrypt et sqlite3
RUN apt-get update && \
    apt-get install -y python3 make g++ sqlite3 && \
    rm -rf /var/lib/apt/lists/*

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci --only=production

# Copie du code source
COPY . .

# Stage 2: Production
FROM node:18-slim

WORKDIR /app

# Installation des dépendances runtime nécessaires
RUN apt-get update && \
    apt-get install -y sqlite3 && \
    rm -rf /var/lib/apt/lists/*

# Création d'un utilisateur non-root pour la sécurité
RUN groupadd -r nodejs --gid=1001 && \
    useradd -r -g nodejs --uid=1001 nodejs

# Copie des fichiers depuis le builder
COPY --from=builder --chown=nodejs:nodejs /app /app

# Création du répertoire pour la base de données avec les bonnes permissions
# IMPORTANT: Sur Render, utiliser /tmp pour les fichiers SQLite car /app est read-only
RUN mkdir -p /app/data && chown -R nodejs:nodejs /app/data && \
    mkdir -p /tmp/data && chown -R nodejs:nodejs /tmp/data

# Utilisation de l'utilisateur non-root
USER nodejs

# Exposition du port
EXPOSE 5000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=5000

# Commande de démarrage
CMD ["node", "src/server.js"]
