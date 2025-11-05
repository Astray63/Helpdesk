const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

/**
 * Modèle User - Représente un utilisateur de l'application
 * Peut être un utilisateur standard ou un administrateur
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

/**
 * Hook beforeCreate : hash du mot de passe avant sauvegarde
 * Utilise bcrypt avec un salt de 10 rounds pour la sécurité
 */
User.beforeCreate(async (user) => {
  if (user.password) {
    console.log('[USER MODEL] Hashage du mot de passe pour:', user.email);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    console.log('[USER MODEL] ✅ Mot de passe hashé');
  }
});

/**
 * Hook beforeUpdate : hash du mot de passe si modifié
 */
User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    console.log('[USER MODEL] Hashage du nouveau mot de passe pour:', user.email);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    console.log('[USER MODEL] ✅ Mot de passe mis à jour et hashé');
  }
});

/**
 * Méthode d'instance : vérification du mot de passe
 * @param {string} password - Mot de passe en clair à vérifier
 * @returns {Promise<boolean>} - True si le mot de passe correspond
 */
User.prototype.comparePassword = async function(password) {
  console.log('[USER MODEL] Comparaison du mot de passe pour:', this.email);
  const isValid = await bcrypt.compare(password, this.password);
  console.log('[USER MODEL] Résultat de la comparaison:', isValid ? '✅ Valide' : '❌ Invalide');
  return isValid;
};

/**
 * Méthode pour obtenir les données publiques de l'utilisateur
 * (sans le mot de passe)
 */
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;
