const express = require('express');
const router = express.Router();
const {
  createTicket,
  getMyTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} = require('../controllers/ticketController');
const { authMiddleware } = require('../middleware/auth');

/**
 * Routes des tickets
 * Toutes les routes nécessitent une authentification
 */

// POST /tickets - Créer un nouveau ticket
router.post('/', authMiddleware, createTicket);

// GET /tickets - Récupérer tous les tickets de l'utilisateur (ou tous si admin)
router.get('/', authMiddleware, getMyTickets);

// GET /tickets/:id - Récupérer un ticket par son ID
router.get('/:id', authMiddleware, getTicketById);

// PUT /tickets/:id - Mettre à jour un ticket
router.put('/:id', authMiddleware, updateTicket);

// DELETE /tickets/:id - Supprimer un ticket
router.delete('/:id', authMiddleware, deleteTicket);

module.exports = router;
