const jwt = require('jsonwebtoken');
const { User } = require('../models');

// verif token JWT
const authMiddleware = async (req, res, next) => {
  try {
    console.log('[MIDDLEWARE] Vérification du token JWT');
    const authHeader = req.headers.authorization;
    console.log('[MIDDLEWARE] Authorization header:', authHeader ? 'présent' : 'absent');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[MIDDLEWARE] ❌ Token manquant ou format invalide');
      return res.status(401).json({
        success: false,
        message: 'Token manquant. Authentification requise.',
      });
    }

    const token = authHeader.substring(7);
    console.log('[MIDDLEWARE] Token extrait (longueur):', token.length);
    
    console.log('[MIDDLEWARE] Vérification du token avec JWT_SECRET...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[MIDDLEWARE] ✅ Token valide, userId:', decoded.userId);
    
    console.log('[MIDDLEWARE] Recherche de l\'utilisateur...');
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      console.log('[MIDDLEWARE] ❌ Utilisateur non trouvé pour userId:', decoded.userId);
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé. Token invalide.',
      });
    }
    
    console.log('[MIDDLEWARE] ✅ Utilisateur authentifié:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error('[MIDDLEWARE] ❌ Erreur d\'authentification:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      console.log('[MIDDLEWARE] Type d\'erreur: Token invalide');
      return res.status(401).json({
        success: false,
        message: 'Token invalide.',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      console.log('[MIDDLEWARE] Type d\'erreur: Token expiré');
      return res.status(401).json({
        success: false,
        message: 'Token expiré. Veuillez vous reconnecter.',
      });
    }

    console.error('[MIDDLEWARE] Stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'authentification.',
    });
  }
};

// verif admin
const adminMiddleware = (req, res, next) => {
  console.log('[MIDDLEWARE] Vérification des droits admin');
  
  if (!req.user) {
    console.log('[MIDDLEWARE] ❌ Pas d\'utilisateur authentifié');
    return res.status(401).json({
      success: false,
      message: 'Authentification requise.',
    });
  }

  console.log('[MIDDLEWARE] Utilisateur:', req.user.email, '| Role:', req.user.role);
  
  if (req.user.role !== 'admin') {
    console.log('[MIDDLEWARE] ❌ Utilisateur non admin');
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits administrateur requis.',
    });
  }

  console.log('[MIDDLEWARE] ✅ Utilisateur admin confirmé');
  next();
};

module.exports = { authMiddleware, adminMiddleware };
