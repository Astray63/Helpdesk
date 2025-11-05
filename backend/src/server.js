require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('[INFO] Démarrage du serveur...');
    console.log('[INFO] NODE_ENV:', process.env.NODE_ENV || 'development');
    console.log('[INFO] PORT:', PORT);
    console.log('[INFO] FRONTEND_URL:', process.env.FRONTEND_URL || 'non défini');
    console.log('[INFO] DATABASE_URL:', process.env.DATABASE_URL ? 'configuré (PostgreSQL)' : 'non défini (SQLite)');
    
    await testConnection();

    // sync db (en production aussi si FORCE_SYNC=true)
    const forceSync = process.env.FORCE_SYNC === 'true';
    console.log('[INFO] FORCE_SYNC:', forceSync);
    await syncDatabase(forceSync);
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log('\n✅ Serveur démarré avec succès');
      console.log(`📡 URL: http://0.0.0.0:${PORT}`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\n📚 Documentation API disponible sur http://0.0.0.0:${PORT}\n`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  console.log('\nSignal SIGTERM reçu, arrêt du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSignal SIGINT reçu, arrêt du serveur...');
  process.exit(0);
});

startServer();
