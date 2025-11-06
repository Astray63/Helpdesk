# Frontend - Helpdesk Application

Application React frontend pour la gestion de tickets de support.

## 🚀 Démarrage rapide

### Développement local

```bash
# Installation des dépendances
npm install

# Copier le fichier de configuration
cp .env.example .env

# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur http://localhost:3000

### Build de production

```bash
# Build
npm run build

# Preview du build
npm run preview
```

## 📝 Configuration

### Variables d'environnement

Le frontend utilise des variables d'environnement Vite. **IMPORTANT** : Ces variables doivent être définies **AVANT** le build !

Créez un fichier `.env` à la racine du dossier frontend :

```bash
# URL de l'API backend
VITE_API_URL=http://localhost:5000
```

#### ⚠️ Pour la production

**Sur Render, Vercel, Netlify, etc. :**

1. **DÉFINISSEZ la variable d'environnement dans votre plateforme AVANT le premier build**
2. Les variables `VITE_*` sont compilées dans le JavaScript au moment du build
3. Si vous ajoutez/modifiez la variable après le build, vous DEVEZ redéployer

**Exemple pour Render :**
```
VITE_API_URL=https://helpdesk-backend-xxxx.onrender.com
```

## 🐛 Dépannage

### Erreur : "VITE_API_URL non défini en production"

**Cause** : La variable d'environnement n'était pas définie au moment du build.

**Solutions** :

1. **Solution recommandée** : Définir `VITE_API_URL` dans les paramètres de votre plateforme de déploiement
   - Render : Environment → Add Environment Variable
   - Vercel : Settings → Environment Variables
   - Netlify : Site settings → Environment variables

2. **Rebuild** : Après avoir ajouté la variable, forcez un nouveau déploiement
   - Render : Manual Deploy → Clear build cache & deploy
   - Vercel : Deployments → Redeploy
   - Netlify : Deploys → Trigger deploy

3. **Configuration runtime** (dépannage) : 
   - Modifiez le fichier `/config.js` dans votre build déployé
   - Décommentez et définissez `VITE_API_URL`
   - Cette méthode fonctionne sans rebuild mais est moins recommandée

### Erreur CORS

Si vous voyez une erreur CORS dans la console :

1. Vérifiez que `FRONTEND_URL` est correctement défini dans le backend
2. Vérifiez que l'URL du backend est correcte dans `VITE_API_URL`
3. Assurez-vous que les deux services sont accessibles (pas d'erreur 503)

### L'application se connecte à localhost en production

**Cause** : `VITE_API_URL` n'était pas défini au moment du build

**Solution** : Voir "VITE_API_URL non défini en production" ci-dessus

## 📦 Structure du projet

```
frontend/
├── public/              # Fichiers statiques
│   └── config.js       # Configuration runtime (optionnel)
├── src/
│   ├── components/     # Composants réutilisables
│   ├── context/        # Contexts React (Auth, etc.)
│   ├── pages/          # Pages de l'application
│   ├── services/       # Services API
│   ├── __tests__/      # Tests unitaires
│   ├── App.jsx         # Composant principal
│   └── main.jsx        # Point d'entrée
├── .env.example        # Exemple de configuration
├── index.html          # Template HTML
├── package.json        # Dépendances
└── vite.config.js      # Configuration Vite
```

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 🔧 Technologies utilisées

- **React** 18.x - Framework UI
- **React Router** 6.x - Routing
- **Axios** - Client HTTP
- **Vite** - Build tool
- **Vitest** - Framework de tests
- **Testing Library** - Tests de composants

## 📚 Documentation

Pour plus d'informations sur le déploiement, consultez [DEPLOYMENT.md](../DEPLOYMENT.md) à la racine du projet.
