require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await testConnection();

    // sync db
    const forceSync = process.env.NODE_ENV === 'development' && process.env.FORCE_SYNC === 'true';
    await syncDatabase(forceSync);
    app.listen(PORT, () => {
      console.log(`\nServeur démarré avec succès`);
      console.log(`URL: http://localhost:${PORT}`);
      console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\nDocumentation API disponible sur http://localhost:${PORT}\n`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
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
