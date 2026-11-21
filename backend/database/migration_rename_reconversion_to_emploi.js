const { pool } = require('../config/db');

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('--- Migration : Utilisation de "emploi" au lieu de "reconversion" dans toute la BDD ---');

    await client.query('BEGIN');

    // 1. Mise à jour de la contrainte CHECK sur uti_rol dans la table utilisateur
    console.log('1. Mise à jour de la contrainte de rôle...');
    await client.query(`
      ALTER TABLE utilisateur DROP CONSTRAINT IF EXISTS utilisateurs_uti_rol_check;
      ALTER TABLE utilisateur ADD CONSTRAINT utilisateurs_uti_rol_check 
        CHECK (uti_rol IN ('admin', 'eleve', 'etudiant', 'emploi', 'reconversion'));
    `);

    // 2. Migration des utilisateurs ayant le rôle 'reconversion' vers 'emploi'
    console.log('2. Mise à jour des rôles utilisateurs vers "emploi"...');
    const updateRoleRes = await client.query(`
      UPDATE utilisateur SET uti_rol = 'emploi' WHERE uti_rol = 'reconversion';
    `);
    console.log(`   -> ${updateRoleRes.rowCount} utilisateur(s) mis à jour vers le rôle 'emploi'.`);

    // 3. Renommage de la table profils_reconversion vers profil_emploi
    console.log('3. Renommage de la table profils_reconversion -> profil_emploi...');
    const tableExists = await client.query(`
      SELECT 1 FROM information_schema.tables WHERE table_name = 'profils_reconversion' AND table_type = 'BASE TABLE';
    `);

    if (tableExists.rows.length > 0) {
      await client.query(`ALTER TABLE profils_reconversion RENAME TO profil_emploi;`);
      console.log('   -> Table renommée en profil_emploi avec succès.');
    } else {
      console.log('   -> Table profils_reconversion déjà renommée ou inexistante.');
    }

    // 4. Renommage des colonnes rec_* vers emp_* dans profil_emploi
    console.log('4. Renommage des colonnes rec_* vers emp_*...');
    const columnsToRename = [
      ['rec_id', 'emp_id'],
      ['rec_uti_id', 'emp_uti_id'],
      ['rec_sit_act', 'emp_sit_act'],
      ['rec_met_act', 'emp_met_act'],
      ['rec_sec_act', 'emp_sec_act'],
      ['rec_ann_exp', 'emp_ann_exp'],
      ['rec_com_act', 'emp_com_act'],
      ['rec_mot_cha', 'emp_mot_cha'],
      ['rec_sec_cib', 'emp_sec_cib'],
      ['rec_bio', 'emp_bio'],
      ['rec_ori_pro_1', 'emp_ori_pro_1'],
      ['rec_ori_pro_2', 'emp_ori_pro_2'],
      ['rec_det_mot', 'emp_det_mot'],
      ['rec_det_tra', 'emp_det_tra'],
      ['rec_eta_act', 'emp_eta_act'],
      ['rec_dat_cre', 'emp_dat_cre'],
      ['rec_dat_mod', 'emp_dat_mod']
    ];

    for (const [oldCol, newCol] of columnsToRename) {
      const colCheck = await client.query(`
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profil_emploi' AND column_name = $1;
      `, [oldCol]);

      if (colCheck.rows.length > 0) {
        await client.query(`ALTER TABLE profil_emploi RENAME COLUMN ${oldCol} TO ${newCol};`);
        console.log(`   -> Colonne ${oldCol} renommée en ${newCol}`);
      }
    }

    // 5. Renommage de l'index
    console.log('5. Renommage de l\'index...');
    await client.query(`
      ALTER INDEX IF EXISTS idx_rec_uti_id RENAME TO idx_emp_uti_id;
    `);

    // 6. Création de la vue de compatibilité descendante profils_reconversion
    console.log('6. Création de la vue profils_reconversion pour assurer la compatibilité...');
    await client.query(`
      CREATE OR REPLACE VIEW profils_reconversion AS 
      SELECT 
        emp_id AS rec_id,
        emp_uti_id AS rec_uti_id,
        emp_sit_act AS rec_sit_act,
        emp_met_act AS rec_met_act,
        emp_sec_act AS rec_sec_act,
        emp_ann_exp AS rec_ann_exp,
        emp_com_act AS rec_com_act,
        emp_mot_cha AS rec_mot_cha,
        emp_sec_cib AS rec_sec_cib,
        emp_bio AS rec_bio,
        emp_ori_pro_1 AS rec_ori_pro_1,
        emp_ori_pro_2 AS rec_ori_pro_2,
        emp_det_mot AS rec_det_mot,
        emp_det_tra AS rec_det_tra,
        emp_eta_act AS rec_eta_act,
        emp_dat_cre AS rec_dat_cre,
        emp_dat_mod AS rec_dat_mod
      FROM profil_emploi;
    `);

    await client.query('COMMIT');
    console.log('✅ Migration "emploi" terminée avec succès !');

    // Affichage des colonnes de profil_emploi
    const resCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'profil_emploi' 
      ORDER BY ordinal_position;
    `);
    console.log('Colonnes de la table profil_emploi :');
    resCols.rows.forEach(r => console.log(` - ${r.column_name} (${r.data_type})`));

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erreur migration emploi :', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrate();

