const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// inscription
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis (email, password, name).',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères.',
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Un compte avec cet email existe déjà.',
      });
    }

    // le password sera hashé auto
    const user = await User.create({
      email,
      password,
      name,
      role: 'user',
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
      message: 'Compte créé avec succès.',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription.',
    });
  }
};

// connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis.',
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: 'Connexion réussie.',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion.',
    });
  }
};

// recuperer user connecté
const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        user: req.user.toJSON(),
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur.',
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
