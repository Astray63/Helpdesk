// Configuration globale pour Jest
// Ce fichier est exécuté avant tous les tests

// Définir les variables d'environnement pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key_for_jest';
process.env.JWT_EXPIRES_IN = '24h';
process.env.DATABASE_PATH = ':memory:'; // Base de données SQLite en mémoire
