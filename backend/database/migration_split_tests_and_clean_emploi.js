const { query } = require('../config/db');

async function migrate() {
  console.log('🚀 Démarrage de la migration : séparation des 2 tests par rôle et nettoyage de profil_emploi...');
  try {
    // 1. Créer les 6 tables de tests séparées
    console.log('1. Création des 6 tables de tests distinctes...');

    // 1.1 Tests Élèves : Test 1 et Test 2
    await query(`
      CREATE TABLE IF NOT EXISTS tests_eleves_1 (
        te1_id SERIAL PRIMARY KEY,
        te1_uti_id INTEGER UNIQUE NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
        te1_det_int JSONB,
        te1_cen_int TEXT,
        te1_ori_pro_1 TEXT,
        te1_fb_ana JSONB,
        te1_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        te1_dat_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_te1_uti_id ON tests_eleves_1(te1_uti_id);

      CREATE TABLE IF NOT EXISTS tests_eleves_2 (
        te2_id SERIAL PRIMARY KEY,
        te2_uti_id INTEGER UNIQUE NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
        te2_det_mat JSONB,
        te2_mat_pre TEXT,
        te2_ori_pro_2 TEXT,
        te2_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        te2_dat_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_te2_uti_id ON tests_eleves_2(te2_uti_id);
    `);

    // 1.2 Tests Étudiants : Test 1 et Test 2
    await query(`
      CREATE TABLE IF NOT EXISTS tests_etudiants_1 (
        tet1_id SERIAL PRIMARY KEY,
        tet1_uti_id INTEGER UNIQUE NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
        tet1_det_int JSONB,
        tet1_ori_pro_1 VARCHAR(255),
        tet1_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        tet1_dat_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_tet1_uti_id ON tests_etudiants_1(tet1_uti_id);

      CREATE TABLE IF NOT EXISTS tests_etudiants_2 (
        tet2_id SERIAL PRIMARY KEY,
        tet2_uti_id INTEGER UNIQUE NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
        tet2_det_com JSONB,
        tet2_ori_pro_2 VARCHAR(255),
        tet2_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        tet2_dat_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_tet2_uti_id ON tests_etudiants_2(tet2_uti_id);
    `);

    // 1.3 Tests Emploi : Test 1 et Test 2
    await query(`
      CREATE TABLE IF NOT EXISTS tests_emploi_1 (
        tem1_id SERIAL PRIMARY KEY,
        tem1_uti_id INTEGER UNIQUE NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
        tem1_det_mot JSONB,
        tem1_ori_pro_1 VARCHAR(255),
        tem1_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        tem1_dat_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_tem1_uti_id ON tests_emploi_1(tem1_uti_id);

      CREATE TABLE IF NOT EXISTS tests_emploi_2 (
        tem2_id SERIAL PRIMARY KEY,
        tem2_uti_id INTEGER UNIQUE NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
        tem2_det_tra JSONB,
        tem2_ori_pro_2 VARCHAR(255),
        tem2_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        tem2_dat_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_tem2_uti_id ON tests_emploi_2(tem2_uti_id);
    `);
    console.log('✅ Les 6 tables de tests créées avec succès.');

    // 2. Migration des données existantes depuis les anciennes tables tests_*
    console.log('2. Migration des données de tests vers les tables individuelles...');

    // Migrer tests_eleves vers tests_eleves_1 et tests_eleves_2
    await query(`
      INSERT INTO tests_eleves_1 (te1_uti_id, te1_det_int, te1_cen_int, te1_ori_pro_1, te1_fb_ana, te1_dat_cre, te1_dat_mod)
      SELECT tel_uti_id, tel_det_int, tel_cen_int, tel_ori_pro_1, tel_fb_ana, tel_dat_cre, tel_dat_mod
      FROM tests_eleves
      WHERE tel_ori_pro_1 IS NOT NULL OR tel_det_int IS NOT NULL
      ON CONFLICT (te1_uti_id) DO UPDATE SET
        te1_det_int = EXCLUDED.te1_det_int,
        te1_cen_int = EXCLUDED.te1_cen_int,
        te1_ori_pro_1 = EXCLUDED.te1_ori_pro_1,
        te1_fb_ana = EXCLUDED.te1_fb_ana,
        te1_dat_mod = EXCLUDED.te1_dat_mod;

      INSERT INTO tests_eleves_2 (te2_uti_id, te2_det_mat, te2_mat_pre, te2_ori_pro_2, te2_dat_cre, te2_dat_mod)
      SELECT tel_uti_id, tel_det_mat, tel_mat_pre, tel_ori_pro_2, tel_dat_cre, tel_dat_mod
      FROM tests_eleves
      WHERE tel_ori_pro_2 IS NOT NULL OR tel_det_mat IS NOT NULL
      ON CONFLICT (te2_uti_id) DO UPDATE SET
        te2_det_mat = EXCLUDED.te2_det_mat,
        te2_mat_pre = EXCLUDED.te2_mat_pre,
        te2_ori_pro_2 = EXCLUDED.te2_ori_pro_2,
        te2_dat_mod = EXCLUDED.te2_dat_mod;
    `);

    // Migrer tests_etudiants vers tests_etudiants_1 et tests_etudiants_2
    await query(`
      INSERT INTO tests_etudiants_1 (tet1_uti_id, tet1_det_int, tet1_ori_pro_1, tet1_dat_cre, tet1_dat_mod)
      SELECT tet_uti_id, tet_det_int, tet_ori_pro_1, tet_dat_cre, tet_dat_mod
      FROM tests_etudiants
      WHERE tet_ori_pro_1 IS NOT NULL OR tet_det_int IS NOT NULL
      ON CONFLICT (tet1_uti_id) DO UPDATE SET
        tet1_det_int = EXCLUDED.tet1_det_int,
        tet1_ori_pro_1 = EXCLUDED.tet1_ori_pro_1,
        tet1_dat_mod = EXCLUDED.tet1_dat_mod;

      INSERT INTO tests_etudiants_2 (tet2_uti_id, tet2_det_com, tet2_ori_pro_2, tet2_dat_cre, tet2_dat_mod)
      SELECT tet_uti_id, tet_det_com, tet_ori_pro_2, tet_dat_cre, tet_dat_mod
      FROM tests_etudiants
      WHERE tet_ori_pro_2 IS NOT NULL OR tet_det_com IS NOT NULL
      ON CONFLICT (tet2_uti_id) DO UPDATE SET
        tet2_det_com = EXCLUDED.tet2_det_com,
        tet2_ori_pro_2 = EXCLUDED.tet2_ori_pro_2,
        tet2_dat_mod = EXCLUDED.tet2_dat_mod;
    `);

    // Migrer tests_emploi vers tests_emploi_1 et tests_emploi_2
    await query(`
      INSERT INTO tests_emploi_1 (tem1_uti_id, tem1_det_mot, tem1_ori_pro_1, tem1_dat_cre, tem1_dat_mod)
      SELECT tem_uti_id, tem_det_mot, tem_ori_pro_1, tem_dat_cre, tem_dat_mod
      FROM tests_emploi
      WHERE tem_ori_pro_1 IS NOT NULL OR tem_det_mot IS NOT NULL
      ON CONFLICT (tem1_uti_id) DO UPDATE SET
        tem1_det_mot = EXCLUDED.tem1_det_mot,
        tem1_ori_pro_1 = EXCLUDED.tem1_ori_pro_1,
        tem1_dat_mod = EXCLUDED.tem1_dat_mod;

      INSERT INTO tests_emploi_2 (tem2_uti_id, tem2_det_tra, tem2_ori_pro_2, tem2_dat_cre, tem2_dat_mod)
      SELECT tem_uti_id, tem_det_tra, tem_ori_pro_2, tem_dat_cre, tem_dat_mod
      FROM tests_emploi
      WHERE tem_ori_pro_2 IS NOT NULL OR tem_det_tra IS NOT NULL
      ON CONFLICT (tem2_uti_id) DO UPDATE SET
        tem2_det_tra = EXCLUDED.tem2_det_tra,
        tem2_ori_pro_2 = EXCLUDED.tem2_ori_pro_2,
        tem2_dat_mod = EXCLUDED.tem2_dat_mod;
    `);
    console.log('✅ Données de tests migrées dans les 6 tables.');

    // 3. Remplacer les anciennes tables tests_* par des vues unifiées pour rétro-compatibilité
    console.log('3. Remplacement des anciennes tables de tests par des vues de compatibilité...');
    await query(`
      DROP VIEW IF EXISTS tests_reconversion CASCADE;
      DROP TABLE IF EXISTS tests_eleves CASCADE;
      DROP TABLE IF EXISTS tests_etudiants CASCADE;
      DROP TABLE IF EXISTS tests_emploi CASCADE;

      CREATE OR REPLACE VIEW tests_eleves AS
      SELECT 
        COALESCE(t1.te1_id, t2.te2_id) AS tel_id,
        COALESCE(t1.te1_uti_id, t2.te2_uti_id) AS tel_uti_id,
        t1.te1_det_int AS tel_det_int,
        t2.te2_det_mat AS tel_det_mat,
        t1.te1_cen_int AS tel_cen_int,
        t2.te2_mat_pre AS tel_mat_pre,
        t1.te1_ori_pro_1 AS tel_ori_pro_1,
        t2.te2_ori_pro_2 AS tel_ori_pro_2,
        t1.te1_fb_ana AS tel_fb_ana,
        CASE 
          WHEN t2.te2_ori_pro_2 IS NOT NULL THEN 3 
          WHEN t1.te1_ori_pro_1 IS NOT NULL THEN 2 
          ELSE 1 
        END AS tel_eta_act,
        COALESCE(t1.te1_dat_cre, t2.te2_dat_cre) AS tel_dat_cre,
        COALESCE(GREATEST(t1.te1_dat_mod, t2.te2_dat_mod), t1.te1_dat_mod, t2.te2_dat_mod) AS tel_dat_mod
      FROM tests_eleves_1 t1
      FULL OUTER JOIN tests_eleves_2 t2 ON t1.te1_uti_id = t2.te2_uti_id;

      CREATE OR REPLACE VIEW tests_etudiants AS
      SELECT 
        COALESCE(t1.tet1_id, t2.tet2_id) AS tet_id,
        COALESCE(t1.tet1_uti_id, t2.tet2_uti_id) AS tet_uti_id,
        t1.tet1_det_int AS tet_det_int,
        t2.tet2_det_com AS tet_det_com,
        t1.tet1_ori_pro_1 AS tet_ori_pro_1,
        t2.tet2_ori_pro_2 AS tet_ori_pro_2,
        CASE 
          WHEN t2.tet2_ori_pro_2 IS NOT NULL THEN 3 
          WHEN t1.tet1_ori_pro_1 IS NOT NULL THEN 2 
          ELSE 1 
        END AS tet_eta_act,
        COALESCE(t1.tet1_dat_cre, t2.tet2_dat_cre) AS tet_dat_cre,
        COALESCE(GREATEST(t1.tet1_dat_mod, t2.tet2_dat_mod), t1.tet1_dat_mod, t2.tet2_dat_mod) AS tet_dat_mod
      FROM tests_etudiants_1 t1
      FULL OUTER JOIN tests_etudiants_2 t2 ON t1.tet1_uti_id = t2.tet2_uti_id;

      CREATE OR REPLACE VIEW tests_emploi AS
      SELECT 
        COALESCE(t1.tem1_id, t2.tem2_id) AS tem_id,
        COALESCE(t1.tem1_uti_id, t2.tem2_uti_id) AS tem_uti_id,
        t1.tem1_det_mot AS tem_det_mot,
        t2.tem2_det_tra AS tem_det_tra,
        t1.tem1_ori_pro_1 AS tem_ori_pro_1,
        t2.tem2_ori_pro_2 AS tem_ori_pro_2,
        CASE 
          WHEN t2.tem2_ori_pro_2 IS NOT NULL THEN 3 
          WHEN t1.tem1_ori_pro_1 IS NOT NULL THEN 2 
          ELSE 1 
        END AS tem_eta_act,
        COALESCE(t1.tem1_dat_cre, t2.tem2_dat_cre) AS tem_dat_cre,
        COALESCE(GREATEST(t1.tem1_dat_mod, t2.tem2_dat_mod), t1.tem1_dat_mod, t2.tem2_dat_mod) AS tem_dat_mod
      FROM tests_emploi_1 t1
      FULL OUTER JOIN tests_emploi_2 t2 ON t1.tem1_uti_id = t2.tem2_uti_id;

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
    console.log('✅ Vues de tests unifiées créées avec succès.');

    // 4. Nettoyage de profil_emploi (suppression des colonnes inutiles demandées par l'utilisateur)
    console.log('4. Suppression des colonnes inutiles de profil_emploi :');
    console.log('   - emp_sec_act (secteur d\'activité actuel)');
    console.log('   - emp_ann_exp (années d\'expérience professionnelle)');
    console.log('   - emp_com_act (compétences déclarées)');
    console.log('   - emp_mot_cha (motivations d\'insertion / transition)');
    console.log('   - emp_sec_cib (secteurs cibles)');
    console.log('   - emp_bio (bio / présentation)');

    await query(`DROP VIEW IF EXISTS profils_reconversion CASCADE;`);

    await query(`
      ALTER TABLE profil_emploi
      DROP COLUMN IF EXISTS emp_sec_act,
      DROP COLUMN IF EXISTS emp_ann_exp,
      DROP COLUMN IF EXISTS emp_com_act,
      DROP COLUMN IF EXISTS emp_mot_cha,
      DROP COLUMN IF EXISTS emp_sec_cib,
      DROP COLUMN IF EXISTS emp_bio;
    `);

    // Recréer la vue profils_reconversion simplifiée
    await query(`
      CREATE OR REPLACE VIEW profils_reconversion AS 
      SELECT 
        emp_id AS rec_id,
        emp_uti_id AS rec_uti_id,
        emp_sit_act AS rec_sit_act,
        emp_met_act AS rec_met_act,
        emp_dat_cre AS rec_dat_cre,
        emp_dat_mod AS rec_dat_mod
      FROM profil_emploi;
    `);
    console.log('✅ profil_emploi nettoyé et profils_reconversion mis à jour.');

    // 5. Affichage des colonnes restantes
    console.log('\n📋 Vérification des tables en BDD :');
    const tables = [
      'profil_eleve', 'tests_eleves_1', 'tests_eleves_2',
      'profil_etudiant', 'tests_etudiants_1', 'tests_etudiants_2',
      'profil_emploi', 'tests_emploi_1', 'tests_emploi_2'
    ];
    for (const t of tables) {
      const res = await query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position
      `, [t]);
      console.log(`\nTable '${t}' :`);
      res.rows.forEach(c => console.log(`   - ${c.column_name} (${c.data_type})`));
    }

    console.log('\n🎉 Migration terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la migration :', error);
  } finally {
    process.exit(0);
  }
}

migrate();
