const { query } = require('../config/db');

const MessageModel = {
  // Récupérer l'administrateur principal de la plateforme
  async getPrimaryAdmin() {
    const res = await query(
      `SELECT uti_id, uti_nom, uti_pre, uti_ema, uti_rol, uti_ava 
       FROM utilisateur 
       WHERE uti_rol = 'admin' 
       ORDER BY uti_id ASC 
       LIMIT 1`
    );
    return res.rows[0] || null;
  },

  // Créer un nouveau message (avec ou sans fichier joint)
  async create({
    mes_exp_id,
    mes_des_id,
    mes_con = null,
    mes_fic_nom = null,
    mes_fic_typ = null,
    mes_fic_tai = null,
    mes_fic_url = null,
  }) {
    const text = `
      INSERT INTO message (
        mes_exp_id, mes_des_id, mes_con,
        mes_fic_nom, mes_fic_typ, mes_fic_tai, mes_fic_url,
        mes_lu, mes_dat_cre
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const values = [
      mes_exp_id,
      mes_des_id,
      mes_con ? mes_con.trim() : null,
      mes_fic_nom,
      mes_fic_typ,
      mes_fic_tai,
      mes_fic_url,
    ];
    const res = await query(text, values);
    return res.rows[0];
  },

  // Récupérer le fil de discussion complet entre deux utilisateurs
  async getConversation(user1Id, user2Id) {
    const text = `
      SELECT 
        m.mes_id, m.mes_exp_id, m.mes_des_id, m.mes_con,
        m.mes_fic_nom, m.mes_fic_typ, m.mes_fic_tai, m.mes_fic_url,
        m.mes_lu, m.mes_dat_cre,
        u_exp.uti_nom AS exp_nom, u_exp.uti_pre AS exp_pre, u_exp.uti_rol AS exp_rol, u_exp.uti_ava AS exp_ava,
        u_des.uti_nom AS des_nom, u_des.uti_pre AS des_pre, u_des.uti_rol AS des_rol, u_des.uti_ava AS des_ava
      FROM message m
      JOIN utilisateur u_exp ON m.mes_exp_id = u_exp.uti_id
      JOIN utilisateur u_des ON m.mes_des_id = u_des.uti_id
      WHERE (m.mes_exp_id = $1 AND m.mes_des_id = $2)
         OR (m.mes_exp_id = $2 AND m.mes_des_id = $1)
      ORDER BY m.mes_dat_cre ASC
    `;
    const res = await query(text, [user1Id, user2Id]);
    return res.rows;
  },

  // Marquer comme lus tous les messages reçus par recipientId en provenance de senderId
  async markAsRead(senderId, recipientId) {
    const text = `
      UPDATE message
      SET mes_lu = TRUE
      WHERE mes_exp_id = $1 AND mes_des_id = $2 AND mes_lu = FALSE
      RETURNING mes_id
    `;
    const res = await query(text, [senderId, recipientId]);
    return res.rowCount;
  },

  // Nombre de messages non lus pour un utilisateur donné
  async getUnreadCount(userId) {
    const text = `
      SELECT COUNT(*)::int AS unread_count
      FROM message
      WHERE mes_des_id = $1 AND mes_lu = FALSE
    `;
    const res = await query(text, [userId]);
    return res.rows[0]?.unread_count || 0;
  },

  // Liste des conversations de l'administrateur avec le dernier message et le décompte des non lus
  async getAdminConversations(adminId) {
    const text = `
      SELECT 
        u.uti_id, u.uti_nom, u.uti_pre, u.uti_ema, u.uti_rol, u.uti_ava, u.uti_sta,
        lm.mes_id AS last_mes_id,
        lm.mes_con AS last_message,
        lm.mes_con AS der_message,
        lm.mes_fic_nom AS last_file_name,
        lm.mes_fic_nom AS der_fichier,
        lm.mes_dat_cre AS last_message_date,
        lm.mes_dat_cre AS der_date,
        lm.mes_exp_id AS last_sender_id,
        COALESCE(unread.count, 0) AS unread_count,
        COALESCE(unread.count, 0) AS non_lus
      FROM utilisateur u
      INNER JOIN (
        SELECT DISTINCT 
          CASE WHEN mes_exp_id = $1 THEN mes_des_id ELSE mes_exp_id END AS partner_id
        FROM message
        WHERE mes_exp_id = $1 OR mes_des_id = $1
      ) p ON u.uti_id = p.partner_id
      LEFT JOIN LATERAL (
        SELECT mes_id, mes_con, mes_fic_nom, mes_dat_cre, mes_exp_id
        FROM message
        WHERE (mes_exp_id = $1 AND mes_des_id = u.uti_id)
           OR (mes_exp_id = u.uti_id AND mes_des_id = $1)
        ORDER BY mes_dat_cre DESC
        LIMIT 1
      ) lm ON true
      LEFT JOIN (
        SELECT mes_exp_id, COUNT(*)::int AS count
        FROM message
        WHERE mes_des_id = $1 AND mes_lu = FALSE
        GROUP BY mes_exp_id
      ) unread ON unread.mes_exp_id = u.uti_id
      ORDER BY lm.mes_dat_cre DESC NULLS LAST
    `;
    const res = await query(text, [adminId]);
    return res.rows;
  },

  // Trouver un message par son ID
  async findById(messageId) {
    const text = `
      SELECT m.*, 
             u_exp.uti_nom AS exp_nom, u_exp.uti_pre AS exp_pre, u_exp.uti_rol AS exp_rol, u_exp.uti_ava AS exp_ava
      FROM message m
      JOIN utilisateur u_exp ON m.mes_exp_id = u_exp.uti_id
      WHERE m.mes_id = $1
    `;
    const res = await query(text, [messageId]);
    return res.rows[0] || null;
  },

  // Modifier le contenu texte d'un message existant
  async update(messageId, mes_con) {
    const text = `
      UPDATE message
      SET mes_con = $1
      WHERE mes_id = $2
      RETURNING *
    `;
    const res = await query(text, [mes_con ? mes_con.trim() : null, messageId]);
    return res.rows[0] || null;
  },

  // Supprimer définitivement un message
  async delete(messageId) {
    const text = `
      DELETE FROM message
      WHERE mes_id = $1
      RETURNING *
    `;
    const res = await query(text, [messageId]);
    return res.rows[0] || null;
  },
};

module.exports = MessageModel;

