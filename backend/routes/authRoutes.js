const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Inscription (Étudiant, Travailleur, Admin)
router.post('/register', AuthController.register);

// Connexion
router.post('/login', AuthController.login);

// Obtenir le profil de l'utilisateur actuellement connecté
router.get('/me', verifyToken, AuthController.getMe);

module.exports = router;

