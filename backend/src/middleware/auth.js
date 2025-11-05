const jwt = require('jsonwebtoken');
const { User } = require('../models');

// verif token JWT
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant. Authentification requise.',
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé. Token invalide.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide.',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré. Veuillez vous reconnecter.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'authentification.',
    });
  }
};

// verif admin
const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentification requise.',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits administrateur requis.',
    });
  }

  next();
};

module.exports = { authMiddleware, adminMiddleware };
