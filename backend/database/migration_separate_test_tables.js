const { query } = require('../config/db');

async function migrate() {
  console.log('🚀 Démarrage de la migration : séparation des profils et création des tables de tests indépendantes...');
  try {
    // 1. Créer la table tests_eleves
    console.log('1. Création de la table tests_eleves...');
    await query(`
      CREATE TABLE IF NOT EXISTS tests_eleves (
        tel_id SERIAL PRIMARY KEY,
        tel_uti_id INTEGER UNIQUE NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
        tel_det_int JSONB,
        tel_det_mat JSONB,
        tel_cen_int TEXT,
        tel_mat_pre TEXT,
        tel_ori_pro_1 TEXT,
        tel_ori_pro_2 TEXT,
        tel_fb_ana JSONB,
        tel_eta_act INTEGER DEFAULT 1,
        tel_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        tel_dat_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_tel_uti_id ON tests_eleves(tel_uti_id);
    `);

    // 2. Créer la table tests_etudiants
    console.log('2. Création de la table tests_etudiants...');
    await query(`
      CREATE TABLE IF NOT EXISTS tests_etudiants (
        tet_id SERIAL PRIMARY KEY,
        tet_uti_id INTEGER UNIQUE NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
        tet_det_int JSONB,
        tet_det_com JSONB,
        tet_ori_pro_1 VARCHAR(255),
        tet_ori_pro_2 VARCHAR(255),
        tet_eta_act INTEGER DEFAULT 1,
        tet_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        tet_dat_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_tet_uti_id ON tests_etudiants(tet_uti_id);
    `);

    // 3. Créer la table tests_emploi
    console.log('3. Création de la table tests_emploi...');
    await query(`
      CREATE TABLE IF NOT EXISTS tests_emploi (
        tem_id SERIAL PRIMARY KEY,
        tem_uti_id INTEGER UNIQUE NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
        tem_det_mot JSONB,
        tem_det_tra JSONB,
        tem_ori_pro_1 VARCHAR(255),
        tem_ori_pro_2 VARCHAR(255),
        tem_eta_act INTEGER DEFAULT 1,
        tem_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        tem_dat_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_tem_uti_id ON tests_emploi(tem_uti_id);
    `);

    // 4. Migrer les tests élèves existants
    console.log('4. Migration des réponses et résultats de tests élèves...');
    await query(`
      INSERT INTO tests_eleves (
        tel_uti_id, tel_det_int, tel_det_mat, tel_cen_int, tel_mat_pre, 
        tel_ori_pro_1, tel_ori_pro_2, tel_fb_ana, tel_eta_act, tel_dat_cre, tel_dat_mod
      )
      SELECT 
        ele_uti_id, ele_det_int, ele_det_mat, ele_cen_int, ele_mat_pre, 
        ele_ori_pro_1, ele_ori_pro_2, ele_fb_ana, COALESCE(ele_eta_act, 1), ele_dat_cre, ele_dat_mod
      FROM profil_eleve
      ON CONFLICT (tel_uti_id) DO UPDATE SET
        tel_det_int = EXCLUDED.tel_det_int,
        tel_det_mat = EXCLUDED.tel_det_mat,
        tel_cen_int = EXCLUDED.tel_cen_int,
        tel_mat_pre = EXCLUDED.tel_mat_pre,
        tel_ori_pro_1 = EXCLUDED.tel_ori_pro_1,
        tel_ori_pro_2 = EXCLUDED.tel_ori_pro_2,
        tel_fb_ana = EXCLUDED.tel_fb_ana,
        tel_eta_act = EXCLUDED.tel_eta_act,
        tel_dat_mod = EXCLUDED.tel_dat_mod;
    `);

    // 5. Migrer les tests étudiants existants
    console.log('5. Migration des réponses et résultats de tests étudiants...');
    await query(`
      INSERT INTO tests_etudiants (
        tet_uti_id, tet_det_int, tet_det_com, 
        tet_ori_pro_1, tet_ori_pro_2, tet_eta_act, tet_dat_cre, tet_dat_mod
      )
      SELECT 
        etu_uti_id, etu_det_int, etu_det_com, 
        etu_ori_pro_1, etu_ori_pro_2, COALESCE(etu_eta_act, 1), etu_dat_cre, etu_dat_mod
      FROM profil_etudiant
      ON CONFLICT (tet_uti_id) DO UPDATE SET
        tet_det_int = EXCLUDED.tet_det_int,
        tet_det_com = EXCLUDED.tet_det_com,
        tet_ori_pro_1 = EXCLUDED.tet_ori_pro_1,
        tet_ori_pro_2 = EXCLUDED.tet_ori_pro_2,
        tet_eta_act = EXCLUDED.tet_eta_act,
        tet_dat_mod = EXCLUDED.tet_dat_mod;
    `);

    // 6. Migrer les tests emploi existants
    console.log('6. Migration des réponses et résultats de tests emploi...');
    await query(`
      INSERT INTO tests_emploi (
        tem_uti_id, tem_det_mot, tem_det_tra, 
        tem_ori_pro_1, tem_ori_pro_2, tem_eta_act, tem_dat_cre, tem_dat_mod
      )
      SELECT 
        emp_uti_id, emp_det_mot, emp_det_tra, 
        emp_ori_pro_1, emp_ori_pro_2, COALESCE(emp_eta_act, 1), emp_dat_cre, emp_dat_mod
      FROM profil_emploi
      ON CONFLICT (tem_uti_id) DO UPDATE SET
        tem_det_mot = EXCLUDED.tem_det_mot,
        tem_det_tra = EXCLUDED.tem_det_tra,
        tem_ori_pro_1 = EXCLUDED.tem_ori_pro_1,
        tem_ori_pro_2 = EXCLUDED.tem_ori_pro_2,
        tem_eta_act = EXCLUDED.tem_eta_act,
        tem_dat_mod = EXCLUDED.tem_dat_mod;
    `);

    // 7. Supprimer les colonnes de tests des tables profils
    console.log('7. Nettoyage des tables de profils (conservation stricte des infos personnelles)...');
    
    // Supprimer la vue profils_reconversion avant d'altérer profil_emploi
    await query(`DROP VIEW IF EXISTS profils_reconversion;`);

    // Nettoyer profil_eleve
    await query(`
      ALTER TABLE profil_eleve
      DROP COLUMN IF EXISTS ele_ori_pro_1,
      DROP COLUMN IF EXISTS ele_ori_pro_2,
      DROP COLUMN IF EXISTS ele_det_int,
      DROP COLUMN IF EXISTS ele_det_mat,
      DROP COLUMN IF EXISTS ele_cen_int,
      DROP COLUMN IF EXISTS ele_mat_pre,
      DROP COLUMN IF EXISTS ele_pro_bac,
      DROP COLUMN IF EXISTS ele_bio,
      DROP COLUMN IF EXISTS ele_fb_ana,
      DROP COLUMN IF EXISTS ele_edt_rev,
      DROP COLUMN IF EXISTS ele_eta_act;
    `);

    // Nettoyer profil_etudiant
    await query(`
      ALTER TABLE profil_etudiant
      DROP COLUMN IF EXISTS etu_ori_pro_1,
      DROP COLUMN IF EXISTS etu_ori_pro_2,
      DROP COLUMN IF EXISTS etu_det_int,
      DROP COLUMN IF EXISTS etu_det_com,
      DROP COLUMN IF EXISTS etu_eta_act;
    `);

    // Nettoyer profil_emploi
    await query(`
      ALTER TABLE profil_emploi
      DROP COLUMN IF EXISTS emp_ori_pro_1,
      DROP COLUMN IF EXISTS emp_ori_pro_2,
      DROP COLUMN IF EXISTS emp_det_mot,
      DROP COLUMN IF EXISTS emp_det_tra,
      DROP COLUMN IF EXISTS emp_eta_act;
    `);

    // 8. Recréer la vue profils_reconversion
    console.log('8. Recréation de la vue profils_reconversion...');
    await query(`
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
        emp_dat_cre AS rec_dat_cre,
        emp_dat_mod AS rec_dat_mod
      FROM profil_emploi;
    `);

    // Vue de compatibilité tests_reconversion
    await query(`
      CREATE OR REPLACE VIEW tests_reconversion AS 
      SELECT 
        tem_id AS rec_test_id,
        tem_uti_id AS rec_uti_id,
        tem_det_mot AS rec_det_mot,
        tem_det_tra AS rec_det_tra,
        tem_ori_pro_1 AS rec_ori_pro_1,
        tem_ori_pro_2 AS rec_ori_pro_2,
        tem_eta_act AS rec_eta_act,
        tem_dat_cre AS rec_dat_cre,
        tem_dat_mod AS rec_dat_mod
      FROM tests_emploi;
    `);

    console.log('✅ Migration des tables de tests et profils terminée avec succès !');

    // Vérification des colonnes
    const tables = ['profil_eleve', 'tests_eleves', 'profil_etudiant', 'tests_etudiants', 'profil_emploi', 'tests_emploi'];
    for (const t of tables) {
      const res = await query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position
      `, [t]);
      console.log(`\n📋 Colonnes de '${t}' :`);
      res.rows.forEach(c => console.log(`   - ${c.column_name} (${c.data_type})`));
    }

  } catch (error) {
    console.error('❌ Erreur lors de la migration :', error);
  } finally {
    process.exit(0);
  }
}

migrate();
