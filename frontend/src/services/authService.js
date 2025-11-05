import api from './api';

/**
 * Service d'authentification
 */
const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur (email, password, name)
   * @returns {Promise} Réponse de l'API
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      // Sauvegarde du token et des infos utilisateur
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de l\'inscription' };
    }
  },

  /**
   * Connexion d'un utilisateur
   * @param {Object} credentials - Identifiants (email, password)
   * @returns {Promise} Réponse de l'API
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Sauvegarde du token et des infos utilisateur
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la connexion' };
    }
  },

  /**
   * Déconnexion de l'utilisateur
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Récupération de l'utilisateur connecté depuis localStorage
   * @returns {Object|null} Utilisateur ou null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Récupération de l'utilisateur connecté depuis l'API
   * @returns {Promise} Utilisateur depuis le serveur
   */
  getCurrentUserFromAPI: async () => {
    try {
      const response = await api.get('/auth/me');
      
      // Mise à jour du localStorage avec les données fraîches
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      // Si le token est invalide, nettoyer le localStorage
      if (error.response?.status === 401) {
        authService.logout();
      }
      throw error.response?.data || { message: 'Erreur lors de la récupération de l\'utilisateur' };
    }
  },

  /**
   * Vérification si l'utilisateur est connecté
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Vérification si l'utilisateur est admin
   * @returns {boolean}
   */
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'admin';
  },
};

export default authService;
