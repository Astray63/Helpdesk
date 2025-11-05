const { sequelize } = require('../config/database');
const User = require('./User');
const Ticket = require('./Ticket');

/**
 * Définition des relations entre les modèles
 */

// Un utilisateur peut avoir plusieurs tickets
User.hasMany(Ticket, {
  foreignKey: 'userId',
  as: 'tickets',
  onDelete: 'CASCADE', // Supprime les tickets si l'utilisateur est supprimé
});

// Un ticket appartient à un utilisateur
Ticket.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

/**
 * Synchronisation de la base de données
 * @param {boolean} force - Si true, supprime et recrée les tables
 */
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('[OK] Base de données synchronisée');
    
    // Création d'un utilisateur admin par défaut au premier démarrage
    // Vérifie toujours si l'admin existe, pas seulement en mode force
    const existingAdmin = await User.findOne({ where: { email: 'admin@helpdesk.com' } });
    
    if (!existingAdmin) {
      await User.create({
        email: 'admin@helpdesk.com',
        password: 'Admin123!',
        name: 'Administrateur',
        role: 'admin',
      });
      console.log('[OK] Utilisateur admin créé par défaut');
      console.log('    📧 Email: admin@helpdesk.com');
      console.log('    🔑 Mot de passe: Admin123!');
      console.log('    ⚠️  Pensez à changer le mot de passe après la première connexion !');
    } else {
      console.log('[INFO] Utilisateur admin existe déjà');
    }
  } catch (error) {
    console.error('[ERREUR] Erreur lors de la synchronisation:', error);
    throw error;
  }
};

module.exports = {
  User,
  Ticket,
  syncDatabase,
};
