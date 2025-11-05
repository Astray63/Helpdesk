import api from './api';

/**
 * Service de gestion des tickets
 */
const ticketService = {
  /**
   * Créer un nouveau ticket
   * @param {Object} ticketData - Données du ticket
   * @returns {Promise} Réponse de l'API
   */
  createTicket: async (ticketData) => {
    try {
      const response = await api.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création du ticket' };
    }
  },

  /**
   * Récupérer tous les tickets
   * @returns {Promise} Liste des tickets
   */
  getAllTickets: async () => {
    try {
      const response = await api.get('/tickets');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des tickets' };
    }
  },

  /**
   * Récupérer un ticket par son ID
   * @param {number} id - ID du ticket
   * @returns {Promise} Ticket
   */
  getTicketById: async (id) => {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération du ticket' };
    }
  },

  /**
   * Mettre à jour un ticket
   * @param {number} id - ID du ticket
   * @param {Object} updates - Données à mettre à jour
   * @returns {Promise} Ticket mis à jour
   */
  updateTicket: async (id, updates) => {
    try {
      const response = await api.put(`/tickets/${id}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour du ticket' };
    }
  },

  /**
   * Supprimer un ticket
   * @param {number} id - ID du ticket
   * @returns {Promise} Confirmation de suppression
   */
  deleteTicket: async (id) => {
    try {
      const response = await api.delete(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression du ticket' };
    }
  },
};

export default ticketService;
