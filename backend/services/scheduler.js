const NotificationService = require('./notificationService');

let schedulerInterval = null;

function startRevisionScheduler(intervalMs = 60000) {
  if (schedulerInterval) return;

  console.log('⏰ [Scheduler e-HARI] Démarrage du système de surveillance des heures de révision...');

  // Première vérification après 5 secondes
  setTimeout(async () => {
    try {
      const res = await NotificationService.checkAndSendRevisionReminders();
      if (res && res.dispatchedCount > 0) {
        console.log(`🔔 [Scheduler e-HARI] ${res.dispatchedCount} rappel(s) de révision envoyé(s) (Email & SMS).`);
      }
    } catch (e) {
      console.error('[Scheduler e-HARI] Erreur premier scan :', e.message);
    }
  }, 5000);

  // Vérification périodique toutes les minutes
  schedulerInterval = setInterval(async () => {
    try {
      const res = await NotificationService.checkAndSendRevisionReminders();
      if (res && res.dispatchedCount > 0) {
        console.log(`🔔 [Scheduler e-HARI] ${res.dispatchedCount} rappel(s) envoyé(s) automatiquement à l'élève.`);
      }
    } catch (err) {
      console.error('[Scheduler e-HARI] Erreur lors du scan périodique :', err.message);
    }
  }, intervalMs);
}

function stopRevisionScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('⏹️ [Scheduler e-HARI] Surveillance des révisions arrêtée.');
  }
}

module.exports = {
  startRevisionScheduler,
  stopRevisionScheduler,
};

