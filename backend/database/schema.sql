-- ========================================================
-- SCHÉMA DE LA BASE DE DONNÉES : Plateforme e-HARI
-- SGBD : PostgreSQL 15+
-- Encodage : UTF-8
-- Architecture simplifiée : 9 TABLES FONDAMENTALES
--
-- Principe :
-- 1. Les éléments constants (questions, barèmes, traits de caractère)
--    sont gérés au niveau du code (backend/data/testsConstantData.js).
-- 2. Une table unique 'reponses' stocke l'ensemble des réponses et
--    résultats de tests de tous les profils (élève, étudiant, emploi).
-- 3. Aucun attribut redondant de type *_code : le nom (*_nom) et l'ID suffisent.
-- 4. Zéro icône ou émoji en BDD : gestion purement visuelle côté front.
-- ========================================================

-- ========================================================
-- 1. TABLE PRINCIPALE DES UTILISATEURS (Préfixe : uti_)
-- ========================================================
CREATE TABLE IF NOT EXISTS utilisateur (
    uti_id SERIAL PRIMARY KEY,
    uti_nom VARCHAR(100) NOT NULL,
    uti_pre VARCHAR(100) NOT NULL,
    uti_ema VARCHAR(150) UNIQUE NOT NULL,
    uti_pas VARCHAR(255) NOT NULL,
    uti_rol VARCHAR(20) NOT NULL CHECK (uti_rol IN ('admin', 'eleve', 'etudiant', 'emploi', 'reconversion')),
    uti_tel VARCHAR(30),
    uti_adr TEXT,
    uti_ava TEXT,
    uti_sta VARCHAR(20) DEFAULT 'actif' CHECK (uti_sta IN ('actif', 'inactif', 'suspendu')),
    uti_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    uti_dat_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_uti_ema ON utilisateur(uti_ema);
CREATE INDEX IF NOT EXISTS idx_uti_rol ON utilisateur(uti_rol);

-- ========================================================
-- 2. PROFILS PERSONNELS DES UTILISATEURS PAR RÔLE
-- ========================================================

-- 2.1 Profil personnel Élève (Préfixe : ele_)
-- Ne contient STRICTEMENT que les informations personnelles & scolaires
CREATE TABLE IF NOT EXISTS profil_eleve (
    ele_id SERIAL PRIMARY KEY,
    ele_uti_id INTEGER UNIQUE NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
    ele_cla VARCHAR(50),              -- Classe actuelle (6ème, 3ème, Terminale...)
    ele_ser VARCHAR(100),             -- Série suivie au Baccalauréat
    ele_eta VARCHAR(150),             -- Établissement scolaire / Lycée
    ele_not_ema BOOLEAN DEFAULT TRUE, -- Rappels de révision par email
    ele_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ele_dat_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ele_uti_id ON profil_eleve(ele_uti_id);

-- 2.2 Profil personnel Étudiant (Préfixe : etu_)
-- Ne contient STRICTEMENT que les informations académiques & personnelles
CREATE TABLE IF NOT EXISTS profil_etudiant (
    etu_id SERIAL PRIMARY KEY,
    etu_uti_id INTEGER UNIQUE NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
    etu_eta VARCHAR(150),             -- Université / Institut d'enseignement supérieur
    etu_fil VARCHAR(150),             -- Filière / Spécialisation
    etu_niv_etu VARCHAR(50),          -- Niveau d'études actuel (L1, L2, L3, M1, M2, Doctorat)
    etu_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    etu_dat_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_etu_uti_id ON profil_etudiant(etu_uti_id);

-- 2.3 Profil personnel Insertion & Emploi (Préfixe : emp_)
-- Ne contient STRICTEMENT que les informations professionnelles & personnelles
CREATE TABLE IF NOT EXISTS profil_emploi (
    emp_id SERIAL PRIMARY KEY,
    emp_uti_id INTEGER UNIQUE NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
    emp_sit_act VARCHAR(150),         -- Situation actuelle (En recherche, En poste, etc.)
    emp_met_act VARCHAR(150),         -- Métier actuel ou dernière profession exercée
    emp_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    emp_dat_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_emp_uti_id ON profil_emploi(emp_uti_id);

-- Vue de compatibilité pour le rôle historique 'reconversion'
CREATE OR REPLACE VIEW profils_reconversion AS 
SELECT 
    emp_id AS rec_id,
    emp_uti_id AS rec_uti_id,
    emp_sit_act AS rec_sit_act,
    emp_met_act AS rec_met_act,
    emp_dat_cre AS rec_dat_cre,
    emp_dat_mod AS rec_dat_mod
FROM profil_emploi;

-- ========================================================
-- 3. EMPLOIS DU TEMPS DE RÉVISION (Préfixe : edt_)
-- ========================================================
CREATE TABLE IF NOT EXISTS emploi_du_temps (
    edt_id SERIAL PRIMARY KEY,
    edt_uti_id INTEGER UNIQUE NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
    edt_don JSONB NOT NULL DEFAULT '{}'::jsonb, -- Données complètes de l'emploi du temps généré
    edt_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    edt_dat_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_edt_uti_id ON emploi_du_temps(edt_uti_id);

-- ========================================================
-- 4. ENTITÉS DU CATALOGUE & PROPOSITIONS D'ORIENTATION
-- (Sans colonnes redondantes de code - les noms et IDs suffisent)
-- ========================================================

-- 4.1 Facultés, Écoles et Universités partenaires (Préfixe : fac_)
CREATE TABLE IF NOT EXISTS faculte (
    fac_id SERIAL PRIMARY KEY,
    fac_nom VARCHAR(200) NOT NULL,
    fac_sigle VARCHAR(50),
    fac_type VARCHAR(50) DEFAULT 'Public',
    fac_ville VARCHAR(100) DEFAULT 'Antananarivo',
    fac_filiere TEXT[],
    fac_description TEXT,
    fac_site_web VARCHAR(255),
    fac_pole VARCHAR(100),
    fac_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_fac_nom ON faculte(fac_nom);
CREATE INDEX IF NOT EXISTS idx_fac_pole ON faculte(fac_pole);

-- 4.2 Entreprises partenaires & Recruteurs cibles (Préfixe : ent_)
CREATE TABLE IF NOT EXISTS entreprise (
    ent_id SERIAL PRIMARY KEY,
    ent_nom VARCHAR(200) NOT NULL,
    ent_secteur VARCHAR(100) NOT NULL,
    ent_secteur_detail VARCHAR(150),
    ent_ville VARCHAR(100) DEFAULT 'Antananarivo',
    ent_implantation VARCHAR(150),
    ent_description TEXT,
    ent_poste_recrute TEXT[],
    ent_profil_recherche TEXT,
    ent_accessibilite VARCHAR(150),
    ent_email_contact VARCHAR(150),
    ent_site_web VARCHAR(255),
    ent_pole VARCHAR(100),
    ent_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ent_nom ON entreprise(ent_nom);
CREATE INDEX IF NOT EXISTS idx_ent_pole ON entreprise(ent_pole);

-- 4.3 Métiers, Débouchés & Fiches carrières (Préfixe : met_)
CREATE TABLE IF NOT EXISTS metier (
    met_id SERIAL PRIMARY KEY,
    met_nom VARCHAR(200) NOT NULL,
    met_secteur VARCHAR(100) NOT NULL,
    met_niveau_requis VARCHAR(100),
    met_salaire_indicatif VARCHAR(100),
    met_description TEXT,
    met_debouche TEXT[],
    met_pole VARCHAR(100),
    met_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_met_nom ON metier(met_nom);
CREATE INDEX IF NOT EXISTS idx_met_pole ON metier(met_pole);

-- ========================================================
-- 5. TABLE LISTE DE RECOMMANDATION (Préfixe : rec_)
-- Associe plusieurs facultés, entreprises et métiers recommandés
-- ========================================================
CREATE TABLE IF NOT EXISTS liste_recommandation (
    rec_id SERIAL PRIMARY KEY,
    rec_liste_fac_id INTEGER[] DEFAULT '{}'::integer[],
    rec_liste_ent_id INTEGER[] DEFAULT '{}'::integer[],
    rec_liste_met_id INTEGER[] DEFAULT '{}'::integer[]
);

-- ========================================================
-- 6. TABLE UNIQUE DES RÉPONSES & RÉSULTATS DE TEST (Préfixe : rep_)
-- Centralise tous les tests (Test 1 et Test 2) pour tous les rôles
-- ========================================================
CREATE TABLE IF NOT EXISTS reponse (
    rep_id SERIAL PRIMARY KEY,
    rep_uti_id INTEGER NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
    rep_rol VARCHAR(20) NOT NULL CHECK (rep_rol IN ('eleve', 'etudiant', 'emploi', 'reconversion')),
    rep_test_num SMALLINT NOT NULL CHECK (rep_test_num IN (1, 2)),
    rep_choix TEXT,                     -- Choix déclarés ou matières / compétences clés
    rep_resultat VARCHAR(255),          -- Orientation provisoire ou trait de caractère attribué
    rep_pt_sci INTEGER DEFAULT 0,      -- Points accumulés pôle scientifique
    rep_pt_lit INTEGER DEFAULT 0,      -- Points accumulés pôle littéraire
    rep_detail JSONB DEFAULT '{}'::jsonb, -- Détails de l'évaluation, réponses et scores
    rep_rec_id INTEGER REFERENCES liste_recommandation(rec_id) ON DELETE SET NULL,
    rep_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    rep_dat_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_utilisateur_role_test UNIQUE (rep_uti_id, rep_rol, rep_test_num)
);

CREATE INDEX IF NOT EXISTS idx_rep_uti_id ON reponse(rep_uti_id);
CREATE INDEX IF NOT EXISTS idx_rep_rol_test ON reponse(rep_rol, rep_test_num);

-- ========================================================
-- 6. VUES DE COMPATIBILITÉ RÉTROACTIVE
-- Assurent la fluidité du code existant sans tables superflues
-- ========================================================

-- Vue Élève
CREATE OR REPLACE VIEW tests_eleves AS
SELECT 
  u.uti_id AS tel_uti_id,
  COALESCE(r1.rep_id, r2.rep_id) AS tel_id,
  r1.rep_resultat AS tel_ori_pro_1,
  r2.rep_resultat AS tel_ori_pro_2,
  r1.rep_detail AS tel_det_int,
  r2.rep_detail AS tel_det_mat,
  r1.rep_choix AS tel_cen_int,
  r2.rep_choix AS tel_mat_pre,
  r1.rep_detail->>'fb_ana' AS tel_fb_ana,
  r1.rep_fac_id AS tel_fac_id_1,
  r2.rep_fac_id AS tel_fac_id_2,
  r1.rep_ent_id AS tel_ent_id_1,
  r2.rep_ent_id AS tel_ent_id_2,
  r1.rep_met_id AS tel_met_id_1,
  r2.rep_met_id AS tel_met_id_2,
  COALESCE(r1.rep_pt_sci, 0) AS tel_pts_sci_1,
  COALESCE(r1.rep_pt_lit, 0) AS tel_pts_lit_1,
  COALESCE(r2.rep_pt_sci, 0) AS tel_pts_sci_2,
  COALESCE(r2.rep_pt_lit, 0) AS tel_pts_lit_2,
  COALESCE(r1.rep_pt_sci, 0) + COALESCE(r2.rep_pt_sci, 0) AS tel_pts_sci,
  COALESCE(r1.rep_pt_lit, 0) + COALESCE(r2.rep_pt_lit, 0) AS tel_pts_lit,
  CASE 
    WHEN r2.rep_resultat IS NOT NULL THEN 3 
    WHEN r1.rep_resultat IS NOT NULL THEN 2 
    ELSE 1 
  END AS tel_eta_act,
  LEAST(r1.rep_dat_cre, r2.rep_dat_cre) AS tel_dat_cre,
  GREATEST(r1.rep_dat_mod, r2.rep_dat_mod) AS tel_dat_mod
FROM utilisateur u
LEFT JOIN reponse r1 ON u.uti_id = r1.rep_uti_id AND r1.rep_rol = 'eleve' AND r1.rep_test_num = 1
LEFT JOIN reponse r2 ON u.uti_id = r2.rep_uti_id AND r2.rep_rol = 'eleve' AND r2.rep_test_num = 2
WHERE u.uti_rol = 'eleve';

-- Vue Étudiant
CREATE OR REPLACE VIEW tests_etudiants AS
SELECT 
  u.uti_id AS tet_uti_id,
  COALESCE(r1.rep_id, r2.rep_id) AS tet_id,
  r1.rep_resultat AS tet_ori_pro_1,
  r2.rep_resultat AS tet_ori_pro_2,
  r1.rep_detail AS tet_det_int,
  r2.rep_detail AS tet_det_com,
  r1.rep_choix AS tet_cen_int,
  r2.rep_choix AS tet_com,
  r1.rep_fac_id AS tet_fac_id_1,
  r2.rep_fac_id AS tet_fac_id_2,
  r1.rep_ent_id AS tet_ent_id_1,
  r2.rep_ent_id AS tet_ent_id_2,
  r1.rep_met_id AS tet_met_id_1,
  r2.rep_met_id AS tet_met_id_2,
  COALESCE(r1.rep_pt_sci, 0) AS tet_pts_sci_1,
  COALESCE(r1.rep_pt_lit, 0) AS tet_pts_lit_1,
  COALESCE(r2.rep_pt_sci, 0) AS tet_pts_sci_2,
  COALESCE(r2.rep_pt_lit, 0) AS tet_pts_lit_2,
  COALESCE(r1.rep_pt_sci, 0) + COALESCE(r2.rep_pt_sci, 0) AS tet_pts_sci,
  COALESCE(r1.rep_pt_lit, 0) + COALESCE(r2.rep_pt_lit, 0) AS tet_pts_lit,
  CASE 
    WHEN r2.rep_resultat IS NOT NULL THEN 3 
    WHEN r1.rep_resultat IS NOT NULL THEN 2 
    ELSE 1 
  END AS tet_eta_act,
  LEAST(r1.rep_dat_cre, r2.rep_dat_cre) AS tet_dat_cre,
  GREATEST(r1.rep_dat_mod, r2.rep_dat_mod) AS tet_dat_mod
FROM utilisateur u
LEFT JOIN reponse r1 ON u.uti_id = r1.rep_uti_id AND r1.rep_rol = 'etudiant' AND r1.rep_test_num = 1
LEFT JOIN reponse r2 ON u.uti_id = r2.rep_uti_id AND r2.rep_rol = 'etudiant' AND r2.rep_test_num = 2
WHERE u.uti_rol = 'etudiant';

-- Vue Emploi & Insertion
CREATE OR REPLACE VIEW tests_emploi AS
SELECT 
  u.uti_id AS tem_uti_id,
  COALESCE(r1.rep_id, r2.rep_id) AS tem_id,
  r1.rep_resultat AS tem_ori_pro_1,
  r2.rep_resultat AS tem_ori_pro_2,
  r1.rep_detail AS tem_det_mot,
  r2.rep_detail AS tem_det_tra,
  r1.rep_choix AS tem_mot_cha,
  r2.rep_choix AS tem_sec_cib,
  r1.rep_fac_id AS tem_fac_id_1,
  r2.rep_fac_id AS tem_fac_id_2,
  r1.rep_ent_id AS tem_ent_id_1,
  r2.rep_ent_id AS tem_ent_id_2,
  r1.rep_met_id AS tem_met_id_1,
  r2.rep_met_id AS tem_met_id_2,
  COALESCE(r1.rep_pt_sci, 0) AS tem_pts_sci_1,
  COALESCE(r1.rep_pt_lit, 0) AS tem_pts_lit_1,
  COALESCE(r2.rep_pt_sci, 0) AS tem_pts_sci_2,
  COALESCE(r2.rep_pt_lit, 0) AS tem_pts_lit_2,
  COALESCE(r1.rep_pt_sci, 0) + COALESCE(r2.rep_pt_sci, 0) AS tem_pts_sci,
  COALESCE(r1.rep_pt_lit, 0) + COALESCE(r2.rep_pt_lit, 0) AS tem_pts_lit,
  CASE 
    WHEN r2.rep_resultat IS NOT NULL THEN 3 
    WHEN r1.rep_resultat IS NOT NULL THEN 2 
    ELSE 1 
  END AS tem_eta_act,
  LEAST(r1.rep_dat_cre, r2.rep_dat_cre) AS tem_dat_cre,
  GREATEST(r1.rep_dat_mod, r2.rep_dat_mod) AS tem_dat_mod
FROM utilisateur u
LEFT JOIN reponse r1 ON u.uti_id = r1.rep_uti_id AND r1.rep_rol IN ('emploi', 'reconversion') AND r1.rep_test_num = 1
LEFT JOIN reponse r2 ON u.uti_id = r2.rep_uti_id AND r2.rep_rol IN ('emploi', 'reconversion') AND r2.rep_test_num = 2
WHERE u.uti_rol IN ('emploi', 'reconversion');

-- Vue Reconversion (Rétrocompatibilité)
CREATE OR REPLACE VIEW tests_reconversion AS
SELECT 
  tem_uti_id AS rec_uti_id,
  tem_id AS rec_id,
  tem_ori_pro_1 AS rec_ori_pro_1,
  tem_ori_pro_2 AS rec_ori_pro_2,
  tem_det_mot AS rec_det_mot,
  tem_det_tra AS rec_det_tra,
  tem_mot_cha AS rec_mot_cha,
  tem_sec_cib AS rec_sec_cib,
  tem_fac_id_1 AS rec_fac_id_1,
  tem_fac_id_2 AS rec_fac_id_2,
  tem_ent_id_1 AS rec_ent_id_1,
  tem_ent_id_2 AS rec_ent_id_2,
  tem_met_id_1 AS rec_met_id_1,
  tem_met_id_2 AS rec_met_id_2,
  tem_pts_sci_1 AS rec_pts_sci_1,
  tem_pts_lit_1 AS rec_pts_lit_1,
  tem_pts_sci_2 AS rec_pts_sci_2,
  tem_pts_lit_2 AS rec_pts_lit_2,
  tem_pts_sci AS rec_pts_sci,
  tem_pts_lit AS rec_pts_lit,
  tem_eta_act AS rec_eta_act,
  tem_dat_cre AS rec_dat_cre,
  tem_dat_mod AS rec_dat_mod
FROM tests_emploi;

-- ========================================================
-- 10. TABLE DES MESSAGES & ÉCHANGES AVEC L'ADMIN (Préfixe : mes_)
-- Espace type messagerie privée / MP avec support de documents & pièces jointes
-- ========================================================
CREATE TABLE IF NOT EXISTS message (
    mes_id SERIAL PRIMARY KEY,
    mes_exp_id INTEGER NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE, -- Expéditeur
    mes_des_id INTEGER NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE, -- Destinataire
    mes_con TEXT,                                                                  -- Texte du message
    mes_fic_nom VARCHAR(255),                                                      -- Nom du fichier joint (ex: "CV.pdf")
    mes_fic_typ VARCHAR(100),                                                      -- Type MIME (ex: "image/png", "application/pdf")
    mes_fic_tai INTEGER,                                                           -- Taille en octets
    mes_fic_url TEXT,                                                              -- Données base64 ou URL du fichier
    mes_lu BOOLEAN DEFAULT FALSE,                                                  -- Statut de lecture
    mes_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP                 -- Date et heure d'envoi
);

CREATE INDEX IF NOT EXISTS idx_mes_exp_id ON message(mes_exp_id);
CREATE INDEX IF NOT EXISTS idx_mes_des_id ON message(mes_des_id);
CREATE INDEX IF NOT EXISTS idx_mes_conv ON message(mes_exp_id, mes_des_id);
CREATE INDEX IF NOT EXISTS idx_mes_dat_cre ON message(mes_dat_cre);
