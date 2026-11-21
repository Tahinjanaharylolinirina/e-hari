const { query } = require('../config/db');

const EdtModel = {
  // Récupérer l'emploi du temps correspondant à l'élève par son id
  async getByUserId(uti_id) {
    const text = `
      SELECT * FROM emploi_du_temps 
      WHERE edt_uti_id = $1
    `;
    const res = await query(text, [uti_id]);
    return res.rows[0] || null;
  },

  // Enregistrer ou mettre à jour l'emploi du temps lié à l'id de l'élève (1 élève <=> 1 EDT)
  async saveUserEdt({ edt_uti_id, edt_don = {} }) {
    const text = `
      INSERT INTO emploi_du_temps (edt_uti_id, edt_don, edt_dat_mod)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (edt_uti_id) DO UPDATE SET
        edt_don = EXCLUDED.edt_don,
        edt_dat_mod = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const values = [
      edt_uti_id,
      JSON.stringify(edt_don || {}),
    ];
    const res = await query(text, values);
    return res.rows[0];
  },

  // Supprimer l'emploi du temps d'un élève
  async deleteByUserId(uti_id) {
    const text = `
      DELETE FROM emploi_du_temps
      WHERE edt_uti_id = $1
      RETURNING *;
    `;
    const res = await query(text, [uti_id]);
    return res.rows[0] || null;
  },
};

module.exports = EdtModel;
