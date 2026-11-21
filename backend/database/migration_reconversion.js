const { pool } = require('../config/db');

async function migrateReconversion() {
  const client = await pool.connect();
  try {
    console.log('--- Migration : Ajout des colonnes pour les tests de reconversion ---');

    await client.query(`
      ALTER TABLE profils_reconversion
      ADD COLUMN IF NOT EXISTS rec_ori_pro_1 VARCHAR(255),
      ADD COLUMN IF NOT EXISTS rec_ori_pro_2 VARCHAR(255),
      ADD COLUMN IF NOT EXISTS rec_det_mot JSONB,
      ADD COLUMN IF NOT EXISTS rec_det_tra JSONB,
      ADD COLUMN IF NOT EXISTS rec_eta_act INTEGER DEFAULT 1;
    `);

    console.log('✅ Colonnes rec_ori_pro_1, rec_ori_pro_2, rec_det_mot, rec_det_tra, rec_eta_act ajoutées avec succès !');

    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'profils_reconversion' 
      ORDER BY ordinal_position;
    `);
    console.log('Colonnes actuelles de profils_reconversion :');
    res.rows.forEach(r => console.log(` - ${r.column_name} (${r.data_type})`));

  } catch (err) {
    console.error('❌ Erreur migration reconversion :', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrateReconversion();

