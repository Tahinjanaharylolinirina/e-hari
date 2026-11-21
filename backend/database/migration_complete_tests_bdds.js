const { query } = require('../config/db');

// Fonction pour nettoyer strictement toute icône ou émoji
function cleanString(str) {
  if (!str) return '';
  return str
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{200D}\u{FE0F}]/gu, '')
    .trim();
}

async function runMigration() {
  console.log('🚀 Démarrage de la migration complète : Questions, Réponses, et Caractéristiques sans icônes...');
  try {
    // -----------------------------------------------------------------
    // 1. MISE À JOUR DES CARACTÉRISTIQUES ÉTUDIANTS 1 & 2
    // -----------------------------------------------------------------
    console.log('1. Mise à jour des caractéristiques Étudiant...');
    const carEtudiant1 = [
      {
        code: 'tech_ingenierie',
        nom: 'Profil Bâtisseur, Concepteur & Ingénieur',
        short_nom: 'Ingénierie & Systèmes',
        pts_sci_min: 8,
        pts_lit_min: 0,
        desc: 'Vous êtes doté d\'un esprit logique, structuré et passionné par la résolution de problèmes concrets. Vous aimez concevoir, programmer, bâtir des architectures robustes et transformer des idées en solutions fonctionnelles.',
      },
      {
        code: 'analytique_finance',
        nom: 'Profil Stratège, Analyste & Décideur',
        short_nom: 'Finance & Stratégie',
        pts_sci_min: 6,
        pts_lit_min: 3,
        desc: 'Vous possédez un sens aigu des chiffres, de la rentabilité et de la prospective. Vous savez décrypter les indicateurs financiers, anticiper les risques de marché et éclairer les décisions stratégiques par la donnée.',
      },
      {
        code: 'comm_marketing',
        nom: 'Profil Communicant, Développeur & Négociateur',
        short_nom: 'Marketing & Business',
        pts_sci_min: 0,
        pts_lit_min: 8,
        desc: 'Dynamique, persuasif et créatif, vous comprenez instinctivement les attentes du marché et de vos interlocuteurs. Vous excellez dans l\'art de convaincre, de créer du lien et de promouvoir des projets innovants.',
      },
      {
        code: 'management_rh',
        nom: 'Profil Leader, Fédérateur & Gestionnaire de Talents',
        short_nom: 'Leadership & RH',
        pts_sci_min: 3,
        pts_lit_min: 6,
        desc: 'Vous êtes guidé par l\'intelligence émotionnelle, le sens des responsabilités et la coordination d\'équipe. Vous savez motiver les collaborateurs, organiser le travail collectif et maintenir un climat de confiance.',
      },
      {
        code: 'recherche_sciences',
        nom: 'Profil Chercheur, Scientifique & Expert Méthodique',
        short_nom: 'Sciences & R&D',
        pts_sci_min: 8,
        pts_lit_min: 3,
        desc: 'Rigoureux, observateur et passionné par l\'investigation méthodique. Vous aimez explorer les concepts profonds, expérimenter en laboratoire ou sur le terrain et faire avancer les connaissances.',
      },
      {
        code: 'impact_juridique',
        nom: 'Profil Juriste, Auditeur & Acteur du Bien Commun',
        short_nom: 'Droit & Impact',
        pts_sci_min: 1,
        pts_lit_min: 8,
        desc: 'Attentif aux règles éthiques, aux textes juridiques et à l\'équité sociale. Vous aimez sécuriser les contrats, analyser les politiques publiques et veiller à la responsabilité sociétale.',
      },
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
      `, [cleanString(c.code), cleanString(c.nom), cleanString(c.short_nom), c.pts_sci_min, c.pts_lit_min, cleanString(c.desc)]);
    }

    const carEtudiant2 = [
      {
        code: 'pole_tech',
        nom: 'Filière Ingénierie, Technologies & Systèmes Numériques',
        short_nom: 'Tech & Systèmes',
        secteurs: 'Informatique, Télécoms, BTP, Électromécanique, Data',
        metiers: 'Développeur Full-Stack, Ingénieur DevOps, Chef de Projet SI, Ingénieur BTP',
        pts_sci_min: 8,
        pts_lit_min: 0,
        desc: 'Compétences techniques et aisance avec les outils numériques avancés pour les secteurs de la tech, du génie et de l\'innovation industrielle.'
      },
      {
        code: 'pole_finance',
        nom: 'Filière Banque, Finance, Audit & Gestion d\'Entreprise',
        short_nom: 'Banque & Finance',
        secteurs: 'Banque d\'affaires, Cabinets d\'audit, Microfinance, Contrôle de gestion',
        metiers: 'Auditeur financier, Contrôleur de gestion, Analyste crédit, Data Analyst BI',
        pts_sci_min: 6,
        pts_lit_min: 3,
        desc: 'Aptitudes analytiques, rigueur chiffrée et vision stratégique des flux financiers et des équilibres économiques.'
      },
      {
        code: 'pole_business',
        nom: 'Filière Marketing, Commerce International & Digital Business',
        short_nom: 'Commerce & Digital',
        secteurs: 'Agences digitales, E-commerce, Import-Export, Grande distribution',
        metiers: 'Growth Manager, Responsable E-commerce, Chargé d\'affaires internationales',
        pts_sci_min: 2,
        pts_lit_min: 6,
        desc: 'Orientation client, force de conviction commerciale et stratégie marketing omnicanale.'
      },
      {
        code: 'pole_management',
        nom: 'Filière Management, Gouvernance & Ressources Humaines',
        short_nom: 'Management & RH',
        secteurs: 'Directions d\'entreprises, Cabinets de recrutement, Organisation',
        metiers: 'Responsable RH, Coordinateur des opérations, Consultant en organisation',
        pts_sci_min: 2,
        pts_lit_min: 6,
        desc: 'Intelligence relationnelle, gouvernance responsable et conduite du changement humain.'
      },
      {
        code: 'pole_droit',
        nom: 'Filière Droit, Sciences Politiques & Développement Durable',
        short_nom: 'Droit & RSE',
        secteurs: 'Cabinets d\'avocats, Institutions publiques, ONG internationales',
        metiers: 'Juriste d\'entreprise, Chargé de conformité (Compliance), Consultant RSE',
        pts_sci_min: 1,
        pts_lit_min: 8,
        desc: 'Sécurisation juridique, analyse des traités et conformité aux standards internationaux.'
      },
      {
        code: 'pole_sciences',
        nom: 'Filière Santé, Biotechnologies, Agronomie & Environnement',
        short_nom: 'Santé & Environnement',
        secteurs: 'Santé publique, Laboratoires, Agro-industrie, Gestion environnementale',
        metiers: 'Ingénieur agronome, Biologiste, Responsable qualité QHSE, Cadre de santé',
        pts_sci_min: 8,
        pts_lit_min: 2,
        desc: 'Rigueur expérimentale, valorisation de la biodiversité malgache et innovation scientifique durable.'
      }
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
      `, [cleanString(c.code), cleanString(c.nom), cleanString(c.short_nom), cleanString(c.secteurs), cleanString(c.metiers), c.pts_sci_min, c.pts_lit_min, cleanString(c.desc)]);
    }

    // -----------------------------------------------------------------
    // 2. MISE À JOUR DES CARACTÉRISTIQUES EMPLOI 1 & 2
    // -----------------------------------------------------------------
    console.log('2. Mise à jour des caractéristiques Emploi...');
    const carEmploi1 = [
      {
        code: 'tech_numerique',
        nom: 'Profil Métiers du Numérique, Web & Nouvelles Technologies',
        short_nom: 'Numérique & Tech',
        pts_sci_min: 8,
        pts_lit_min: 0,
        desc: 'Attrait pour l\'informatique, les outils digitaux, l\'automatisation et les compétences recherchées dans le web et la data.'
      },
      {
        code: 'entrepreneuriat_agri',
        nom: 'Profil Créateur d\'Activité, Commerce & Métiers Autonomes',
        short_nom: 'Entrepreneuriat & Commerce',
        pts_sci_min: 4,
        pts_lit_min: 3,
        desc: 'Esprit d\'initiative, indépendance professionnelle, sens des opportunités commerciales et dynamisme de terrain.'
      },
      {
        code: 'management_conseil',
        nom: 'Profil Gestion de Projets, Coordination & Conseil Opérationnel',
        short_nom: 'Coordination & Gestion',
        pts_sci_min: 3,
        pts_lit_min: 5,
        desc: 'Aptitude à organiser, planifier, suivre des indicateurs et animer des équipes pour atteindre des résultats tangibles.'
      },
      {
        code: 'impact_vert_rse',
        nom: 'Profil Écologie, Développement Durable & Impact Social',
        short_nom: 'Environnement & Impact',
        pts_sci_min: 4,
        pts_lit_min: 4,
        desc: 'Engagement pour des missions porteuses de sens, l\'agroécologie, la transition écologique et l\'utilité collective.'
      },
      {
        code: 'formation_rh_humain',
        nom: 'Profil Accompagnement Humain, Formation & Recrutement',
        short_nom: 'RH & Formation',
        pts_sci_min: 0,
        pts_lit_min: 8,
        desc: 'Écoute active, pédagogie, transmission de savoir et développement du potentiel des individus au travail.'
      },
      {
        code: 'expertise_terrain_qualite',
        nom: 'Profil Métiers de Terrain, Logistique & Qualité Opérationnelle',
        short_nom: 'Terrain & Logistique',
        pts_sci_min: 7,
        pts_lit_min: 1,
        desc: 'Sens pratique, manipulation d\'équipements, gestion physique des flux, contrôle qualité et rigueur d\'exécution.'
      }
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
      `, [cleanString(c.code), cleanString(c.nom), cleanString(c.short_nom), c.pts_sci_min, c.pts_lit_min, cleanString(c.desc)]);
    }

    const carEmploi2 = [
      {
        code: 'pole_tech_digital',
        nom: 'Pôle Technologies Numériques, Web & Data',
        short_nom: 'Tech & Digital',
        secteurs: 'Développement Web, Gestion de Données, Maintenance Informatique, Marketing Digital',
        metiers: 'Développeur Junior, Gestionnaire de Contenu Web, Assistant Support Technique',
        pts_sci_min: 8,
        pts_lit_min: 1,
        desc: 'Filière moderne en forte croissance à Madagascar avec de réelles opportunités d\'embauche et d\'évolution.'
      },
      {
        code: 'pole_conseil_management',
        nom: 'Pôle Coordination de Projets, Gestion & Conseil',
        short_nom: 'Coordination & Projets',
        secteurs: 'Cabinets de conseil, Gestion de projets, Assistanat de direction, Administration',
        metiers: 'Coordinateur de projet, Assistant de gestion, Chargé de suivi et évaluation',
        pts_sci_min: 3,
        pts_lit_min: 5,
        desc: 'Métiers valorisant l\'organisation méthodique, le respect des plannings et la communication interne.'
      },
      {
        code: 'pole_entrepreneuriat',
        nom: 'Pôle Création d\'Activité, Vente & Développement Commercial',
        short_nom: 'Commerce & Vente',
        secteurs: 'Commerce, Distribution, Entrepreneuriat individuel, Services de proximité',
        metiers: 'Commercial de terrain, Responsable de boutique, Entrepreneur indépendant',
        pts_sci_min: 2,
        pts_lit_min: 5,
        desc: 'Parcours pour les profils autonomes souhaitant créer leur propre source de revenus ou exceller dans la vente.'
      },
      {
        code: 'pole_impact_vert',
        nom: 'Pôle Environnement, RSE & Développement Durable',
        short_nom: 'Impact & Écologie',
        secteurs: 'ONG environnementales, Agroécologie, Gestion des déchets, Énergies renouvelables',
        metiers: 'Animateur de projet vert, Technicien écocitoyen, Assistant projets durables',
        pts_sci_min: 5,
        pts_lit_min: 4,
        desc: 'Filière d\'avenir alliant utilité sociale et préservation du patrimoine naturel malgache.'
      },
      {
        code: 'pole_rh_formation',
        nom: 'Pôle Ressources Humaines, Formation & Services aux Personnes',
        short_nom: 'RH & Services',
        secteurs: 'Agences de travail temporaire, Centres de formation, Pôles de relation client',
        metiers: 'Chargé de recrutement, Formateur d\'adultes, Conseiller d\'insertion',
        pts_sci_min: 1,
        pts_lit_min: 8,
        desc: 'Métiers relationnels dédiés au développement des compétences et au bien-être au travail.'
      },
      {
        code: 'pole_logistique_supply',
        nom: 'Pôle Logistique, Supply Chain & Organisation Opérationnelle',
        short_nom: 'Logistique & Terrain',
        secteurs: 'Transport, Entreposage, Plateformes logistiques, Importation-Exportation',
        metiers: 'Gestionnaire de stocks, Assistant logistique, Magasinier qualifié',
        pts_sci_min: 6,
        pts_lit_min: 1,
        desc: 'Secteur dynamique axé sur l\'efficacité concrète, la précision des inventaires et la chaîne d\'approvisionnement.'
      }
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
      `, [cleanString(c.code), cleanString(c.nom), cleanString(c.short_nom), cleanString(c.secteurs), cleanString(c.metiers), c.pts_sci_min, c.pts_lit_min, cleanString(c.desc)]);
    }

    // -----------------------------------------------------------------
    // 3. TABLES DES RÉPONSES UTILISATEURS ÉTUDIANTS & EMPLOI
    // -----------------------------------------------------------------
    console.log('3. Création des tables de réponses individuelles utilisateurs pour Étudiants & Emploi...');
    await query(`
      CREATE TABLE IF NOT EXISTS reponses_utilisateurs_etudiants_1 (
        ruet1_id SERIAL PRIMARY KEY,
        ruet1_uti_id INTEGER NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
        ruet1_que_id INTEGER NOT NULL REFERENCES questions_etudiants_1(que_id) ON DELETE CASCADE,
        ruet1_rep_id INTEGER NOT NULL REFERENCES reponses_etudiants_1(rep_id) ON DELETE CASCADE,
        ruet1_pts_sci INTEGER DEFAULT 0,
        ruet1_pts_lit INTEGER DEFAULT 0,
        ruet1_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(ruet1_uti_id, ruet1_que_id)
      );

      CREATE TABLE IF NOT EXISTS reponses_utilisateurs_etudiants_2 (
        ruet2_id SERIAL PRIMARY KEY,
        ruet2_uti_id INTEGER NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
        ruet2_que_id INTEGER NOT NULL REFERENCES questions_etudiants_2(que_id) ON DELETE CASCADE,
        ruet2_rep_id INTEGER NOT NULL REFERENCES reponses_etudiants_2(rep_id) ON DELETE CASCADE,
        ruet2_pts_sci INTEGER DEFAULT 0,
        ruet2_pts_lit INTEGER DEFAULT 0,
        ruet2_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reponses_utilisateurs_emploi_1 (
        ruem1_id SERIAL PRIMARY KEY,
        ruem1_uti_id INTEGER NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
        ruem1_que_id INTEGER NOT NULL REFERENCES questions_emploi_1(que_id) ON DELETE CASCADE,
        ruem1_rep_id INTEGER NOT NULL REFERENCES reponses_emploi_1(rep_id) ON DELETE CASCADE,
        ruem1_pts_sci INTEGER DEFAULT 0,
        ruem1_pts_lit INTEGER DEFAULT 0,
        ruem1_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(ruem1_uti_id, ruem1_que_id)
      );

      CREATE TABLE IF NOT EXISTS reponses_utilisateurs_emploi_2 (
        ruem2_id SERIAL PRIMARY KEY,
        ruem2_uti_id INTEGER NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
        ruem2_que_id INTEGER NOT NULL REFERENCES questions_emploi_2(que_id) ON DELETE CASCADE,
        ruem2_rep_id INTEGER NOT NULL REFERENCES reponses_emploi_2(rep_id) ON DELETE CASCADE,
        ruem2_pts_sci INTEGER DEFAULT 0,
        ruem2_pts_lit INTEGER DEFAULT 0,
        ruem2_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // -----------------------------------------------------------------
    // 4. QUESTIONS ET RÉPONSES ÉTUDIANTS 1
    // -----------------------------------------------------------------
    console.log('4. Insertion des questions et options pour Étudiant Test 1...');
    await query('DELETE FROM questions_etudiants_1;');

    const qEtudiant1 = [
      {
        ordre: 1,
        texte: "Dans le cadre d'un projet universitaire majeur ou d'un mémoire de fin d'études, quel rôle prenez-vous spontanément ?",
        options: [
          { code: '1a', cat: 'tech_ingenierie', sci: 3, lit: 0, titre: "Le référent technique ou concepteur", desc: "Développer le prototype, programmer les modules, concevoir l'architecture ou valider la faisabilité technique." },
          { code: '1b', cat: 'analytique_finance', sci: 2, lit: 1, titre: "L'analyste financier et modélisateur", desc: "Établir le budget prévisionnel, analyser les données statistiques et chiffrer précisément la viabilité du projet." },
          { code: '1c', cat: 'comm_marketing', sci: 0, lit: 3, titre: "Le communicant et présentateur", desc: "Préparer la soutenance, concevoir le support visuel percutant et pitcher le projet pour convaincre le jury." },
          { code: '1d', cat: 'management_rh', sci: 1, lit: 2, titre: "Le coordinateur d'équipe et facilitateur", desc: "Répartir équitablement les tâches, planifier le calendrier, motiver les collègues et veiller à la cohésion." },
          { code: '1e', cat: 'recherche_sciences', sci: 3, lit: 1, titre: "Le chercheur de fond et documentaliste", desc: "Explorer la littérature scientifique internationale, vérifier les sources et poser des hypothèses solides." },
          { code: '1f', cat: 'impact_juridique', sci: 0, lit: 3, titre: "Le garant de la conformité et de l'éthique", desc: "Vérifier la légalité, sécuriser les aspects réglementaires et mesurer l'impact sociétal ou environnemental." },
        ]
      },
      {
        ordre: 2,
        texte: "Parmi ces types d'entreprises ou structures professionnelles, laquelle vous attire le plus pour votre stage ou premier emploi ?",
        options: [
          { code: '2a', cat: 'tech_ingenierie', sci: 3, lit: 0, titre: "Une entreprise technologique ou un bureau d'ingénierie", desc: "Un environnement d'innovation où l'on code, construit et conçoit des infrastructures de pointe." },
          { code: '2b', cat: 'analytique_finance', sci: 2, lit: 1, titre: "Une institution financière, cabinet d'audit ou banque d'affaires", desc: "Un cadre d'analyse rigoureux orienté vers l'investissement, le contrôle des risques et la performance chiffrée." },
          { code: '2c', cat: 'comm_marketing', sci: 0, lit: 3, titre: "Une agence digitale, un grand groupe commercial ou une start-up", desc: "Un univers dynamique tourné vers l'acquisition clients, le branding et la conquête de marchés." },
          { code: '2d', cat: 'management_rh', sci: 1, lit: 2, titre: "La direction des opérations d'un groupe ou un cabinet RH", desc: "Une organisation axée sur la gestion humaine, le recrutement des talents et l'amélioration du travail." },
          { code: '2e', cat: 'recherche_sciences', sci: 3, lit: 1, titre: "Un institut de recherche, laboratoire ou département R&D", desc: "Un lieu dédié à la découverte scientifique, aux brevets et à l'expérimentation méthodologique." },
          { code: '2f', cat: 'impact_juridique', sci: 0, lit: 3, titre: "Un cabinet juridique, une grande ONG ou une institution publique", desc: "Une structure d'envergure engagée dans la défense du droit, la transparence et le développement durable." },
        ]
      },
      {
        ordre: 3,
        texte: "Quelle compétence transversale (Soft Skill) considérez-vous comme votre plus grand atout ?",
        options: [
          { code: '3a', cat: 'tech_ingenierie', sci: 3, lit: 0, titre: "L'esprit d'ingénierie et la résolution de bugs", desc: "Votre capacité à comprendre les rouages complexes et à démonter un problème jusqu'à trouver la solution." },
          { code: '3b', cat: 'analytique_finance', sci: 2, lit: 1, titre: "L'esprit critique et la maîtrise de la donnée", desc: "Votre habileté à détecter les anomalies dans les tableaux de bord et à tirer des conclusions objectives." },
          { code: '3c', cat: 'comm_marketing', sci: 0, lit: 3, titre: "L'art de la persuasion et la négociation", desc: "Votre facilité à capter l'attention, valoriser une idée et créer une relation de confiance immédiate." },
          { code: '3d', cat: 'management_rh', sci: 1, lit: 2, titre: "L'empathie managériale et l'écoute active", desc: "Votre aptitude à comprendre les besoins d'autrui, apaiser les tensions et fédérer un groupe vers un objectif." },
          { code: '3e', cat: 'recherche_sciences', sci: 3, lit: 1, titre: "La rigueur d'investigation et la persévérance", desc: "Votre capacité à approfondir sans relâche un sujet complexe jusqu'à en maîtriser chaque facette." },
          { code: '3f', cat: 'impact_juridique', sci: 0, lit: 3, titre: "Le sens de la justice et la clarté argumentative", desc: "Votre rigueur pour structurer une démonstration irréfutable et faire respecter des principes éthiques." },
        ]
      },
      {
        ordre: 4,
        texte: "Face à une urgence professionnelle imprévue (défaillance système, crise client ou blocage d'équipe), quelle est votre attitude réflexe ?",
        options: [
          { code: '4a', cat: 'tech_ingenierie', sci: 3, lit: 0, titre: "Analyser les logs et réparer le mécanisme", desc: "Identifier immédiatement la panne technique, isoler la défaillance et déployer un correctif stable." },
          { code: '4b', cat: 'analytique_finance', sci: 2, lit: 1, titre: "Mesurer l'impact financier et les risques", desc: "Calculer le coût direct et indirect de l'incident et recommander la décision financière la plus rationnelle." },
          { code: '4c', cat: 'comm_marketing', sci: 0, lit: 3, titre: "Gérer la communication de crise", desc: "Rassurer les partenaires, formuler les bons messages et préserver la réputation de l'organisation." },
          { code: '4d', cat: 'management_rh', sci: 1, lit: 2, titre: "Rassembler l'équipe et soutenir le moral", desc: "Éviter la panique, réassigner clairement les rôles dans le calme et s'assurer que chacun sait quoi faire." },
          { code: '4e', cat: 'recherche_sciences', sci: 3, lit: 1, titre: "Documenter le cas pour éviter toute récidive", desc: "Analyser les causes profondes avec recul scientifique et rédiger un protocole préventif rigoureux." },
          { code: '4f', cat: 'impact_juridique', sci: 0, lit: 3, titre: "Vérifier les engagements contractuels et légaux", desc: "Examiner les clauses juridiques, protéger la structure et négocier une issue conforme aux règlements." },
        ]
      },
      {
        ordre: 5,
        texte: "Quelle mission valorisante vous procurerait le plus grand sentiment d'accomplissement personnel ?",
        options: [
          { code: '5a', cat: 'tech_ingenierie', sci: 3, lit: 0, titre: "Créer une application, une infrastructure ou un outil adopté par des milliers d'utilisateurs", desc: "Bâtir un système numérique performant et durable au service de la société." },
          { code: '5b', cat: 'analytique_finance', sci: 2, lit: 1, titre: "Optimiser la santé financière d'une organisation et lui faire réussir un investissement stratégique", desc: "Guider une structure vers l'équilibre et la croissance par des choix chiffrés avisés." },
          { code: '5c', cat: 'comm_marketing', sci: 0, lit: 3, titre: "Lancer une campagne à succès qui transforme une marque et développe ses parts de marché", desc: "Développer la notoriété et la valeur économique par une stratégie de communication exemplaire." },
          { code: '5d', cat: 'management_rh', sci: 1, lit: 2, titre: "Faire progresser des collaborateurs, recruter des talents et bâtir une équipe soudée", desc: "Cultiver le potentiel humain et l'engagement collectif dans l'entreprise." },
          { code: '5e', cat: 'recherche_sciences', sci: 3, lit: 1, titre: "Découvrir un nouveau modèle théorique, publier dans une revue internationale ou breveter une innovation", desc: "Participer aux avancées scientifiques et techniques mondiales." },
          { code: '5f', cat: 'impact_juridique', sci: 0, lit: 3, titre: "Contribuer au développement équitable de Madagascar en défendant le droit et la bonne gouvernance", desc: "Faire triompher l'intégrité, la justice institutionnelle et le développement équitable." },
        ]
      },
      {
        ordre: 6,
        texte: "Quel type de veille professionnelle ou de lecture aimez-vous consulter sur votre temps libre ?",
        options: [
          { code: '6a', cat: 'tech_ingenierie', sci: 3, lit: 0, titre: "Nouveaux frameworks, IA, innovations matérielles, GitHub, tech blogs", desc: "Suivi continu des évolutions logicielles et matérielles." },
          { code: '6b', cat: 'analytique_finance', sci: 2, lit: 1, titre: "Actualités économiques, analyses de marchés, tendances cryptos/devises", desc: "Veille macroéconomique, marchés financiers et indicateurs d'entreprises." },
          { code: '6c', cat: 'comm_marketing', sci: 0, lit: 3, titre: "Tendances marketing, storytelling de marques mondiales, stratégies publicitaires, réseaux sociaux", desc: "Analyse des campagnes marketing virales et des comportements consommateurs." },
          { code: '6d', cat: 'management_rh', sci: 1, lit: 2, titre: "Articles de leadership, psychologie du travail, gestion des talents", desc: "Innovations managériales et bien-être des équipes au travail." },
          { code: '6e', cat: 'recherche_sciences', sci: 3, lit: 1, titre: "Revues scientifiques, vulgarisation de haut niveau, rapports universitaires", desc: "Publications académiques, découvertes de pointe et recherche fondamentale." },
          { code: '6f', cat: 'impact_juridique', sci: 0, lit: 3, titre: "Analyses géopolitiques, réformes du droit, rapports d'ONG, politiques publiques de développement", desc: "Évolutions des traités internationaux, jurisprudences et impact sociétal." },
        ]
      },
      {
        ordre: 7,
        texte: "Si vous deviez définir votre ambition professionnelle d'ici 5 ans, elle ressemblerait à :",
        options: [
          { code: '7a', cat: 'tech_ingenierie', sci: 3, lit: 0, titre: "Architecte technique / Lead Developer reconnu pour son savoir-faire d'exception", desc: "Piloter la conception technique de grands projets technologiques." },
          { code: '7b', cat: 'analytique_finance', sci: 2, lit: 1, titre: "Directeur financier, auditeur senior ou gestionnaire de fonds influent", desc: "Prendre en main la gestion financière et la stratégie d'investissements." },
          { code: '7c', cat: 'comm_marketing', sci: 0, lit: 3, titre: "Directeur marketing ou entrepreneur ayant fondé son agence ou sa marque", desc: "Conduire la croissance commerciale d'une marque forte." },
          { code: '7d', cat: 'management_rh', sci: 1, lit: 2, titre: "Directeur des ressources humaines ou directeur général pilotant de grandes équipes", desc: "Assurer la gouvernance humaine et l'excellence opérationnelle collective." },
          { code: '7e', cat: 'recherche_sciences', sci: 3, lit: 1, titre: "Docteur ou expert scientifique de référence dans son domaine de spécialisation", desc: "Diriger des travaux de recherche novateurs et enseigner au plus haut niveau." },
          { code: '7f', cat: 'impact_juridique', sci: 0, lit: 3, titre: "Avocat d'affaires, haut magistrat ou cadre dirigeant au sein d'une institution multilatérale", desc: "Défendre l'état de droit et réguler les relations économiques d'envergure." },
        ]
      }
    ];

    for (const q of qEtudiant1) {
      const qRes = await query(`
        INSERT INTO questions_etudiants_1 (que_texte, que_ordre, que_pts_sci, que_pts_lit)
        VALUES ($1, $2, $3, $4) RETURNING que_id;
      `, [cleanString(q.texte), q.ordre, 3, 3]);
      const queId = qRes.rows[0].que_id;

      for (const opt of q.options) {
        await query(`
          INSERT INTO reponses_etudiants_1 (rep_que_id, rep_code, rep_titre, rep_description, rep_pt_sci, rep_pt_lit, rep_categorie)
          VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [queId, opt.code, cleanString(opt.titre), cleanString(opt.desc), opt.sci, opt.lit, opt.cat]);
      }
    }

    // -----------------------------------------------------------------
    // 5. QUESTIONS ET RÉPONSES ÉTUDIANTS 2 (Domaines d'excellence & Aptitudes)
    // -----------------------------------------------------------------
    console.log('5. Insertion des questions et options pour Étudiant Test 2...');
    await query('DELETE FROM questions_etudiants_2;');

    const qEt2_1 = await query(`
      INSERT INTO questions_etudiants_2 (que_texte, que_ordre, que_pts_sci, que_pts_lit)
      VALUES ($1, $2, $3, $4) RETURNING que_id;
    `, ["Sélectionnez vos domaines d'études ou spécialisations d'excellence universitaire", 1, 3, 3]);
    const queIdEt2_1 = qEt2_1.rows[0].que_id;

    const optEt2_1 = [
      { code: 'dom_informatique', pole: 'pole_tech', sci: 3, lit: 0, titre: "Informatique, IA & Systèmes d'Information", desc: "Développement web, architecture de données, intelligence artificielle et cybersécurité." },
      { code: 'dom_finance_audit', pole: 'pole_finance', sci: 2, lit: 1, titre: "Finance d'Entreprise, Audit & Comptabilité", desc: "Contrôle de gestion, normes IFRS, analyse des états financiers et audit légal." },
      { code: 'dom_ingenierie_btp', pole: 'pole_tech', sci: 3, lit: 0, titre: "Sciences de l'Ingénieur, Industrie & BTP", desc: "Calcul de structures, génie mécanique, électrotechnique et chantiers de construction." },
      { code: 'dom_mkt_comm', pole: 'pole_business', sci: 0, lit: 3, titre: "Marketing Digital, Communication & E-Commerce", desc: "Acquisition de trafic, gestion de communauté, relations publiques et publicité en ligne." },
      { code: 'dom_rh_management', pole: 'pole_management', sci: 1, lit: 2, titre: "Management, Organisation & Ressources Humaines", desc: "Recrutement, gestion des compétences, dialogue social et pilotage de projets." },
      { code: 'dom_droit_fiscalite', pole: 'pole_droit', sci: 0, lit: 3, titre: "Droit des Affaires, Fiscalité & Conformité", desc: "Sécurité juridique des contrats, contentieux, fiscalité des sociétés et conformité." },
      { code: 'dom_sciences_sante', pole: 'pole_sciences', sci: 3, lit: 1, titre: "Sciences Médicales, Santé & Biotechnologies", desc: "Biologie, médecine, pharmacie, santé publique et recherche biomédicale." },
      { code: 'dom_agro_env', pole: 'pole_sciences', sci: 3, lit: 1, titre: "Agronomie, Foresterie & Développement Durable", desc: "Filières agricoles, valorisation des ressources naturelles et conservation des forêts." },
      { code: 'dom_logistique_inter', pole: 'pole_business', sci: 1, lit: 2, titre: "Logistique, Supply Chain & Commerce International", desc: "Gestion des expéditions, dédouanement maritime/aérien et chaîne d'approvisionnement." },
      { code: 'dom_economie_data', pole: 'pole_finance', sci: 2, lit: 1, titre: "Économie, Statistiques & Politiques Publiques", desc: "Modélisation économétrique, analyse d'impact macroéconomique et politiques de développement." },
    ];

    for (const opt of optEt2_1) {
      await query(`
        INSERT INTO reponses_etudiants_2 (rep_que_id, rep_code, rep_titre, rep_description, rep_pt_sci, rep_pt_lit, rep_pole)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `, [queIdEt2_1, opt.code, cleanString(opt.titre), cleanString(opt.desc), opt.sci, opt.lit, opt.pole]);
    }

    const qEt2_2 = await query(`
      INSERT INTO questions_etudiants_2 (que_texte, que_ordre, que_pts_sci, que_pts_lit)
      VALUES ($1, $2, $3, $4) RETURNING que_id;
    `, ["Auto-évaluation de vos aptitudes opérationnelles clés pour votre insertion", 2, 2, 2]);
    const queIdEt2_2 = qEt2_2.rows[0].que_id;

    const optEt2_2 = [
      { code: 'apt_analytique_data', pole: 'pole_finance', sci: 2, lit: 0, titre: "Analyse quantitative, rigueur chiffrée & modélisation", desc: "Facilité à traiter des volumes de données, interpréter des bilans ou extraire des tendances statistiques." },
      { code: 'apt_gestion_projet', pole: 'pole_management', sci: 1, lit: 1, titre: "Gestion de projet, planification & tenue des délais", desc: "Aisance pour définir un rétroplanning, structurer des jalons et coordonner la réalisation d'objectifs." },
      { code: 'apt_communication_pitch', pole: 'pole_business', sci: 0, lit: 2, titre: "Aisance oratoire, négociation & pitch de soutenance", desc: "Facilité à captiver un auditoire, présenter des idées avec clarté et défendre une proposition à l'oral." },
      { code: 'apt_redaction_synthese', pole: 'pole_droit', sci: 0, lit: 2, titre: "Rédaction professionnelle, esprit de synthèse & rapports", desc: "Capacité à formuler des documents clairs, précis, sans fautes, et à vulgariser des sujets denses." },
      { code: 'apt_outils_numeriques', pole: 'pole_tech', sci: 2, lit: 0, titre: "Maîtrise des technologies, IA & logiciels spécialisés", desc: "Rapidité d'adoption des nouveaux outils digitaux, programmation ou logiciels avancés de votre discipline." },
      { code: 'apt_leadership_collectif', pole: 'pole_management', sci: 0, lit: 2, titre: "Intelligence émotionnelle, travail d'équipe & leadership", desc: "Aptitude naturelle à écouter, encourager la coopération et surmonter les blocages collectifs." },
    ];

    for (const opt of optEt2_2) {
      await query(`
        INSERT INTO reponses_etudiants_2 (rep_que_id, rep_code, rep_titre, rep_description, rep_pt_sci, rep_pt_lit, rep_pole)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `, [queIdEt2_2, opt.code, cleanString(opt.titre), cleanString(opt.desc), opt.sci, opt.lit, opt.pole]);
    }

    // -----------------------------------------------------------------
    // 6. QUESTIONS ET RÉPONSES EMPLOI 1
    // -----------------------------------------------------------------
    console.log('6. Insertion des questions et options pour Emploi Test 1...');
    await query('DELETE FROM questions_emploi_1;');

    const qEmploi1 = [
      {
        ordre: 1,
        texte: "Quel est votre objectif principal pour trouver un travail qui vous correspond aujourd'hui ?",
        options: [
          { code: '1a', cat: 'tech_numerique', sci: 3, lit: 0, titre: "Apprendre et exercer un métier d'avenir, moderne et très demandé dans le numérique", desc: "Acquérir des compétences techniques valorisées sur le marché digital." },
          { code: '1b', cat: 'entrepreneuriat_agri', sci: 2, lit: 1, titre: "Créer ma propre activité, gagner mon indépendance et développer un projet rentable", desc: "Développer une source de revenus autonome et pérenne." },
          { code: '1c', cat: 'management_conseil', sci: 1, lit: 2, titre: "Coordonner des projets, organiser le travail d'équipe et prendre des responsabilités", desc: "Assurer la coordination opérationnelle et le suivi rigoureux." },
          { code: '1d', cat: 'impact_vert_rse', sci: 2, lit: 2, titre: "Trouver un travail utile avec du sens, qui contribue concrètement à la société malgache", desc: "Participer à l'essor économique et écologique de la communauté." },
          { code: '1e', cat: 'formation_rh_humain', sci: 0, lit: 3, titre: "Mettre l'humain au cœur de mon activité : former, conseiller, recruter et accompagner", desc: "Accompagner les personnes dans leur développement et leur orientation." },
          { code: '1f', cat: 'expertise_terrain_qualite', sci: 3, lit: 0, titre: "Avoir un métier concret et pragmatique, avec des résultats visibles chaque jour sur le terrain", desc: "Mener des interventions tangibles avec efficacité et méthode." },
        ]
      },
      {
        ordre: 2,
        texte: "Quelle est votre posture face aux nouveaux apprentissages et aux défis professionnels ?",
        options: [
          { code: '2a', cat: 'entrepreneuriat_agri', sci: 2, lit: 1, titre: "Audacieux et débrouillard : je teste sur le terrain, apprends de mes erreurs et persévère", desc: "Apprendre par l'expérimentation directe et l'adaptabilité." },
          { code: '2b', cat: 'tech_numerique', sci: 3, lit: 0, titre: "Curieux et méthodique : je me forme avec rigueur sur des compétences concrètes et recherchées", desc: "Structurer ses compétences pas à pas avec discipline." },
          { code: '2c', cat: 'management_conseil', sci: 1, lit: 2, titre: "Structuré et analytique : j'évalue les priorités et organise un plan par étapes claires", desc: "Définir une méthode et mesurer chaque avancée avec objectivité." },
          { code: '2d', cat: 'impact_vert_rse', sci: 2, lit: 2, titre: "Passionné et engagé : je m'investis sans compter si la mission correspond à mes valeurs", desc: "Donner le meilleur de soi pour une vision collective vertueuse." },
          { code: '2e', cat: 'formation_rh_humain', sci: 0, lit: 3, titre: "Écoute et bienveillance : je progresse au contact des autres et par l'échange d'expériences", desc: "Grandir grâce au partage humain et aux retours constructifs." },
          { code: '2f', cat: 'expertise_terrain_qualite', sci: 3, lit: 0, titre: "Pragmatique et réaliste : je privilégie les activités solides et indispensables au quotidien", desc: "Privilégier la solidité opérationnelle et les besoins concrets immédiats." },
        ]
      },
      {
        ordre: 3,
        texte: "Dans quel type d'environnement quotidien vous projetez-vous le plus ?",
        options: [
          { code: '3a', cat: 'tech_numerique', sci: 3, lit: 0, titre: "Environnement connecté, outils digitaux modernes, travail en équipe agile ou hybride", desc: "Bureaux connectés, télétravail ou espaces de coworking modernes." },
          { code: '3b', cat: 'entrepreneuriat_agri', sci: 2, lit: 1, titre: "Mon propre espace ou commerce, sur le terrain au contact direct de mes clients", desc: "Point de vente, atelier personnel ou exploitation de proximité." },
          { code: '3c', cat: 'management_conseil', sci: 1, lit: 2, titre: "Entreprises dynamiques, suivi de projets, réunions de coordination et planification", desc: "Services administratifs et opérationnels structurés." },
          { code: '3d', cat: 'impact_vert_rse', sci: 2, lit: 2, titre: "Au sein d'une ONG, d'un projet écologique ou sur le terrain auprès des communautés", desc: "Actions communautaires de proximité et préservation de l'environnement." },
          { code: '3e', cat: 'formation_rh_humain', sci: 0, lit: 3, titre: "Espaces d'échange, entretiens individuels, centres de formation ou départements RH", desc: "Lieux d'apprentissage, d'accueil et d'orientation." },
          { code: '3f', cat: 'expertise_terrain_qualite', sci: 3, lit: 0, titre: "Plateforme logistique, entrepôt, atelier de production ou chantiers opérationnels", desc: "Sites de fabrication, dépôts logistiques et zones techniques." },
        ]
      },
      {
        ordre: 4,
        texte: "Quelle est votre plus grande force personnelle à faire valoir auprès d'un recruteur ou de clients ?",
        options: [
          { code: '4a', cat: 'management_conseil', sci: 1, lit: 2, titre: "Mon sens de l'organisation, de la rigueur et de la coordination de plusieurs tâches", desc: "Garantir un travail méthodique sans oubli ni retard." },
          { code: '4b', cat: 'tech_numerique', sci: 3, lit: 0, titre: "Mon aisance avec le numérique, mon esprit logique et ma rapidité d'apprentissage", desc: "Assimiler rapidement de nouveaux logiciels et outils techniques." },
          { code: '4c', cat: 'entrepreneuriat_agri', sci: 2, lit: 1, titre: "Mon sens du contact, mon autonomie, mon énergie commerciale et mon sens de la négociation", desc: "Créer des opportunités de vente et fidéliser les clients." },
          { code: '4d', cat: 'formation_rh_humain', sci: 0, lit: 3, titre: "Ma pédagogie, ma patience, mon sens de l'écoute et ma capacité à motiver autrui", desc: "Créer de la confiance et faire monter les équipes en compétences." },
          { code: '4e', cat: 'impact_vert_rse', sci: 2, lit: 2, titre: "Mon intégrité, mon sérieux et mon engagement envers des causes utiles pour la société", desc: "Faire preuve d'un dévouement sans faille pour les valeurs d'équité." },
          { code: '4f', cat: 'expertise_terrain_qualite', sci: 3, lit: 0, titre: "Mon sens pratique, mon souci du travail bien fait et mon efficacité sur le terrain", desc: "Résoudre les problèmes techniques avec robustesse et rapidité." },
        ]
      },
      {
        ordre: 5,
        texte: "Quel format d'apprentissage ou d'accompagnement vous intéresserait le plus pour trouver votre voie ?",
        options: [
          { code: '5a', cat: 'tech_numerique', sci: 3, lit: 0, titre: "Une formation pratique et intensive de 3 à 6 mois (développement web, data, outils numériques)", desc: "Acquérir rapidement des bases techniques appliquées directement aux projets." },
          { code: '5b', cat: 'entrepreneuriat_agri', sci: 2, lit: 1, titre: "Des ateliers pratiques de business plan, gestion de budget, vente et démarches concrètes", desc: "Apprendre à chiffrer, vendre et gérer sa propre entreprise au quotidien." },
          { code: '5c', cat: 'management_conseil', sci: 1, lit: 2, titre: "Une formation certifiante en gestion de projet, coordination d'équipe et organisation", desc: "Valider une méthode de conduite d'opérations et de suivi rigoureux." },
          { code: '5d', cat: 'impact_vert_rse', sci: 2, lit: 2, titre: "Des modules spécialisés en gestion de projets associatifs, RSE ou protection environnementale", desc: "Maîtriser les méthodologies d'impact durable et de reporting sociétal." },
          { code: '5e', cat: 'formation_rh_humain', sci: 0, lit: 3, titre: "Des techniques d'animation d'ateliers, de recrutement et de communication interpersonnelle", desc: "Pratiquer les méthodes d'écoute, de coaching et d'évaluation des compétences." },
          { code: '5f', cat: 'expertise_terrain_qualite', sci: 3, lit: 0, titre: "Des formations en gestion des stocks, logiciels de gestion (ERP/Excel) et normes de qualité", desc: "Maîtriser les processus de chaîne logistique et de conformité opérationnelle." },
        ]
      },
      {
        ordre: 6,
        texte: "Face à un problème imprévu ou une difficulté au travail, quelle est votre réaction spontanée ?",
        options: [
          { code: '6a', cat: 'tech_numerique', sci: 3, lit: 0, titre: "Je cherche la cause logique, teste différentes pistes avec méthode et cherche à fiabiliser", desc: "Remonter à la source de la panne informatique ou de la défaillance logique." },
          { code: '6b', cat: 'entrepreneuriat_agri', sci: 2, lit: 1, titre: "Je trouve une solution alternative immédiate, pragmatique et peu coûteuse sans attendre", desc: "Agir avec débrouillardise pour ne pas bloquer l'activité." },
          { code: '6c', cat: 'management_conseil', sci: 1, lit: 2, titre: "Je rassemble les faits, consulte les personnes concernées et établis un plan d'action clair", desc: "Prendre du recul pour décider en concertation avec l'équipe." },
          { code: '6d', cat: 'formation_rh_humain', sci: 0, lit: 3, titre: "Je privilégie le dialogue et la bienveillance pour comprendre le blocage et motiver la personne", desc: "Désamorcer les tensions et restaurer un climat de coopération serein." },
          { code: '6e', cat: 'impact_vert_rse', sci: 2, lit: 2, titre: "Je m'assure que la solution choisie respecte les personnes et apporte un bénéfice équitable", desc: "Protéger l'éthique et les intérêts durables de la collectivité." },
          { code: '6f', cat: 'expertise_terrain_qualite', sci: 3, lit: 0, titre: "Je vais directement voir sur place pour comprendre le dysfonctionnement et le réparer", desc: "Constater sur le terrain l'anomalie matérielle et intervenir." },
        ]
      },
      {
        ordre: 7,
        texte: "À quoi ressemblerait votre réussite professionnelle idéale d'ici 3 ans ?",
        options: [
          { code: '7a', cat: 'entrepreneuriat_agri', sci: 2, lit: 1, titre: "Avoir développé ma propre activité autonome et rentable qui me procure fierté et liberté", desc: "Gérer avec succès sa propre entreprise et créer de la valeur à Madagascar." },
          { code: '7b', cat: 'tech_numerique', sci: 3, lit: 0, titre: "Exercer un métier stimulant dans le numérique, avec un bon salaire et de solides débouchés", desc: "Évoluer au sein d'une équipe tech dynamique et innovante." },
          { code: '7c', cat: 'management_conseil', sci: 1, lit: 2, titre: "Occuper un rôle de coordinateur ou chargé de projet respecté pour sa méthode et ses résultats", desc: "Être le pivot organisationnel d'une structure en développement." },
          { code: '7d', cat: 'impact_vert_rse', sci: 2, lit: 2, titre: "Avoir un impact positif concret sur les conditions de vie et l'environnement à Madagascar", desc: "Constater les retombées bénéfiques d'initiatives solidaires locales." },
          { code: '7e', cat: 'formation_rh_humain', sci: 0, lit: 3, titre: "Avoir formé, recruté et aidé de nombreuses personnes à réussir dans leur propre parcours", desc: "Participer à l'épanouissement professionnel de centaines d'actifs." },
          { code: '7f', cat: 'expertise_terrain_qualite', sci: 3, lit: 0, titre: "Maîtriser une activité opérationnelle fluide et efficace, reconnue pour sa rigueur et sa qualité", desc: "Assurer la fiabilité absolue des processus physiques et logistiques." },
        ]
      }
    ];

    for (const q of qEmploi1) {
      const qRes = await query(`
        INSERT INTO questions_emploi_1 (que_texte, que_ordre, que_pts_sci, que_pts_lit)
        VALUES ($1, $2, $3, $4) RETURNING que_id;
      `, [cleanString(q.texte), q.ordre, 3, 3]);
      const queId = qRes.rows[0].que_id;

      for (const opt of q.options) {
        await query(`
          INSERT INTO reponses_emploi_1 (rep_que_id, rep_code, rep_titre, rep_description, rep_pt_sci, rep_pt_lit, rep_categorie)
          VALUES ($1, $2, $3, $4, $5, $6, $7);
        `, [queId, opt.code, cleanString(opt.titre), cleanString(opt.desc), opt.sci, opt.lit, opt.cat]);
      }
    }

    // -----------------------------------------------------------------
    // 7. QUESTIONS ET RÉPONSES EMPLOI 2 (Compétences professionnelles & Pôles)
    // -----------------------------------------------------------------
    console.log('7. Insertion des questions et options pour Emploi Test 2...');
    await query('DELETE FROM questions_emploi_2;');

    const qEm2_1 = await query(`
      INSERT INTO questions_emploi_2 (que_texte, que_ordre, que_pts_sci, que_pts_lit)
      VALUES ($1, $2, $3, $4) RETURNING que_id;
    `, ["Sélectionnez vos domaines de compétences transférables ou d'expérience clé", 1, 3, 3]);
    const queIdEm2_1 = qEm2_1.rows[0].que_id;

    const optEm2_1 = [
      { code: 'dom_orga_projets', pole: 'pole_conseil_management', sci: 1, lit: 1, titre: "Organisation, Méthode & Planification", desc: "Suivi de plannings, gestion des priorités, respect des consignes et organisation méthodique." },
      { code: 'dom_finance_gestion', pole: 'pole_conseil_management', sci: 2, lit: 1, titre: "Chiffres, Calculs & Notions de Gestion", desc: "Calculs de coûts, factures, gestion de petites caisses, sens de la rigueur chiffrée." },
      { code: 'dom_vente_negociation', pole: 'pole_entrepreneuriat', sci: 1, lit: 2, titre: "Contact Client, Vente & Négociation", desc: "Sens de l'accueil, argumentation commerciale, persuasion et fidélisation de clients." },
      { code: 'dom_management_equipe', pole: 'pole_rh_formation', sci: 0, lit: 2, titre: "Communication, Écoute & Animation de Groupe", desc: "Aisance pour animer un groupe, faciliter l'entraide et motiver ses pairs." },
      { code: 'dom_outils_digitaux', pole: 'pole_tech_digital', sci: 3, lit: 0, titre: "Outils Numériques, Bureautique & Internet", desc: "Bureautique (Word, Excel), navigation web efficace, réseaux sociaux et outils en ligne." },
      { code: 'dom_redaction_langues', pole: 'pole_tech_digital', sci: 0, lit: 3, titre: "Expression Écrite, Synthèse & Langues", desc: "Rédaction soignée, clarté d'expression en français et/ou anglais, esprit de synthèse." },
      { code: 'dom_technique_terrain', pole: 'pole_logistique_supply', sci: 2, lit: 0, titre: "Logistique, Organisation Pratique & Stocks", desc: "Comptage d'inventaires, rangement rigoureux, manipulation de colis, contrôle physique." },
      { code: 'dom_pedagogie_formation', pole: 'pole_rh_formation', sci: 0, lit: 3, titre: "Pédagogie, Conseil & Transmission de Savoir", desc: "Capacité à expliquer clairement une tâche, former de nouveaux collègues avec patience." },
    ];

    for (const opt of optEm2_1) {
      await query(`
        INSERT INTO reponses_emploi_2 (rep_que_id, rep_code, rep_titre, rep_description, rep_pt_sci, rep_pt_lit, rep_pole)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `, [queIdEm2_1, opt.code, cleanString(opt.titre), cleanString(opt.desc), opt.sci, opt.lit, opt.pole]);
    }

    const qEm2_2 = await query(`
      INSERT INTO questions_emploi_2 (que_texte, que_ordre, que_pts_sci, que_pts_lit)
      VALUES ($1, $2, $3, $4) RETURNING que_id;
    `, ["Évaluez vos atouts personnels d'employabilité et de réussite professionnelle", 2, 2, 2]);
    const queIdEm2_2 = qEm2_2.rows[0].que_id;

    const optEm2_2 = [
      { code: 'apt_autonomie_debrouille', pole: 'pole_entrepreneuriat', sci: 1, lit: 1, titre: "Autonomie, sens des initiatives & débrouillardise", desc: "Capacité à avancer seul sur ses missions sans attendre qu'on me dise quoi faire à chaque étape." },
      { code: 'apt_rigueur_precision', pole: 'pole_conseil_management', sci: 2, lit: 0, titre: "Rigueur, ponctualité & précision du travail", desc: "Respect des horaires, souci du travail bien fait du premier coup et vigilance sur les détails." },
      { code: 'apt_relationnel_empathie', pole: 'pole_rh_formation', sci: 0, lit: 2, titre: "Aisance relationnelle, écoute active & diplomatie", desc: "Facilité pour créer du lien, désamorcer les tensions et collaborer avec respect et courtoisie." },
      { code: 'apt_apprentissage_continu', pole: 'pole_tech_digital', sci: 2, lit: 1, titre: "Curiosité, envie d'apprendre & adaptabilité", desc: "Enthousiasme à découvrir de nouvelles méthodes, apprendre un métier différent ou changer d'outils." },
      { code: 'apt_sens_responsabilite', pole: 'pole_conseil_management', sci: 1, lit: 1, titre: "Sens des responsabilités & fiabilité sans faille", desc: "Tenue des engagements pris, honnêteté professionnelle et fidélité à la parole donnée." },
      { code: 'apt_resistance_stress', pole: 'pole_logistique_supply', sci: 1, lit: 1, titre: "Gestion du stress & persévérance face aux imprévus", desc: "Capacité à garder son calme lors des périodes d'affluence ou face aux pannes techniques." },
    ];

    for (const opt of optEm2_2) {
      await query(`
        INSERT INTO reponses_emploi_2 (rep_que_id, rep_code, rep_titre, rep_description, rep_pt_sci, rep_pt_lit, rep_pole)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `, [queIdEm2_2, opt.code, cleanString(opt.titre), cleanString(opt.desc), opt.sci, opt.lit, opt.pole]);
    }

    // -----------------------------------------------------------------
    // 8. RATTACHEMENT DES TESTS EXISTANTS AVEC LEUR CAR_ID
    // -----------------------------------------------------------------
    console.log('8. Mise à jour des car_id dans les tests existants des utilisateurs...');

    // Étudiant 1
    await query(`
      UPDATE tests_etudiants_1 tet1
      SET tet1_car_id = c.car_id,
          tet1_pts_sci = c.car_pts_sci_min,
          tet1_pts_lit = c.car_pts_lit_min
      FROM caracteristiques_etudiants_1 c
      WHERE (tet1.tet1_ori_pro_1 ILIKE '%' || c.car_short_nom || '%' 
         OR tet1.tet1_ori_pro_1 ILIKE '%' || c.car_nom || '%')
        AND (tet1.tet1_car_id IS NULL OR tet1.tet1_car_id = 0);
    `);

    // Étudiant 2
    await query(`
      UPDATE tests_etudiants_2 tet2
      SET tet2_car_id = c.car_id,
          tet2_pts_sci = c.car_pts_sci_min,
          tet2_pts_lit = c.car_pts_lit_min
      FROM caracteristiques_etudiants_2 c
      WHERE (tet2.tet2_ori_pro_2 ILIKE '%' || c.car_short_nom || '%' 
         OR tet2.tet2_ori_pro_2 ILIKE '%' || c.car_nom || '%')
        AND (tet2.tet2_car_id IS NULL OR tet2.tet2_car_id = 0);
    `);

    // Emploi 1
    await query(`
      UPDATE tests_emploi_1 tem1
      SET tem1_car_id = c.car_id,
          tem1_pts_sci = c.car_pts_sci_min,
          tem1_pts_lit = c.car_pts_lit_min
      FROM caracteristiques_emploi_1 c
      WHERE (tem1.tem1_ori_pro_1 ILIKE '%' || c.car_short_nom || '%' 
         OR tem1.tem1_ori_pro_1 ILIKE '%' || c.car_nom || '%')
        AND (tem1.tem1_car_id IS NULL OR tem1.tem1_car_id = 0);
    `);

    // Emploi 2
    await query(`
      UPDATE tests_emploi_2 tem2
      SET tem2_car_id = c.car_id,
          tem2_pts_sci = c.car_pts_sci_min,
          tem2_pts_lit = c.car_pts_lit_min
      FROM caracteristiques_emploi_2 c
      WHERE (tem2.tem2_ori_pro_2 ILIKE '%' || c.car_short_nom || '%' 
         OR tem2.tem2_ori_pro_2 ILIKE '%' || c.car_nom || '%')
        AND (tem2.tem2_car_id IS NULL OR tem2.tem2_car_id = 0);
    `);

    console.log('✅ Migration complète des questions, réponses et caractéristiques terminée avec succès !');
  } catch (err) {
    console.error('❌ Erreur lors de la migration :', err);
    throw err;
  }
}

if (require.main === module) {
  runMigration().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { runMigration };
