const { pool } = require('../config/db');

async function migrateEdt() {
  try {
    await pool.query(`
      ALTER TABLE profil_eleve 
      ADD COLUMN IF NOT EXISTS ele_edt_rev JSONB;
    `);
    console.log('✅ Migration ele_edt_rev JSONB réussie dans profil_eleve !');
  } catch (err) {
    console.error('❌ Erreur lors de la migration ele_edt_rev :', err);
  } finally {
    await pool.end();
  }
}

migrateEdt();

