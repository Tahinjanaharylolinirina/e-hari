const { query, pool } = require('../config/db');

async function migrateSimplification() {
  console.log('🚀 Début de la simplification architecturale de la BDD :');
  console.log('  1. Création de la table unique `reponses` pour tous les tests');
  console.log('  2. Migration des données existantes');
  console.log('  3. Suppression des attributs *_code (facultes, entreprises, metiers)');
  console.log('  4. Suppression de toutes les tables de constantes et tables redondantes');
  console.log('  5. Recréation des vues de compatibilité');

  // 1. CRÉATION DE LA TABLE UNIQUE REPOSNES
  await query(`
    CREATE TABLE IF NOT EXISTS reponse (
      rep_id SERIAL PRIMARY KEY,
      rep_uti_id INTEGER NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
      rep_rol VARCHAR(50) NOT NULL,            -- 'eleve', 'etudiant', 'emploi'
      rep_test_num INTEGER NOT NULL,            -- 1 ou 2
      rep_choix JSONB DEFAULT '{}'::jsonb,      -- Réponses & choix saisis par l'utilisateur
      rep_resultat VARCHAR(255),               -- Résultat ou orientation calculé
      rep_pt_sci INTEGER DEFAULT 0,            -- Points scientifiques cumulés
      rep_pt_lit INTEGER DEFAULT 0,            -- Points littéraires cumulés
      rep_detail JSONB DEFAULT '{}'::jsonb,    -- Données complémentaires, matières, etc.
      rep_fac_id INTEGER REFERENCES faculte(fac_id) ON DELETE SET NULL,     -- Faculté / Université rattachée
      rep_ent_id INTEGER REFERENCES entreprise(ent_id) ON DELETE SET NULL,  -- Entreprise partenaire rattachée
      rep_met_id INTEGER REFERENCES metier(met_id) ON DELETE SET NULL,      -- Métier / Débouché rattaché
      rep_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      rep_dat_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT uq_reponses_uti_rol_test UNIQUE (rep_uti_id, rep_rol, rep_test_num)
    );

    CREATE INDEX IF NOT EXISTS idx_reponses_uti_id ON reponse(rep_uti_id);
    CREATE INDEX IF NOT EXISTS idx_reponses_rol_test ON reponse(rep_rol, rep_test_num);
  `);
  console.log('✅ Table `reponse` créée avec succès.');

  // 2. MIGRATION DES RÉPONSES EXISTANTES
  console.log('🔄 Migration des tests existants vers la table unique `reponses`...');

  // 2.1 Élève Test 1
  await query(`
    INSERT INTO reponse (rep_uti_id, rep_rol, rep_test_num, rep_choix, rep_resultat, rep_pt_sci, rep_pt_lit, rep_detail, rep_fac_id, rep_ent_id, rep_met_id, rep_dat_cre, rep_dat_mod)
    SELECT 
      te1_uti_id,
      'eleve',
      1,
      jsonb_build_object('centres_interet', te1_cen_int),
      te1_ori_pro_1,
      COALESCE(te1_pts_sci, 0),
      COALESCE(te1_pts_lit, 0),
      COALESCE(te1_det_int, '{}'::jsonb),
      te1_fac_id,
      te1_ent_id,
      te1_met_id,
      te1_dat_cre,
      te1_dat_mod
    FROM tests_eleves_1
    ON CONFLICT (rep_uti_id, rep_rol, rep_test_num) DO UPDATE SET
      rep_resultat = EXCLUDED.rep_resultat,
      rep_pt_sci = EXCLUDED.rep_pt_sci,
      rep_pt_lit = EXCLUDED.rep_pt_lit,
      rep_detail = EXCLUDED.rep_detail,
      rep_fac_id = EXCLUDED.rep_fac_id,
      rep_ent_id = EXCLUDED.rep_ent_id,
      rep_met_id = EXCLUDED.rep_met_id,
      rep_dat_mod = EXCLUDED.rep_dat_mod;
  `);

  // 2.2 Élève Test 2
  await query(`
    INSERT INTO reponse (rep_uti_id, rep_rol, rep_test_num, rep_choix, rep_resultat, rep_pt_sci, rep_pt_lit, rep_detail, rep_fac_id, rep_ent_id, rep_met_id, rep_dat_cre, rep_dat_mod)
    SELECT 
      te2_uti_id,
      'eleve',
      2,
      jsonb_build_object('matieres_preferees', te2_mat_pre),
      te2_ori_pro_2,
      COALESCE(te2_pts_sci, 0),
      COALESCE(te2_pts_lit, 0),
      COALESCE(te2_det_mat, '{}'::jsonb),
      te2_fac_id,
      te2_ent_id,
      te2_met_id,
      te2_dat_cre,
      te2_dat_mod
    FROM tests_eleves_2
    ON CONFLICT (rep_uti_id, rep_rol, rep_test_num) DO UPDATE SET
      rep_resultat = EXCLUDED.rep_resultat,
      rep_pt_sci = EXCLUDED.rep_pt_sci,
      rep_pt_lit = EXCLUDED.rep_pt_lit,
      rep_detail = EXCLUDED.rep_detail,
      rep_fac_id = EXCLUDED.rep_fac_id,
      rep_ent_id = EXCLUDED.rep_ent_id,
      rep_met_id = EXCLUDED.rep_met_id,
      rep_dat_mod = EXCLUDED.rep_dat_mod;
  `);

  // 2.3 Étudiant Test 1
  await query(`
    INSERT INTO reponse (rep_uti_id, rep_rol, rep_test_num, rep_choix, rep_resultat, rep_pt_sci, rep_pt_lit, rep_detail, rep_fac_id, rep_ent_id, rep_met_id, rep_dat_cre, rep_dat_mod)
    SELECT 
      tet1_uti_id,
      'etudiant',
      1,
      COALESCE(tet1_det_int, '{}'::jsonb),
      tet1_ori_pro_1,
      COALESCE(tet1_pts_sci, 0),
      COALESCE(tet1_pts_lit, 0),
      COALESCE(tet1_det_int, '{}'::jsonb),
      tet1_fac_id,
      tet1_ent_id,
      tet1_met_id,
      tet1_dat_cre,
      tet1_dat_mod
    FROM tests_etudiants_1
    ON CONFLICT (rep_uti_id, rep_rol, rep_test_num) DO UPDATE SET
      rep_resultat = EXCLUDED.rep_resultat,
      rep_pt_sci = EXCLUDED.rep_pt_sci,
      rep_pt_lit = EXCLUDED.rep_pt_lit,
      rep_detail = EXCLUDED.rep_detail,
      rep_fac_id = EXCLUDED.rep_fac_id,
      rep_ent_id = EXCLUDED.rep_ent_id,
      rep_met_id = EXCLUDED.rep_met_id,
      rep_dat_mod = EXCLUDED.rep_dat_mod;
  `);

  // 2.4 Étudiant Test 2
  await query(`
    INSERT INTO reponse (rep_uti_id, rep_rol, rep_test_num, rep_choix, rep_resultat, rep_pt_sci, rep_pt_lit, rep_detail, rep_fac_id, rep_ent_id, rep_met_id, rep_dat_cre, rep_dat_mod)
    SELECT 
      tet2_uti_id,
      'etudiant',
      2,
      COALESCE(tet2_det_com, '{}'::jsonb),
      tet2_ori_pro_2,
      COALESCE(tet2_pts_sci, 0),
      COALESCE(tet2_pts_lit, 0),
      COALESCE(tet2_det_com, '{}'::jsonb),
      tet2_fac_id,
      tet2_ent_id,
      tet2_met_id,
      tet2_dat_cre,
      tet2_dat_mod
    FROM tests_etudiants_2
    ON CONFLICT (rep_uti_id, rep_rol, rep_test_num) DO UPDATE SET
      rep_resultat = EXCLUDED.rep_resultat,
      rep_pt_sci = EXCLUDED.rep_pt_sci,
      rep_pt_lit = EXCLUDED.rep_pt_lit,
      rep_detail = EXCLUDED.rep_detail,
      rep_fac_id = EXCLUDED.rep_fac_id,
      rep_ent_id = EXCLUDED.rep_ent_id,
      rep_met_id = EXCLUDED.rep_met_id,
      rep_dat_mod = EXCLUDED.rep_dat_mod;
  `);

  // 2.5 Emploi Test 1
  await query(`
    INSERT INTO reponse (rep_uti_id, rep_rol, rep_test_num, rep_choix, rep_resultat, rep_pt_sci, rep_pt_lit, rep_detail, rep_fac_id, rep_ent_id, rep_met_id, rep_dat_cre, rep_dat_mod)
    SELECT 
      tem1_uti_id,
      'emploi',
      1,
      COALESCE(tem1_det_mot, '{}'::jsonb),
      tem1_ori_pro_1,
      COALESCE(tem1_pts_sci, 0),
      COALESCE(tem1_pts_lit, 0),
      COALESCE(tem1_det_mot, '{}'::jsonb),
      tem1_fac_id,
      tem1_ent_id,
      tem1_met_id,
      tem1_dat_cre,
      tem1_dat_mod
    FROM tests_emploi_1
    ON CONFLICT (rep_uti_id, rep_rol, rep_test_num) DO UPDATE SET
      rep_resultat = EXCLUDED.rep_resultat,
      rep_pt_sci = EXCLUDED.rep_pt_sci,
      rep_pt_lit = EXCLUDED.rep_pt_lit,
      rep_detail = EXCLUDED.rep_detail,
      rep_fac_id = EXCLUDED.rep_fac_id,
      rep_ent_id = EXCLUDED.rep_ent_id,
      rep_met_id = EXCLUDED.rep_met_id,
      rep_dat_mod = EXCLUDED.rep_dat_mod;
  `);

  // 2.6 Emploi Test 2
  await query(`
    INSERT INTO reponse (rep_uti_id, rep_rol, rep_test_num, rep_choix, rep_resultat, rep_pt_sci, rep_pt_lit, rep_detail, rep_fac_id, rep_ent_id, rep_met_id, rep_dat_cre, rep_dat_mod)
    SELECT 
      tem2_uti_id,
      'emploi',
      2,
      COALESCE(tem2_det_tra, '{}'::jsonb),
      tem2_ori_pro_2,
      COALESCE(tem2_pts_sci, 0),
      COALESCE(tem2_pts_lit, 0),
      COALESCE(tem2_det_tra, '{}'::jsonb),
      tem2_fac_id,
      tem2_ent_id,
      tem2_met_id,
      tem2_dat_cre,
      tem2_dat_mod
    FROM tests_emploi_2
    ON CONFLICT (rep_uti_id, rep_rol, rep_test_num) DO UPDATE SET
      rep_resultat = EXCLUDED.rep_resultat,
      rep_pt_sci = EXCLUDED.rep_pt_sci,
      rep_pt_lit = EXCLUDED.rep_pt_lit,
      rep_detail = EXCLUDED.rep_detail,
      rep_fac_id = EXCLUDED.rep_fac_id,
      rep_ent_id = EXCLUDED.rep_ent_id,
      rep_met_id = EXCLUDED.rep_met_id,
      rep_dat_mod = EXCLUDED.rep_dat_mod;
  `);

  const countRes = await query('SELECT COUNT(*) FROM reponse');
  console.log(`✅ Migration réussie : ${countRes.rows[0].count} réponses enregistrées dans \`reponses\`.`);

  // 3. SUPPRESSION DES ATTRIBUTS *_code (LE NOM SUFFIT)
  console.log('🗑️ Suppression des attributs fac_code, ent_code, met_code...');
  await query(`
    ALTER TABLE faculte DROP COLUMN IF EXISTS fac_code CASCADE;
    ALTER TABLE entreprise DROP COLUMN IF EXISTS ent_code CASCADE;
    ALTER TABLE metier DROP COLUMN IF EXISTS met_code CASCADE;
  `);
  console.log('✅ Attributs *_code supprimés de facultes, entreprises et metiers.');

  // 4. SUPPRESSION DES TABLES DE CONSTANTES ET DES MULTIPLES TABLES DE TESTS
  console.log('🗑️ Suppression des 44 tables de constantes et tables redondantes...');
  await query(`
    -- Vues dépendantes
    DROP VIEW IF EXISTS questions_1, questions_2, reponses_1, reponses_2, caracteristiques_1, caracteristiques_2 CASCADE;
    DROP VIEW IF EXISTS tests_eleves, tests_etudiants, tests_emploi, tests_reconversion, profils_reconversion CASCADE;

    -- Tables de liaison jonction facultes/entreprises/metiers
    DROP TABLE IF EXISTS tests_eleves_1_facultes, tests_eleves_1_entreprises, tests_eleves_1_metiers CASCADE;
    DROP TABLE IF EXISTS tests_eleves_2_facultes, tests_eleves_2_entreprises, tests_eleves_2_metiers CASCADE;
    DROP TABLE IF EXISTS tests_etudiants_1_facultes, tests_etudiants_1_entreprises, tests_etudiants_1_metiers CASCADE;
    DROP TABLE IF EXISTS tests_etudiants_2_facultes, tests_etudiants_2_entreprises, tests_etudiants_2_metiers CASCADE;
    DROP TABLE IF EXISTS tests_emploi_1_entreprises, tests_emploi_1_metiers CASCADE;
    DROP TABLE IF EXISTS tests_emploi_2_entreprises, tests_emploi_2_metiers CASCADE;

    -- Anciennes tables de tests individuels
    DROP TABLE IF EXISTS tests_eleves_1, tests_eleves_2 CASCADE;
    DROP TABLE IF EXISTS tests_etudiants_1, tests_etudiants_2 CASCADE;
    DROP TABLE IF EXISTS tests_emploi_1, tests_emploi_2 CASCADE;

    -- Tables de réponses utilisateurs intermédiaires
    DROP TABLE IF EXISTS reponses_utilisateurs_eleves_1, reponses_utilisateurs_eleves_2 CASCADE;
    DROP TABLE IF EXISTS reponses_utilisateurs_etudiants_1, reponses_utilisateurs_etudiants_2 CASCADE;
    DROP TABLE IF EXISTS reponses_utilisateurs_emploi_1, reponses_utilisateurs_emploi_2 CASCADE;

    -- Tables de constantes questions, réponses possibles et caractéristiques
    DROP TABLE IF EXISTS questions_eleves_1, questions_eleves_2 CASCADE;
    DROP TABLE IF EXISTS questions_etudiants_1, questions_etudiants_2 CASCADE;
    DROP TABLE IF EXISTS questions_emploi_1, questions_emploi_2 CASCADE;

    DROP TABLE IF EXISTS reponses_eleves_1, reponses_eleves_2 CASCADE;
    DROP TABLE IF EXISTS reponses_etudiants_1, reponses_etudiants_2 CASCADE;
    DROP TABLE IF EXISTS reponses_emploi_1, reponses_emploi_2 CASCADE;

    DROP TABLE IF EXISTS caracteristiques_eleves_1, caracteristiques_eleves_2 CASCADE;
    DROP TABLE IF EXISTS caracteristiques_etudiants_1, caracteristiques_etudiants_2 CASCADE;
    DROP TABLE IF EXISTS caracteristiques_emploi_1, caracteristiques_emploi_2 CASCADE;
  `);
  console.log('✅ Tables de constantes et tables redondantes supprimées.');

  // 5. RECRÉATION DES VUES DE COMPATIBILITÉ BASÉES SUR LA TABLE UNIQUE `reponses`
  console.log('🔄 Création des vues unifiées pour rétrocompatibilité totale...');
  await query(`
    -- Vue Élève
    CREATE OR REPLACE VIEW tests_eleves AS
    SELECT 
      COALESCE(r1.rep_id, r2.rep_id) AS tel_id,
      COALESCE(r1.rep_uti_id, r2.rep_uti_id) AS tel_uti_id,
      r1.rep_resultat AS tel_ori_pro_1,
      r2.rep_resultat AS tel_ori_pro_2,
      r1.rep_detail AS tel_det_int,
      r2.rep_detail AS tel_det_mat,
      r1.rep_choix->>'centres_interet' AS tel_cen_int,
      r2.rep_choix->>'matieres_preferees' AS tel_mat_pre,
      r1.rep_detail->'fb_ana' AS tel_fb_ana,
      r1.rep_fac_id AS tel_fac_id_1,
      r2.rep_fac_id AS tel_fac_id_2,
      r1.rep_ent_id AS tel_ent_id_1,
      r2.rep_ent_id AS tel_ent_id_2,
      r1.rep_met_id AS tel_met_id_1,
      r2.rep_met_id AS tel_met_id_2,
      r1.rep_pt_sci AS tel_pts_sci_1,
      r1.rep_pt_lit AS tel_pts_lit_1,
      r2.rep_pt_sci AS tel_pts_sci_2,
      r2.rep_pt_lit AS tel_pts_lit_2,
      (COALESCE(r1.rep_pt_sci, 0) + COALESCE(r2.rep_pt_sci, 0)) AS tel_pts_sci,
      (COALESCE(r1.rep_pt_lit, 0) + COALESCE(r2.rep_pt_lit, 0)) AS tel_pts_lit,
      CASE 
        WHEN r2.rep_id IS NOT NULL THEN 3
        WHEN r1.rep_id IS NOT NULL THEN 2
        ELSE 1
      END AS tel_eta_act,
      COALESCE(r1.rep_dat_cre, r2.rep_dat_cre) AS tel_dat_cre,
      GREATEST(COALESCE(r1.rep_dat_mod, r2.rep_dat_mod), COALESCE(r2.rep_dat_mod, r1.rep_dat_mod)) AS tel_dat_mod
    FROM (SELECT * FROM reponse WHERE rep_rol = 'eleve' AND rep_test_num = 1) r1
    FULL OUTER JOIN (SELECT * FROM reponse WHERE rep_rol = 'eleve' AND rep_test_num = 2) r2
      ON r1.rep_uti_id = r2.rep_uti_id;

    -- Vue Étudiant
    CREATE OR REPLACE VIEW tests_etudiants AS
    SELECT 
      COALESCE(r1.rep_id, r2.rep_id) AS tet_id,
      COALESCE(r1.rep_uti_id, r2.rep_uti_id) AS tet_uti_id,
      r1.rep_resultat AS tet_ori_pro_1,
      r2.rep_resultat AS tet_ori_pro_2,
      r1.rep_detail AS tet_det_int,
      r2.rep_detail AS tet_det_com,
      r1.rep_fac_id AS tet_fac_id_1,
      r2.rep_fac_id AS tet_fac_id_2,
      r1.rep_ent_id AS tet_ent_id_1,
      r2.rep_ent_id AS tet_ent_id_2,
      r1.rep_met_id AS tet_met_id_1,
      r2.rep_met_id AS tet_met_id_2,
      r1.rep_pt_sci AS tet_pts_sci_1,
      r1.rep_pt_lit AS tet_pts_lit_1,
      r2.rep_pt_sci AS tet_pts_sci_2,
      r2.rep_pt_lit AS tet_pts_lit_2,
      (COALESCE(r1.rep_pt_sci, 0) + COALESCE(r2.rep_pt_sci, 0)) AS tet_pts_sci,
      (COALESCE(r1.rep_pt_lit, 0) + COALESCE(r2.rep_pt_lit, 0)) AS tet_pts_lit,
      CASE 
        WHEN r2.rep_id IS NOT NULL THEN 3
        WHEN r1.rep_id IS NOT NULL THEN 2
        ELSE 1
      END AS tet_eta_act,
      COALESCE(r1.rep_dat_cre, r2.rep_dat_cre) AS tet_dat_cre,
      GREATEST(COALESCE(r1.rep_dat_mod, r2.rep_dat_mod), COALESCE(r2.rep_dat_mod, r1.rep_dat_mod)) AS tet_dat_mod
    FROM (SELECT * FROM reponse WHERE rep_rol = 'etudiant' AND rep_test_num = 1) r1
    FULL OUTER JOIN (SELECT * FROM reponse WHERE rep_rol = 'etudiant' AND rep_test_num = 2) r2
      ON r1.rep_uti_id = r2.rep_uti_id;

    -- Vue Emploi
    CREATE OR REPLACE VIEW tests_emploi AS
    SELECT 
      COALESCE(r1.rep_id, r2.rep_id) AS tem_id,
      COALESCE(r1.rep_uti_id, r2.rep_uti_id) AS tem_uti_id,
      r1.rep_resultat AS tem_ori_pro_1,
      r2.rep_resultat AS tem_ori_pro_2,
      r1.rep_detail AS tem_det_mot,
      r2.rep_detail AS tem_det_tra,
      r1.rep_fac_id AS tem_fac_id_1,
      r2.rep_fac_id AS tem_fac_id_2,
      r1.rep_ent_id AS tem_ent_id_1,
      r2.rep_ent_id AS tem_ent_id_2,
      r1.rep_met_id AS tem_met_id_1,
      r2.rep_met_id AS tem_met_id_2,
      r1.rep_pt_sci AS tem_pts_sci_1,
      r1.rep_pt_lit AS tem_pts_lit_1,
      r2.rep_pt_sci AS tem_pts_sci_2,
      r2.rep_pt_lit AS tem_pts_lit_2,
      (COALESCE(r1.rep_pt_sci, 0) + COALESCE(r2.rep_pt_sci, 0)) AS tem_pts_sci,
      (COALESCE(r1.rep_pt_lit, 0) + COALESCE(r2.rep_pt_lit, 0)) AS tem_pts_lit,
      CASE 
        WHEN r2.rep_id IS NOT NULL THEN 3
        WHEN r1.rep_id IS NOT NULL THEN 2
        ELSE 1
      END AS tem_eta_act,
      COALESCE(r1.rep_dat_cre, r2.rep_dat_cre) AS tem_dat_cre,
      GREATEST(COALESCE(r1.rep_dat_mod, r2.rep_dat_mod), COALESCE(r2.rep_dat_mod, r1.rep_dat_mod)) AS tem_dat_mod
    FROM (SELECT * FROM reponse WHERE rep_rol = 'emploi' AND rep_test_num = 1) r1
    FULL OUTER JOIN (SELECT * FROM reponse WHERE rep_rol = 'emploi' AND rep_test_num = 2) r2
      ON r1.rep_uti_id = r2.rep_uti_id;

    -- Vue Reconversion
    CREATE OR REPLACE VIEW tests_reconversion AS
    SELECT 
      tem_id AS rec_test_id,
      tem_uti_id AS rec_uti_id,
      tem_fac_id_1 AS rec_fac_id_1,
      tem_fac_id_2 AS rec_fac_id_2,
      tem_ent_id_1 AS rec_ent_id_1,
      tem_ent_id_2 AS rec_ent_id_2,
      tem_met_id_1 AS rec_met_id_1,
      tem_met_id_2 AS rec_met_id_2,
      tem_pts_sci AS rec_pts_sci,
      tem_pts_lit AS rec_pts_lit,
      tem_det_mot AS rec_det_mot,
      tem_det_tra AS rec_det_tra,
      tem_ori_pro_1 AS rec_ori_pro_1,
      tem_ori_pro_2 AS rec_ori_pro_2,
      tem_eta_act AS rec_eta_act,
      tem_dat_cre AS rec_dat_cre,
      tem_dat_mod AS rec_dat_mod
    FROM tests_emploi;
  `);
  console.log('✅ Vues de compatibilité créées.');

  // 6. ÉTAT FINAL DU SCHÉMA
  const finalTables = await query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);

  console.log('\n======================================================');
  console.log(`🎉 ARCHITECTURE SIMPLIFIÉE AVEC SUCCÈS !`);
  console.log(`📋 NOMBRE TOTAL DE TABLES ACTUELLES : ${finalTables.rows.length}`);
  console.log('Tables conservées :', finalTables.rows.map(r => r.table_name).join(', '));
  console.log('======================================================\n');
}

migrateSimplification()
  .then(() => pool.end())
  .catch(err => {
    console.error('Erreur migrateSimplification :', err);
    process.exit(1);
  });

