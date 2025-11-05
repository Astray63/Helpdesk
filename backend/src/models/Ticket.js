const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modèle Ticket - Représente un ticket de support
 * Chaque ticket appartient à un utilisateur et a un statut et une priorité
 */
const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 200], // Titre entre 3 et 200 caractères
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 5000], // Description entre 10 et 5000 caractères
    },
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
    defaultValue: 'open',
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'tickets',
  timestamps: true,
});

module.exports = Ticket;
