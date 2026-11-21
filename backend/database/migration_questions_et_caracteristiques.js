const { query } = require('../config/db');

async function migrate() {
  console.log('🚀 Démarrage de la migration : Questions, Réponses possibles et Caractéristiques en BDD...');
  try {
    // ========================================================
    // 1. ÉLÈVE : TEST 1 (Centres d'intérêt & Personnalité)
    // ========================================================
    console.log('1. Création des tables pour Élève Test 1...');
    await query(`
      CREATE TABLE IF NOT EXISTS caracteristiques_eleves_1 (
        car_id SERIAL PRIMARY KEY,
        car_code VARCHAR(50) UNIQUE NOT NULL,
        car_nom VARCHAR(200) NOT NULL,
        car_short_nom VARCHAR(100) NOT NULL,
        car_pts_sci_min INTEGER DEFAULT 0,
        car_pts_lit_min INTEGER DEFAULT 0,
        car_description TEXT,
        car_qualites TEXT,
        car_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS questions_eleves_1 (
        que_id SERIAL PRIMARY KEY,
        que_texte TEXT NOT NULL,
        que_ordre INTEGER NOT NULL,
        que_pts_sci INTEGER DEFAULT 0,
        que_pts_lit INTEGER DEFAULT 0,
        que_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reponses_eleves_1 (
        rep_id SERIAL PRIMARY KEY,
        rep_que_id INTEGER NOT NULL REFERENCES questions_eleves_1(que_id) ON DELETE CASCADE,
        rep_code VARCHAR(20) NOT NULL,
        rep_titre VARCHAR(255) NOT NULL,
        rep_description TEXT,
        rep_pt_sci INTEGER DEFAULT 0,
        rep_pt_lit INTEGER DEFAULT 0,
        rep_categorie VARCHAR(50) NOT NULL,
        rep_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reponses_utilisateurs_eleves_1 (
        ru1_id SERIAL PRIMARY KEY,
        ru1_uti_id INTEGER NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
        ru1_que_id INTEGER NOT NULL REFERENCES questions_eleves_1(que_id) ON DELETE CASCADE,
        ru1_rep_id INTEGER NOT NULL REFERENCES reponses_eleves_1(rep_id) ON DELETE CASCADE,
        ru1_pts_sci INTEGER DEFAULT 0,
        ru1_pts_lit INTEGER DEFAULT 0,
        ru1_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(ru1_uti_id, ru1_que_id)
      );

      -- Vues de compatibilité selon le libellé utilisateur 'questions-1' / 'caracteristiques-1'
      CREATE OR REPLACE VIEW questions_1 AS SELECT * FROM questions_eleves_1;
      CREATE OR REPLACE VIEW reponses_1 AS SELECT * FROM reponses_eleves_1;
      CREATE OR REPLACE VIEW caracteristiques_1 AS SELECT * FROM caracteristiques_eleves_1;
    `);

    // ========================================================
    // 2. ÉLÈVE : TEST 2 (Matières scolaires, Aptitudes & Séries Bac)
    // ========================================================
    console.log('2. Création des tables pour Élève Test 2...');
    await query(`
      CREATE TABLE IF NOT EXISTS caracteristiques_eleves_2 (
        car_id SERIAL PRIMARY KEY,
        car_code VARCHAR(50) UNIQUE NOT NULL,
        car_nom VARCHAR(200) NOT NULL,
        car_short_nom VARCHAR(100) NOT NULL,
        car_recommandations TEXT,
        car_debouches TEXT,
        car_pts_sci_min INTEGER DEFAULT 0,
        car_pts_lit_min INTEGER DEFAULT 0,
        car_description TEXT,
        car_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS questions_eleves_2 (
        que_id SERIAL PRIMARY KEY,
        que_texte TEXT NOT NULL,
        que_ordre INTEGER NOT NULL,
        que_pts_sci INTEGER DEFAULT 0,
        que_pts_lit INTEGER DEFAULT 0,
        que_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reponses_eleves_2 (
        rep_id SERIAL PRIMARY KEY,
        rep_que_id INTEGER NOT NULL REFERENCES questions_eleves_2(que_id) ON DELETE CASCADE,
        rep_code VARCHAR(50) NOT NULL,
        rep_titre VARCHAR(255) NOT NULL,
        rep_description TEXT,
        rep_pt_sci INTEGER DEFAULT 0,
        rep_pt_lit INTEGER DEFAULT 0,
        rep_pole VARCHAR(50) NOT NULL,
        rep_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reponses_utilisateurs_eleves_2 (
        ru2_id SERIAL PRIMARY KEY,
        ru2_uti_id INTEGER NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
        ru2_que_id INTEGER NOT NULL REFERENCES questions_eleves_2(que_id) ON DELETE CASCADE,
        ru2_rep_id INTEGER NOT NULL REFERENCES reponses_eleves_2(rep_id) ON DELETE CASCADE,
        ru2_pts_sci INTEGER DEFAULT 0,
        ru2_pts_lit INTEGER DEFAULT 0,
        ru2_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE OR REPLACE VIEW questions_2 AS SELECT * FROM questions_eleves_2;
      CREATE OR REPLACE VIEW reponses_2 AS SELECT * FROM reponses_eleves_2;
      CREATE OR REPLACE VIEW caracteristiques_2 AS SELECT * FROM caracteristiques_eleves_2;
    `);

    // ========================================================
    // 3. ÉTUDIANT : TEST 1 & TEST 2
    // ========================================================
    console.log('3. Création des tables pour Étudiant Tests 1 & 2...');
    await query(`
      CREATE TABLE IF NOT EXISTS caracteristiques_etudiants_1 (
        car_id SERIAL PRIMARY KEY,
        car_code VARCHAR(50) UNIQUE NOT NULL,
        car_nom VARCHAR(200) NOT NULL,
        car_short_nom VARCHAR(100) NOT NULL,
        car_pts_sci_min INTEGER DEFAULT 0,
        car_pts_lit_min INTEGER DEFAULT 0,
        car_description TEXT,
        car_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS questions_etudiants_1 (
        que_id SERIAL PRIMARY KEY,
        que_texte TEXT NOT NULL,
        que_ordre INTEGER NOT NULL,
        que_pts_sci INTEGER DEFAULT 0,
        que_pts_lit INTEGER DEFAULT 0,
        que_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reponses_etudiants_1 (
        rep_id SERIAL PRIMARY KEY,
        rep_que_id INTEGER NOT NULL REFERENCES questions_etudiants_1(que_id) ON DELETE CASCADE,
        rep_code VARCHAR(20) NOT NULL,
        rep_titre VARCHAR(255) NOT NULL,
        rep_description TEXT,
        rep_pt_sci INTEGER DEFAULT 0,
        rep_pt_lit INTEGER DEFAULT 0,
        rep_categorie VARCHAR(50) NOT NULL,
        rep_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS caracteristiques_etudiants_2 (
        car_id SERIAL PRIMARY KEY,
        car_code VARCHAR(50) UNIQUE NOT NULL,
        car_nom VARCHAR(200) NOT NULL,
        car_short_nom VARCHAR(100) NOT NULL,
        car_secteurs TEXT,
        car_metiers TEXT,
        car_pts_sci_min INTEGER DEFAULT 0,
        car_pts_lit_min INTEGER DEFAULT 0,
        car_description TEXT,
        car_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS questions_etudiants_2 (
        que_id SERIAL PRIMARY KEY,
        que_texte TEXT NOT NULL,
        que_ordre INTEGER NOT NULL,
        que_pts_sci INTEGER DEFAULT 0,
        que_pts_lit INTEGER DEFAULT 0,
        que_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reponses_etudiants_2 (
        rep_id SERIAL PRIMARY KEY,
        rep_que_id INTEGER NOT NULL REFERENCES questions_etudiants_2(que_id) ON DELETE CASCADE,
        rep_code VARCHAR(50) NOT NULL,
        rep_titre VARCHAR(255) NOT NULL,
        rep_description TEXT,
        rep_pt_sci INTEGER DEFAULT 0,
        rep_pt_lit INTEGER DEFAULT 0,
        rep_pole VARCHAR(50) NOT NULL,
        rep_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ========================================================
    // 4. EMPLOI : TEST 1 & TEST 2
    // ========================================================
    console.log('4. Création des tables pour Emploi Tests 1 & 2...');
    await query(`
      CREATE TABLE IF NOT EXISTS caracteristiques_emploi_1 (
        car_id SERIAL PRIMARY KEY,
        car_code VARCHAR(50) UNIQUE NOT NULL,
        car_nom VARCHAR(200) NOT NULL,
        car_short_nom VARCHAR(100) NOT NULL,
        car_pts_sci_min INTEGER DEFAULT 0,
        car_pts_lit_min INTEGER DEFAULT 0,
        car_description TEXT,
        car_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS questions_emploi_1 (
        que_id SERIAL PRIMARY KEY,
        que_texte TEXT NOT NULL,
        que_ordre INTEGER NOT NULL,
        que_pts_sci INTEGER DEFAULT 0,
        que_pts_lit INTEGER DEFAULT 0,
        que_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reponses_emploi_1 (
        rep_id SERIAL PRIMARY KEY,
        rep_que_id INTEGER NOT NULL REFERENCES questions_emploi_1(que_id) ON DELETE CASCADE,
        rep_code VARCHAR(20) NOT NULL,
        rep_titre VARCHAR(255) NOT NULL,
        rep_description TEXT,
        rep_pt_sci INTEGER DEFAULT 0,
        rep_pt_lit INTEGER DEFAULT 0,
        rep_categorie VARCHAR(50) NOT NULL,
        rep_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS caracteristiques_emploi_2 (
        car_id SERIAL PRIMARY KEY,
        car_code VARCHAR(50) UNIQUE NOT NULL,
        car_nom VARCHAR(200) NOT NULL,
        car_short_nom VARCHAR(100) NOT NULL,
        car_secteurs TEXT,
        car_metiers TEXT,
        car_pts_sci_min INTEGER DEFAULT 0,
        car_pts_lit_min INTEGER DEFAULT 0,
        car_description TEXT,
        car_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS questions_emploi_2 (
        que_id SERIAL PRIMARY KEY,
        que_texte TEXT NOT NULL,
        que_ordre INTEGER NOT NULL,
        que_pts_sci INTEGER DEFAULT 0,
        que_pts_lit INTEGER DEFAULT 0,
        que_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reponses_emploi_2 (
        rep_id SERIAL PRIMARY KEY,
        rep_que_id INTEGER NOT NULL REFERENCES questions_emploi_2(que_id) ON DELETE CASCADE,
        rep_code VARCHAR(50) NOT NULL,
        rep_titre VARCHAR(255) NOT NULL,
        rep_description TEXT,
        rep_pt_sci INTEGER DEFAULT 0,
        rep_pt_lit INTEGER DEFAULT 0,
        rep_pole VARCHAR(50) NOT NULL,
        rep_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ========================================================
    // 5. AJOUT DES LIENS AVEC L'ID DE CARACTÉRISTIQUE SUR LES TESTS UTILISATEURS
    // ========================================================
    console.log('5. Liaison des tables de tests utilisateurs avec les tables de caractéristiques...');
    await query(`
      -- Élève Test 1
      ALTER TABLE tests_eleves_1 
        ADD COLUMN IF NOT EXISTS te1_car_id INTEGER REFERENCES caracteristiques_eleves_1(car_id),
        ADD COLUMN IF NOT EXISTS te1_pts_sci INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS te1_pts_lit INTEGER DEFAULT 0;

      -- Élève Test 2
      ALTER TABLE tests_eleves_2 
        ADD COLUMN IF NOT EXISTS te2_car_id INTEGER REFERENCES caracteristiques_eleves_2(car_id),
        ADD COLUMN IF NOT EXISTS te2_pts_sci INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS te2_pts_lit INTEGER DEFAULT 0;

      -- Étudiant Test 1
      ALTER TABLE tests_etudiants_1 
        ADD COLUMN IF NOT EXISTS tet1_car_id INTEGER REFERENCES caracteristiques_etudiants_1(car_id),
        ADD COLUMN IF NOT EXISTS tet1_pts_sci INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS tet1_pts_lit INTEGER DEFAULT 0;

      -- Étudiant Test 2
      ALTER TABLE tests_etudiants_2 
        ADD COLUMN IF NOT EXISTS tet2_car_id INTEGER REFERENCES caracteristiques_etudiants_2(car_id),
        ADD COLUMN IF NOT EXISTS tet2_pts_sci INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS tet2_pts_lit INTEGER DEFAULT 0;

      -- Emploi Test 1
      ALTER TABLE tests_emploi_1 
        ADD COLUMN IF NOT EXISTS tem1_car_id INTEGER REFERENCES caracteristiques_emploi_1(car_id),
        ADD COLUMN IF NOT EXISTS tem1_pts_sci INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS tem1_pts_lit INTEGER DEFAULT 0;

      -- Emploi Test 2
      ALTER TABLE tests_emploi_2 
        ADD COLUMN IF NOT EXISTS tem2_car_id INTEGER REFERENCES caracteristiques_emploi_2(car_id),
        ADD COLUMN IF NOT EXISTS tem2_pts_sci INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS tem2_pts_lit INTEGER DEFAULT 0;
    `);

    // ========================================================
    // 6. PEUPLEMENT DES CARACTÉRISTIQUES (SANS AUCUNE ICÔNE)
    // ========================================================
    console.log('6. Peuplement des caractéristiques dans les tables (strictement sans icônes)...');

    // 6.1 Caractéristiques Élève 1
    const carEleve1 = [
      {
        code: 'sciences_tech',
        nom: 'Caractère Réfléchi, Curieux & Méthodique',
        short_nom: 'Réfléchi & Méthodique',
        pts_sci_min: 8,
        pts_lit_min: 0,
        desc: 'Vous possédez une nature posée, calme et persévérante. Vous aimez comprendre en profondeur comment fonctionnent les choses, analyser les situations avec logique et aborder chaque problème avec rigueur et bon sens.',
        qualites: 'Raisonnement logique, Curiosité intellectuelle, Patience et persévérance, Sens de l\'analyse'
      },
      {
        code: 'lettres_comm',
        nom: 'Caractère Éloquent, Sensible & Humaniste',
        short_nom: 'Éloquent & Sensible',
        pts_sci_min: 0,
        pts_lit_min: 8,
        desc: 'Vous vous distinguez par votre sensibilité humaine, votre clarté d\'expression et votre goût pour l\'échange d\'idées. Vous aimez écouter, transmettre, dialoguer et défendre les valeurs de justice et de respect.',
        qualites: 'Aisance d\'expression, Sens de l\'écoute, Sensibilité humaine, Esprit critique et nuance'
      },
      {
        code: 'eco_gestion',
        nom: 'Caractère Entreprenant, Organisateur & Leader',
        short_nom: 'Entreprenant & Leader',
        pts_sci_min: 4,
        pts_lit_min: 4,
        desc: 'Vous êtes dynamique, proactif et naturellement tourné vers l\'action concrète. Vous aimez prendre des initiatives, rassembler les autres autour d\'un but commun, organiser et trouver des solutions pratiques.',
        qualites: 'Esprit d\'initiative, Capacité à fédérer, Sens de l\'organisation, Pragmatisme et réactivité'
      },
      {
        code: 'sante_social',
        nom: 'Caractère Bienveillant, Altruiste & Protecteur',
        short_nom: 'Bienveillant & Altruiste',
        pts_sci_min: 4,
        pts_lit_min: 4,
        desc: 'Votre plus belle qualité réside dans votre grand cœur, votre empathie naturelle et votre dévouement pour autrui. Vous êtes toujours à l\'écoute, attentif au bien-être de votre entourage et prêt à soutenir ceux qui en ont besoin.',
        qualites: 'Profonde empathie, Dévouement sincère, Douceur et patience, Générosité d\'esprit'
      },
      {
        code: 'arts_creation',
        nom: 'Caractère Créatif, Imaginatif & Expressif',
        short_nom: 'Créatif & Imaginatif',
        pts_sci_min: 0,
        pts_lit_min: 4,
        desc: 'Vous avez une imagination féconde, un regard personnel sur le monde et une véritable sensibilité esthétique. Vous aimez inventer, concevoir des choses originales et exprimer vos émotions par la créativité et les formes.',
        qualites: 'Imagination fertile, Sensibilité artistique, Originalité d\'esprit, Intuition et spontanéité'
      },
      {
        code: 'nature_agri',
        nom: 'Caractère Observateur, Proche de la Nature & Authentique',
        short_nom: 'Observateur & Naturel',
        pts_sci_min: 4,
        pts_lit_min: 0,
        desc: 'Vous êtes quelqu\'un de posé, franc et attentif à ce qui vous entoure. Vous avez un lien fort avec la nature et le vivant, une grande patience et un bon sens naturel qui vous permet de garder les pieds sur terre.',
        qualites: 'Sens de l\'observation, Calme et patience, Respect du vivant, Bon sens et authenticité'
      }
    ];

    for (const c of carEleve1) {
      await query(`
        INSERT INTO caracteristiques_eleves_1 (car_code, car_nom, car_short_nom, car_pts_sci_min, car_pts_lit_min, car_description, car_qualites)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (car_code) DO UPDATE SET
          car_nom = EXCLUDED.car_nom,
          car_short_nom = EXCLUDED.car_short_nom,
          car_pts_sci_min = EXCLUDED.car_pts_sci_min,
          car_pts_lit_min = EXCLUDED.car_pts_lit_min,
          car_description = EXCLUDED.car_description,
          car_qualites = EXCLUDED.car_qualites;
      `, [c.code, c.nom, c.short_nom, c.pts_sci_min, c.pts_lit_min, c.desc, c.qualites]);
    }

    // 6.2 Caractéristiques Élève 2 (Filières / Pôles de Bac)
    const carEleve2 = [
      {
        code: 'sciences_exactes',
        nom: 'Sciences Exactes, Mathématiques & Ingénierie',
        short_nom: 'Série Scientifique S (C)',
        pts_sci_min: 6,
        pts_lit_min: 0,
        recommandations: 'Série Scientifique S (spécialité C ou dominante Mathématiques / Physique)',
        debouches: 'Génie civil, Informatique & Algorithmique, Télécoms, Aéronautique, Statistiques, Énergies',
        desc: 'Vos facilités en Mathématiques et Physique-Chimie, alliées à votre rigueur de raisonnement, vous orientent naturellement vers les études scientifiques approfondies et les métiers d\'ingénieur.'
      },
      {
        code: 'sciences_vie_sante',
        nom: 'Sciences Biologiques, Santé & Médecine',
        short_nom: 'Série Scientifique S (D)',
        pts_sci_min: 4,
        pts_lit_min: 2,
        recommandations: 'Série Scientifique S (spécialité D - dominante SVT & Chimie)',
        debouches: 'Médecine générale & spécialisée, Pharmacie, Dentaire, Agronomie & Foresterie, Biologie',
        desc: 'Vos atouts en SVT et Sciences Physiques, enrichis par votre goût pour l\'observation expérimentale et le vivant, constituent d\'excellents repères pour les carrières médicales, biologiques ou vétérinaires.'
      },
      {
        code: 'lettres_langues',
        nom: 'Lettres, Langues & Sciences Humaines',
        short_nom: 'Série Littéraire L (A1/A2)',
        pts_sci_min: 0,
        pts_lit_min: 6,
        recommandations: 'Série Littéraire L (spécialité A1, A2 ou Langues Vivantes)',
        debouches: 'Droit, Magistrature, Diplomatie, Traduction, Enseignement, Journalisme',
        desc: 'Votre aisance dans les matières d\'expression (Français, Malagasy, Anglais, Philosophie) et vos qualités de réflexion constituent un tremplin privilégié pour briller dans le droit, la communication et les sciences humaines.'
      },
      {
        code: 'eco_societe',
        nom: 'Sciences Économiques, Sociales & Gestion',
        short_nom: 'Série Économique (OSE / B)',
        pts_sci_min: 2,
        pts_lit_min: 4,
        recommandations: 'Série Économique et Sociale (OSE / B)',
        debouches: 'Économie, Comptabilité & Finance, Gestion d\'entreprises, Marketing, Ressources Humaines',
        desc: 'Votre compréhension de l\'Histoire-Géo, des sciences économiques et des grands enjeux de société vous positionne idéalement pour les métiers de l\'économie, du management et de l\'administration.'
      },
      {
        code: 'technique_appliquee',
        nom: 'Sciences Appliquées, Informatique & Technologies',
        short_nom: 'Série Technique & Technologique',
        pts_sci_min: 4,
        pts_lit_min: 1,
        recommandations: 'Série Technique (Génie Civil, Électronique, Maintenance Informatique ou Filières Tertiaires)',
        debouches: 'Développement de logiciels, Maintenance systèmes & réseaux, Électromécanique, Travaux publics',
        desc: 'Votre esprit pratique et vos aptitudes techniques et informatiques sont des forces précieuses pour réussir dans les formations technologiques concrètes et innovantes.'
      }
    ];

    for (const c of carEleve2) {
      await query(`
        INSERT INTO caracteristiques_eleves_2 (car_code, car_nom, car_short_nom, car_recommandations, car_debouches, car_pts_sci_min, car_pts_lit_min, car_description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (car_code) DO UPDATE SET
          car_nom = EXCLUDED.car_nom,
          car_short_nom = EXCLUDED.car_short_nom,
          car_recommandations = EXCLUDED.car_recommandations,
          car_debouches = EXCLUDED.car_debouches,
          car_pts_sci_min = EXCLUDED.car_pts_sci_min,
          car_pts_lit_min = EXCLUDED.car_pts_lit_min,
          car_description = EXCLUDED.car_description;
      `, [c.code, c.nom, c.short_nom, c.recommandations, c.debouches, c.pts_sci_min, c.pts_lit_min, c.desc]);
    }

    // 6.3 Caractéristiques Étudiant 1
    const carEtudiant1 = [
      { code: 'tech_digital', nom: 'Profil Technologique & Digital', short_nom: 'Tech & Digital', sci: 6, lit: 1, desc: 'Esprit orienté ingénierie, programmation logicielle et logique informatique.' },
      { code: 'finance_gestion', nom: 'Profil Analyse Financière, Audit & Stratégie', short_nom: 'Finance & Stratégie', sci: 4, lit: 3, desc: 'Aptitudes mathématiques, comptables, organisationnelles et rigueur d\'analyse.' },
      { code: 'communication_marketing', nom: 'Profil Communication, Médias & Marketing Digital', short_nom: 'Com & Marketing', sci: 1, lit: 6, desc: 'Sens de la persuasion, créativité narrative, relationnel et langues.' },
      { code: 'social_sante', nom: 'Profil Sciences Humaines, Santé & Développement Social', short_nom: 'Social & Santé', sci: 3, lit: 4, desc: 'Dévouement au service des populations, écoute active et accompagnement.' },
      { code: 'ingenierie_projets', nom: 'Profil Ingénierie, Systèmes & Projets Techniques', short_nom: 'Ingénierie & Projets', sci: 5, lit: 2, desc: 'Conception de solutions matérielles, supervision d\'infrastructures et gestion technique.' },
      { code: 'agri_environnement', nom: 'Profil Sciences Agronomiques, Environnement & Développement Durable', short_nom: 'Agri & Environnement', sci: 4, lit: 2, desc: 'Valorisation des ressources naturelles et pratiques écologiques durables.' }
    ];

    for (const c of carEtudiant1) {
      await query(`
        INSERT INTO caracteristiques_etudiants_1 (car_code, car_nom, car_short_nom, car_pts_sci_min, car_pts_lit_min, car_description)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (car_code) DO UPDATE SET
          car_nom = EXCLUDED.car_nom,
          car_short_nom = EXCLUDED.car_short_nom,
          car_pts_sci_min = EXCLUDED.car_pts_sci_min,
          car_pts_lit_min = EXCLUDED.car_pts_lit_min,
          car_description = EXCLUDED.car_description;
      `, [c.code, c.nom, c.short_nom, c.sci, c.lit, c.desc]);
    }

    // 6.4 Caractéristiques Étudiant 2
    const carEtudiant2 = [
      { code: 'pole_tech_numerique', nom: 'Pôle Technologies Numériques, Web & Data', short_nom: 'Numérique & Data', secteurs: 'ESN, Start-ups, E-commerce, Télécoms', metiers: 'Développeur Web, Data Analyst, Administrateur Systèmes', sci: 5, lit: 1, desc: 'Débouchés à fort recrutement dans le secteur technologique à Madagascar.' },
      { code: 'pole_finance_banque', nom: 'Pôle Banque, Finance, Audit & Assurance', short_nom: 'Banque & Finance', secteurs: 'Institutions financières, Banques, Cabinets d\'audit', metiers: 'Analyste financier, Auditeur junior, Gestionnaire de portefeuille', sci: 4, lit: 3, desc: 'Gestion financière, conformité bancaire et investissement stratégique.' },
      { code: 'pole_commerce_marketing', nom: 'Pôle Marketing, Vente & Relations Entreprises', short_nom: 'Commerce & Vente', secteurs: 'Grande distribution, B2B, Import-Export', metiers: 'Chef de produit, Responsable commercial, Chargé de partenariats', sci: 2, lit: 4, desc: 'Développement commercial, négociation et fidélisation de clientèle.' },
      { code: 'pole_agronomie_agroalimentaire', nom: 'Pôle Agronomie, Élevage & Filières Vertes', short_nom: 'Agronomie & Vert', secteurs: 'Industrie agroalimentaire, Exploitations, ONG', metiers: 'Ingénieur agronome, Responsable filière, Consultant environnement', sci: 4, lit: 2, desc: 'Valorisation du potentiel agricole et transformation locale.' }
    ];

    for (const c of carEtudiant2) {
      await query(`
        INSERT INTO caracteristiques_etudiants_2 (car_code, car_nom, car_short_nom, car_secteurs, car_metiers, car_pts_sci_min, car_pts_lit_min, car_description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (car_code) DO UPDATE SET
          car_nom = EXCLUDED.car_nom,
          car_short_nom = EXCLUDED.car_short_nom,
          car_secteurs = EXCLUDED.car_secteurs,
          car_metiers = EXCLUDED.car_metiers,
          car_pts_sci_min = EXCLUDED.car_pts_sci_min,
          car_pts_lit_min = EXCLUDED.car_pts_lit_min,
          car_description = EXCLUDED.car_description;
      `, [c.code, c.nom, c.short_nom, c.secteurs, c.metiers, c.sci, c.lit, c.desc]);
    }

    // 6.5 Caractéristiques Emploi 1
    const carEmploi1 = [
      { code: 'tech_numerique', nom: 'Profil Métiers du Numérique, Web & Data', short_nom: 'Numérique & Web', sci: 5, lit: 2, desc: 'Recherche de reconversion ou d\'emploi dans les technologies numériques et services BPO.' },
      { code: 'entrepreneuriat_agri', nom: 'Profil Créateur d\'Activité, Commerce & Métiers de Terrain', short_nom: 'Entrepreneuriat', sci: 3, lit: 3, desc: 'Lancement d\'activités autonomes, commerce de détail et projets entrepreneuriaux.' },
      { code: 'management_conseil', nom: 'Profil Gestion, Conseil & Coordination Opérationnelle', short_nom: 'Gestion & Conseil', sci: 3, lit: 4, desc: 'Coordination d\'équipes, gestion de projets et appui stratégique aux organisations.' },
      { code: 'formation_rh_humain', nom: 'Profil Formation, Développement Humain & Relations Client', short_nom: 'RH & Formation', sci: 1, lit: 5, desc: 'Encadrement, transmission de compétences et relations humaines en entreprise.' }
    ];

    for (const c of carEmploi1) {
      await query(`
        INSERT INTO caracteristiques_emploi_1 (car_code, car_nom, car_short_nom, car_pts_sci_min, car_pts_lit_min, car_description)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (car_code) DO UPDATE SET
          car_nom = EXCLUDED.car_nom,
          car_short_nom = EXCLUDED.car_short_nom,
          car_pts_sci_min = EXCLUDED.car_pts_sci_min,
          car_pts_lit_min = EXCLUDED.car_pts_lit_min,
          car_description = EXCLUDED.car_description;
      `, [c.code, c.nom, c.short_nom, c.sci, c.lit, c.desc]);
    }

    // 6.6 Caractéristiques Emploi 2
    const carEmploi2 = [
      { code: 'pole_tech_digital', nom: 'Pôle Technologies Numériques, Web & Data', short_nom: 'Tech & Digital', secteurs: 'Centres BPO, Agences Web, ESN', metiers: 'Opérateur Data, Développeur Junior, Support Client', sci: 5, lit: 2, desc: 'Pôle à fort potentiel d\'embauche directe à Madagascar.' },
      { code: 'pole_entrepreneuriat', nom: 'Pôle Commerce, Entrepreneuriat & Métiers Indépendants', short_nom: 'Commerce & Indépendant', secteurs: 'Distribution, Micro-finance, Commerce local', metiers: 'Responsable point de vente, Micro-entrepreneur, Agent commercial', sci: 2, lit: 4, desc: 'Développement d\'activités indépendantes rentables et durables.' },
      { code: 'pole_rh_formation', nom: 'Pôle Ressources Humaines, Formation & Services Client', short_nom: 'RH & Relation Client', secteurs: 'Call centers, Entreprises de services, Cabinets RH', metiers: 'Chargé de recrutement, Téléconseiller, Formateur interne', sci: 1, lit: 5, desc: 'Postes centrés sur la communication interpersonnelle et l\'accompagnement.' }
    ];

    for (const c of carEmploi2) {
      await query(`
        INSERT INTO caracteristiques_emploi_2 (car_code, car_nom, car_short_nom, car_secteurs, car_metiers, car_pts_sci_min, car_pts_lit_min, car_description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (car_code) DO UPDATE SET
          car_nom = EXCLUDED.car_nom,
          car_short_nom = EXCLUDED.car_short_nom,
          car_secteurs = EXCLUDED.car_secteurs,
          car_metiers = EXCLUDED.car_metiers,
          car_pts_sci_min = EXCLUDED.car_pts_sci_min,
          car_pts_lit_min = EXCLUDED.car_pts_lit_min,
          car_description = EXCLUDED.car_description;
      `, [c.code, c.nom, c.short_nom, c.secteurs, c.metiers, c.sci, c.lit, c.desc]);
    }

    // ========================================================
    // 7. PEUPLEMENT DES QUESTIONS ET RÉPONSES POSSIBLES TEST 1 ÉLÈVE (SANS AUCUNE ICÔNE)
    // ========================================================
    console.log('7. Peuplement des questions et réponses possibles Test 1 Élève...');

    const questionsEleve1 = [
      {
        ordre: 1,
        texte: 'Pendant votre temps libre ou vos week-ends, quelle activité vous passionne le plus ?',
        pts_sci: 2,
        pts_lit: 2,
        reponses: [
          { code: '1a', titre: 'Explorer la technologie ou la logique', desc: 'Programmer, bricoler des circuits, comprendre le fonctionnement des appareils ou résoudre des énigmes mathématiques.', pts_sci: 2, pts_lit: 0, cat: 'sciences_tech' },
          { code: '1b', titre: 'Lire, écrire et s\'exprimer', desc: 'Dévorer des livres, rédiger des récits, apprendre des langues étrangères ou débattre sur des idées d\'actualité.', pts_sci: 0, pts_lit: 2, cat: 'lettres_comm' },
          { code: '1c', titre: 'Entreprendre et organiser', desc: 'Imaginer un petit projet commercial, gérer l\'argent, planifier des événements et motiver des camarades.', pts_sci: 1, pts_lit: 1, cat: 'eco_gestion' },
          { code: '1d', titre: 'Prendre soin et aider les autres', desc: 'Aider un ami en difficulté, faire du bénévolat, expliquer des cours aux plus jeunes ou soigner des proches.', pts_sci: 1, pts_lit: 1, cat: 'sante_social' },
          { code: '1e', titre: 'Créer, dessiner ou composer', desc: 'Dessiner, faire de la musique, concevoir des visuels graphiques, filmer ou imaginer des œuvres artistiques.', pts_sci: 0, pts_lit: 1, cat: 'arts_creation' },
          { code: '1f', titre: 'Être au contact de la nature', desc: 'Observer les plantes et animaux, jardiner, randonner et s\'intéresser à la protection de l\'environnement malgache.', pts_sci: 1, pts_lit: 0, cat: 'nature_agri' }
        ]
      },
      {
        ordre: 2,
        texte: 'Quelle cause humaine ou collective résonne le plus avec vos valeurs profondes ?',
        pts_sci: 2,
        pts_lit: 2,
        reponses: [
          { code: '2a', titre: 'Le progrès scientifique et la compréhension du monde', desc: 'Comprendre les mystères de l\'univers, la logique des sciences et trouver des solutions ingénieuses.', pts_sci: 2, pts_lit: 0, cat: 'sciences_tech' },
          { code: '2b', titre: 'La justice, les droits humains et la culture', desc: 'Défendre l\'équité, faire entendre la voix de chacun et transmettre la richesse de nos langues et traditions.', pts_sci: 0, pts_lit: 2, cat: 'lettres_comm' },
          { code: '2c', titre: 'L\'esprit d\'initiative et l\'autonomie', desc: 'Encourager chacun à entreprendre, mener des projets collectifs concrets et dynamiser notre entourage.', pts_sci: 1, pts_lit: 1, cat: 'eco_gestion' },
          { code: '2d', titre: 'La solidarité, le soin et la bienveillance', desc: 'Venir en aide à ceux qui traversent des épreuves, préserver la santé et apporter une écoute sincère.', pts_sci: 1, pts_lit: 1, cat: 'sante_social' },
          { code: '2e', titre: 'L\'art, l\'imaginaire et la liberté d\'expression', desc: 'Émouvoir par la musique, l\'image et les mots, et faire rayonner les talents et la créativité.', pts_sci: 0, pts_lit: 1, cat: 'arts_creation' },
          { code: '2f', titre: 'La protection de la nature et le respect du vivant', desc: 'Préserver l\'équilibre de la terre, des forêts et des cours d\'eau, et vivre en harmonie avec le vivant.', pts_sci: 1, pts_lit: 0, cat: 'nature_agri' }
        ]
      },
      {
        ordre: 3,
        texte: 'Quel trait de votre personnalité vos amis et proches remarquent-ils le plus chez vous ?',
        pts_sci: 2,
        pts_lit: 2,
        reponses: [
          { code: '3a', titre: 'Rationnel, méthodique et persévérant', desc: 'Vous cherchez toujours la cause exacte des choses avec logique et rigueur intellectuelle.', pts_sci: 2, pts_lit: 0, cat: 'sciences_tech' },
          { code: '3b', titre: 'Éloquent, sensible et à l\'aise avec les mots', desc: 'Vous trouvez les mots justes, vous aimez argumenter et vous appréciez les belles formulations.', pts_sci: 0, pts_lit: 2, cat: 'lettres_comm' },
          { code: '3c', titre: 'Leader, négociateur et orienté résultats', desc: 'Vous aimez prendre des initiatives, rassembler les gens autour d\'un but et trouver des solutions pratiques.', pts_sci: 1, pts_lit: 1, cat: 'eco_gestion' },
          { code: '3d', titre: 'Empathique, généreux et à l\'écoute', desc: 'Vous ressentez les émotions des autres et vous êtes toujours prêt à soutenir et réconforter.', pts_sci: 1, pts_lit: 1, cat: 'sante_social' },
          { code: '3e', titre: 'Imaginatif, original et sensible à la beauté', desc: 'Vous voyez le monde sous un angle différent et vous avez toujours mille idées créatives.', pts_sci: 0, pts_lit: 1, cat: 'arts_creation' },
          { code: '3f', titre: 'Pragmatique, attentif au vivant et patient', desc: 'Vous avez le sens de l\'observation concrète, vous aimez le travail de terrain et le respect de la vie.', pts_sci: 1, pts_lit: 0, cat: 'nature_agri' }
        ]
      },
      {
        ordre: 4,
        texte: 'Lors d\'un moment en groupe ou d\'un projet commun, quelle est votre posture naturelle ?',
        pts_sci: 2,
        pts_lit: 2,
        reponses: [
          { code: '4a', titre: 'L\'esprit posé et méthodique', desc: 'Observer calmement, vérifier les détails avec logique et structurer les étapes avec clarté.', pts_sci: 2, pts_lit: 0, cat: 'sciences_tech' },
          { code: '4b', titre: 'Le porte-parole à l\'écoute', desc: 'Faciliter le dialogue, exprimer les idées avec nuance et veiller à une communication fluide.', pts_sci: 0, pts_lit: 2, cat: 'lettres_comm' },
          { code: '4c', titre: 'Le moteur du groupe', desc: 'Encourager tout le monde, proposer des actions concrètes et maintenir l\'élan collectif.', pts_sci: 1, pts_lit: 1, cat: 'eco_gestion' },
          { code: '4d', titre: 'Le soutien attentionné', desc: 'Veiller à ce que chacun se sente respecté, encouragé et écouté dans une ambiance sereine.', pts_sci: 1, pts_lit: 1, cat: 'sante_social' },
          { code: '4e', titre: 'L\'esprit créatif et original', desc: 'Apporter un regard neuf, imaginer des pistes inattendues et soigner la beauté d\'ensemble.', pts_sci: 0, pts_lit: 1, cat: 'arts_creation' },
          { code: '4f', titre: 'Le réaliste de bon sens', desc: 'Garder les pieds sur terre, privilégier les solutions simples et observer avec patience.', pts_sci: 1, pts_lit: 0, cat: 'nature_agri' }
        ]
      },
      {
        ordre: 5,
        texte: 'Quel sujet de documentaire ou d\'article capte immédiatement toute votre attention ?',
        pts_sci: 2,
        pts_lit: 2,
        reponses: [
          { code: '5a', titre: 'Les mystères de l\'univers et l\'intelligence artificielle', desc: 'Les robots du futur, les trous noirs, la physique quantique et les algorithmes informatiques.', pts_sci: 2, pts_lit: 0, cat: 'sciences_tech' },
          { code: '5b', titre: 'Les grands récits de l\'histoire et les chefs-d\'œuvre littéraires', desc: 'Les discours historiques célèbres, les secrets des langues et les grandes révolutions humaines.', pts_sci: 0, pts_lit: 2, cat: 'lettres_comm' },
          { code: '5c', titre: 'La trajectoire des personnes audacieuses et entreprenantes', desc: 'Comment naît une grande idée, comment se nouent les coopérations et se bâtissent les réussites.', pts_sci: 1, pts_lit: 1, cat: 'eco_gestion' },
          { code: '5d', titre: 'Les actes de courage et le dévouement pour autrui', desc: 'Les missions humanitaires, les découvertes médicales qui sauvent des vies et l\'entraide humaine.', pts_sci: 1, pts_lit: 1, cat: 'sante_social' },
          { code: '5e', titre: 'Les coulisses d\'un atelier de création ou de spectacle', desc: 'La confection d\'un film, la composition d\'une œuvre musicale ou la création architecturale.', pts_sci: 0, pts_lit: 1, cat: 'arts_creation' },
          { code: '5f', titre: 'La vie sauvage fascinante et la force de la nature', desc: 'Les espèces endémiques de Madagascar, les forêts primaires et la beauté des cycles naturels.', pts_sci: 1, pts_lit: 0, cat: 'nature_agri' }
        ]
      },
      {
        ordre: 6,
        texte: 'Dans quel cadre ou atmosphère vous sentez-vous le plus épanoui(e) au quotidien ?',
        pts_sci: 2,
        pts_lit: 2,
        reponses: [
          { code: '6a', titre: 'Un espace calme et studieux', desc: 'Où vous pouvez vous concentrer en paix, approfondir un sujet et résoudre des énigmes logiques.', pts_sci: 2, pts_lit: 0, cat: 'sciences_tech' },
          { code: '6b', titre: 'Un cadre d\'échange et d\'ouverture', desc: 'Où la parole est libre, où l\'on apprend des autres et où l\'on partage des réflexions stimulantes.', pts_sci: 0, pts_lit: 2, cat: 'lettres_comm' },
          { code: '6c', titre: 'Un environnement actif et motivant', desc: 'Où les initiatives sont encouragées, où l\'on relève des challenges et où les projets prennent vie.', pts_sci: 1, pts_lit: 1, cat: 'eco_gestion' },
          { code: '6d', titre: 'Une ambiance chaleureuse et solidaire', desc: 'Où la bienveillance et le respect mutuel sont prioritaires, et où l\'on veille les uns sur les autres.', pts_sci: 1, pts_lit: 1, cat: 'sante_social' },
          { code: '6e', titre: 'Un lieu d\'inspiration et de liberté', desc: 'Un espace stimulant où l\'imagination s\'exprime librement à travers les sons, les mots et les images.', pts_sci: 0, pts_lit: 1, cat: 'arts_creation' },
          { code: '6f', titre: 'Le grand air et le contact avec la nature', desc: 'Un cadre vivant, paisible et enraciné, au contact de la terre, des plantes et des éléments vivants.', pts_sci: 1, pts_lit: 0, cat: 'nature_agri' }
        ]
      },
      {
        ordre: 7,
        texte: 'Face à une situation imprévue et complexe, quelle est votre première réaction ?',
        pts_sci: 2,
        pts_lit: 2,
        reponses: [
          { code: '7a', titre: 'Décortiquer méthodiquement le problème', desc: 'Analyser les faits étape par étape pour identifier l\'origine logique de la panne ou du blocage.', pts_sci: 2, pts_lit: 0, cat: 'sciences_tech' },
          { code: '7b', titre: 'Dialoguer et rechercher des arguments solides', desc: 'Poser les bonnes questions, consulter des textes fiables et convaincre par la parole.', pts_sci: 0, pts_lit: 2, cat: 'lettres_comm' },
          { code: '7c', titre: 'Agir avec efficacité et pragmatisme', desc: 'Calculer le meilleur rapport bénéfice/risque et prendre une décision rapide sans hésiter.', pts_sci: 1, pts_lit: 1, cat: 'eco_gestion' },
          { code: '7d', titre: 'Rassurer les personnes touchées', desc: 'Veiller avant tout à la sécurité et au moral de son entourage avant de chercher la solution.', pts_sci: 1, pts_lit: 1, cat: 'sante_social' },
          { code: '7e', titre: 'Trouver une issue créative et originale', desc: 'Penser en dehors du cadre pour imaginer une solution inédite que personne n\'avait envisagée.', pts_sci: 0, pts_lit: 1, cat: 'arts_creation' },
          { code: '7f', titre: 'Observer avec patience et bon sens', desc: 'Prendre le recul nécessaire, observer l\'évolution naturelle des choses et agir avec pragmatisme.', pts_sci: 1, pts_lit: 0, cat: 'nature_agri' }
        ]
      }
    ];

    for (const q of questionsEleve1) {
      let qRow = await query('SELECT que_id FROM questions_eleves_1 WHERE que_ordre = $1', [q.ordre]);
      let queId;
      if (qRow.rows.length === 0) {
        const ins = await query(`
          INSERT INTO questions_eleves_1 (que_texte, que_ordre, que_pts_sci, que_pts_lit)
          VALUES ($1, $2, $3, $4)
          RETURNING que_id;
        `, [q.texte, q.ordre, q.pts_sci, q.pts_lit]);
        queId = ins.rows[0].que_id;
      } else {
        queId = qRow.rows[0].que_id;
        await query(`
          UPDATE questions_eleves_1 
          SET que_texte = $1, que_pts_sci = $2, que_pts_lit = $3
          WHERE que_id = $4;
        `, [q.texte, q.pts_sci, q.pts_lit, queId]);
      }

      for (const rep of q.reponses) {
        await query(`
          INSERT INTO reponses_eleves_1 (rep_que_id, rep_code, rep_titre, rep_description, rep_pt_sci, rep_pt_lit, rep_categorie)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (rep_id) DO NOTHING;
        `, [queId, rep.code, rep.titre, rep.desc, rep.pts_sci, rep.pts_lit, rep.cat]);
      }
    }

    // ========================================================
    // 8. PEUPLEMENT DES QUESTIONS ET RÉPONSES POSSIBLES TEST 2 ÉLÈVE (SANS AUCUNE ICÔNE)
    // ========================================================
    console.log('8. Peuplement des questions et réponses possibles Test 2 Élève...');

    const matieresReponses = [
      { code: 'maths', titre: 'Mathématiques', desc: 'Calcul différentiel, probabilités, algèbre et géométrie dans l\'espace.', pts_sci: 3, pts_lit: 0, pole: 'sciences_exactes' },
      { code: 'physique', titre: 'Physique - Chimie', desc: 'Mécanique, électricité, réactions chimiques et optique.', pts_sci: 3, pts_lit: 0, pole: 'sciences_exactes' },
      { code: 'svt', titre: 'Sciences de la Vie et de la Terre (SVT)', desc: 'Génétique, biologie humaine, géologie et écosystèmes.', pts_sci: 2, pts_lit: 0, pole: 'sciences_vie_sante' },
      { code: 'francais', titre: 'Français & Littérature', desc: 'Analyse littéraire, dissertation, expression écrite et synthèse.', pts_sci: 0, pts_lit: 3, pole: 'lettres_langues' },
      { code: 'malagasy', titre: 'Malagasy (Teny sy Fomba)', desc: 'Grammaire malgache, contes traditionnels, kabary et poésie.', pts_sci: 0, pts_lit: 3, pole: 'lettres_langues' },
      { code: 'anglais', titre: 'Anglais (English)', desc: 'Compréhension orale, expression internationale et vocabulaire.', pts_sci: 0, pts_lit: 2, pole: 'lettres_langues' },
      { code: 'histoire_geo', titre: 'Histoire - Géographie', desc: 'Histoire de Madagascar et du monde, cartes et géopolitique.', pts_sci: 0, pts_lit: 2, pole: 'eco_societe' },
      { code: 'ses', titre: 'Sciences Économiques & Sociales (SES)', desc: 'Mécanismes de marché, budget, monnaie et faits de société.', pts_sci: 1, pts_lit: 2, pole: 'eco_societe' },
      { code: 'informatique', titre: 'Informatique & Technologie', desc: 'Algorithmique, logique de programmation et outils numériques.', pts_sci: 3, pts_lit: 0, pole: 'technique_appliquee' },
      { code: 'philo', titre: 'Philosophie & Pensée Critique', desc: 'Réflexion morale, éthique, logique conceptuelle et dissertations.', pts_sci: 0, pts_lit: 3, pole: 'lettres_langues' }
    ];

    let qMat = await query('SELECT que_id FROM questions_eleves_2 WHERE que_ordre = 1');
    let qMatId;
    if (qMat.rows.length === 0) {
      const ins = await query(`
        INSERT INTO questions_eleves_2 (que_texte, que_ordre, que_pts_sci, que_pts_lit)
        VALUES ($1, $2, $3, $4) RETURNING que_id;
      `, ['Sélectionnez les matières scolaires dans lesquelles vous vous sentez le plus à l\'aise et motivé(e) :', 1, 3, 3]);
      qMatId = ins.rows[0].que_id;
    } else {
      qMatId = qMat.rows[0].que_id;
    }

    for (const m of matieresReponses) {
      const exist = await query('SELECT rep_id FROM reponses_eleves_2 WHERE rep_que_id = $1 AND rep_code = $2', [qMatId, m.code]);
      if (exist.rows.length === 0) {
        await query(`
          INSERT INTO reponses_eleves_2 (rep_que_id, rep_code, rep_titre, rep_description, rep_pt_sci, rep_pt_lit, rep_pole)
          VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [qMatId, m.code, m.titre, m.desc, m.pts_sci, m.pts_lit, m.pole]);
      }
    }

    const aptitudesReponses = [
      { code: 'apt_calcul', titre: 'Calcul mental, algèbre et rigueur chiffrée', desc: 'Facilité à résoudre des équations, mémoriser des formules et raisonner abstraitement.', pts_sci: 3, pts_lit: 0, pole: 'sciences_exactes' },
      { code: 'apt_redaction', titre: 'Rédaction écrite, orthographe et clarté d\'idées', desc: 'Aisance pour rédiger des dissertations, exprimer vos pensées avec précision et vocabulaire riche.', pts_sci: 0, pts_lit: 3, pole: 'lettres_langues' },
      { code: 'apt_oral', titre: 'Prise de parole en public et argumentation', desc: 'Facilité à débattre, défendre un point de vue et captiver un auditoire à l\'oral.', pts_sci: 0, pts_lit: 2, pole: 'lettres_langues' },
      { code: 'apt_observation', titre: 'Démarche expérimentale et observation du vivant', desc: 'Curiosité pour les mécanismes biologiques, la nature vivante et l\'expérimentation scientifique.', pts_sci: 2, pts_lit: 0, pole: 'sciences_vie_sante' },
      { code: 'apt_analyse_societe', titre: 'Compréhension du monde, de l\'histoire et de la société', desc: 'Intérêt pour l\'actualité, l\'évolution historique, la géopolitique et l\'économie.', pts_sci: 1, pts_lit: 2, pole: 'eco_societe' },
      { code: 'apt_technique', titre: 'Pratique manuelle, sens technique et logique informatique', desc: 'Sens pratique pour le montage, le bricolage, la conception technique et le code informatique.', pts_sci: 3, pts_lit: 0, pole: 'technique_appliquee' }
    ];

    let qApt = await query('SELECT que_id FROM questions_eleves_2 WHERE que_ordre = 2');
    let qAptId;
    if (qApt.rows.length === 0) {
      const ins = await query(`
        INSERT INTO questions_eleves_2 (que_texte, que_ordre, que_pts_sci, que_pts_lit)
        VALUES ($1, $2, $3, $4) RETURNING que_id;
      `, ['Sélectionnez vos aptitudes dominantes et styles d\'apprentissage :', 2, 3, 3]);
      qAptId = ins.rows[0].que_id;
    } else {
      qAptId = qApt.rows[0].que_id;
    }

    for (const a of aptitudesReponses) {
      const exist = await query('SELECT rep_id FROM reponses_eleves_2 WHERE rep_que_id = $1 AND rep_code = $2', [qAptId, a.code]);
      if (exist.rows.length === 0) {
        await query(`
          INSERT INTO reponses_eleves_2 (rep_que_id, rep_code, rep_titre, rep_description, rep_pt_sci, rep_pt_lit, rep_pole)
          VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [qAptId, a.code, a.titre, a.desc, a.pts_sci, a.pts_lit, a.pole]);
      }
    }

    // ========================================================
    // 9. RELIER LES ENREGISTREMENTS EXISTANTS AUX IDs DE CARACTÉRISTIQUES
    // ========================================================
    console.log('9. Mise à jour des identifiants de caractéristiques pour les tests existants...');

    // Lier tests_eleves_1
    await query(`
      UPDATE tests_eleves_1 t
      SET te1_car_id = c.car_id
      FROM caracteristiques_eleves_1 c
      WHERE t.te1_ori_pro_1 ILIKE ('%' || c.car_short_nom || '%')
         OR t.te1_ori_pro_1 ILIKE ('%' || c.car_nom || '%')
         OR t.te1_cen_int ILIKE ('%' || c.car_code || '%');
    `);

    // Lier tests_eleves_2
    await query(`
      UPDATE tests_eleves_2 t
      SET te2_car_id = c.car_id
      FROM caracteristiques_eleves_2 c
      WHERE t.te2_ori_pro_2 ILIKE ('%' || c.car_short_nom || '%')
         OR t.te2_ori_pro_2 ILIKE ('%' || c.car_nom || '%')
         OR t.te2_mat_pre ILIKE ('%' || c.car_code || '%');
    `);

    // Lier tests_etudiants_1
    await query(`
      UPDATE tests_etudiants_1 t
      SET tet1_car_id = c.car_id
      FROM caracteristiques_etudiants_1 c
      WHERE t.tet1_ori_pro_1 ILIKE ('%' || c.car_short_nom || '%')
         OR t.tet1_ori_pro_1 ILIKE ('%' || c.car_nom || '%');
    `);

    // Lier tests_etudiants_2
    await query(`
      UPDATE tests_etudiants_2 t
      SET tet2_car_id = c.car_id
      FROM caracteristiques_etudiants_2 c
      WHERE t.tet2_ori_pro_2 ILIKE ('%' || c.car_short_nom || '%')
         OR t.tet2_ori_pro_2 ILIKE ('%' || c.car_nom || '%');
    `);

    // Lier tests_emploi_1
    await query(`
      UPDATE tests_emploi_1 t
      SET tem1_car_id = c.car_id
      FROM caracteristiques_emploi_1 c
      WHERE t.tem1_ori_pro_1 ILIKE ('%' || c.car_short_nom || '%')
         OR t.tem1_ori_pro_1 ILIKE ('%' || c.car_nom || '%');
    `);

    // Lier tests_emploi_2
    await query(`
      UPDATE tests_emploi_2 t
      SET tem2_car_id = c.car_id
      FROM caracteristiques_emploi_2 c
      WHERE t.tem2_ori_pro_2 ILIKE ('%' || c.car_short_nom || '%')
         OR t.tem2_ori_pro_2 ILIKE ('%' || c.car_nom || '%');
    `);

    // ========================================================
    // 10. METTRE À JOUR LES VUES DE COMPATIBILITÉ AVEC LES NOUVEAUX CHAMPS
    // ========================================================
    console.log('10. Mise à jour des vues unifiées de tests...');
    await query(`
      DROP VIEW IF EXISTS tests_reconversion CASCADE;
      DROP VIEW IF EXISTS tests_eleves CASCADE;
      DROP VIEW IF EXISTS tests_etudiants CASCADE;
      DROP VIEW IF EXISTS tests_emploi CASCADE;

      CREATE OR REPLACE VIEW tests_eleves AS
      SELECT 
        COALESCE(t1.te1_id, t2.te2_id) AS tel_id,
        COALESCE(t1.te1_uti_id, t2.te2_uti_id) AS tel_uti_id,
        t1.te1_car_id AS tel_car_id_1,
        t2.te2_car_id AS tel_car_id_2,
        t1.te1_pts_sci AS tel_pts_sci,
        t1.te1_pts_lit AS tel_pts_lit,
        t1.te1_det_int AS tel_det_int,
        t2.te2_det_mat AS tel_det_mat,
        t1.te1_cen_int AS tel_cen_int,
        t2.te2_mat_pre AS tel_mat_pre,
        t1.te1_ori_pro_1 AS tel_ori_pro_1,
        t2.te2_ori_pro_2 AS tel_ori_pro_2,
        t1.te1_fb_ana AS tel_fb_ana,
        CASE 
          WHEN t2.te2_ori_pro_2 IS NOT NULL OR t2.te2_car_id IS NOT NULL THEN 3 
          WHEN t1.te1_ori_pro_1 IS NOT NULL OR t1.te1_car_id IS NOT NULL THEN 2 
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
        t1.tet1_car_id AS tet_car_id_1,
        t2.tet2_car_id AS tet_car_id_2,
        t1.tet1_pts_sci AS tet_pts_sci,
        t1.tet1_pts_lit AS tet_pts_lit,
        t1.tet1_det_int AS tet_det_int,
        t2.tet2_det_com AS tet_det_com,
        t1.tet1_ori_pro_1 AS tet_ori_pro_1,
        t2.tet2_ori_pro_2 AS tet_ori_pro_2,
        CASE 
          WHEN t2.tet2_ori_pro_2 IS NOT NULL OR t2.tet2_car_id IS NOT NULL THEN 3 
          WHEN t1.tet1_ori_pro_1 IS NOT NULL OR t1.tet1_car_id IS NOT NULL THEN 2 
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
        t1.tem1_car_id AS tem_car_id_1,
        t2.tem2_car_id AS tem_car_id_2,
        t1.tem1_pts_sci AS tem_pts_sci,
        t1.tem1_pts_lit AS tem_pts_lit,
        t1.tem1_det_mot AS tem_det_mot,
        t2.tem2_det_tra AS tem_det_tra,
        t1.tem1_ori_pro_1 AS tem_ori_pro_1,
        t2.tem2_ori_pro_2 AS tem_ori_pro_2,
        CASE 
          WHEN t2.tem2_ori_pro_2 IS NOT NULL OR t2.tem2_car_id IS NOT NULL THEN 3 
          WHEN t1.tem1_ori_pro_1 IS NOT NULL OR t1.tem1_car_id IS NOT NULL THEN 2 
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
        tem_car_id_1 AS rec_car_id_1,
        tem_car_id_2 AS rec_car_id_2,
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

    console.log('✅ Migration des tables de questions, réponses et caractéristiques terminée avec SUCCÈS !');
  } catch (error) {
    console.error('❌ Erreur lors de la migration :', error);
    throw error;
  }
}

if (require.main === module) {
  migrate().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = migrate;

