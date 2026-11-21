const { query } = require('../config/db');

// Fonction pour nettoyer strictement toute icône ou émoji (0 icône en BDD)
function cleanString(str) {
  if (!str) return '';
  return str
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{200D}\u{FE0F}]/gu, '')
    .trim();
}

async function migrate() {
  console.log('🚀 Démarrage de la migration : Facultés, Entreprises et Métiers en tables dédiées...');
  try {
    // ========================================================
    // 1. CRÉATION DES 3 TABLES PRINCIPALES (SANS AUCUNE ICÔNE)
    // ========================================================
    console.log('1. Création des tables facultes, entreprises et metiers...');

    await query(`
      -- 1. Table des Facultés, Universités & Instituts d'Enseignement Supérieur
      CREATE TABLE IF NOT EXISTS faculte (
        fac_id SERIAL PRIMARY KEY,
        fac_code VARCHAR(50) UNIQUE NOT NULL,
        fac_nom VARCHAR(255) NOT NULL,
        fac_sigle VARCHAR(50),
        fac_type VARCHAR(50) DEFAULT 'Public',
        fac_ville VARCHAR(100) DEFAULT 'Antananarivo',
        fac_filiere TEXT,
        fac_description TEXT,
        fac_site_web VARCHAR(255),
        fac_pole VARCHAR(50) NOT NULL,
        fac_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- 2. Table des Entreprises qui recrutent à Madagascar
      CREATE TABLE IF NOT EXISTS entreprise (
        ent_id SERIAL PRIMARY KEY,
        ent_code VARCHAR(50) UNIQUE NOT NULL,
        ent_nom VARCHAR(255) NOT NULL,
        ent_secteur VARCHAR(150) NOT NULL,
        ent_secteur_detail TEXT,
        ent_ville VARCHAR(100) DEFAULT 'Antananarivo',
        ent_implantation TEXT,
        ent_description TEXT,
        ent_poste_recrute TEXT,
        ent_profil_recherche TEXT,
        ent_accessibilite TEXT,
        ent_email_contact VARCHAR(150),
        ent_site_web VARCHAR(255),
        ent_pole VARCHAR(50) NOT NULL,
        ent_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- 3. Table des Métiers / Sortes de travail & Débouchés à proposer
      CREATE TABLE IF NOT EXISTS metier (
        met_id SERIAL PRIMARY KEY,
        met_code VARCHAR(50) UNIQUE NOT NULL,
        met_nom VARCHAR(255) NOT NULL,
        met_secteur VARCHAR(150) NOT NULL,
        met_niveau_requis VARCHAR(100),
        met_salaire_indicatif VARCHAR(255),
        met_description TEXT,
        met_debouche TEXT,
        met_pole VARCHAR(50) NOT NULL,
        met_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ========================================================
    // 2. AJOUT DES CLÉS ÉTRANGÈRES D'ATTRIBUTION SUR LES TESTS
    // ========================================================
    console.log('2. Ajout des colonnes d\'attribution d\'ID sur les tables de tests...');

    await query(`
      -- Élève Test 1
      ALTER TABLE tests_eleves_1
        ADD COLUMN IF NOT EXISTS te1_fac_id INTEGER REFERENCES faculte(fac_id),
        ADD COLUMN IF NOT EXISTS te1_ent_id INTEGER REFERENCES entreprise(ent_id),
        ADD COLUMN IF NOT EXISTS te1_met_id INTEGER REFERENCES metier(met_id);

      -- Élève Test 2
      ALTER TABLE tests_eleves_2
        ADD COLUMN IF NOT EXISTS te2_fac_id INTEGER REFERENCES faculte(fac_id),
        ADD COLUMN IF NOT EXISTS te2_ent_id INTEGER REFERENCES entreprise(ent_id),
        ADD COLUMN IF NOT EXISTS te2_met_id INTEGER REFERENCES metier(met_id);

      -- Étudiant Test 1
      ALTER TABLE tests_etudiants_1
        ADD COLUMN IF NOT EXISTS tet1_fac_id INTEGER REFERENCES faculte(fac_id),
        ADD COLUMN IF NOT EXISTS tet1_ent_id INTEGER REFERENCES entreprise(ent_id),
        ADD COLUMN IF NOT EXISTS tet1_met_id INTEGER REFERENCES metier(met_id);

      -- Étudiant Test 2
      ALTER TABLE tests_etudiants_2
        ADD COLUMN IF NOT EXISTS tet2_fac_id INTEGER REFERENCES faculte(fac_id),
        ADD COLUMN IF NOT EXISTS tet2_ent_id INTEGER REFERENCES entreprise(ent_id),
        ADD COLUMN IF NOT EXISTS tet2_met_id INTEGER REFERENCES metier(met_id);

      -- Emploi Test 1
      ALTER TABLE tests_emploi_1
        ADD COLUMN IF NOT EXISTS tem1_fac_id INTEGER REFERENCES faculte(fac_id),
        ADD COLUMN IF NOT EXISTS tem1_ent_id INTEGER REFERENCES entreprise(ent_id),
        ADD COLUMN IF NOT EXISTS tem1_met_id INTEGER REFERENCES metier(met_id);

      -- Emploi Test 2
      ALTER TABLE tests_emploi_2
        ADD COLUMN IF NOT EXISTS tem2_fac_id INTEGER REFERENCES faculte(fac_id),
        ADD COLUMN IF NOT EXISTS tem2_ent_id INTEGER REFERENCES entreprise(ent_id),
        ADD COLUMN IF NOT EXISTS tem2_met_id INTEGER REFERENCES metier(met_id);
    `);

    // ========================================================
    // 3. TABLES DE JONCTION POUR ATTRIBUTIONS MULTIPLES PAR TEST
    // ========================================================
    console.log('3. Création des tables de liaison/attribution par test effectué...');

    await query(`
      -- Élève Test 1 attributions
      CREATE TABLE IF NOT EXISTS tests_eleves_1_facultes (
        te1_id INTEGER NOT NULL REFERENCES tests_eleves_1(te1_id) ON DELETE CASCADE,
        fac_id INTEGER NOT NULL REFERENCES faculte(fac_id) ON DELETE CASCADE,
        PRIMARY KEY (te1_id, fac_id)
      );
      CREATE TABLE IF NOT EXISTS tests_eleves_1_entreprises (
        te1_id INTEGER NOT NULL REFERENCES tests_eleves_1(te1_id) ON DELETE CASCADE,
        ent_id INTEGER NOT NULL REFERENCES entreprise(ent_id) ON DELETE CASCADE,
        PRIMARY KEY (te1_id, ent_id)
      );
      CREATE TABLE IF NOT EXISTS tests_eleves_1_metiers (
        te1_id INTEGER NOT NULL REFERENCES tests_eleves_1(te1_id) ON DELETE CASCADE,
        met_id INTEGER NOT NULL REFERENCES metier(met_id) ON DELETE CASCADE,
        PRIMARY KEY (te1_id, met_id)
      );

      -- Élève Test 2 attributions
      CREATE TABLE IF NOT EXISTS tests_eleves_2_facultes (
        te2_id INTEGER NOT NULL REFERENCES tests_eleves_2(te2_id) ON DELETE CASCADE,
        fac_id INTEGER NOT NULL REFERENCES faculte(fac_id) ON DELETE CASCADE,
        PRIMARY KEY (te2_id, fac_id)
      );
      CREATE TABLE IF NOT EXISTS tests_eleves_2_entreprises (
        te2_id INTEGER NOT NULL REFERENCES tests_eleves_2(te2_id) ON DELETE CASCADE,
        ent_id INTEGER NOT NULL REFERENCES entreprise(ent_id) ON DELETE CASCADE,
        PRIMARY KEY (te2_id, ent_id)
      );
      CREATE TABLE IF NOT EXISTS tests_eleves_2_metiers (
        te2_id INTEGER NOT NULL REFERENCES tests_eleves_2(te2_id) ON DELETE CASCADE,
        met_id INTEGER NOT NULL REFERENCES metier(met_id) ON DELETE CASCADE,
        PRIMARY KEY (te2_id, met_id)
      );

      -- Étudiant Test 1 attributions
      CREATE TABLE IF NOT EXISTS tests_etudiants_1_facultes (
        tet1_id INTEGER NOT NULL REFERENCES tests_etudiants_1(tet1_id) ON DELETE CASCADE,
        fac_id INTEGER NOT NULL REFERENCES faculte(fac_id) ON DELETE CASCADE,
        PRIMARY KEY (tet1_id, fac_id)
      );
      CREATE TABLE IF NOT EXISTS tests_etudiants_1_entreprises (
        tet1_id INTEGER NOT NULL REFERENCES tests_etudiants_1(tet1_id) ON DELETE CASCADE,
        ent_id INTEGER NOT NULL REFERENCES entreprise(ent_id) ON DELETE CASCADE,
        PRIMARY KEY (tet1_id, ent_id)
      );
      CREATE TABLE IF NOT EXISTS tests_etudiants_1_metiers (
        tet1_id INTEGER NOT NULL REFERENCES tests_etudiants_1(tet1_id) ON DELETE CASCADE,
        met_id INTEGER NOT NULL REFERENCES metier(met_id) ON DELETE CASCADE,
        PRIMARY KEY (tet1_id, met_id)
      );

      -- Étudiant Test 2 attributions
      CREATE TABLE IF NOT EXISTS tests_etudiants_2_facultes (
        tet2_id INTEGER NOT NULL REFERENCES tests_etudiants_2(tet2_id) ON DELETE CASCADE,
        fac_id INTEGER NOT NULL REFERENCES faculte(fac_id) ON DELETE CASCADE,
        PRIMARY KEY (tet2_id, fac_id)
      );
      CREATE TABLE IF NOT EXISTS tests_etudiants_2_entreprises (
        tet2_id INTEGER NOT NULL REFERENCES tests_etudiants_2(tet2_id) ON DELETE CASCADE,
        ent_id INTEGER NOT NULL REFERENCES entreprise(ent_id) ON DELETE CASCADE,
        PRIMARY KEY (tet2_id, ent_id)
      );
      CREATE TABLE IF NOT EXISTS tests_etudiants_2_metiers (
        tet2_id INTEGER NOT NULL REFERENCES tests_etudiants_2(tet2_id) ON DELETE CASCADE,
        met_id INTEGER NOT NULL REFERENCES metier(met_id) ON DELETE CASCADE,
        PRIMARY KEY (tet2_id, met_id)
      );

      -- Emploi Test 1 attributions
      CREATE TABLE IF NOT EXISTS tests_emploi_1_entreprises (
        tem1_id INTEGER NOT NULL REFERENCES tests_emploi_1(tem1_id) ON DELETE CASCADE,
        ent_id INTEGER NOT NULL REFERENCES entreprise(ent_id) ON DELETE CASCADE,
        PRIMARY KEY (tem1_id, ent_id)
      );
      CREATE TABLE IF NOT EXISTS tests_emploi_1_metiers (
        tem1_id INTEGER NOT NULL REFERENCES tests_emploi_1(tem1_id) ON DELETE CASCADE,
        met_id INTEGER NOT NULL REFERENCES metier(met_id) ON DELETE CASCADE,
        PRIMARY KEY (tem1_id, met_id)
      );

      -- Emploi Test 2 attributions
      CREATE TABLE IF NOT EXISTS tests_emploi_2_entreprises (
        tem2_id INTEGER NOT NULL REFERENCES tests_emploi_2(tem2_id) ON DELETE CASCADE,
        ent_id INTEGER NOT NULL REFERENCES entreprise(ent_id) ON DELETE CASCADE,
        PRIMARY KEY (tem2_id, ent_id)
      );
      CREATE TABLE IF NOT EXISTS tests_emploi_2_metiers (
        tem2_id INTEGER NOT NULL REFERENCES tests_emploi_2(tem2_id) ON DELETE CASCADE,
        met_id INTEGER NOT NULL REFERENCES metier(met_id) ON DELETE CASCADE,
        PRIMARY KEY (tem2_id, met_id)
      );
    `);

    // ========================================================
    // 4. PEUPLEMENT DES FACULTÉS & UNIVERSITÉS (STRICTEMENT SANS ICÔNE)
    // ========================================================
    console.log('4. Insertion du catalogue des facultés et universités...');

    const listeFacultes = [
      {
        code: 'fac_espa',
        nom: 'École Supérieure Polytechnique d\'Antananarivo (ESPA Vontovorona)',
        sigle: 'ESPA',
        type: 'Public',
        ville: 'Antananarivo',
        filieres: 'Génie Civil, BTP, Électronique, Télécommunications, Énergies, Informatique, Génie Mécanique, Mines',
        desc: 'Grande école d\'ingénieurs d\'État de référence à Madagascar, formant les ingénieurs diplômés d\'excellence.',
        site_web: 'http://www.univ-antananarivo.mg/ESPA',
        pole: 'sciences_exactes'
      },
      {
        code: 'fac_sciences_ankatso',
        nom: 'Faculté des Sciences d\'Ankatso',
        sigle: 'Fac Sciences',
        type: 'Public',
        ville: 'Antananarivo',
        filieres: 'Mathématiques & Informatique, Physique & Applications, Chimie, Biologie & Écologie Végétale/Animale',
        desc: 'Pôle académique d\'excellence de l\'Université d\'Antananarivo pour la recherche fondamentale et appliquée.',
        site_web: 'http://www.univ-antananarivo.mg/Faculte-des-Sciences',
        pole: 'sciences_exactes'
      },
      {
        code: 'fac_eni_fianar',
        nom: 'École Nationale d\'Informatique de Fianarantsoa (ENI)',
        sigle: 'ENI',
        type: 'Public',
        ville: 'Fianarantsoa',
        filieres: 'Génie Logiciel & Base de Données, Administration Systèmes & Réseaux, Intelligence Artificielle',
        desc: 'École publique universitaire historique spécialisée dans l\'ingénierie informatique et le numérique à Madagascar.',
        site_web: 'https://eni.mg',
        pole: 'sciences_exactes'
      },
      {
        code: 'fac_ispm',
        nom: 'Institut Supérieur Polytechnique de Madagascar (ISPM)',
        sigle: 'ISPM',
        type: 'Privé',
        ville: 'Antananarivo',
        filieres: 'Informatique & Télécoms, Génie Civil, Agroalimentaire, Électronique & Énergies Renouvelables',
        desc: 'Institut privé de premier plan accrédité par l\'État, réputé pour sa pédagogie pratique et orientée entreprise.',
        site_web: 'https://www.ispm.mg',
        pole: 'sciences_exactes'
      },
      {
        code: 'fac_itu',
        nom: 'IT University (Institut de Technologies de l\'Information)',
        sigle: 'ITU',
        type: 'Privé',
        ville: 'Antananarivo',
        filieres: 'Développement Web, Génie Logiciel, Mobile, Cloud Computing, Cybersécurité',
        desc: 'Établissement supérieur privé spécialisé dans la tech et les métiers du développement informatique.',
        site_web: 'https://www.ituniversity-mg.com',
        pole: 'pole_tech'
      },
      {
        code: 'fac_esti',
        nom: 'École Supérieure des Technologies de l\'Information (ESTI)',
        sigle: 'ESTI',
        type: 'Privé (Partenariat CCIA)',
        ville: 'Antananarivo',
        filieres: 'Réseaux & Sécurité, Intégration Logicielle, Télécommunications & Systèmes Connectés',
        desc: 'Créée par la Chambre de Commerce et d\'Industrie d\'Antananarivo pour répondre directement aux besoins des ESN.',
        site_web: 'https://esti.mg',
        pole: 'pole_tech'
      },
      {
        code: 'fac_medecine_tana',
        nom: 'Faculté de Médecine d\'Antananarivo',
        sigle: 'Fac Médecine',
        type: 'Public',
        ville: 'Antananarivo',
        filieres: 'Médecine Générale, Chirurgie, Spécialités Médicales, Pharmacie, Odontostomatologie',
        desc: 'Faculté d\'État formant les docteurs en médecine et les praticiens hospitaliers de Madagascar.',
        site_web: 'http://www.univ-antananarivo.mg/Faculte-de-Medecine',
        pole: 'sciences_vie_sante'
      },
      {
        code: 'fac_essa_ankatso',
        nom: 'École Supérieure des Sciences Agronomiques (ESSA Ankatso)',
        sigle: 'ESSA',
        type: 'Public',
        ville: 'Antananarivo',
        filieres: 'Agriculture, Foresterie & Environnement, Élevage, Agro-management, Industries Agricoles & Alimentaires',
        desc: 'Pôle national formant les ingénieurs agronomes et experts en gestion des ressources naturelles.',
        site_web: 'http://www.univ-antananarivo.mg/ESSA',
        pole: 'sciences_vie_sante'
      },
      {
        code: 'fac_inspc',
        nom: 'Institut National de Santé Publique et Communautaire (INSPC)',
        sigle: 'INSPC',
        type: 'Public',
        ville: 'Antananarivo',
        filieres: 'Santé Publique, Épidémiologie, Management des Services de Santé, Nutrition',
        desc: 'Institution publique rattachée au Ministère de la Santé Publique pour la formation des cadres sanitaires.',
        site_web: 'http://www.sante.gov.mg',
        pole: 'sciences_vie_sante'
      },
      {
        code: 'fac_ifirp',
        nom: 'Institut de Formation Interrégionale des Paramédicaux (IFIRP)',
        sigle: 'IFIRP',
        type: 'Public',
        ville: 'Antananarivo',
        filieres: 'Soins Infirmiers, Sage-Femme, Techniciens de Laboratoire, Kinésithérapie, Imagerie Médicale',
        desc: 'Établissement d\'État préparant aux diplômes nationaux des professions paramédicales.',
        site_web: 'http://www.sante.gov.mg',
        pole: 'sciences_vie_sante'
      },
      {
        code: 'fac_fdsp_ankatso',
        nom: 'Faculté de Droit et Sciences Politiques d\'Ankatso (FDSP)',
        sigle: 'FDSP',
        type: 'Public',
        ville: 'Antananarivo',
        filieres: 'Droit Privé, Droit des Affaires, Droit Public, Sciences Politiques, Relations Internationales',
        desc: 'Faculté de droit historique formant les magistrats, avocats, juristes d\'entreprise et diplomates.',
        site_web: 'http://www.univ-antananarivo.mg/FDSP',
        pole: 'lettres_langues'
      },
      {
        code: 'fac_ceds_mada',
        nom: 'Centre d\'Études Diplomatiques et Stratégiques (CEDS Madagascar)',
        sigle: 'CEDS',
        type: 'Privé Supérieur',
        ville: 'Antananarivo',
        filieres: 'Diplomatie, Géopolitique, Négociation Internationale, Gestion des Crises',
        desc: 'Antenne régionale réputée pour le perfectionnement des diplomates, officiers et hauts cadres de l\'État.',
        site_web: 'https://cedsmadagascar.org',
        pole: 'lettres_langues'
      },
      {
        code: 'fac_egs_ankatso',
        nom: 'Faculté d\'Économie, de Gestion et de Sociologie (Faculté EGS Ankatso)',
        sigle: 'Fac EGS',
        type: 'Public',
        ville: 'Antananarivo',
        filieres: 'Économie du Développement, Gestion Financière, Comptabilité, Marketing, Sociologie',
        desc: 'Plus grande faculté d\'économie et de gestion du pays formant les analystes et cadres administratifs.',
        site_web: 'http://www.univ-antananarivo.mg/Faculte-EGS',
        pole: 'eco_societe'
      },
      {
        code: 'fac_inscae',
        nom: 'Institut National des Sciences Comptables et de l\'Administration d\'Entreprises (INSCAE)',
        sigle: 'INSCAE',
        type: 'Public / Semi-autonome',
        ville: 'Antananarivo',
        filieres: 'Comptabilité & Finance, Audit & Contrôle, Marketing & Commerce, Management des Entreprises',
        desc: 'Institut d\'excellence à concours très sélectif, référence absolue à Madagascar pour la finance et le management.',
        site_web: 'https://www.inscae.mg',
        pole: 'eco_societe'
      },
      {
        code: 'fac_iscam',
        nom: 'Institut Supérieur de la Communication, des Affaires et du Management (ISCAM)',
        sigle: 'ISCAM',
        type: 'Privé',
        ville: 'Antananarivo',
        filieres: 'Commerce International, Marketing Digital, Ressources Humaines, Finance d\'Entreprise, Communication',
        desc: 'Grande école privée de management avec un fort réseau d\'entreprises partenaires et de stages.',
        site_web: 'https://www.iscam.mg',
        pole: 'eco_societe'
      },
      {
        code: 'fac_flsh_ankatso',
        nom: 'Faculté des Lettres et Sciences Humaines d\'Ankatso (FLSH)',
        sigle: 'FLSH',
        type: 'Public',
        ville: 'Antananarivo',
        filieres: 'Études Françaises & Francophones, Malagasy, Anglais, Philosophie, Histoire & Patrimoine, Géographie',
        desc: 'Centre d\'enseignement et de recherche sur les humanités, les langues vivantes et l\'histoire de Madagascar.',
        site_web: 'http://www.univ-antananarivo.mg/FLSH',
        pole: 'lettres_langues'
      },
      {
        code: 'fac_cntemad',
        nom: 'Centre National de Télé-Enseignement de Madagascar (CNTEMAD)',
        sigle: 'CNTEMAD',
        type: 'Public',
        ville: 'National (Réseau de centres régionaux)',
        filieres: 'Droit, Sciences Économiques, Gestion, Informatique, Communication, Génie Industriel',
        desc: 'Institution publique d\'enseignement supérieur à distance permettant d\'étudier tout en exerçant un travail.',
        site_web: 'https://www.cntemad.mg',
        pole: 'eco_societe'
      },
      {
        code: 'fac_ist_tana',
        nom: 'Institut Supérieur de Technologie d\'Antananarivo (IST-T)',
        sigle: 'IST',
        type: 'Public',
        ville: 'Antananarivo',
        filieres: 'Génie Industriel, Télécoms, BTP & Maintenance, Gestion des PME/PMI, Logistique',
        desc: 'Établissement public dispensant des cursus technologiques courts et professionnalisants (DTS, Licence Pro).',
        site_web: 'https://www.ist-tana.mg',
        pole: 'technique_appliquee'
      }
    ];

    for (const f of listeFacultes) {
      await query(`
        INSERT INTO faculte (fac_code, fac_nom, fac_sigle, fac_type, fac_ville, fac_filiere, fac_description, fac_site_web, fac_pole)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (fac_code) DO UPDATE SET
          fac_nom = EXCLUDED.fac_nom,
          fac_sigle = EXCLUDED.fac_sigle,
          fac_type = EXCLUDED.fac_type,
          fac_ville = EXCLUDED.fac_ville,
          fac_filiere = EXCLUDED.fac_filiere,
          fac_description = EXCLUDED.fac_description,
          fac_site_web = EXCLUDED.fac_site_web,
          fac_pole = EXCLUDED.fac_pole;
      `, [cleanString(f.code), cleanString(f.nom), cleanString(f.sigle), cleanString(f.type), cleanString(f.ville), cleanString(f.filieres), cleanString(f.desc), cleanString(f.site_web), cleanString(f.pole)]);
    }

    // ========================================================
    // 5. PEUPLEMENT DES ENTREPRISES (STRICTEMENT SANS ICÔNE)
    // ========================================================
    console.log('5. Insertion du catalogue des entreprises partenaires...');

    const listeEntreprises = [
      {
        code: 'ent_intelcia',
        nom: 'Intelcia Madagascar',
        secteur: 'BPO & Relation Client',
        secteur_detail: 'Externalisation de services, centres de contact multicanal et support technique international',
        ville: 'Antananarivo',
        implantation: 'Zone Galaxy Andraharo, Zone Futura Andranomahery',
        desc: 'Acteur majeur de la relation client et de l\'outsourcing à Madagascar, employant plusieurs milliers de collaborateurs.',
        postes_recrutes: 'Conseiller Clientèle Francophone / Anglophone, Modérateur de Contenus Digitaux, Superviseur Junior',
        profil_recherche: 'Baccalauréat minimum, élocution fluide en français, disponibilité horaire et sens du service.',
        accessibilite: 'Accessible aux débutants avec formation rémunérée assurée dès l\'embauche.',
        email_contact: 'recrutement-madagascar@intelcia.com',
        site_web: 'https://recrutement.intelcia.com',
        pole: 'pole_tech_digital'
      },
      {
        code: 'ent_concentrix_webhelp',
        nom: 'Concentrix / Webhelp Madagascar',
        secteur: 'Relation Client & Modération Digitale',
        secteur_detail: 'Expérience client internationale, modération de réseaux sociaux et support applicatif B2B',
        ville: 'Antananarivo',
        implantation: 'Zone Galaxy Andraharo, Enceinte Batpro',
        desc: 'Leader mondial de l\'expérience client offrant un cadre de travail moderne et des plans d\'évolution de carrière.',
        postes_recrutes: 'Spécialiste Support Utilisateur, Agent de Modération Réseaux Sociaux, Chargé de Qualité',
        profil_recherche: 'Excellente compréhension du français métropolitain, bon relationnel, résistance au stress.',
        accessibilite: 'Débutants bienvenus avec formation interne structurée.',
        email_contact: 'recrutement.tana@webhelp.com',
        site_web: 'https://jobs.concentrix.com',
        pole: 'pole_tech_digital'
      },
      {
        code: 'ent_vivetic',
        nom: 'Vivetic Group Madagascar',
        secteur: 'Traitement de Données & BPO',
        secteur_detail: 'Qualification de fichiers, saisie experte, annotation IA (Computer Vision & NLP) et relation client',
        ville: 'Antananarivo',
        implantation: 'Ankorondrano & Tanjombato',
        desc: 'Pionnier historique du traitement de données et de l\'outsourcing digital à Madagascar depuis plus de 20 ans.',
        postes_recrutes: 'Opérateur de Saisie de Données, Annotateur IA, Téléconseiller Réception d\'Appels, Rédacteur Web',
        profil_recherche: 'Bac minimum, orthographe soignée, rapidité au clavier et rigueur.',
        accessibilite: 'Parfait pour un premier emploi formel et pour les profils minutieux.',
        email_contact: 'recrutement@vivetic.mg',
        site_web: 'https://www.viveticgroup.com',
        pole: 'pole_tech_digital'
      },
      {
        code: 'ent_bocasay',
        nom: 'Bocasay Madagascar',
        secteur: 'Ingénierie Logicielle & ESN',
        secteur_detail: 'Développement d\'applications web et mobiles offshore, méthodes agiles Scrum',
        ville: 'Antananarivo',
        implantation: 'Zone Tana Waterfront Ambodivona',
        desc: 'Entreprise de services du numérique française implantée à Antananarivo, concevant des solutions logicielles sur-mesure.',
        postes_recrutes: 'Développeur Full-Stack (React, Node.js, Symfony), Développeur Flutter, Testeur QA',
        profil_recherche: 'Bases solides en programmation, autonomie, méthodologie Agile et portfolio de projets réels.',
        accessibilite: 'Diplômés bac+3/5 ou autodidactes avec projets concrets à présenter.',
        email_contact: 'jobs@bocasay.com',
        site_web: 'https://www.bocasay.com',
        pole: 'pole_tech'
      },
      {
        code: 'ent_etech',
        nom: 'Etech Consulting (Groupe Arkeup)',
        secteur: 'Services Informatiques & Cloud',
        secteur_detail: 'Développement d\'applications d\'entreprise, intégration ERP Odoo, solutions Cloud et E-commerce',
        ville: 'Antananarivo',
        implantation: 'Ankorondrano & Andraharo',
        desc: 'Une des plus grandes ESN de Madagascar, accompagnant la transformation digitale d\'entreprises européennes et locales.',
        postes_recrutes: 'Développeur PHP/Laravel, Développeur Front-End (React, Vue), Consultant ERP, Chef de Projet',
        profil_recherche: 'Connaissance de la POO, passion pour les nouvelles technologies et esprit de collaboration.',
        accessibilite: 'Recrute régulièrement des profils juniors lors de sessions de sélection technique.',
        email_contact: 'recrutement@etechconsulting-mg.com',
        site_web: 'https://www.etechconsulting-mg.com',
        pole: 'pole_tech'
      },
      {
        code: 'ent_axian',
        nom: 'Groupe Axian (Telma, Mvola, Pulse)',
        secteur: 'Télécoms, Fintech & Énergie',
        secteur_detail: 'Réseaux de télécommunications, paiement mobile Mvola, énergie solaire et services financiers',
        ville: 'Antananarivo',
        implantation: 'Alarobia, Ankorondrano et agences régionales dans toute l\'île',
        desc: 'Groupe panafricain d\'origine malgache leader dans les télécoms, la finance mobile et les infrastructures.',
        postes_recrutes: 'Conseiller Clientèle Telma, Animateur Commercial Mvola, Technicien Réseaux, Assistant Gestion',
        profil_recherche: 'Excellent sens relationnel, rigueur commerciale, dynamisme et honnêteté.',
        accessibilite: 'Opportunités multiples pour débutants et diplômés de gestion ou télécoms.',
        email_contact: 'recrutement@telma.mg',
        site_web: 'https://www.axian-group.com',
        pole: 'pole_tech'
      },
      {
        code: 'ent_chocolat_robert',
        nom: 'Chocolaterie Robert / Ramanandraibe Exportation',
        secteur: 'Agroalimentaire & Terroir',
        secteur_detail: 'Transformation de cacao fin de Madagascar, chocolaterie haut de gamme et exportation internationale',
        ville: 'Antananarivo',
        implantation: 'Soixante-Sept Hectares, Tanjombato & Ambanja (Sambirano)',
        desc: 'Chocolatier emblématique de Madagascar reconnu mondialement pour la qualité de son cacao mono-origine.',
        postes_recrutes: 'Agent de Production, Contrôleur Qualité Produits Finis, Vendeur en Boutique, Gestionnaire de Stocks',
        profil_recherche: 'Rigueur hygiénique, minutie dans la manipulation des produits et respect des procédures.',
        accessibilite: 'Postes d\'opérateurs accessibles avec Bac ou terminale.',
        email_contact: 'recrutement@chocolatserobert.com',
        site_web: 'https://www.chocolatserobert.com',
        pole: 'pole_entrepreneuriat'
      },
      {
        code: 'ent_star',
        nom: 'Star Madagascar (Groupe Castel)',
        secteur: 'Agroalimentaire & Distribution',
        secteur_detail: 'Brasserie, boissons gazeuses, eaux minérales et réseau logistique national',
        ville: 'Antananarivo',
        implantation: 'Andraharo, Ambatolampy, Antsirabe et centres de distribution provinciaux',
        desc: 'Premier groupe agroalimentaire de boissons à Madagascar, garantissant un réseau de distribution dense.',
        postes_recrutes: 'Opérateur de Ligne de Conditionnement, Agent de Distribution, Magasinier Manutentionnaire, Promoteur Commercial',
        profil_recherche: 'Condition physique solide, ponctualité, permis de conduire (selon poste), sens du contact.',
        accessibilite: 'Nombreuses opportunités d\'entrée pour les profils opérationnels.',
        email_contact: 'recrutement@star.mg',
        site_web: 'https://www.star.mg',
        pole: 'pole_logistique_supply'
      },
      {
        code: 'ent_welight',
        nom: 'WeLight Madagascar',
        secteur: 'Énergies Renouvelables & Électrification',
        secteur_detail: 'Mini-réseaux solaires ruraux, compteurs intelligents et énergie productive pour villages isolés',
        ville: 'Antananarivo',
        implantation: 'Galaxy Andraharo et plus de 60 villages électrifiés dans toute l\'île',
        desc: 'Entreprise pionnière de l\'électrification rurale propre offrant l\'accès à l\'énergie aux communautés enclavées.',
        postes_recrutes: 'Technicien Solaire & Réseau Électrique, Agent Commercial de Terrain, Responsable d\'Exploitation de Centrale',
        profil_recherche: 'Notions d\'électricité, autonomie, capacité de déplacement en milieu rural.',
        accessibilite: 'Formation pratique dispensée aux jeunes techniciens électriciens.',
        email_contact: 'recrutement@welight-africa.com',
        site_web: 'https://www.welight-africa.com',
        pole: 'pole_impact_vert'
      },
      {
        code: 'ent_wwf',
        nom: 'WWF Madagascar',
        secteur: 'Environnement & Conservation',
        secteur_detail: 'Organisation non gouvernementale internationale dédiée à la préservation de la biodiversité',
        ville: 'Antananarivo',
        implantation: 'Ambatobe et bureaux de terrain (Menabe, Diana, Mahafaly)',
        desc: 'ONG internationale engagée dans la conservation des forêts, des récifs marins et le développement communautaire.',
        postes_recrutes: 'Assistant de Projet Communautaire, Animateur Environnemental, Assistant Suivi-Évaluation',
        profil_recherche: 'Intégrité morale, écoute des populations locales, compréhension des enjeux environnementaux.',
        accessibilite: 'Recrutements réguliers sur appels à candidatures ouverts aux jeunes engagés.',
        email_contact: 'recrutement@wwf.mg',
        site_web: 'https://www.wwf.mg',
        pole: 'pole_impact_vert'
      },
      {
        code: 'ent_agl',
        nom: 'Africa Global Logistics (AGL) Madagascar',
        secteur: 'Logistique, Portuaire & Transit',
        secteur_detail: 'Transit maritime et aérien, dédouanement, entreposage logistique et manutention portuaire',
        ville: 'Antananarivo',
        implantation: 'Ankorondrano, Tamatave (Port), Majunga, Diego',
        desc: 'Premier opérateur de logistique intégrée et de transport multimodal à Madagascar.',
        postes_recrutes: 'Déclarant en Douane Junior, Magasinier d\'Entrepôt, Agent de Suivi Conteneurs',
        profil_recherche: 'Rigueur administrative, connaissance des documents de fret, ponctualité exemplaire.',
        accessibilite: 'Formations internes régulières aux formalités douanières.',
        email_contact: 'recrutement.madagascar@aglgroup.com',
        site_web: 'https://www.aglgroup.com',
        pole: 'pole_logistique_supply'
      },
      {
        code: 'ent_bni',
        nom: 'BNI Madagascar',
        secteur: 'Banque & Services Financiers',
        secteur_detail: 'Banque de détail, financement des entreprises malgaches, micro-finance et services digitaux',
        ville: 'Antananarivo',
        implantation: 'Siège à Analakely et plus de 100 agences dans tout Madagascar',
        desc: 'Plus ancien établissement bancaire de la Grande Île, acteur clé du financement économique.',
        postes_recrutes: 'Chargé d\'Accueil & Caissier d\'Agence, Gestionnaire de Comptes Particuliers, Analyste Risques',
        profil_recherche: 'Rigueur chiffrée, probité irréprochable, sens de l\'accueil client et esprit d\'équipe.',
        accessibilite: 'Diplômés de filières économiques, comptables ou de gestion.',
        email_contact: 'recrutement@bni.mg',
        site_web: 'https://www.bni.mg',
        pole: 'pole_finance'
      },
      {
        code: 'ent_boa',
        nom: 'Bank of Africa (BOA) Madagascar',
        secteur: 'Banque, Crédit & Micro-Entreprises',
        secteur_detail: 'Financement des professionnels, des PME et des ménages, inclusion financière',
        ville: 'Antananarivo',
        implantation: 'Antaninarenina et réseau d\'agences étendu sur l\'ensemble du territoire',
        desc: 'Réseau bancaire de référence à Madagascar, très actif dans le soutien aux initiatives entrepreneuriales.',
        postes_recrutes: 'Agent Commercial de Banque, Analyste Crédit Junior, Chargé d\'Opérations Bancaires',
        profil_recherche: 'Aisance mathématique, intégrité, clarté d\'analyse et respect des procédures de conformité.',
        accessibilite: 'Cursus universitaires en gestion, économie ou mathématiques.',
        email_contact: 'recrutement@boa.mg',
        site_web: 'https://www.boa.mg',
        pole: 'pole_finance'
      },
      {
        code: 'ent_colas',
        nom: 'Colas Madagascar',
        secteur: 'BTP, Travaux Publics & Génie Civil',
        secteur_detail: 'Construction de routes, ponts, aménagements urbains et grands travaux d\'infrastructures',
        ville: 'Antananarivo',
        implantation: 'Ankorondrano, carrières et chantiers opérationnels dans toute la Grande Île',
        desc: 'Leader historique des travaux publics à Madagascar, réalisant les grands projets d\'infrastructures nationales.',
        postes_recrutes: 'Conducteur de Travaux Junior, Technicien Topographe, Chef de Chantier, Mécanicien d\'Engins',
        profil_recherche: 'Sens du terrain, rigueur de sécurité, formation technique en génie civil ou mécanique.',
        accessibilite: 'Diplômés d\'écoles d\'ingénieurs (ESPA, ISPM) ou de filières techniques (IST).',
        email_contact: 'recrutement@colas.mg',
        site_web: 'https://www.colas.com',
        pole: 'pole_tech'
      }
    ];

    for (const e of listeEntreprises) {
      await query(`
        INSERT INTO entreprise (ent_code, ent_nom, ent_secteur, ent_secteur_detail, ent_ville, ent_implantation, ent_description, ent_poste_recrute, ent_profil_recherche, ent_accessibilite, ent_email_contact, ent_site_web, ent_pole)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (ent_code) DO UPDATE SET
          ent_nom = EXCLUDED.ent_nom,
          ent_secteur = EXCLUDED.ent_secteur,
          ent_secteur_detail = EXCLUDED.ent_secteur_detail,
          ent_ville = EXCLUDED.ent_ville,
          ent_implantation = EXCLUDED.ent_implantation,
          ent_description = EXCLUDED.ent_description,
          ent_poste_recrute = EXCLUDED.ent_poste_recrute,
          ent_profil_recherche = EXCLUDED.ent_profil_recherche,
          ent_accessibilite = EXCLUDED.ent_accessibilite,
          ent_email_contact = EXCLUDED.ent_email_contact,
          ent_site_web = EXCLUDED.ent_site_web,
          ent_pole = EXCLUDED.ent_pole;
      `, [cleanString(e.code), cleanString(e.nom), cleanString(e.secteur), cleanString(e.secteur_detail), cleanString(e.ville), cleanString(e.implantation), cleanString(e.desc), cleanString(e.postes_recrutes), cleanString(e.profil_recherche), cleanString(e.accessibilite), cleanString(e.email_contact), cleanString(e.site_web), cleanString(e.pole)]);
    }

    // ========================================================
    // 6. PEUPLEMENT DES MÉTIERS / POSTES À PROPOSER (STRICTEMENT SANS ICÔNE)
    // ========================================================
    console.log('6. Insertion du catalogue des métiers et débouchés...');

    const listeMetiers = [
      {
        code: 'met_dev_fullstack',
        nom: 'Développeur Full-Stack & Applications Web',
        secteur: 'Informatique & Technologies Numériques',
        niveau_requis: 'Licence 3 / Master (ou Autodidacte certifié)',
        salaire_indicatif: 'Forte valorisation sur le marché local et opportunités internationales en télétravail',
        desc: 'Conception et développement d\'applications web et mobiles complètes, de l\'interface utilisateur aux serveurs de données.',
        debouches: 'ESN, startups tech, banques, plateformes e-commerce et travail indépendant (Freelance).',
        pole: 'pole_tech'
      },
      {
        code: 'met_devops_cloud',
        nom: 'Ingénieur DevOps & Architecte Cloud',
        secteur: 'Informatique & Télécoms',
        niveau_requis: 'Master ou Certification Cloud (AWS, Azure)',
        salaire_indicatif: 'Niveau de rémunération parmi les plus élevés du secteur numérique malgache',
        desc: 'Automatisation des déploiements applicatifs, maintenance des pipelines CI/CD et gestion de serveurs distribués.',
        debouches: 'Grandes entreprises technologiques, institutions bancaires et sociétés internationales.',
        pole: 'pole_tech'
      },
      {
        code: 'met_admin_sys_reseaux',
        nom: 'Administrateur Systèmes, Réseaux & Cybersécurité',
        secteur: 'Infrastructures Informatiques',
        niveau_requis: 'Licence Pro / Master ou Cisco CCNA',
        salaire_indicatif: 'Poste stratégique et stable en entreprise',
        desc: 'Installation, sécurisation et supervision continue du parc informatique, des serveurs et des connexions réseau.',
        debouches: 'Toutes entreprises moyennes et grandes, banques, télécoms et ministères.',
        pole: 'pole_tech'
      },
      {
        code: 'met_data_analyst',
        nom: 'Data Analyst & Spécialiste Décisionnel (BI)',
        secteur: 'Data & Finance',
        niveau_requis: 'Licence 3 / Master en Statistiques ou Informatique',
        salaire_indicatif: 'Très forte demande dans le secteur bancaire et les télécoms',
        desc: 'Collecte, modélisation et analyse statistique de grands volumes de données pour éclairer la prise de décision stratégique.',
        debouches: 'Institutions financières, cabinets d\'audit, BPO et multinationales.',
        pole: 'pole_finance'
      },
      {
        code: 'met_ingenieur_genie_civil',
        nom: 'Ingénieur en Génie Civil & BTP',
        secteur: 'Travaux Publics & Construction',
        niveau_requis: 'Diplôme d\'Ingénieur (Bac+5 - ESPA, ISPM)',
        salaire_indicatif: 'Rémunération attractive selon l\'envergure des chantiers',
        desc: 'Conception technique, calcul de structures, dimensionnement et direction de chantiers d\'infrastructures durables.',
        debouches: 'Sociétés de travaux publics, bureaux d\'études d\'ingénierie et ministères de l\'Aménagement.',
        pole: 'sciences_exactes'
      },
      {
        code: 'met_auditeur_financier',
        nom: 'Auditeur Financier & Contrôleur de Gestion',
        secteur: 'Finance, Audit & Comptabilité',
        niveau_requis: 'Master en Gestion / Finance (INSCAE, Fac EGS) ou DSCG',
        salaire_indicatif: 'Tremplin d\'excellence vers les directions administratives et financières (DAF)',
        desc: 'Contrôle de la conformité comptable, analyse de la rentabilité, détection des risques et optimisation des budgets.',
        debouches: 'Cabinets d\'audit internationaux (Big 4), grandes entreprises et institutions financières.',
        pole: 'pole_finance'
      },
      {
        code: 'met_analyste_credit',
        nom: 'Analyste Crédit & Chargé d\'Affaires Microfinance',
        secteur: 'Banque & Inclusion Financière',
        niveau_requis: 'Licence 3 / Master Économie ou Finance',
        salaire_indicatif: 'Poste d\'entrée de choix dans le réseau bancaire',
        desc: 'Étude de la solvabilité des dossiers d\'emprunt des particuliers et des petites entreprises, montage de prêts.',
        debouches: 'Banques commerciales, institutions de microfinance (Otiv, Baobab, AccèsBanque).',
        pole: 'pole_finance'
      },
      {
        code: 'met_medecin_praticien',
        nom: 'Médecin Praticien / Médecin Généraliste',
        secteur: 'Santé Publique & Soins Hospitaliers',
        niveau_requis: 'Doctorat d\'État en Médecine Humaine (Bac+8)',
        salaire_indicatif: 'Statut médical reconnu, opportunités en cabinet libéral, ONG et hôpitaux',
        desc: 'Consultation médicale, diagnostic des pathologies, prescription des traitements et actions de prévention sanitaire.',
        debouches: 'Centres hospitaliers universitaires (CHU), cliniques privées, ONG humanitaires et cabinets privés.',
        pole: 'sciences_vie_sante'
      },
      {
        code: 'met_ingenieur_agronome',
        nom: 'Ingénieur Agronome & Expert Agroécologie',
        secteur: 'Agriculture, Foresterie & Environnement',
        niveau_requis: 'Diplôme d\'Ingénieur Agronome (Bac+5 - ESSA Ankatso)',
        salaire_indicatif: 'Marché porteur dans les filières d\'exportation et les programmes internationaux',
        desc: 'Développement des rendements des cultures vivrières et de rente, amélioration des sols et gestion durable des forêts.',
        debouches: 'Entreprises agroalimentaires, coopératives agricoles, parcs nationaux et projets de développement rural.',
        pole: 'sciences_vie_sante'
      },
      {
        code: 'met_pharmacien',
        nom: 'Pharmacien d\'Officine & de Recherche',
        secteur: 'Santé & Industrie Pharmaceutique',
        niveau_requis: 'Doctorat en Pharmacie (Bac+6)',
        salaire_indicatif: 'Profession de santé hautement réglementée et valorisée',
        desc: 'Dispensation des médicaments, vérification des posologies, conseil aux patients et valorisation des remèdes naturels.',
        debouches: 'Pharmacies d\'officine, laboratoires de phytothérapie (Homéopharma) et grossistes répartiteurs.',
        pole: 'sciences_vie_sante'
      },
      {
        code: 'met_biologiste_qualite',
        nom: 'Biologiste / Responsable Qualité Agroalimentaire (QHSE)',
        secteur: 'Sciences Biologiques & Industrie',
        niveau_requis: 'Licence 3 / Master en Sciences Biologiques',
        salaire_indicatif: 'Poste pivot dans les entreprises exportatrices malgaches',
        desc: 'Analyses microbiologiques, contrôle de conformité des produits alimentaires et mise en œuvre des normes HACCP.',
        debouches: 'Usines de transformation alimentaire, laboratoires d\'analyse vétérinaire et instituts de recherche.',
        pole: 'sciences_vie_sante'
      },
      {
        code: 'met_juriste_affaires',
        nom: 'Juriste d\'Entreprise & Conformité (Compliance)',
        secteur: 'Droit des Affaires & Contentieux',
        niveau_requis: 'Master 2 en Droit Privé ou Droit des Affaires (FDSP)',
        salaire_indicatif: 'Cadre juridique essentiel pour la sécurisation des investissements',
        desc: 'Rédaction des contrats commerciaux, gestion des contentieux, veille réglementaire et protection des intérêts de l\'entreprise.',
        debouches: 'Grandes entreprises, cabinets d\'avocats d\'affaires, banques et télécoms.',
        pole: 'lettres_langues'
      },
      {
        code: 'met_mkt_digital_manager',
        nom: 'Responsable Marketing Digital & E-Commerce',
        secteur: 'Marketing, Médias & Vente',
        niveau_requis: 'Licence 3 / Master en Marketing ou Communication (ISCAM)',
        salaire_indicatif: 'Secteur en plein essor avec l\'expansion du digital à Madagascar',
        desc: 'Élaboration de la stratégie de marque en ligne, gestion des campagnes publicitaires sur les réseaux sociaux et conversion.',
        debouches: 'Agences de communication digitale, entreprises e-commerce, banques et marques de grande consommation.',
        pole: 'eco_societe'
      },
      {
        code: 'met_charge_affaires_b2b',
        nom: 'Chargé d\'Affaires Commerciales & Négociateur B2B',
        secteur: 'Commerce, Vente & Distribution',
        niveau_requis: 'Licence en Commerce / Gestion ou profil commercial confirmé',
        salaire_indicatif: 'Salaire fixe valorisant avec primes d\'objectifs significatives',
        desc: 'Prospection auprès des entreprises clientes, négociation de contrats de vente et fidélisation de portefeuille.',
        debouches: 'Importateurs, distributeurs, concessionnaires, opérateurs télécoms et fournisseurs de services.',
        pole: 'eco_societe'
      },
      {
        code: 'met_coordinateur_projet_ong',
        nom: 'Coordinateur de Projets Humanitaires & Environnementaux',
        secteur: 'Projets Sociaux & Développement Durable',
        niveau_requis: 'Licence 3 / Master en Sciences Sociales ou Gestion de Projets',
        salaire_indicatif: 'Financement par bailleurs internationaux avec expérience valorisée',
        desc: 'Planification opérationnelle des missions de terrain, gestion du budget de projet et rédaction des rapports d\'impact.',
        debouches: 'ONG nationales et internationales, agences de l\'ONU et coopérations bilatérales.',
        pole: 'pole_impact_vert'
      },
      {
        code: 'met_conseiller_clientele_bpo',
        nom: 'Conseiller Clientèle Multicanal / Téléopérateur BPO',
        secteur: 'BPO & Services Clients',
        niveau_requis: 'Baccalauréat avec très bonne maîtrise du français',
        salaire_indicatif: 'Emploi formel stable avec primes de performance attractives',
        desc: 'Prise en charge des appels, emails et messageries des clients internationaux, résolution de requêtes et assistance technique.',
        debouches: 'Centres de contact internationaux (Intelcia, Concentrix, Vivetic, etc.).',
        pole: 'pole_tech_digital'
      },
      {
        code: 'met_gestionnaire_stocks',
        nom: 'Gestionnaire de Stocks & Logisticien d\'Entrepôt',
        secteur: 'Logistique, Approvisionnement & Transport',
        niveau_requis: 'Bac ou Licence Pro en Gestion / Logistique',
        salaire_indicatif: 'Poste indispensable et valorisé au cœur des flux physiques',
        desc: 'Organisation physique des entrepôts, comptage d\'inventaires sous Excel, contrôle qualitatif et gestion des réceptions/expéditions.',
        debouches: 'Plateformes logistiques, grandes surfaces, usines de production et entreprises de distribution.',
        pole: 'pole_logistique_supply'
      },
      {
        code: 'met_technicien_solaire',
        nom: 'Technicien d\'Installation Photovoltaïque & Énergie Solaire',
        secteur: 'Énergies Renouvelables & Électrotechnique',
        niveau_requis: 'Bac Technique / DTS ou formation professionnelle spécialisée',
        salaire_indicatif: 'Activité manuelle recherchée sur tout le territoire malgache',
        desc: 'Montage de panneaux solaires, câblage de régulateurs et onduleurs, maintenance préventive des mini-centrales.',
        debouches: 'Entreprises solaires (WeLight, Solarmad, Jiro-Ve), projets d\'électrification rurale et chantiers privés.',
        pole: 'pole_impact_vert'
      }
    ];

    for (const m of listeMetiers) {
      await query(`
        INSERT INTO metier (met_code, met_nom, met_secteur, met_niveau_requis, met_salaire_indicatif, met_description, met_debouche, met_pole)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (met_code) DO UPDATE SET
          met_nom = EXCLUDED.met_nom,
          met_secteur = EXCLUDED.met_secteur,
          met_niveau_requis = EXCLUDED.met_niveau_requis,
          met_salaire_indicatif = EXCLUDED.met_salaire_indicatif,
          met_description = EXCLUDED.met_description,
          met_debouche = EXCLUDED.met_debouche,
          met_pole = EXCLUDED.met_pole;
      `, [cleanString(m.code), cleanString(m.nom), cleanString(m.secteur), cleanString(m.niveau_requis), cleanString(m.salaire_indicatif), cleanString(m.desc), cleanString(m.debouches), cleanString(m.pole)]);
    }

    // ========================================================
    // 7. RATTACHEMENT AUTOMATIQUE PAR ID SUR LES TESTS EFFECTUÉS
    // ========================================================
    console.log('7. Attribution des ID de facultés, entreprises et métiers sur les tests utilisateurs...');

    // 7.1 Élève Test 1
    await query(`
      UPDATE tests_eleves_1 te1
      SET 
        te1_fac_id = CASE
          WHEN ce1.car_code = 'sciences_tech' THEN (SELECT fac_id FROM faculte WHERE fac_code = 'fac_espa' LIMIT 1)
          WHEN ce1.car_code = 'lettres_comm' THEN (SELECT fac_id FROM faculte WHERE fac_code = 'fac_fdsp_ankatso' LIMIT 1)
          WHEN ce1.car_code = 'eco_gestion' THEN (SELECT fac_id FROM faculte WHERE fac_code = 'fac_inscae' LIMIT 1)
          WHEN ce1.car_code = 'sante_social' THEN (SELECT fac_id FROM faculte WHERE fac_code = 'fac_medecine_tana' LIMIT 1)
          WHEN ce1.car_code = 'arts_creation' THEN (SELECT fac_id FROM faculte WHERE fac_code = 'fac_flsh_ankatso' LIMIT 1)
          WHEN ce1.car_code = 'nature_agri' THEN (SELECT fac_id FROM faculte WHERE fac_code = 'fac_essa_ankatso' LIMIT 1)
          ELSE (SELECT fac_id FROM faculte LIMIT 1)
        END,
        te1_ent_id = CASE
          WHEN ce1.car_code IN ('sciences_tech', 'eco_gestion') THEN (SELECT ent_id FROM entreprise WHERE ent_code = 'ent_axian' LIMIT 1)
          WHEN ce1.car_code = 'nature_agri' THEN (SELECT ent_id FROM entreprise WHERE ent_code = 'ent_wwf' LIMIT 1)
          ELSE (SELECT ent_id FROM entreprise WHERE ent_code = 'ent_intelcia' LIMIT 1)
        END,
        te1_met_id = CASE
          WHEN ce1.car_code = 'sciences_tech' THEN (SELECT met_id FROM metier WHERE met_code = 'met_dev_fullstack' LIMIT 1)
          WHEN ce1.car_code = 'lettres_comm' THEN (SELECT met_id FROM metier WHERE met_code = 'met_juriste_affaires' LIMIT 1)
          WHEN ce1.car_code = 'eco_gestion' THEN (SELECT met_id FROM metier WHERE met_code = 'met_auditeur_financier' LIMIT 1)
          WHEN ce1.car_code = 'sante_social' THEN (SELECT met_id FROM metier WHERE met_code = 'met_medecin_praticien' LIMIT 1)
          WHEN ce1.car_code = 'nature_agri' THEN (SELECT met_id FROM metier WHERE met_code = 'met_ingenieur_agronome' LIMIT 1)
          ELSE (SELECT met_id FROM metier WHERE met_code = 'met_mkt_digital_manager' LIMIT 1)
        END
      FROM caracteristiques_eleves_1 ce1
      WHERE te1.te1_car_id = ce1.car_id;
    `);

    // 7.2 Élève Test 2
    await query(`
      UPDATE tests_eleves_2 te2
      SET 
        te2_fac_id = CASE
          WHEN ce2.car_code = 'sciences_exactes' THEN (SELECT fac_id FROM faculte WHERE fac_code = 'fac_espa' LIMIT 1)
          WHEN ce2.car_code = 'sciences_vie_sante' THEN (SELECT fac_id FROM faculte WHERE fac_code = 'fac_medecine_tana' LIMIT 1)
          WHEN ce2.car_code = 'lettres_langues' THEN (SELECT fac_id FROM faculte WHERE fac_code = 'fac_fdsp_ankatso' LIMIT 1)
          WHEN ce2.car_code = 'eco_societe' THEN (SELECT fac_id FROM faculte WHERE fac_code = 'fac_inscae' LIMIT 1)
          WHEN ce2.car_code = 'technique_appliquee' THEN (SELECT fac_id FROM faculte WHERE fac_code = 'fac_ist_tana' LIMIT 1)
          ELSE (SELECT fac_id FROM faculte LIMIT 1)
        END,
        te2_ent_id = CASE
          WHEN ce2.car_code IN ('sciences_exactes', 'technique_appliquee') THEN (SELECT ent_id FROM entreprise WHERE ent_code = 'ent_bocasay' LIMIT 1)
          WHEN ce2.car_code = 'eco_societe' THEN (SELECT ent_id FROM entreprise WHERE ent_code = 'ent_bni' LIMIT 1)
          ELSE (SELECT ent_id FROM entreprise WHERE ent_code = 'ent_intelcia' LIMIT 1)
        END,
        te2_met_id = CASE
          WHEN ce2.car_code = 'sciences_exactes' THEN (SELECT met_id FROM metier WHERE met_code = 'met_ingenieur_genie_civil' LIMIT 1)
          WHEN ce2.car_code = 'sciences_vie_sante' THEN (SELECT met_id FROM metier WHERE met_code = 'met_pharmacien' LIMIT 1)
          WHEN ce2.car_code = 'lettres_langues' THEN (SELECT met_id FROM metier WHERE met_code = 'met_juriste_affaires' LIMIT 1)
          WHEN ce2.car_code = 'eco_societe' THEN (SELECT met_id FROM metier WHERE met_code = 'met_analyste_credit' LIMIT 1)
          ELSE (SELECT met_id FROM metier WHERE met_code = 'met_admin_sys_reseaux' LIMIT 1)
        END
      FROM caracteristiques_eleves_2 ce2
      WHERE te2.te2_car_id = ce2.car_id;
    `);

    // 7.3 Étudiant Test 1
    await query(`
      UPDATE tests_etudiants_1 tet1
      SET 
        tet1_fac_id = (SELECT fac_id FROM faculte WHERE fac_code = 'fac_sciences_ankatso' LIMIT 1),
        tet1_ent_id = (SELECT ent_id FROM entreprise WHERE ent_code = 'ent_etech' LIMIT 1),
        tet1_met_id = (SELECT met_id FROM metier WHERE met_code = 'met_dev_fullstack' LIMIT 1)
      WHERE tet1.tet1_car_id IS NOT NULL;
    `);

    // 7.4 Étudiant Test 2
    await query(`
      UPDATE tests_etudiants_2 tet2
      SET 
        tet2_fac_id = (SELECT fac_id FROM faculte WHERE fac_code = 'fac_espa' LIMIT 1),
        tet2_ent_id = (SELECT ent_id FROM entreprise WHERE ent_code = 'ent_bocasay' LIMIT 1),
        tet2_met_id = (SELECT met_id FROM metier WHERE met_code = 'met_devops_cloud' LIMIT 1)
      WHERE tet2.tet2_car_id IS NOT NULL;
    `);

    // 7.5 Emploi Test 1
    await query(`
      UPDATE tests_emploi_1 tem1
      SET 
        tem1_ent_id = (SELECT ent_id FROM entreprise WHERE ent_code = 'ent_intelcia' LIMIT 1),
        tem1_met_id = (SELECT met_id FROM metier WHERE met_code = 'met_conseiller_clientele_bpo' LIMIT 1)
      WHERE tem1.tem1_car_id IS NOT NULL;
    `);

    // 7.6 Emploi Test 2
    await query(`
      UPDATE tests_emploi_2 tem2
      SET 
        tem2_ent_id = (SELECT ent_id FROM entreprise WHERE ent_code = 'ent_agl' LIMIT 1),
        tem2_met_id = (SELECT met_id FROM metier WHERE met_code = 'met_gestionnaire_stocks' LIMIT 1)
      WHERE tem2.tem2_car_id IS NOT NULL;
    `);

    // 7.7 Insertion dans les tables de liaisons multiples pour chaque test
    await query(`
      -- Élève 1
      INSERT INTO tests_eleves_1_facultes (te1_id, fac_id)
      SELECT te1_id, te1_fac_id FROM tests_eleves_1 WHERE te1_fac_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      INSERT INTO tests_eleves_1_entreprises (te1_id, ent_id)
      SELECT te1_id, te1_ent_id FROM tests_eleves_1 WHERE te1_ent_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      INSERT INTO tests_eleves_1_metiers (te1_id, met_id)
      SELECT te1_id, te1_met_id FROM tests_eleves_1 WHERE te1_met_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      -- Élève 2
      INSERT INTO tests_eleves_2_facultes (te2_id, fac_id)
      SELECT te2_id, te2_fac_id FROM tests_eleves_2 WHERE te2_fac_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      INSERT INTO tests_eleves_2_entreprises (te2_id, ent_id)
      SELECT te2_id, te2_ent_id FROM tests_eleves_2 WHERE te2_ent_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      INSERT INTO tests_eleves_2_metiers (te2_id, met_id)
      SELECT te2_id, te2_met_id FROM tests_eleves_2 WHERE te2_met_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      -- Étudiant 1
      INSERT INTO tests_etudiants_1_facultes (tet1_id, fac_id)
      SELECT tet1_id, tet1_fac_id FROM tests_etudiants_1 WHERE tet1_fac_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      INSERT INTO tests_etudiants_1_entreprises (tet1_id, ent_id)
      SELECT tet1_id, tet1_ent_id FROM tests_etudiants_1 WHERE tet1_ent_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      INSERT INTO tests_etudiants_1_metiers (tet1_id, met_id)
      SELECT tet1_id, tet1_met_id FROM tests_etudiants_1 WHERE tet1_met_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      -- Étudiant 2
      INSERT INTO tests_etudiants_2_facultes (tet2_id, fac_id)
      SELECT tet2_id, tet2_fac_id FROM tests_etudiants_2 WHERE tet2_fac_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      INSERT INTO tests_etudiants_2_entreprises (tet2_id, ent_id)
      SELECT tet2_id, tet2_ent_id FROM tests_etudiants_2 WHERE tet2_ent_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      INSERT INTO tests_etudiants_2_metiers (tet2_id, met_id)
      SELECT tet2_id, tet2_met_id FROM tests_etudiants_2 WHERE tet2_met_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      -- Emploi 1
      INSERT INTO tests_emploi_1_entreprises (tem1_id, ent_id)
      SELECT tem1_id, tem1_ent_id FROM tests_emploi_1 WHERE tem1_ent_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      INSERT INTO tests_emploi_1_metiers (tem1_id, met_id)
      SELECT tem1_id, tem1_met_id FROM tests_emploi_1 WHERE tem1_met_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      -- Emploi 2
      INSERT INTO tests_emploi_2_entreprises (tem2_id, ent_id)
      SELECT tem2_id, tem2_ent_id FROM tests_emploi_2 WHERE tem2_ent_id IS NOT NULL
      ON CONFLICT DO NOTHING;

      INSERT INTO tests_emploi_2_metiers (tem2_id, met_id)
      SELECT tem2_id, tem2_met_id FROM tests_emploi_2 WHERE tem2_met_id IS NOT NULL
      ON CONFLICT DO NOTHING;
    `);

    // ========================================================
    // 8. RECRÉATION DES VUES DE COMPATIBILITÉ
    // ========================================================
    console.log('8. Mise à jour des vues de compatibilité tests_*...');

    await query(`
      DROP VIEW IF EXISTS tests_reconversion CASCADE;
      DROP VIEW IF EXISTS tests_emploi CASCADE;
      DROP VIEW IF EXISTS tests_etudiants CASCADE;
      DROP VIEW IF EXISTS tests_eleves CASCADE;

      CREATE OR REPLACE VIEW tests_eleves AS
      SELECT 
        te1.te1_id AS tel_id,
        te1.te1_uti_id AS tel_uti_id,
        te1.te1_ori_pro_1 AS tel_ori_pro_1,
        te2.te2_ori_pro_2 AS tel_ori_pro_2,
        te1.te1_det_int AS tel_det_int,
        te2.te2_det_mat AS tel_det_mat,
        te1.te1_cen_int AS tel_cen_int,
        te2.te2_mat_pre AS tel_mat_pre,
        te1.te1_fb_ana AS tel_fb_ana,
        te1.te1_car_id AS tel_car_id_1,
        te2.te2_car_id AS tel_car_id_2,
        te1.te1_fac_id AS tel_fac_id_1,
        te2.te2_fac_id AS tel_fac_id_2,
        te1.te1_ent_id AS tel_ent_id_1,
        te2.te2_ent_id AS tel_ent_id_2,
        te1.te1_met_id AS tel_met_id_1,
        te2.te2_met_id AS tel_met_id_2,
        te1.te1_pts_sci AS tel_pts_sci_1,
        te1.te1_pts_lit AS tel_pts_lit_1,
        te2.te2_pts_sci AS tel_pts_sci_2,
        te2.te2_pts_lit AS tel_pts_lit_2,
        (COALESCE(te1.te1_pts_sci, 0) + COALESCE(te2.te2_pts_sci, 0)) AS tel_pts_sci,
        (COALESCE(te1.te1_pts_lit, 0) + COALESCE(te2.te2_pts_lit, 0)) AS tel_pts_lit,
        CASE 
          WHEN te2.te2_ori_pro_2 IS NOT NULL THEN 3
          WHEN te1.te1_ori_pro_1 IS NOT NULL THEN 2
          ELSE 1
        END AS tel_eta_act,
        te1.te1_dat_cre AS tel_dat_cre,
        GREATEST(te1.te1_dat_mod, te2.te2_dat_mod) AS tel_dat_mod
      FROM tests_eleves_1 te1
      FULL OUTER JOIN tests_eleves_2 te2 ON te1.te1_uti_id = te2.te2_uti_id;

      CREATE OR REPLACE VIEW tests_etudiants AS
      SELECT 
        tet1.tet1_id AS tet_id,
        tet1.tet1_uti_id AS tet_uti_id,
        tet1.tet1_ori_pro_1 AS tet_ori_pro_1,
        tet2.tet2_ori_pro_2 AS tet_ori_pro_2,
        tet1.tet1_det_int AS tet_det_int,
        tet2.tet2_det_com AS tet_det_com,
        tet1.tet1_car_id AS tet_car_id_1,
        tet2.tet2_car_id AS tet_car_id_2,
        tet1.tet1_fac_id AS tet_fac_id_1,
        tet2.tet2_fac_id AS tet_fac_id_2,
        tet1.tet1_ent_id AS tet_ent_id_1,
        tet2.tet2_ent_id AS tet_ent_id_2,
        tet1.tet1_met_id AS tet_met_id_1,
        tet2.tet2_met_id AS tet_met_id_2,
        tet1.tet1_pts_sci AS tet_pts_sci_1,
        tet1.tet1_pts_lit AS tet_pts_lit_1,
        tet2.tet2_pts_sci AS tet_pts_sci_2,
        tet2.tet2_pts_lit AS tet_pts_lit_2,
        (COALESCE(tet1.tet1_pts_sci, 0) + COALESCE(tet2.tet2_pts_sci, 0)) AS tet_pts_sci,
        (COALESCE(tet1.tet1_pts_lit, 0) + COALESCE(tet2.tet2_pts_lit, 0)) AS tet_pts_lit,
        CASE 
          WHEN tet2.tet2_ori_pro_2 IS NOT NULL THEN 3
          WHEN tet1.tet1_ori_pro_1 IS NOT NULL THEN 2
          ELSE 1
        END AS tet_eta_act,
        tet1.tet1_dat_cre AS tet_dat_cre,
        GREATEST(tet1.tet1_dat_mod, tet2.tet2_dat_mod) AS tet_dat_mod
      FROM tests_etudiants_1 tet1
      FULL OUTER JOIN tests_etudiants_2 tet2 ON tet1.tet1_uti_id = tet2.tet2_uti_id;

      CREATE OR REPLACE VIEW tests_emploi AS
      SELECT 
        tem1.tem1_id AS tem_id,
        tem1.tem1_uti_id AS tem_uti_id,
        tem1.tem1_ori_pro_1 AS tem_ori_pro_1,
        tem2.tem2_ori_pro_2 AS tem_ori_pro_2,
        tem1.tem1_det_mot AS tem_det_mot,
        tem2.tem2_det_tra AS tem_det_tra,
        tem1.tem1_car_id AS tem_car_id_1,
        tem2.tem2_car_id AS tem_car_id_2,
        tem1.tem1_ent_id AS tem_ent_id_1,
        tem2.tem2_ent_id AS tem_ent_id_2,
        tem1.tem1_met_id AS tem_met_id_1,
        tem2.tem2_met_id AS tem_met_id_2,
        tem1.tem1_pts_sci AS tem_pts_sci_1,
        tem1.tem1_pts_lit AS tem_pts_lit_1,
        tem2.tem2_pts_sci AS tem_pts_sci_2,
        tem2.tem2_pts_lit AS tem_pts_lit_2,
        (COALESCE(tem1.tem1_pts_sci, 0) + COALESCE(tem2.tem2_pts_sci, 0)) AS tem_pts_sci,
        (COALESCE(tem1.tem1_pts_lit, 0) + COALESCE(tem2.tem2_pts_lit, 0)) AS tem_pts_lit,
        CASE 
          WHEN tem2.tem2_ori_pro_2 IS NOT NULL THEN 3
          WHEN tem1.tem1_ori_pro_1 IS NOT NULL THEN 2
          ELSE 1
        END AS tem_eta_act,
        tem1.tem1_dat_cre AS tem_dat_cre,
        GREATEST(tem1.tem1_dat_mod, tem2.tem2_dat_mod) AS tem_dat_mod
      FROM tests_emploi_1 tem1
      FULL OUTER JOIN tests_emploi_2 tem2 ON tem1.tem1_uti_id = tem2.tem2_uti_id;

      CREATE OR REPLACE VIEW tests_reconversion AS SELECT * FROM tests_emploi;
    `);

    console.log('✅ Migration des Facultés, Entreprises et Métiers réussie avec succès !');
  } catch (err) {
    console.error('❌ Erreur lors de la migration :', err);
    throw err;
  }
}

if (require.main === module) {
  migrate().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { migrate };
