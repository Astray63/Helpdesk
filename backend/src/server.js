require('dotenv').config();

// Log immédiat pour vérifier que le serveur démarre
console.log('='.repeat(80));
console.log('🚀 HELPDESK BACKEND - DÉMARRAGE');
console.log('='.repeat(80));
console.log('Timestamp:', new Date().toISOString());

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
      console.log('\n' + '='.repeat(80));
      console.log('✅ SERVEUR DÉMARRÉ AVEC SUCCÈS');
      console.log('='.repeat(80));
      console.log(`📡 URL: http://0.0.0.0:${PORT}`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`� Frontend autorisé: ${process.env.FRONTEND_URL || 'localhost'}`);
      console.log(`💾 Base de données: ${process.env.DATABASE_URL ? 'PostgreSQL (Render)' : 'SQLite (local)'}`);
      console.log(`📚 Documentation API: http://0.0.0.0:${PORT}`);
      console.log('='.repeat(80) + '\n');
      
      // Force le flush des logs
      if (process.stdout.isTTY === false) {
        process.stdout.write('');
      }
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
