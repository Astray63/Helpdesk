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

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// log des requetes en dev
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

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
