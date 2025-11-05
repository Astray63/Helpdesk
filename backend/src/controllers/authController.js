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
    console.log('[AUTH] Tentative d\'inscription');
    const { email, password, name } = req.body;
    console.log('[AUTH] Données reçues:', { email, name, passwordLength: password?.length });

    if (!email || !password || !name) {
      console.log('[AUTH] ❌ Champs manquants');
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis (email, password, name).',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('[AUTH] ❌ Email invalide:', email);
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide.',
      });
    }

    if (password.length < 6) {
      console.log('[AUTH] ❌ Mot de passe trop court');
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères.',
      });
    }

    console.log('[AUTH] Vérification de l\'existence de l\'utilisateur...');
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('[AUTH] ❌ Utilisateur existe déjà:', email);
      return res.status(409).json({
        success: false,
        message: 'Un compte avec cet email existe déjà.',
      });
    }

    console.log('[AUTH] Création de l\'utilisateur...');
    // le password sera hashé auto
    const user = await User.create({
      email,
      password,
      name,
      role: 'user',
    });
    console.log('[AUTH] ✅ Utilisateur créé avec ID:', user.id);

    const token = generateToken(user.id);
    console.log('[AUTH] ✅ Token JWT généré');

    return res.status(201).json({
      success: true,
      message: 'Compte créé avec succès.',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('[AUTH] ❌ Erreur lors de l\'inscription:', error.message);
    console.error('[AUTH] Stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription.',
    });
  }
};

// connexion
const login = async (req, res) => {
  try {
    console.log('[AUTH] Tentative de connexion');
    const { email, password } = req.body;
    console.log('[AUTH] Email:', email);

    if (!email || !password) {
      console.log('[AUTH] ❌ Email ou mot de passe manquant');
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis.',
      });
    }

    console.log('[AUTH] Recherche de l\'utilisateur...');
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('[AUTH] ❌ Utilisateur non trouvé:', email);
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }
    console.log('[AUTH] ✅ Utilisateur trouvé, ID:', user.id);

    console.log('[AUTH] Vérification du mot de passe...');
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('[AUTH] ❌ Mot de passe incorrect pour:', email);
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }
    console.log('[AUTH] ✅ Mot de passe valide');

    const token = generateToken(user.id);
    console.log('[AUTH] ✅ Connexion réussie pour:', email);

    return res.status(200).json({
      success: true,
      message: 'Connexion réussie.',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('[AUTH] ❌ Erreur lors de la connexion:', error.message);
    console.error('[AUTH] Stack:', error.stack);
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
