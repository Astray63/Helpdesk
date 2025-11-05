const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

/**
 * Routes d'authentification
 */

// POST /auth/register - Inscription d'un nouvel utilisateur
router.post('/register', register);

// POST /auth/login - Connexion d'un utilisateur
router.post('/login', login);

// GET /auth/me - Récupération des informations de l'utilisateur connecté
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
