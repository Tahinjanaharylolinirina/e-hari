const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const { query } = require('../config/db');

// Garde-fou anti-doublon en mémoire vive (RAM uniquement, aucune sauvegarde en BDD)
// Permet d'éviter de spammer l'élève toutes les minutes durant sa même heure de révision
const dispatchedMemoryKeys = new Set();

// Récupération dynamique des coordonnées de l'administrateur système (expéditeur officiel)
async function getAdminSender() {
  try {
    const adminRes = await query(
      `SELECT uti_nom, uti_pre, uti_ema FROM utilisateur WHERE uti_rol = 'admin' ORDER BY uti_id ASC LIMIT 1`
    );
    const admin = adminRes.rows[0];
    const adminEmail = (process.env.SMTP_USER || admin?.uti_ema || process.env.SMTP_FROM || 'admin@hari.mg').trim();
    const adminName = admin ? `${admin.uti_pre} ${admin.uti_nom}`.trim() : 'Administrateur e-HARI';
    return { adminEmail, adminName };
  } catch (err) {
    return {
      adminEmail: (process.env.SMTP_USER || process.env.SMTP_FROM || 'admin@hari.mg').trim(),
      adminName: 'Administrateur e-HARI',
    };
  }
}

// Configuration du transporteur d'emails réels (Gmail / SMTP standard)
async function getMailTransporter(adminEmail) {
  const smtpUser = (process.env.SMTP_USER || adminEmail || '').trim();
  const rawPass = (process.env.SMTP_PASS || '').trim();
  const smtpPass = rawPass.replace(/\s+/g, '');

  if (!smtpPass) {
    return {
      transporter: null,
      configured: false,
      smtpUser,
      error: `Configuration SMTP incomplète : Le mot de passe d'application Google (variable SMTP_PASS) n'est pas encore renseigné dans backend/.env pour l'adresse admin ${smtpUser}. Pour que l'email arrive directement dans la boîte Gmail de l'élève, générez un mot de passe d'application sur votre compte Google (https://myaccount.google.com/apppasswords) et ajoutez-le dans backend/.env (SMTP_PASS=...).`,
    };
  }

  const isGmail =
    process.env.SMTP_SERVICE === 'gmail' ||
    smtpUser.toLowerCase().endsWith('@gmail.com') ||
    (process.env.SMTP_HOST && process.env.SMTP_HOST.includes('gmail'));

  const transporter = isGmail
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })
    : nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

  return { transporter, configured: true, smtpUser };
}

// Service principal des notifications de révision par Email

// Génération du modèle HTML pour le mail
function generateRevisionEmailHtml({ studentName, studentEmail, adminName, adminEmail, subject, hour, day, objective }) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Rappel de Révision e-HARI</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); color: #ffffff; padding: 25px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; }
        .header p { margin: 6px 0 0 0; opacity: 0.9; font-size: 13px; }
        .content { padding: 30px; }
        .sender-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #475569; margin-bottom: 20px; line-height: 1.6; }
        .alert-box { background: #eff6ff; border-left: 5px solid #2563eb; border-radius: 8px; padding: 15px 20px; margin-bottom: 25px; }
        .alert-title { font-size: 17px; font-weight: 800; color: #1e40af; margin-bottom: 5px; }
        .details-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        .details-table td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .details-table td.label { font-weight: 700; color: #64748b; width: 35%; }
        .details-table td.value { color: #0f172a; font-weight: 600; }
        .objective-badge { background: #fef2f2; border: 1.5px solid #f87171; color: #991b1b; padding: 12px 16px; border-radius: 8px; font-size: 14px; line-height: 1.5; margin-bottom: 25px; }
        .btn-action { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px; text-align: center; margin: 0 auto; }
        .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; font-size: 12px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>e-HARI • Rappel de Révision</h1>
          <p>ONG HARI Madagascar • Accompagnement vers la Réussite Scolaire</p>
        </div>
        <div class="content">
          <div class="sender-box">
            <div><strong>Expéditeur (Admin) :</strong> ${adminName} &lt;${adminEmail}&gt;</div>
            <div><strong>Destinataire (Élève) :</strong> ${studentName} &lt;${studentEmail}&gt;</div>
          </div>

          <p style="font-size: 15px; margin-top: 0;">Bonjour <strong>${studentName}</strong>,</p>
          
          <div class="alert-box">
            <div class="alert-title">🎯 C'est l'heure de ta séance de révision !</div>
            <div style="font-size: 14px; color: #334155;">Ton créneau personnalisé de révision vient de débuter sur ton emploi du temps.</div>
          </div>

          <table class="details-table">
            <tr>
              <td class="label">📅 Jour :</td>
              <td class="value">${day}</td>
            </tr>
            <tr>
              <td class="label">⏰ Horaire :</td>
              <td class="value">${hour}</td>
            </tr>
            <tr>
              <td class="label">📚 Matière :</td>
              <td class="value" style="color: #2563eb; font-size: 16px;">${subject}</td>
            </tr>
          </table>

          <div class="objective-badge">
            <div style="font-weight: 800; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
              🎯 Objectif de la session :
            </div>
            <div>${objective || 'Consolidation active des cours et exercices d\'entraînement'}</div>
          </div>

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #166534; margin-bottom: 25px;">
            💡 <strong>Règle d'or e-hari :</strong> Travaille en mode Pomodoro (45 min sans interruption téléphonique, puis 10 min de pause).
          </div>

          <div style="text-align: center; margin: 25px 0;">
            <a href="http://localhost:3000" class="btn-action">Ouvrir mon planning sur e-hari</a>
          </div>

          <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">
            Bonne session de révision ! Toute l'équipe de l'ONG HARI Madagascar est à tes côtés pour ta réussite.
          </p>
        </div>
        <div class="footer">
          Plateforme e-HARI • ONG HARI Madagascar • Expéditeur : ${adminEmail} • Tél : 038 11 50 206
        </div>
      </div>
    </body>
    </html>
  `;
}

// Service principal des notifications
const NotificationService = {
  // Envoi d'un rappel de révision uniquement par Email à un élève
  async sendRevisionReminder({
    uti_id,
    matiere,
    objectif,
    creneau,
    jour,
    forceSend = false,
  }) {
    // 1. Récupération des informations de l'élève
    const userRes = await query(
      `SELECT u.uti_id, u.uti_nom, u.uti_pre, u.uti_ema, p.ele_not_ema 
       FROM utilisateur u
       LEFT JOIN profil_eleve p ON p.ele_uti_id = u.uti_id
       WHERE u.uti_id = $1`,
      [uti_id]
    );

    if (userRes.rows.length === 0) {
      throw new Error(`Élève #${uti_id} introuvable.`);
    }

    const user = userRes.rows[0];
    const studentName = `${user.uti_pre} ${user.uti_nom}`.trim();
    const emailDest = (user.uti_ema || '').trim();

    if (!emailDest) {
      return {
        success: false,
        statusEmail: 'invalide',
        message: `L'élève ${studentName} ne possède pas d'adresse email enregistrée.`,
      };
    }

    // 2. Récupération de l'email de l'administrateur (expéditeur officiel)
    const { adminEmail, adminName } = await getAdminSender();

    // 3. Garde-fou anti-répétition en mémoire vive pour le scheduler (aucune donnée sauvegardée en BDD)
    const todayDateKey = new Date().toISOString().slice(0, 10);
    const memoryKey = `${uti_id}_${todayDateKey}_${jour}_${creneau}`;

    if (!forceSend && dispatchedMemoryKeys.has(memoryKey)) {
      return {
        skipped: true,
        message: `Signalement par email déjà effectué pour ${studentName} (${creneau})`,
      };
    }

    // 4. Préparation du contenu du mail
    const emailSubject = `🎯 Rappel de Révision : ${matiere} (${creneau}) • e-HARI`;
    const emailText = `Bonjour ${studentName},\n\nC'est l'heure de ta révision de ${matiere} (${creneau}) sur ton emploi du temps e-hari !\n\n🎯 Objectif : ${objectif || 'Consolidation active des cours et exercices d\'entraînement'}\n\nBonne séance avec l'ONG HARI Madagascar !\n\nAccéder à votre planning : http://localhost:3000`;
    const emailHtml = generateRevisionEmailHtml({
      studentName,
      studentEmail: emailDest,
      adminName,
      adminEmail,
      subject: matiere,
      hour: creneau,
      day: jour,
      objective: objectif,
    });

    // 5. Initialisation du transporteur SMTP
    const transportInfo = await getMailTransporter(adminEmail);
    if (!transportInfo.configured) {
      return {
        success: false,
        statusEmail: 'non_configure',
        message: transportInfo.error,
        student: {
          name: studentName,
          email: emailDest,
        },
        admin: {
          name: adminName,
          email: adminEmail,
        },
        content: {
          emailSubject,
          emailText,
          emailHtml,
        },
      };
    }

    // 6. Envoi effectif de l'Email au destinataire
    try {
      const sendInfo = await transportInfo.transporter.sendMail({
        from: `"${adminName} • e-HARI" <${adminEmail}>`,
        replyTo: adminEmail,
        to: emailDest,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });

      console.log(`✅ [e-HARI Email Transmis] De: ${adminEmail} (Admin) -> À: ${emailDest} (Élève) | Matière: ${matiere} | ID: ${sendInfo.messageId}`);

      if (!forceSend) {
        dispatchedMemoryKeys.add(memoryKey);
        if (dispatchedMemoryKeys.size > 2000) dispatchedMemoryKeys.clear();
      }

      return {
        success: true,
        statusEmail: 'envoye',
        messageId: sendInfo.messageId,
        student: {
          name: studentName,
          email: emailDest,
        },
        admin: {
          name: adminName,
          email: adminEmail,
        },
        content: {
          emailSubject,
          emailText,
          emailHtml,
        },
      };
    } catch (err) {
      console.error(`❌ Erreur envoi email de ${adminEmail} à ${emailDest}:`, err.message);
      return {
        success: false,
        statusEmail: 'echec',
        message: `Échec d'envoi de l'email : ${err.message}`,
        error: err.message,
        student: {
          name: studentName,
          email: emailDest,
        },
        admin: {
          name: adminName,
          email: adminEmail,
        },
        content: {
          emailSubject,
          emailText,
          emailHtml,
        },
      };
    }
  },

  // Scan automatique de tous les élèves et déclenchement des rappels à l'heure exacte
  async checkAndSendRevisionReminders() {
    try {
      // Calcul du jour et heure à Madagascar (UTC+3)
      const now = new Date();
      // Heure locale Madagascar (UTC+3)
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const madaTime = new Date(utcTime + 3600000 * 3);

      const daysFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      const currentDayName = daysFr[madaTime.getDay()];
      const currentHour = madaTime.getHours();
      const currentMinutes = madaTime.getMinutes();

      // On vérifie les créneaux débutant à l'heure actuelle
      // Ex: 17h00 -> créneau '17:00 - 18:00'
      const startHourStr = String(currentHour).padStart(2, '0') + ':00';
      const endHourStr = String(currentHour + 1).padStart(2, '0') + ':00';
      const currentCreneau = `${startHourStr} - ${endHourStr}`;

      // Récupérer les élèves ayant un emploi du temps enregistré ET ayant autorisé les notifications
      const queryEdts = `
        SELECT e.edt_uti_id, e.edt_don, u.uti_nom, u.uti_pre, u.uti_ema, p.ele_not_ema
        FROM emploi_du_temps e
        JOIN utilisateur u ON u.uti_id = e.edt_uti_id
        LEFT JOIN profil_eleve p ON p.ele_uti_id = u.uti_id
        WHERE u.uti_rol = 'eleve' AND u.uti_sta = 'actif' AND (p.ele_not_ema IS NULL OR p.ele_not_ema = true);
      `;
      const edtsRes = await query(queryEdts);

      const dispatched = [];

      for (const row of edtsRes.rows) {
        const uti_id = row.edt_uti_id;
        const gridTasks = row.edt_don || {};
        const dayTasks = gridTasks[currentDayName] || {};

        // Les tranches horaires 1..16 :
        // 1: 05:00-06:00 ... 13: 17:00-18:00, 14: 18:00-19:00, etc.
        const hourToSliceIndex = {
          5: 1, 6: 2, 7: 3, 8: 4, 9: 5, 10: 6, 11: 7, 12: 8,
          13: 9, 14: 10, 15: 11, 16: 12, 17: 13, 18: 14, 19: 15, 20: 16,
        };

        const sliceIdx = hourToSliceIndex[currentHour];
        if (!sliceIdx) continue;

        const taskAtCurrentHour = (dayTasks[String(sliceIdx)] || '').trim();

        // Si l'heure est libre (non occupée par un cours de lycée) et dans une plage habituelle de révision (17h-21h)
        // ou si elle correspond à une révision programmée
        const isEveningFreeTime = !taskAtCurrentHour && [17, 18, 19, 20].includes(currentHour);

        if (isEveningFreeTime) {
          // Matière prioritaire selon le jour
          const defaultSubjects = ['Mathématiques', 'Physique-Chimie', 'SVT', 'Philosophie', 'Anglais'];
          const targetSubject = defaultSubjects[madaTime.getDay() % defaultSubjects.length];

          const res = await this.sendRevisionReminder({
            uti_id,
            matiere: targetSubject,
            objectif: 'Annales d\'entraînement & réactivation méthodique de la mémoire',
            creneau: currentCreneau,
            jour: currentDayName,
            forceSend: false,
          });

          if (!res.skipped) {
            dispatched.push(res);
          }
        }
      }

      return {
        timestamp: madaTime.toISOString(),
        day: currentDayName,
        hour: currentCreneau,
        dispatchedCount: dispatched.length,
        dispatched,
      };
    } catch (err) {
      console.error('Erreur dans checkAndSendRevisionReminders:', err.message);
      return { error: err.message };
    }
  },
};

module.exports = NotificationService;
