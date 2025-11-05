# 🎫 Helpdesk - Application de Gestion de Tickets

![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Application web complète de gestion de tickets de support (Helpdesk) développée dans le cadre du **Titre RNCP Concepteur Développeur d'Applications**.

## 📋 Table des matières

- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement de l'application](#lancement-de-lapplication)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Structure du projet](#structure-du-projet)
- [API Documentation](#api-documentation)
- [Sécurité](#sécurité)
- [Contributeurs](#contributeurs)

## 📖 Description

Cette application permet aux utilisateurs de :
- Créer un compte et se connecter de manière sécurisée
- Soumettre des tickets de support avec titre, description et priorité
- Consulter et modifier leurs tickets
- Suivre l'évolution de leurs demandes

Les administrateurs peuvent :
- Voir tous les tickets du système
- Changer le statut des tickets (en cours, résolu, fermé)
- Gérer l'ensemble des demandes de support

## ✨ Fonctionnalités

### 👤 Authentification
- ✅ Inscription avec validation des données
- ✅ Connexion sécurisée avec JWT
- ✅ Gestion des sessions utilisateur
- ✅ Protection des routes privées

### 🎫 Gestion des tickets
- ✅ Création de tickets avec priorité (basse, moyenne, haute, urgente)
- ✅ Consultation de la liste de tickets
- ✅ Modification des tickets
- ✅ Suppression des tickets
- ✅ Filtrage par statut
- ✅ Détails complets de chaque ticket

### 🔧 Administration
- ✅ Tableau de bord avec statistiques
- ✅ Vue d'ensemble de tous les tickets
- ✅ Modification du statut des tickets
- ✅ Gestion avancée des demandes

## 🛠 Technologies utilisées

### Backend
- **Node.js** (v18+) - Environnement d'exécution JavaScript
- **Express** - Framework web minimaliste
- **Sequelize** - ORM pour la gestion de base de données
- **PostgreSQL** - Base de données relationnelle (production)
- **SQLite** - Base de données légère (développement)
- **JWT** (jsonwebtoken) - Authentification par tokens
- **bcrypt** - Hashage des mots de passe
- **express-validator** - Validation des entrées

### Frontend
- **React** (v18) - Bibliothèque UI
- **React Router** - Navigation côté client
- **Vite** - Build tool moderne et rapide
- **Axios** - Client HTTP
- **CSS3** - Stylisation responsive

### Tests
- **Jest** - Framework de tests JavaScript
- **Supertest** - Tests d'API HTTP
- **React Testing Library** - Tests de composants React
- **Vitest** - Runner de tests pour Vite

### DevOps & Cloud
- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration multi-conteneurs
- **Render** - Plateforme de déploiement cloud
- **PostgreSQL (Render)** - Base de données managée
- **Nginx** - Serveur web pour le frontend

## 📦 Prérequis

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Docker** >= 24.x (optionnel, pour la conteneurisation)
- **Git** >= 2.x

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd dossier-pro-projet3
```

### 2. Installation du Backend

```bash
cd backend
npm install
cp .env.example .env
# Modifier le fichier .env avec vos configurations
```

### 3. Installation du Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
# Modifier le fichier .env avec l'URL de votre backend
```

## ⚙️ Configuration

### Backend (.env)

#### Développement (SQLite)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=votre_secret_jwt_ultra_securise_changez_moi
JWT_EXPIRES_IN=24h
DATABASE_PATH=./database.sqlite
FORCE_SYNC=false
FRONTEND_URL=http://localhost:3000
```

#### Production (PostgreSQL)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=<générer avec: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
JWT_EXPIRES_IN=24h
FORCE_SYNC=true
FRONTEND_URL=https://votre-frontend.onrender.com
```

### Frontend (.env)

#### Développement
```env
VITE_API_URL=http://localhost:5000
```

#### Production
```env
VITE_API_URL=https://votre-backend.onrender.com
```

## 🎬 Lancement de l'application

### Mode développement (recommandé pour tester)

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Le backend démarre sur http://localhost:5000
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# Le frontend démarre sur http://localhost:3000
```

### Mode production

```bash
# Backend
cd backend
npm start

# Frontend (build puis serve)
cd frontend
npm run build
npm run preview
```

### Avec Docker Compose (recommandé pour la production)

```bash
# À la racine du projet
docker-compose up --build

# L'application sera accessible sur :
# - Frontend : http://localhost:3000
# - Backend : http://localhost:5000
```

## 🧪 Tests

### Tests du Backend

```bash
cd backend
npm test                    # Exécution des tests
npm run test:watch         # Mode watch
```

### Tests du Frontend

```bash
cd frontend
npm test                    # Exécution des tests
npm run test:coverage      # Avec rapport de couverture
```

### Exécution de tous les tests

```bash
# Depuis la racine
cd backend && npm test && cd ../frontend && npm test
```

## 📊 Comptes de test

Après le premier lancement (avec `FORCE_SYNC=true`), un compte administrateur est créé :

- **Email** : `admin@helpdesk.com`
- **Mot de passe** : `Admin123!`

## 🚢 Déploiement

### Déploiement sur Render (Recommandé)

#### 1. Backend
1. Créer un **PostgreSQL Database** sur Render
2. Créer un **Web Service** Docker :
   - Repository : `https://github.com/Astray63/Helpdesk`
   - Docker Context Directory : `./backend`
   - Dockerfile Path : `./Dockerfile`
   - Variables d'environnement :
     ```
     NODE_ENV=production
     PORT=5000
     DATABASE_URL=<Internal Database URL de PostgreSQL>
     JWT_SECRET=<générer un token sécurisé>
     JWT_EXPIRES_IN=24h
     FORCE_SYNC=true
     FRONTEND_URL=https://votre-frontend.onrender.com
     ```

#### 2. Frontend
1. Créer un **Web Service** Docker :
   - Repository : `https://github.com/Astray63/Helpdesk`
   - Docker Context Directory : `./frontend`
   - Dockerfile Path : `./Dockerfile`
   - Variables d'environnement :
     ```
     VITE_API_URL=https://votre-backend.onrender.com
     ```

Consultez le fichier [DEPLOYMENT.md](./DEPLOYMENT.md) pour les instructions détaillées.

### Déploiement local avec Docker

```bash
# Build des images
docker-compose build

# Démarrage en arrière-plan
docker-compose up -d

# Vérification des logs
docker-compose logs -f

# Arrêt
docker-compose down
```

## 📁 Structure du projet

```
dossier-pro-projet3/
├── backend/                    # API Backend
│   ├── src/
│   │   ├── config/            # Configuration (DB, etc.)
│   │   ├── controllers/       # Logique métier
│   │   ├── middleware/        # Middlewares (auth, etc.)
│   │   ├── models/            # Modèles Sequelize
│   │   ├── routes/            # Routes Express
│   │   ├── app.js             # Application Express
│   │   └── server.js          # Point d'entrée
│   ├── __tests__/             # Tests
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                   # Application React
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   ├── context/           # Context API (Auth)
│   │   ├── pages/             # Pages de l'application
│   │   ├── services/          # Services API
│   │   ├── __tests__/         # Tests
│   │   ├── App.jsx            # Composant principal
│   │   └── main.jsx           # Point d'entrée
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env.example
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # Pipeline CI/CD
│
├── docker-compose.yml         # Configuration Docker
├── README.md                  # Ce fichier
├── test_plan.md              # Plan de tests
└── DEPLOYMENT.md             # Guide de déploiement
```

## 📡 API Documentation

### Endpoints d'authentification

#### POST `/auth/register`
Inscription d'un nouvel utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### POST `/auth/login`
Connexion d'un utilisateur.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/auth/me`
Récupère les informations de l'utilisateur connecté.

**Headers:**
```
Authorization: Bearer <token>
```

### Endpoints des tickets

#### POST `/tickets`
Crée un nouveau ticket.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Problème de connexion",
  "description": "Je ne peux pas me connecter à mon compte",
  "priority": "high"
}
```

#### GET `/tickets`
Récupère tous les tickets de l'utilisateur (ou tous si admin).

**Headers:**
```
Authorization: Bearer <token>
```

#### GET `/tickets/:id`
Récupère un ticket par son ID.

**Headers:**
```
Authorization: Bearer <token>
```

#### PUT `/tickets/:id`
Met à jour un ticket.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Nouveau titre",
  "description": "Nouvelle description",
  "priority": "medium",
  "status": "in_progress"
}
```

#### DELETE `/tickets/:id`
Supprime un ticket.

**Headers:**
```
Authorization: Bearer <token>
```

## � Migration de base de données

L'application supporte automatiquement SQLite (dev) et PostgreSQL (prod).

### Développement → Production

Lors du déploiement sur Render :
1. Créez une base PostgreSQL
2. Configurez `DATABASE_URL` dans les variables d'environnement
3. Le backend détecte automatiquement PostgreSQL
4. Utilisez `FORCE_SYNC=true` pour la première synchronisation
5. Passez à `FORCE_SYNC=false` après la première exécution

⚠️ **Note** : `FORCE_SYNC=true` réinitialise la base de données !

## �🔒 Sécurité

- ✅ Mots de passe hashés avec bcrypt (10 rounds)
- ✅ Authentification JWT avec expiration
- ✅ Validation des entrées côté serveur
- ✅ Protection CSRF via tokens
- ✅ Headers de sécurité HTTP (X-Frame-Options, CSP, etc.)
- ✅ Gestion des erreurs sécurisée
- ✅ Variables d'environnement pour les secrets
- ✅ Utilisation d'un ORM pour éviter les injections SQL
- ✅ CORS configuré correctement
- ✅ SSL/TLS en production via PostgreSQL
- ✅ Conteneurs Docker non-root

## 🌐 URLs de production

- **Frontend** : https://helpdesk-frontend.onrender.com *(à configurer)*
- **Backend API** : https://helpdesk-backend.onrender.com *(à configurer)*
- **Base de données** : PostgreSQL managée par Render

## 📝 Changelog

### v1.0.0 (Novembre 2025)
- ✨ Support PostgreSQL pour la production
- ✨ Déploiement sur Render
- ✅ Suppression du proxy nginx pour services séparés
- ✅ Configuration multi-environnement (dev/prod)
- ✅ Base de code complète avec tests

**Projet réalisé dans le cadre du Titre RNCP Concepteur Développeur d'Applications**
