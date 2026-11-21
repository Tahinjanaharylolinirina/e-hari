const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/messageController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// 1. Envoyer un message (texte et/ou fichier joint)
router.post('/', verifyToken, MessageController.sendMessage);

// 2. Récupérer le fil de discussion (conversation par défaut avec l'admin pour les élèves, ou avec un utilisateur spécifique)
router.get('/conversation', verifyToken, MessageController.getConversation);
router.get('/conversation/:userId', verifyToken, MessageController.getConversation);

// 3. Récupérer la liste des conversations (Espace Admin)
router.get('/admin/conversations', verifyToken, checkRole('admin'), MessageController.getAdminConversations);

// 4. Nombre de messages non lus pour le badge de notification
router.get('/unread-count', verifyToken, MessageController.getUnreadCount);

// 5. Marquer une conversation comme lue
router.post('/mark-read/:userId', verifyToken, MessageController.markAsRead);

// 6. Diffuser une annonce / offre de stage / emploi groupée par catégorie et mot-clé (Admin)
router.post('/broadcast', verifyToken, checkRole('admin'), MessageController.broadcastMessage);

// 7. Modifier un message (auteur ou admin)
router.put('/:id', verifyToken, MessageController.updateMessage);

// 8. Supprimer un message (auteur ou admin)
router.delete('/:id', verifyToken, MessageController.deleteMessage);

module.exports = router;

