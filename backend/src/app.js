const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

// config CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost',
  process.env.FRONTEND_URL
].filter(Boolean);

console.log('[INFO] CORS - Origines autorisées:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origine (comme Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('[WARN] CORS - Origine bloquée:', origin);
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// log des requetes (toujours actif pour debug)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// routes
app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);

// route test
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Helpdesk',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
        me: 'GET /auth/me',
      },
      tickets: {
        create: 'POST /tickets',
        list: 'GET /tickets',
        getById: 'GET /tickets/:id',
        update: 'PUT /tickets/:id',
        delete: 'DELETE /tickets/:id',
      },
    },
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée.',
  });
});

// gestion erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
