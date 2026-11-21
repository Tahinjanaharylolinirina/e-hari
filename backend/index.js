const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config(); // Fallback si lancé depuis un autre dossier

const { pool } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const testRoutes = require('./routes/testRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const referentielRoutes = require('./routes/referentielRoutes');
const { startRevisionScheduler } = require('./services/scheduler');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globaux (support de pièces jointes documents/photos jusqu'à 25 Mo)
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Routes principales de l'API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/utilisateurs', userRoutes); // Alias en français
app.use('/api/tests', testRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/messagerie', messageRoutes);
app.use('/api', referentielRoutes); // /api/entreprises, /api/facultes, /api/metiers, /api/fecultes
app.use('/api/referentiel', referentielRoutes);

// Route de santé / test
app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW() as now, current_database() as bdd');
    res.json({
      success: true,
      message: 'Backend Express & Base de données PostgreSQL opérationnels !',
      database: dbRes.rows[0].bdd,
      serverTime: dbRes.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Erreur de connexion à la base de données',
      error: err.message,
    });
  }
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    application: 'e-HARI • Habiletés, Accompagnement, Réussite et Insertion',
    version: '1.0.0',
    status: 'en cours d\'exécution',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
      },
      users: {
        list: 'GET /api/users (Admin)',
        eleves: 'GET /api/users/eleves',
        etudiants: 'GET /api/users/etudiants',
        reconversion: 'GET /api/users/reconversion',
        stats: 'GET /api/users/stats (Admin)',
      },
    },
  });
});

// Middleware d'erreur
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré avec succès sur http://localhost:${PORT}`);
  console.log(`📡 Base de données PostgreSQL connectée : '${process.env.DB_NAME || 'hari'}'`);
  // Démarrage du planificateur automatique d'alertes de révision (Email & SMS)
  startRevisionScheduler();
});