const NotificationService = require('../services/notificationService');

const notificationController = {
  // Tester l'envoi immédiat d'un rappel par Email pour l'élève connecté
  // Purement transactionnel : envoie le mail en direct, sans enregistrement en BDD
  async testReminder(req, res) {
    try {
      const uti_id = req.body?.uti_id || req.user?.uti_id || req.user?.util_id;
      if (!uti_id) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié.',
        });
      }

      const {
        matiere = 'Mathématiques',
        objectif = 'Annales du Bac & fiches de synthèse ciblées',
        creneau = '18:00 - 19:00',
        jour = 'Aujourd\'hui',
      } = req.body;

      const result = await NotificationService.sendRevisionReminder({
        uti_id,
        matiere,
        objectif,
        creneau,
        jour,
        forceSend: true,
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message || result.error || 'Erreur lors de l\'envoi du signalement par email.',
          data: result,
        });
      }

      return res.json({
        success: true,
        message: `Signalement envoyé avec succès par Email de ${result.admin?.email} (Admin) vers ${result.student?.email} (Élève) !`,
        data: result,
      });
    } catch (err) {
      console.error('Erreur testReminder:', err);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi du signalement : ' + err.message,
      });
    }
  },

  // Déclencher manuellement la vérification de l'horloge (Scheduler)
  async checkNow(req, res) {
    try {
      const scanResult = await NotificationService.checkAndSendRevisionReminders();
      return res.json({
        success: true,
        scanResult,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  // Mettre à jour la permission accordée par l'élève pour les rappels de révision par e-mail
  async updatePermission(req, res) {
    try {
      const uti_id = req.user?.uti_id || req.user?.util_id;
      if (!uti_id) {
        return res.status(401).json({ success: false, message: 'Utilisateur non authentifié.' });
      }
      const { ele_not_ema } = req.body;
      const { query } = require('../config/db');
      await query(
        'UPDATE profil_eleve SET ele_not_ema = $1, ele_dat_mod = NOW() WHERE ele_uti_id = $2',
        [ele_not_ema !== false, uti_id]
      );
      return res.json({
        success: true,
        message: ele_not_ema !== false ? 'Permission accordée pour les rappels par email.' : 'Rappels par email mis en pause.',
        ele_not_ema: ele_not_ema !== false,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = notificationController;
