import axios from 'axios';

/**
 * Configuration de l'URL de l'API
 * IMPORTANT: En production sur Render, VITE_API_URL DOIT être défini !
 * Exemple: https://helpdesk-backend.onrender.com
 * 
 * Priorité de configuration :
 * 1. window.ENV.VITE_API_URL (configuration runtime via config.js)
 * 2. import.meta.env.VITE_API_URL (variable d'environnement au build)
 * 3. Détection automatique si le backend est sur le même domaine
 * 4. localhost:5000 (développement)
 */
const getApiUrl = () => {
  // 1. Configuration runtime (via config.js ou window.ENV)
  if (window.ENV?.VITE_API_URL) {
    return window.ENV.VITE_API_URL;
  }
  
  // 2. Variable d'environnement de build
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // 3. En production, essayer de détecter l'URL du backend
  if (import.meta.env.MODE === 'production') {
    // Si le frontend est hébergé sur Render, le backend suit souvent ce pattern
    const hostname = window.location.hostname;
    if (hostname.includes('onrender.com')) {
      // Essayer de deviner l'URL du backend basée sur le pattern Render
      const backendUrl = hostname.replace('frontend', 'backend');
      console.warn('⚠️ VITE_API_URL non défini, tentative de détection automatique:', `https://${backendUrl}`);
      return `https://${backendUrl}`;
    }
  }
  
  // 4. Développement local
  return 'http://localhost:5000';
};

const API_URL = getApiUrl();

// Avertissement si VITE_API_URL n'est pas défini en production
if (import.meta.env.MODE === 'production' && !import.meta.env.VITE_API_URL && !window.ENV?.VITE_API_URL) {
  console.error('⚠️ ATTENTION: VITE_API_URL non défini en production!');
  console.error('L\'application utilisera une URL détectée automatiquement, ce qui peut ne pas fonctionner.');
  console.error('Définissez VITE_API_URL dans les variables d\'environnement de Render avant le build.');
}

console.log('🔗 API URL configurée:', API_URL);

/**
 * Instance Axios configurée
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Intercepteur de requête : ajoute automatiquement le token JWT
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponse : gestion des erreurs d'authentification
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si erreur 401 (non autorisé), supprimer le token et rediriger vers login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
