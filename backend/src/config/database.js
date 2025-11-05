const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * Configuration de la connexion à la base de données SQLite
 * Utilise Sequelize ORM pour la sécurité et la facilité d'utilisation
 */
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_PATH || './database.sqlite',
  logging: false, // Désactiver les logs pour les tests
  define: {
    timestamps: true, // Active createdAt et updatedAt automatiquement
    underscored: false,
  },
});

/**
 * Test de la connexion à la base de données
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('[OK] Connexion à la base de données réussie');
  } catch (error) {
    console.error('[ERREUR] Impossible de se connecter à la base de données:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
