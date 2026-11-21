const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Tester l'envoi direct d'un signalement de révision par Email
router.post('/test-rappel', verifyToken, notificationController.testReminder);
router.post('/test-reminder', verifyToken, notificationController.testReminder);

// Mettre à jour la permission de notification par email
router.post('/permission', verifyToken, notificationController.updatePermission);
router.patch('/permission', verifyToken, notificationController.updatePermission);

// Déclencheur manuel du scan des créneaux
router.post('/check-now', verifyToken, notificationController.checkNow);

module.exports = router;
