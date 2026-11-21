const { pool } = require('../config/db');

async function createEdtTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS emploi_du_temps (
        edt_id SERIAL PRIMARY KEY,
        edt_uti_id INTEGER UNIQUE NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
        edt_don JSONB,
        edt_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        edt_dat_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_edt_uti_id ON emploi_du_temps(edt_uti_id);
    `);
    console.log('✅ Table "emploi_du_temps" configurée (liée uniquement à l\'id de l\'élève) !');
  } catch (err) {
    console.error('❌ Erreur lors de la création de la table emploi_du_temps :', err);
  } finally {
    await pool.end();
  }
}

createEdtTable();
