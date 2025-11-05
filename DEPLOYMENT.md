# 🚀 Guide de Déploiement - Application Helpdesk

Ce document détaille les procédures de déploiement de l'application Helpdesk en environnement de production.

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Préparation au déploiement](#préparation-au-déploiement)
- [Méthode 1 : Déploiement avec Docker](#méthode-1--déploiement-avec-docker)
- [Méthode 2 : Déploiement manuel](#méthode-2--déploiement-manuel)
- [Méthode 3 : Déploiement sur Render](#méthode-3--déploiement-sur-render)
- [Méthode 4 : Déploiement sur Railway](#méthode-4--déploiement-sur-railway)
- [Configuration du CI/CD](#configuration-du-cicd)
- [Vérifications post-déploiement](#vérifications-post-déploiement)
- [Maintenance et monitoring](#maintenance-et-monitoring)
- [Rollback](#rollback)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Prérequis

### Logiciels requis
- Git >= 2.x
- Node.js >= 18.x
- npm >= 9.x
- Docker >= 24.x (pour déploiement conteneurisé)
- Docker Compose >= 2.x

### Accès nécessaires
- Compte GitHub (pour CI/CD)
- Serveur de production ou plateforme cloud (Render, Railway, DigitalOcean, etc.)
- Accès SSH au serveur (si déploiement manuel)
- Variables d'environnement configurées

---

## 📦 Préparation au déploiement

### 1. Vérification du code

```bash
# Exécuter les tests
cd backend && npm test
cd ../frontend && npm test

# Vérifier la qualité du code
cd backend && npm run lint  # Si configuré
cd ../frontend && npm run lint
```

### 2. Configuration des variables d'environnement

#### Backend (.env)
```env
# Production
NODE_ENV=production
PORT=5000

# Sécurité - IMPORTANT : Changer ces valeurs !
JWT_SECRET=votre_secret_production_ultra_securise_256bits_minimum
JWT_EXPIRES_IN=24h

# Base de données
DATABASE_PATH=/app/data/database.sqlite

# CORS (URL du frontend en production)
FRONTEND_URL=https://votre-frontend.com
```

#### Frontend (.env)
```env
VITE_API_URL=https://votre-backend.com
```

### 3. Commit et push du code

```bash
git add .
git commit -m "Préparation pour le déploiement en production"
git push origin main
```

---

## 🐳 Méthode 1 : Déploiement avec Docker

### Avantages
- ✅ Isolation complète de l'environnement
- ✅ Reproductibilité garantie
- ✅ Déploiement simplifié
- ✅ Gestion facile des mises à jour

### Étapes

#### 1. Sur le serveur de production

```bash
# Cloner le projet
git clone <url-du-repo>
cd dossier-pro-projet3

# Créer les fichiers d'environnement
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Éditer les fichiers .env avec les valeurs de production
nano backend/.env
nano frontend/.env
```

#### 2. Build et démarrage des conteneurs

```bash
# Build des images
docker-compose build

# Démarrage en mode détaché
docker-compose up -d

# Vérifier que les conteneurs sont en cours d'exécution
docker-compose ps
```

#### 3. Vérification des logs

```bash
# Logs du backend
docker-compose logs -f backend

# Logs du frontend
docker-compose logs -f frontend

# Logs combinés
docker-compose logs -f
```

#### 4. Accès à l'application

- **Frontend** : http://votre-serveur:3000
- **Backend** : http://votre-serveur:5000

### Commandes utiles Docker

```bash
# Arrêter les conteneurs
docker-compose stop

# Redémarrer les conteneurs
docker-compose restart

# Arrêter et supprimer les conteneurs
docker-compose down

# Rebuild et redémarrage
docker-compose up -d --build

# Voir l'utilisation des ressources
docker stats

# Accéder à un conteneur
docker exec -it helpdesk-backend sh
docker exec -it helpdesk-frontend sh
```

---

## 🖥️ Méthode 2 : Déploiement manuel

### Backend

#### 1. Installation sur le serveur

```bash
# Connexion SSH au serveur
ssh user@votre-serveur

# Installation de Node.js (si nécessaire)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cloner le projet
git clone <url-du-repo>
cd dossier-pro-projet3/backend

# Installation des dépendances
npm ci --only=production

# Configuration
cp .env.example .env
nano .env  # Éditer avec les valeurs de production
```

#### 2. Configuration de PM2 (Process Manager)

```bash
# Installation de PM2 globalement
sudo npm install -g pm2

# Démarrage de l'application
pm2 start src/server.js --name helpdesk-backend

# Configuration du démarrage automatique
pm2 startup
pm2 save

# Vérification
pm2 status
pm2 logs helpdesk-backend
```

### Frontend

#### 1. Build de l'application

```bash
cd ../frontend

# Installation des dépendances
npm ci

# Configuration
cp .env.example .env
nano .env  # Éditer avec l'URL du backend

# Build de production
npm run build
```

#### 2. Configuration de Nginx

```bash
# Installation de Nginx
sudo apt-get update
sudo apt-get install nginx

# Configuration du site
sudo nano /etc/nginx/sites-available/helpdesk
```

Contenu du fichier de configuration :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /chemin/vers/dossier-pro-projet3/frontend/dist;
    index index.html;

    # Gestion du SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy vers le backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### 3. Activation et redémarrage de Nginx

```bash
# Créer un lien symbolique
sudo ln -s /etc/nginx/sites-available/helpdesk /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

### Configuration SSL avec Let's Encrypt (recommandé)

```bash
# Installation de Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtention du certificat SSL
sudo certbot --nginx -d votre-domaine.com

# Renouvellement automatique (déjà configuré par défaut)
sudo certbot renew --dry-run
```

---

## ☁️ Méthode 3 : Déploiement sur Render

[Render](https://render.com) offre un hébergement gratuit pour les applications web.

### Backend

1. **Créer un compte sur Render**

2. **Nouveau Web Service**
   - Cliquer sur "New +" → "Web Service"
   - Connecter votre dépôt GitHub
   - Sélectionner le projet

3. **Configuration**
   ```
   Name: helpdesk-backend
   Environment: Node
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   ```

4. **Variables d'environnement**
   - Ajouter toutes les variables du fichier `.env`
   - `NODE_ENV=production`
   - `JWT_SECRET=<générer un secret sécurisé>`
   - `DATABASE_PATH=/opt/render/project/data/database.sqlite`

5. **Déploiement**
   - Cliquer sur "Create Web Service"
   - Render build et déploie automatiquement

### Frontend

1. **Nouveau Static Site**
   - Cliquer sur "New +" → "Static Site"
   - Connecter le même dépôt

2. **Configuration**
   ```
   Name: helpdesk-frontend
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/dist
   ```

3. **Variables d'environnement**
   ```
   VITE_API_URL=<URL du backend Render>
   ```

4. **Déploiement**
   - Cliquer sur "Create Static Site"

---

## 🚂 Méthode 4 : Déploiement sur Railway

[Railway](https://railway.app) est une autre plateforme moderne avec déploiement simple.

### Étapes

1. **Créer un compte sur Railway**

2. **Nouveau projet**
   - Cliquer sur "New Project"
   - "Deploy from GitHub repo"
   - Sélectionner votre dépôt

3. **Configuration du Backend**
   - Railway détecte automatiquement Node.js
   - Configurer le répertoire racine : `backend`
   - Ajouter les variables d'environnement

4. **Configuration du Frontend**
   - Créer un nouveau service dans le même projet
   - Répertoire racine : `frontend`
   - Variables d'environnement : `VITE_API_URL`

5. **Déploiement automatique**
   - Railway redéploie automatiquement à chaque push

---

## 🔄 Configuration du CI/CD

Le projet inclut un workflow GitHub Actions qui automatise :
- ✅ Tests du backend et frontend
- ✅ Build des applications
- ✅ Build des images Docker
- ✅ Déploiement (si configuré)

### Activation du workflow

1. **Push sur GitHub**
   ```bash
   git push origin main
   ```

2. **Vérification**
   - Aller sur GitHub → Actions
   - Vérifier que le workflow s'exécute correctement

### Configuration des secrets GitHub

Pour le déploiement automatique, configurer les secrets :

1. **Aller dans Settings → Secrets and variables → Actions**

2. **Ajouter les secrets** :
   ```
   RENDER_API_KEY=<votre-clé-api>
   RAILWAY_TOKEN=<votre-token>
   JWT_SECRET=<votre-secret-jwt>
   ```

---

## ✅ Vérifications post-déploiement

### 1. Santé de l'application

```bash
# Backend
curl http://votre-backend.com/

# Frontend
curl http://votre-frontend.com/
```

### 2. Tests de fonctionnalité

1. ✅ Ouvrir le frontend dans un navigateur
2. ✅ Tester l'inscription d'un nouvel utilisateur
3. ✅ Tester la connexion
4. ✅ Créer un ticket
5. ✅ Modifier un ticket
6. ✅ Tester avec un compte admin

### 3. Tests de performance

```bash
# Installer Apache Bench (si nécessaire)
sudo apt-get install apache2-utils

# Test de charge
ab -n 1000 -c 10 http://votre-backend.com/
```

### 4. Monitoring des logs

```bash
# Docker
docker-compose logs -f

# PM2
pm2 logs helpdesk-backend

# Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🔧 Maintenance et monitoring

### Mises à jour

```bash
# Avec Docker
cd dossier-pro-projet3
git pull origin main
docker-compose down
docker-compose up -d --build

# Avec PM2
cd dossier-pro-projet3/backend
git pull origin main
npm ci --only=production
pm2 restart helpdesk-backend
```

### Sauvegarde de la base de données

```bash
# Créer un script de sauvegarde
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/helpdesk"

# Créer le répertoire si nécessaire
mkdir -p $BACKUP_DIR

# Copier la base de données
cp /app/data/database.sqlite $BACKUP_DIR/database_$DATE.sqlite

# Garder seulement les 7 dernières sauvegardes
ls -t $BACKUP_DIR/*.sqlite | tail -n +8 | xargs -r rm

echo "Sauvegarde effectuée : database_$DATE.sqlite"
```

### Automatisation des sauvegardes avec cron

```bash
# Éditer crontab
crontab -e

# Ajouter une sauvegarde quotidienne à 2h du matin
0 2 * * * /chemin/vers/backup.sh
```

### Monitoring des ressources

```bash
# CPU et mémoire
top
htop

# Espace disque
df -h

# Processus
ps aux | grep node
```

---

## ⏪ Rollback

### En cas de problème avec Docker

```bash
# Revenir à la version précédente
git checkout HEAD~1
docker-compose down
docker-compose up -d --build

# Ou utiliser une image précédemment buildée
docker-compose down
docker images  # Trouver l'image précédente
docker tag <image-id> helpdesk-backend:latest
docker-compose up -d
```

### En cas de problème avec PM2

```bash
# Revenir à la version précédente
cd backend
git checkout HEAD~1
npm ci --only=production
pm2 restart helpdesk-backend
```

---

## 🐛 Troubleshooting

### Problème : Le backend ne démarre pas

**Vérifications** :
```bash
# Vérifier les logs
docker-compose logs backend
# ou
pm2 logs helpdesk-backend

# Vérifier les variables d'environnement
cat backend/.env

# Vérifier les permissions
ls -la backend/

# Tester manuellement
cd backend
npm start
```

### Problème : Erreur de connexion à la base de données

**Solution** :
```bash
# Vérifier le chemin de la base de données
ls -la backend/database.sqlite

# Créer le répertoire si nécessaire
mkdir -p backend/data

# Recréer la base de données
cd backend
rm database.sqlite
npm start  # Recrée la base automatiquement
```

### Problème : Le frontend ne communique pas avec le backend

**Vérifications** :
1. ✅ Vérifier `VITE_API_URL` dans `.env` du frontend
2. ✅ Vérifier CORS dans le backend
3. ✅ Tester l'API directement avec curl
4. ✅ Vérifier les logs du navigateur (console F12)

### Problème : Images Docker trop volumineuses

**Solution** :
```bash
# Nettoyer les images inutilisées
docker system prune -a

# Utiliser le multi-stage build (déjà implémenté)
# Les Dockerfiles utilisent déjà cette optimisation
```

### Problème : Out of Memory

**Solution** :
```bash
# Augmenter la limite de mémoire pour Node.js
NODE_OPTIONS=--max-old-space-size=4096 npm start

# Ou dans PM2
pm2 start src/server.js --name helpdesk-backend --max-memory-restart 500M
```

---

## 📊 Checklist de déploiement

### Avant le déploiement
- [ ] Tests réussis (backend et frontend)
- [ ] Variables d'environnement configurées
- [ ] Secrets JWT changés
- [ ] Base de données sauvegardée
- [ ] Documentation à jour
- [ ] CORS configuré correctement
- [ ] SSL/HTTPS configuré

### Pendant le déploiement
- [ ] Build réussi
- [ ] Conteneurs/services démarrés
- [ ] Aucune erreur dans les logs
- [ ] Healthchecks passent

### Après le déploiement
- [ ] Application accessible
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Création de ticket fonctionne
- [ ] Interface admin accessible
- [ ] Performance acceptable
- [ ] Monitoring en place
- [ ] Sauvegardes configurées

---

## 🎓 Ressources supplémentaires

- [Documentation Docker](https://docs.docker.com/)
- [Documentation Nginx](https://nginx.org/en/docs/)
- [Documentation PM2](https://pm2.keymetrics.io/)
- [Guide Render](https://render.com/docs)
- [Guide Railway](https://docs.railway.app/)
- [Let's Encrypt](https://letsencrypt.org/)

---

**Document rédigé dans le cadre du Titre RNCP Concepteur Développeur d'Applications**
