const MessageModel = require('../models/messageModel');
const UserModel = require('../models/userModel');

const MessageController = {
  // Envoyer un message (avec ou sans fichier/document)
  async sendMessage(req, res) {
    try {
      const currentUser = req.user;
      const expId = currentUser.uti_id || currentUser.util_id;
      const userRole = currentUser.uti_rol || currentUser.util_role;

      let {
        mes_des_id,
        targetUserId,
        mes_con,
        mes_fic_nom,
        mes_fic_typ,
        mes_fic_tai,
        mes_fic_url,
      } = req.body;

      let desId = parseInt(mes_des_id || targetUserId, 10);

      // Si l'utilisateur n'est pas admin, son destinataire par défaut est l'administrateur système
      if (!desId) {
        if (userRole !== 'admin') {
          const admin = await MessageModel.getPrimaryAdmin();
          if (!admin) {
            return res.status(500).json({
              success: false,
              message: 'Aucun compte administrateur disponible pour recevoir le message.',
            });
          }
          desId = admin.uti_id;
        } else {
          return res.status(400).json({
            success: false,
            message: 'Veuillez sélectionner un destinataire pour ce message.',
          });
        }
      }

      // Vérifier que le destinataire existe
      const recipient = await UserModel.findById(desId);
      if (!recipient) {
        return res.status(404).json({
          success: false,
          message: 'Destinataire introuvable.',
        });
      }

      // Au moins un texte ou un fichier est requis
      const hasContent = mes_con && typeof mes_con === 'string' && mes_con.trim().length > 0;
      const hasFile = mes_fic_url && typeof mes_fic_url === 'string' && mes_fic_url.trim().length > 0;

      if (!hasContent && !hasFile) {
        return res.status(400).json({
          success: false,
          message: 'Le message doit contenir un texte ou un document joint.',
        });
      }

      const createdMessage = await MessageModel.create({
        mes_exp_id: expId,
        mes_des_id: desId,
        mes_con: hasContent ? mes_con.trim() : null,
        mes_fic_nom: hasFile ? (mes_fic_nom || 'document') : null,
        mes_fic_typ: hasFile ? mes_fic_typ : null,
        mes_fic_tai: hasFile ? parseInt(mes_fic_tai, 10) || null : null,
        mes_fic_url: hasFile ? mes_fic_url : null,
      });

      return res.json({
        success: true,
        message: 'Message envoyé avec succès.',
        data: {
          ...createdMessage,
          exp_nom: currentUser.uti_nom,
          exp_pre: currentUser.uti_pre,
          exp_rol: userRole,
          exp_ava: currentUser.uti_ava,
          des_nom: recipient.uti_nom,
          des_pre: recipient.uti_pre,
          des_rol: recipient.uti_rol,
          des_ava: recipient.uti_ava,
        },
      });
    } catch (err) {
      console.error('Erreur sendMessage :', err);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi du message : ' + err.message,
      });
    }
  },

  // Récupérer la discussion entre l'utilisateur connecté et son interlocuteur
  async getConversation(req, res) {
    try {
      const currentUser = req.user;
      const curId = currentUser.uti_id || currentUser.util_id;
      const userRole = currentUser.uti_rol || currentUser.util_role;

      let partnerId = parseInt(req.params.userId, 10);

      // Si l'utilisateur est un élève/étudiant/emploi et qu'aucun ID n'est précisé, l'interlocuteur est l'admin
      if (!partnerId) {
        if (userRole !== 'admin') {
          const admin = await MessageModel.getPrimaryAdmin();
          if (!admin) {
            return res.status(404).json({
              success: false,
              message: 'Administrateur introuvable.',
            });
          }
          partnerId = admin.uti_id;
        } else {
          return res.status(400).json({
            success: false,
            message: 'Veuillez spécifier l\'identifiant de l\'utilisateur.',
          });
        }
      }

      const partner = await UserModel.findById(partnerId);
      if (!partner) {
        return res.status(404).json({
          success: false,
          message: 'Interlocuteur introuvable.',
        });
      }

      // Marquer automatiquement comme lus les messages reçus de cet interlocuteur
      await MessageModel.markAsRead(partnerId, curId);

      const messages = await MessageModel.getConversation(curId, partnerId);

      return res.json({
        success: true,
        partner: {
          uti_id: partner.uti_id,
          uti_nom: partner.uti_nom,
          uti_pre: partner.uti_pre,
          uti_ema: partner.uti_ema,
          uti_rol: partner.uti_rol,
          uti_ava: partner.uti_ava,
          uti_tel: partner.uti_tel,
          uti_sta: partner.uti_sta,
        },
        messages,
        data: messages,
      });
    } catch (err) {
      console.error('Erreur getConversation :', err);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la conversation : ' + err.message,
      });
    }
  },

  // Récupérer la liste des conversations pour le panneau administrateur
  async getAdminConversations(req, res) {
    try {
      const currentUser = req.user;
      const adminId = currentUser.uti_id || currentUser.util_id;

      const conversations = await MessageModel.getAdminConversations(adminId);

      // Récupérer également tous les utilisateurs enregistrés pour permettre d'engager la conversation
      const allUsersData = await UserModel.findAll({ limit: 100 });
      const registeredUsers = allUsersData.users || [];

      return res.json({
        success: true,
        conversations,
        data: conversations,
        registeredUsers: registeredUsers.filter(u => u.uti_id !== adminId),
      });
    } catch (err) {
      console.error('Erreur getAdminConversations :', err);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des conversations : ' + err.message,
      });
    }
  },

  // Obtenir le nombre total de messages non lus pour l'utilisateur connecté
  async getUnreadCount(req, res) {
    try {
      const curId = req.user.uti_id || req.user.util_id;
      const unreadCount = await MessageModel.getUnreadCount(curId);
      return res.json({
        success: true,
        unread_count: unreadCount,
        unreadCount: unreadCount,
        count: unreadCount,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  // Marquer une conversation comme lue
  async markAsRead(req, res) {
    try {
      const curId = req.user.uti_id || req.user.util_id;
      const senderId = parseInt(req.params.userId, 10);
      if (!senderId) {
        return res.status(400).json({ success: false, message: 'ID expéditeur requis' });
      }
      const count = await MessageModel.markAsRead(senderId, curId);
      return res.json({
        success: true,
        marked_read: count,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  // Diffusion groupée d'annonces, offres de stage ou d'emploi ciblées par catégorie et mot-clé
  async broadcastMessage(req, res) {
    try {
      const currentUser = req.user;
      const adminId = currentUser.uti_id || currentUser.util_id;

      const {
        targetRole,      // 'all', 'eleve', 'etudiant', 'emploi'
        keyword,         // ex: 'informatique', 'terminale s', etc.
        targetUserIds,   // tableau d'identifiants ciblés
        mes_con,
        mes_fic_nom,
        mes_fic_typ,
        mes_fic_tai,
        mes_fic_url,
      } = req.body;

      if (!mes_con && !mes_fic_url) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez saisir le contenu du message ou joindre un fichier (offre de stage, fiche de poste, document...).',
        });
      }

      let recipientIds = [];

      if (Array.isArray(targetUserIds) && targetUserIds.length > 0) {
        recipientIds = targetUserIds.map((id) => parseInt(id, 10)).filter((id) => id && id !== adminId);
      } else {
        const usersData = await UserModel.findAll({ limit: 1000 });
        const all = usersData.users || [];

        recipientIds = all
          .filter((u) => u.uti_id !== adminId && (u.uti_sta || 'actif') === 'actif')
          .filter((u) => {
            // Filtre par catégorie / rôle
            if (targetRole && targetRole !== 'all') {
              const uRole = (u.uti_rol || u.role || '').toLowerCase();
              if ((targetRole === 'emploi' || targetRole === 'rechercher emploi') && uRole !== 'emploi' && uRole !== 'reconversion' && uRole !== 'rechercher emploi') return false;
              if (targetRole !== 'emploi' && targetRole !== 'rechercher emploi' && uRole !== targetRole) return false;
            }

            // Filtre par mot-clé
            if (keyword && keyword.trim()) {
              const kw = keyword.trim().toLowerCase();
              const searchable = [
                u.uti_nom,
                u.uti_pre,
                u.uti_ema,
                u.profil?.ele_cla,
                u.profil?.ele_ser,
                u.profil?.ele_eta,
                u.profil?.etu_fil,
                u.profil?.etu_niv_etu,
                u.profil?.etu_eta,
                u.profil?.emp_sit_act,
                u.profil?.emp_met_act,
              ].filter(Boolean).join(' ').toLowerCase();

              return searchable.includes(kw);
            }

            return true;
          })
          .map((u) => u.uti_id);
      }

      // Supprimer les doublons éventuels
      recipientIds = [...new Set(recipientIds)];

      if (recipientIds.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Aucun utilisateur ne correspond à ce type et ce mot-clé.',
        });
      }

      // Insérer un message pour chaque destinataire ciblé
      for (const recId of recipientIds) {
        await MessageModel.create({
          mes_exp_id: adminId,
          mes_des_id: recId,
          mes_con: mes_con || (mes_fic_nom ? `[Pièce jointe : ${mes_fic_nom}]` : ''),
          mes_fic_nom: mes_fic_nom || null,
          mes_fic_typ: mes_fic_typ || null,
          mes_fic_tai: mes_fic_tai || null,
          mes_fic_url: mes_fic_url || null,
        });
      }

      return res.json({
        success: true,
        message: `Message diffusé avec succès à ${recipientIds.length} utilisateur(s).`,
        count: recipientIds.length,
        recipientIds,
      });
    } catch (err) {
      console.error('Erreur broadcastMessage :', err);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la diffusion : ' + err.message,
      });
    }
  },

  // Modifier un message existant (auteur ou admin)
  async updateMessage(req, res) {
    try {
      const currentUserId = req.user.uti_id || req.user.util_id;
      const currentUserRole = req.user.uti_rol || req.user.util_role;
      const messageId = parseInt(req.params.id, 10);

      if (!messageId) {
        return res.status(400).json({ success: false, message: 'Identifiant du message invalide.' });
      }

      const existingMessage = await MessageModel.findById(messageId);
      if (!existingMessage) {
        return res.status(404).json({ success: false, message: 'Message introuvable.' });
      }

      // Seul l'expéditeur du message ou l'administrateur peut modifier le message
      if (existingMessage.mes_exp_id !== currentUserId && currentUserRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Vous n\'êtes pas autorisé à modifier ce message.',
        });
      }

      const { mes_con } = req.body;
      const newContent = typeof mes_con === 'string' ? mes_con.trim() : '';
      if (!newContent && !existingMessage.mes_fic_url) {
        return res.status(400).json({
          success: false,
          message: 'Le contenu du message ne peut pas être vide.',
        });
      }

      const updated = await MessageModel.update(messageId, newContent);
      return res.json({
        success: true,
        message: 'Message modifié avec succès.',
        data: {
          ...existingMessage,
          ...updated,
        },
      });
    } catch (err) {
      console.error('Erreur updateMessage :', err);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la modification du message : ' + err.message,
      });
    }
  },

  // Supprimer un message (auteur ou admin)
  async deleteMessage(req, res) {
    try {
      const currentUserId = req.user.uti_id || req.user.util_id;
      const currentUserRole = req.user.uti_rol || req.user.util_role;
      const messageId = parseInt(req.params.id, 10);

      if (!messageId) {
        return res.status(400).json({ success: false, message: 'Identifiant du message invalide.' });
      }

      const existingMessage = await MessageModel.findById(messageId);
      if (!existingMessage) {
        return res.status(404).json({ success: false, message: 'Message introuvable.' });
      }

      // Seul l'expéditeur du message ou l'administrateur peut supprimer le message
      if (existingMessage.mes_exp_id !== currentUserId && currentUserRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Vous n\'êtes pas autorisé à supprimer ce message.',
        });
      }

      await MessageModel.delete(messageId);
      return res.json({
        success: true,
        message: 'Message supprimé avec succès.',
        data: { mes_id: messageId },
      });
    } catch (err) {
      console.error('Erreur deleteMessage :', err);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du message : ' + err.message,
      });
    }
  },
};

module.exports = MessageController;

