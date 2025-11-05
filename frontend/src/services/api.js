import axios from 'axios';

/**
 * Configuration de l'URL de l'API
 * Priorité : VITE_API_URL > proxy nginx > localhost
 */
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? '/api'  // Via proxy nginx en production Docker
    : 'http://localhost:5000'  // Direct en développement
  );

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
