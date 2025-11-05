const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * Configuration de la connexion à la base de données
 * Supporte PostgreSQL (production) et SQLite (développement)
 * Utilise Sequelize ORM pour la sécurité et la facilité d'utilisation
 */
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
      logging: false,
      define: {
        timestamps: true,
        underscored: false,
      },
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: process.env.DATABASE_PATH || './database.sqlite',
      logging: false,
      define: {
        timestamps: true,
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
