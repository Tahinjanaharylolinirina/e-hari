// ========================================================
// TESTS D'ORIENTATION ET D'INSERTION PROFESSIONNELLE ÉTUDIANT
// Inspiré de l'espace élève et adapté à l'enseignement supérieur
// Plateforme e-HARI (ONG HARI Madagascar)
// ========================================================

// ========================================================
// 1. TEST 1 : PERSONNALITÉ PROFESSIONNELLE & AFFINITÉS DE CARRIÈRE
// ========================================================

export const TEST_ETUDIANT_INTERETS_CATEGORIES = {
  tech_ingenierie: {
    key: 'tech_ingenierie',
    label: 'Profil Bâtisseur, Concepteur & Ingénieur',
    shortLabel: 'Ingénierie & Systèmes',
    icon: '⚙️',
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#93c5fd',
    oriPro: 'Ingénierie, Technologies & Systèmes Complexes',
    badge: 'Bâtisseur Technologique',
    description:
      'Vous êtes doté d\'un esprit logique, structuré et passionné par la résolution de problèmes concrets. Vous aimez concevoir, programmer, bâtir des architectures robustes et transformer des idées en solutions fonctionnelles.',
    forces: [
      'Conception et modélisation technique',
      'Rigueur d\'exécution et sens du détail',
      'Maîtrise des environnements technologiques',
      'Résolution méthodique des incidents complexes',
    ],
    debouches: [
      'Ingénieur Logiciel & Développeur Full-Stack',
      'Ingénieur Réseaux, Cloud & Cybersécurité',
      'Chef de Projet Technique / Data Engineer',
      'Ingénieur Génie Civil, Électromécanique & Énergies',
    ],
  },
  analytique_finance: {
    key: 'analytique_finance',
    label: 'Profil Stratège, Analyste & Décideur',
    shortLabel: 'Finance & Stratégie',
    icon: '📊',
    color: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    oriPro: 'Finance d\'Entreprise, Audit, Data & Stratégie',
    badge: 'Stratège Analytique',
    description:
      'Vous possédez un sens aigu des chiffres, de la rentabilité et de la prospective. Vous savez décrypter les indicateurs financiers, anticiper les risques de marché et éclairer les décisions stratégiques par la donnée.',
    forces: [
      'Analyse quantitative et modélisation financière',
      'Vision stratégique globale et gestion des risques',
      'Esprit critique et rigueur méthodologique',
      'Optimisation des processus et rentabilité',
    ],
    debouches: [
      'Analyste Financier / Auditeur Externe & Contrôleur de Gestion',
      'Data Analyst / Business Intelligence Specialist',
      'Gestionnaire de Portefeuille / Consultant en Stratégie',
      'Expert-Comptable / Directeur Administratif & Financier',
    ],
  },
  comm_marketing: {
    key: 'comm_marketing',
    label: 'Profil Communicant, Développeur & Négociateur',
    shortLabel: 'Marketing & Business',
    icon: '🚀',
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fcd34d',
    oriPro: 'Marketing Digital, Communication & Développement Commercial',
    badge: 'Innovateur Commercial',
    description:
      'Dynamique, persuasif et créatif, vous comprenez instinctivement les attentes du marché et de vos interlocuteurs. Vous excellez dans l\'art de convaincre, de créer du lien et de promouvoir des projets innovants.',
    forces: [
      'Aisance relationnelle et force de conviction',
      'Stratégie de marque et marketing digital',
      'Créativité appliquée aux opportunités d\'affaires',
      'Négociation commerciale et développement de partenariats',
    ],
    debouches: [
      'Responsable Marketing Digital & Growth Manager',
      'Business Developer / Key Account Manager',
      'Consultant en Communication & Relations Publiques',
      'Brand Manager / Chef de Produit Innovant',
    ],
  },
  management_rh: {
    key: 'management_rh',
    label: 'Profil Leader, Fédérateur & Gestionnaire de Talents',
    shortLabel: 'Leadership & RH',
    icon: '🤝',
    color: '#7c3aed',
    bgColor: '#faf5ff',
    borderColor: '#d8b4fe',
    oriPro: 'Management des Organisations, RH & Gouvernance',
    badge: 'Leader Fédérateur',
    description:
      'Vous êtes guidé par l\'intelligence émotionnelle, le sens des responsabilités et la coordination d\'équipe. Vous savez motiver les collaborateurs, organiser le travail collectif et maintenir un climat de confiance.',
    forces: [
      'Leadership bienveillant et sens du collectif',
      'Recrutement, formation et développement des compétences',
      'Médiation, négociation sociale et résolution de conflits',
      'Gestion du changement et culture d\'entreprise',
    ],
    debouches: [
      'Responsable des Ressources Humaines (RRH)',
      'Chef de Projet Organisationnel & Conduite du Changement',
      'Consultant en Recrutement & Chasse de Tête',
      'Manager d\'Équipe / Directeur des Opérations',
    ],
  },
  recherche_sciences: {
    key: 'recherche_sciences',
    label: 'Profil Chercheur, Expert Scientifique & Explorateur',
    shortLabel: 'Recherche & Expertise',
    icon: '🔬',
    color: '#0891b2',
    bgColor: '#ecfeff',
    borderColor: '#a5f3fc',
    oriPro: 'Recherche Scientifique, R&D & Expertise Sectorielle',
    badge: 'Expert Chercheur',
    description:
      'Curieux insatiable et rigoureux, vous êtes animé par la soif de comprendre les lois fondamentales, de faire progresser les connaissances et de concevoir des expérimentations scientifiques approfondies.',
    forces: [
      'Raisonnement scientifique et démarche d\'investigation',
      'Veille documentaire et analyse de publications de pointe',
      'Patience, esprit critique et objectivité',
      'Rdaction de synthèses scientifiques et publications',
    ],
    debouches: [
      'Chercheur en Laboratoire / Enseignant-Chercheur',
      'Ingénieur R&D / Spécialiste Biotechnologies',
      'Biochimiste / Épidémiologiste / Consultant Environnemental',
      'Expert en Normalisation, Qualité & Brevets',
    ],
  },
  impact_juridique: {
    key: 'impact_juridique',
    label: 'Profil Défenseur, Juriste & Acteur du Développement',
    shortLabel: 'Droit & Impact Social',
    icon: '⚖️',
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fca5a5',
    oriPro: 'Droit des Affaires, Gouvernance & Impact Économique',
    badge: 'Défenseur d\'Impact',
    description:
      'Attaché à la justice, à la rigueur des règles et à l\'impact sociétal, vous mettez votre maîtrise des textes et votre sens civique au service de la conformité, de la protection des droits et du développement.',
    forces: [
      'Analyse juridique pointue et argumentation structurée',
      'Éthique professionnelle et sens de la conformité',
      'Négociation contractuelle et défense des intérêts',
      'Compréhension des politiques publiques et ONG',
    ],
    debouches: [
      'Juriste d\'Entreprise / Avocat d\'Affaires / Magistrat',
      'Responsable Conformité (Compliance Officer) & RSE',
      'Chargé de Programme dans une ONG Internationale / Diplomate',
      'Conseiller Juridique & Fiscal / Expert Marchés Publics',
    ],
  },
};

export const TEST_ETUDIANT_INTERETS_QUESTIONS = [
  {
    id: 1,
    question: "Dans le cadre d'un projet universitaire majeur ou d'un mémoire de fin d'études, quel rôle prenez-vous spontanément ?",
    options: [
      {
        id: '1a',
        category: 'tech_ingenierie',
        icon: '💻',
        title: 'Le référent technique ou concepteur',
        desc: 'Développer le prototype, programmer les modules, concevoir l\'architecture ou valider la faisabilité technique.',
      },
      {
        id: '1b',
        category: 'analytique_finance',
        icon: '📈',
        title: 'L\'analyste financier et modélisateur',
        desc: 'Établir le budget prévisionnel, analyser les données statistiques et chiffrer précisément la viabilité du projet.',
      },
      {
        id: '1c',
        category: 'comm_marketing',
        icon: '🎤',
        title: 'Le communicant et présentateur',
        desc: 'Préparer la soutenance, concevoir le support visuel percutant et pitcher le projet pour convaincre le jury.',
      },
      {
        id: '1d',
        category: 'management_rh',
        icon: '🤝',
        title: 'Le coordinateur d\'équipe et facilitateur',
        desc: 'Répartir équitablement les tâches, planifier le calendrier, motiver les collègues et veiller à la cohésion.',
      },
      {
        id: '1e',
        category: 'recherche_sciences',
        icon: '📚',
        title: 'Le chercheur de fond et documentaliste',
        desc: 'Explorer la littérature scientifique internationale, vérifier les sources et poser des hypothèses solides.',
      },
      {
        id: '1f',
        category: 'impact_juridique',
        icon: '⚖️',
        title: 'Le garant de la conformité et de l\'éthique',
        desc: 'Vérifier la légalité, sécuriser les aspects réglementaires et mesurer l\'impact sociétal ou environnemental.',
      },
    ],
  },
  {
    id: 2,
    question: "Parmi ces types d'entreprises ou structures professionnelles, laquelle vous attire le plus pour votre stage ou premier emploi ?",
    options: [
      {
        id: '2a',
        category: 'tech_ingenierie',
        icon: '🚀',
        title: 'Une entreprise technologique ou un bureau d\'ingénierie',
        desc: 'Un environnement d\'innovation où l\'on code, construit et conçoit des infrastructures de pointe.',
      },
      {
        id: '2b',
        category: 'analytique_finance',
        icon: '🏦',
        title: 'Une institution financière, cabinet d\'audit ou banque d\'affaires',
        desc: 'Un cadre d\'analyse rigoureux orienté vers l\'investissement, le contrôle des risques et la performance chiffrée.',
      },
      {
        id: '2c',
        category: 'comm_marketing',
        icon: '📱',
        title: 'Une agence digitale, un grand groupe commercial ou une start-up',
        desc: 'Un univers dynamique tourné vers l\'acquisition clients, le branding et la conquête de marchés.',
      },
      {
        id: '2d',
        category: 'management_rh',
        icon: '👥',
        title: 'La direction des opérations d\'un groupe ou un cabinet RH',
        desc: 'Une organisation axée sur la gestion humaine, le recrutement des talents et l\'amélioration du travail.',
      },
      {
        id: '2e',
        category: 'recherche_sciences',
        icon: '🔬',
        title: 'Un institut de recherche, laboratoire ou département R&D',
        desc: 'Un lieu dédié à la découverte scientifique, aux brevets et à l\'expérimentation méthodologique.',
      },
      {
        id: '2f',
        category: 'impact_juridique',
        icon: '🏛️',
        title: 'Un cabinet juridique, une grande ONG ou une institution publique',
        desc: 'Une structure d\'envergure engagée dans la défense du droit, la transparence et le développement durable.',
      },
    ],
  },
  {
    id: 3,
    question: "Quelle compétence transversale (Soft Skill) considérez-vous comme votre plus grand atout ?",
    options: [
      {
        id: '3a',
        category: 'tech_ingenierie',
        icon: '🧩',
        title: 'L\'esprit d\'ingénierie et la résolution de bugs',
        desc: 'Votre capacité à comprendre les rouages complexes et à démonter un problème jusqu\'à trouver la solution.',
      },
      {
        id: '3b',
        category: 'analytique_finance',
        icon: '🔍',
        title: 'L\'esprit critique et la maîtrise de la donnée',
        desc: 'Votre habileté à détecter les anomalies dans les tableaux de bord et à tirer des conclusions objectives.',
      },
      {
        id: '3c',
        category: 'comm_marketing',
        icon: '🗣️',
        title: 'L\'art de la persuasion et la négociation',
        desc: 'Votre facilité à capter l\'attention, valoriser une idée et créer une relation de confiance immédiate.',
      },
      {
        id: '3d',
        category: 'management_rh',
        icon: '💡',
        title: 'L\'empathie managériale et l\'écoute active',
        desc: 'Votre aptitude à comprendre les besoins d\'autrui, apaiser les tensions et fédérer un groupe vers un objectif.',
      },
      {
        id: '3e',
        category: 'recherche_sciences',
        icon: '📖',
        title: 'La rigueur d\'investigation et la persévérance',
        desc: 'Votre capacité à approfondir sans relâche un sujet complexe jusqu\'à en maîtriser chaque facette.',
      },
      {
        id: '3f',
        category: 'impact_juridique',
        icon: '⚖️',
        title: 'Le sens de la justice et la clarté argumentative',
        desc: 'Votre rigueur pour structurer une démonstration irréfutable et faire respecter des principes éthiques.',
      },
    ],
  },
  {
    id: 4,
    question: "Face à une urgence professionnelle imprévue (défaillance système, crise client ou blocage d'équipe), quelle est votre attitude réflexe ?",
    options: [
      {
        id: '4a',
        category: 'tech_ingenierie',
        icon: '🛠️',
        title: 'Analyser les logs et réparer le mécanisme',
        desc: 'Identifier immédiatement la panne technique, isoler la défaillance et déployer un correctif stable.',
      },
      {
        id: '4b',
        category: 'analytique_finance',
        icon: '📊',
        title: 'Mesurer l\'impact financier et les risques',
        desc: 'Calculer le coût direct et indirect de l\'incident et recommander la décision financière la plus rationnelle.',
      },
      {
        id: '4c',
        category: 'comm_marketing',
        icon: '📣',
        title: 'Gérer la communication de crise',
        desc: 'Rassurer les partenaires, formuler les bons messages et préserver la réputation de l\'organisation.',
      },
      {
        id: '4d',
        category: 'management_rh',
        icon: '🛡️',
        title: 'Rassembler l\'équipe et soutenir le moral',
        desc: 'Éviter la panique, réassigner clairement les rôles dans le calme et s\'assurer que chacun sait quoi faire.',
      },
      {
        id: '4e',
        category: 'recherche_sciences',
        icon: '🔎',
        title: 'Documenter le cas pour éviter toute récidive',
        desc: 'Analyser les causes profondes avec recul scientifique et rédiger un protocole préventif rigoureux.',
      },
      {
        id: '4f',
        category: 'impact_juridique',
        icon: '📑',
        title: 'Vérifier les engagements contractuels et légaux',
        desc: 'Examiner les clauses juridiques, protéger la structure et négocier une issue conforme aux règlements.',
      },
    ],
  },
  {
    id: 5,
    question: "Quelle mission valorisante vous procurerait le plus grand sentiment d'accomplissement personnel ?",
    options: [
      {
        id: '5a',
        category: 'tech_ingenierie',
        icon: '⚙️',
        title: 'Créer une application, une infrastructure ou un outil adopté par des milliers d\'utilisateurs',
      },
      {
        id: '5b',
        category: 'analytique_finance',
        icon: '💰',
        title: 'Optimiser la santé financière d\'une organisation et lui faire réussir un investissement stratégique',
      },
      {
        id: '5c',
        category: 'comm_marketing',
        icon: '🌟',
        title: 'Lancer une campagne à succès qui transforme une marque et développe ses parts de marché',
      },
      {
        id: '5d',
        category: 'management_rh',
        icon: '🌱',
        title: 'Faire progresser des collaborateurs, recruter des talents et bâtir une équipe soudée',
      },
      {
        id: '5e',
        category: 'recherche_sciences',
        icon: '💡',
        title: 'Découvrir un nouveau modèle théorique, publier dans une revue internationale ou breveter une innovation',
      },
      {
        id: '5f',
        category: 'impact_juridique',
        icon: '🇲🇬',
        title: 'Contribuer au développement équitable de Madagascar en défendant le droit et la bonne gouvernance',
      },
    ],
  },
  {
    id: 6,
    question: "Quel type de veille professionnelle ou de lecture aimez-vous consulter sur votre temps libre ?",
    options: [
      {
        id: '6a',
        category: 'tech_ingenierie',
        icon: '🖥️',
        title: 'Nouveaux frameworks, IA, innovations matérielles, GitHub, tech blogs',
      },
      {
        id: '6b',
        category: 'analytique_finance',
        icon: '📰',
        title: 'Actualités économiques (Les Échos, Financial Times), analyses de marchés, tendances cryptos/devises',
      },
      {
        id: '6c',
        category: 'comm_marketing',
        icon: '📱',
        title: 'Tendances marketing, storytelling de marques mondiales, stratégies publicitaires, réseaux sociaux',
      },
      {
        id: '6d',
        category: 'management_rh',
        icon: '🤝',
        title: 'Articles de leadership (Harvard Business Review), psychologie du travail, gestion des talents',
      },
      {
        id: '6e',
        category: 'recherche_sciences',
        icon: '🔬',
        title: 'Revues scientifiques (Nature, Science), vulgarisation de haut niveau, rapports universitaires',
      },
      {
        id: '6f',
        category: 'impact_juridique',
        icon: '⚖️',
        title: 'Analyses géopolitiques, réformes du droit, rapports d\'ONG, politiques publiques de développement',
      },
    ],
  },
  {
    id: 7,
    question: "Si vous deviez définir votre ambition professionnelle d'ici 5 ans, elle ressemblerait à :",
    options: [
      {
        id: '7a',
        category: 'tech_ingenierie',
        icon: '💻',
        title: 'Architecte technique / Lead Developer reconnu pour son savoir-faire d\'exception',
      },
      {
        id: '7b',
        category: 'analytique_finance',
        icon: '💼',
        title: 'Directeur financier, auditeur senior ou gestionnaire de fonds influent',
      },
      {
        id: '7c',
        category: 'comm_marketing',
        icon: '🎯',
        title: 'Directeur marketing ou entrepreneur ayant fondé son agence ou sa marque',
      },
      {
        id: '7d',
        category: 'management_rh',
        icon: '🏆',
        title: 'Directeur des ressources humaines ou directeur général pilotant de grandes équipes',
      },
      {
        id: '7e',
        category: 'recherche_sciences',
        icon: '🎓',
        title: 'Docteur ou expert scientifique de référence dans son domaine de spécialisation',
      },
      {
        id: '7f',
        category: 'impact_juridique',
        icon: '🏛️',
        title: 'Avocat d\'affaires, haut magistrat ou cadre dirigeant au sein d\'une institution multilatérale',
      },
    ],
  },
];

// Calcul des résultats du Test 1 Étudiant
export function computeStudentOrientation1(answers = {}) {
  const scores = {
    tech_ingenierie: 0,
    analytique_finance: 0,
    comm_marketing: 0,
    management_rh: 0,
    recherche_sciences: 0,
    impact_juridique: 0,
  };

  TEST_ETUDIANT_INTERETS_QUESTIONS.forEach((q, index) => {
    const selectedOptId = answers[index];
    if (selectedOptId) {
      const opt = q.options.find((o) => o.id === selectedOptId);
      if (opt && opt.category && scores[opt.category] !== undefined) {
        scores[opt.category] += 1;
      }
    }
  });

  const sortedCategories = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  const dominantKey = sortedCategories[0] || 'tech_ingenierie';
  const secondaryKey = sortedCategories[1] || 'analytique_finance';

  const dominantCat = TEST_ETUDIANT_INTERETS_CATEGORIES[dominantKey];
  const secondaryCat = TEST_ETUDIANT_INTERETS_CATEGORIES[secondaryKey];

  const centresInteret = [dominantCat.shortLabel, secondaryCat.shortLabel];
  const orientationProvisoire1 = dominantCat.label;

  return {
    dominantKey,
    secondaryKey,
    dominantCat,
    secondaryCat,
    scores,
    centresInteret,
    orientationProvisoire1,
    details: {
      scores,
      dominant: dominantKey,
      secondary: secondaryKey,
      dominantLabel: dominantCat.label,
      secondaryLabel: secondaryCat.label,
      answers,
    },
  };
}

// ========================================================
// 2. TEST 2 : DOMAINES D'EXCELLENCE & APTITUDES OPÉRATIONNELLES
// ========================================================

export const LISTE_DOMAINES_EXCELLENCE_ETUDIANT = [
  { id: 'dom_informatique', label: 'Informatique, IA & Systèmes d\'Information', icon: '💻', pole: 'pole_tech' },
  { id: 'dom_finance_audit', label: 'Finance d\'Entreprise, Audit & Comptabilité', icon: '📈', pole: 'pole_finance' },
  { id: 'dom_ingenierie_btp', label: 'Sciences de l\'Ingénieur, Industrie & BTP', icon: '⚙️', pole: 'pole_tech' },
  { id: 'dom_mkt_comm', label: 'Marketing Digital, Communication & E-Commerce', icon: '📱', pole: 'pole_business' },
  { id: 'dom_rh_management', label: 'Management, Organisation & Ressources Humaines', icon: '🤝', pole: 'pole_management' },
  { id: 'dom_droit_fiscalite', label: 'Droit des Affaires, Fiscalité & Conformité', icon: '⚖️', pole: 'pole_droit' },
  { id: 'dom_sciences_sante', label: 'Sciences Médicales, Santé & Biotechnologies', icon: '🩺', pole: 'pole_sciences' },
  { id: 'dom_agro_env', label: 'Agronomie, Foresterie & Développement Durable', icon: '🌱', pole: 'pole_sciences' },
  { id: 'dom_logistique_inter', label: 'Logistique, Supply Chain & Commerce International', icon: '🚢', pole: 'pole_business' },
  { id: 'dom_economie_data', label: 'Économie, Statistiques & Politiques Publiques', icon: '📊', pole: 'pole_finance' },
];

export const LISTE_APTITUDES_ETUDIANT = [
  {
    id: 'apt_analytique_data',
    pole: 'pole_finance',
    label: 'Analyse quantitative, rigueur chiffrée & modélisation',
    desc: 'Facilité à traiter des volumes de données, interpréter des bilans ou extraire des tendances statistiques.',
  },
  {
    id: 'apt_gestion_projet',
    pole: 'pole_management',
    label: 'Gestion de projet, planification & tenue des délais',
    desc: 'Aisance pour définir un rétroplanning, structurer des jalons et coordonner la réalisation d\'objectifs.',
  },
  {
    id: 'apt_communication_pitch',
    pole: 'pole_business',
    label: 'Aisance oratoire, négociation & pitch de soutenance',
    desc: 'Facilité à captiver un auditoire, présenter des idées avec clarté et défendre une proposition à l\'oral.',
  },
  {
    id: 'apt_redaction_synthese',
    pole: 'pole_droit',
    label: 'Rédaction professionnelle, esprit de synthèse & rapports',
    desc: 'Capacité à formuler des documents clairs, précis, sans fautes, et à vulgariser des sujets denses.',
  },
  {
    id: 'apt_outils_numeriques',
    pole: 'pole_tech',
    label: 'Maîtrise des technologies, IA & logiciels spécialisés',
    desc: 'Rapidité d\'adoption des nouveaux outils digitaux, programmation ou logiciels avancés de votre discipline.',
  },
  {
    id: 'apt_leadership_collectif',
    pole: 'pole_management',
    label: 'Intelligence émotionnelle, travail d\'équipe & leadership',
    desc: 'Aptitude naturelle à écouter, encourager la coopération et surmonter les blocages collectifs.',
  },
];

export const TEST_ETUDIANT_POLES_INSERTION = {
  pole_tech: {
    key: 'pole_tech',
    label: 'Filière Ingénierie, Technologies & Systèmes Numériques',
    icon: '💻',
    color: '#1d4ed8',
    bgColor: '#eff6ff',
    borderColor: '#93c5fd',
    oriPro: 'Filière Ingénierie, Technologies & Systèmes Numériques',
    description:
      'Vos compétences techniques et votre aisance avec les outils numériques avancés vous positionnent idéalement pour les secteurs de la tech, du génie et de l\'innovation industrielle, parmi les plus dynamiques à Madagascar.',
    certifications: [
      'AWS Certified Cloud Practitioner / Solutions Architect',
      'Certifications Cisco CCNA / CompTIA Security+',
      'Meta Front-End / Back-End Developer Professional Certificate',
      'Google Data Analytics Professional Certificate',
    ],
    stagesRecommandes: 'Développement web/mobile, audit d\'infrastructures réseaux, modélisation CAO/BTP, automatisation de données.',
  },
  pole_finance: {
    key: 'pole_finance',
    label: 'Filière Audit, Finance, Banque & Stratégie d\'Entreprise',
    icon: '📈',
    color: '#047857',
    bgColor: '#ecfdf5',
    borderColor: '#6ee7b7',
    oriPro: 'Filière Audit, Finance, Banque & Stratégie d\'Entreprise',
    description:
      'Vos facilités analytiques et votre rigueur de traitement des données chiffrées sont hautement recherchées par les cabinets d\'audit internationaux, institutions financières et directions générales.',
    certifications: [
      'CFA (Chartered Financial Analyst) Level 1',
      'Certification Microsoft Excel Expert (MO-201)',
      'Certifications Coursera / Wharton en Corporate Finance',
      'Certifications en Modélisation Financière & Power BI',
    ],
    stagesRecommandes: 'Contrôle de gestion, audit légal en cabinet (Big 4 / cabinets locaux), analyse de crédit bancaire, comptabilité analytique.',
  },
  pole_business: {
    key: 'pole_business',
    label: 'Filière Marketing Stratégique, Business Development & E-Commerce',
    icon: '🚀',
    color: '#b45309',
    bgColor: '#fffbeb',
    borderColor: '#fcd34d',
    oriPro: 'Filière Marketing Stratégique, Business Development & E-Commerce',
    description:
      'Votre force d\'argumentation et votre créativité appliquée au marché font de vous un profil de premier plan pour développer le chiffre d\'affaires, la notoriété et la présence digitale des organisations.',
    certifications: [
      'Google Ads & Google Analytics Individual Qualification (GA4)',
      'HubSpot Inbound Marketing & Content Marketing Certification',
      'Meta Certified Digital Marketing Associate',
      'Certification en Négociation Commerciale & CRM (Salesforce / HubSpot)',
    ],
    stagesRecommandes: 'Gestion de campagnes sponsorisées, développement commercial B2B, stratégie de contenu, expansion e-commerce.',
  },
  pole_management: {
    key: 'pole_management',
    label: 'Filière Management des Organisations, RH & Pilotage de Projets',
    icon: '🤝',
    color: '#7c3aed',
    bgColor: '#faf5ff',
    borderColor: '#d8b4fe',
    oriPro: 'Filière Management des Organisations, RH & Pilotage de Projets',
    description:
      'Votre intelligence situationnelle et votre capacité à structurer l\'effort collectif vous destinent aux postes de conduite de projet, de management d\'équipe et de développement du capital humain.',
    certifications: [
      'CAPM / PMP (Project Management Professional - PMI)',
      'Certification Scrum Master (PSM I / CSM)',
      'Certifications en Gestion des Ressources Humaines & Dialogue Social',
      'Certifications en Lean Six Sigma (Green Belt)',
    ],
    stagesRecommandes: 'Assistance chef de projet, gestion des plannings et livrables, recrutement et gestion prévisionnelle des emplois, conduite du changement.',
  },
  pole_droit: {
    key: 'pole_droit',
    label: 'Filière Droit des Affaires, Gouvernance & Relations Internationales',
    icon: '⚖️',
    color: '#b91c1c',
    bgColor: '#fef2f2',
    borderColor: '#fca5a5',
    oriPro: 'Filière Droit des Affaires, Gouvernance & Relations Internationales',
    description:
      'Votre maîtrise de la rédaction, de la négociation contractuelle et votre rigueur juridique constituent des armes majeures pour conseiller les entreprises et les institutions internationales.',
    certifications: [
      'Certifications en Droit OHADA / Droit des Affaires International',
      'Certifications en Conformité & Lutte Anti-Blanchiment (ACAMS)',
      'Certification en Droit du Numérique & Protection des Données (RGPD / Loi malgache)',
      'TOEFL / IELTS pour l\'anglais juridique international',
    ],
    stagesRecommandes: 'Cabinets d\'avocats d\'affaires, services contentieux des banques/télécoms, conformité juridique dans les ONG, chancelleries.',
  },
  pole_sciences: {
    key: 'pole_sciences',
    label: 'Filière Sciences Appliquées, Santé Publique & Développement Durable',
    icon: '🌿',
    color: '#0f766e',
    bgColor: '#f0fdfa',
    borderColor: '#99f6e4',
    oriPro: 'Filière Sciences Appliquées, Santé Publique & Développement Durable',
    description:
      'Votre rigueur d\'observation et votre volonté d\'action sur le vivant vous ouvrent les portes des secteurs vitaux pour Madagascar : la santé, l\'agroalimentaire et la préservation écologique.',
    certifications: [
      'Certifications en Systèmes d\'Information Géographique (SIG / ArcGIS / QGIS)',
      'Certifications ISO 9001 / ISO 14001 (Qualité & Environnement)',
      'Certifications en Épidémiologie & Santé Communautaire',
      'Certifications en Gestion durable des ressources naturelles',
    ],
    stagesRecommandes: 'Laboratoires de recherche appliquée, ONG de conservation de la biodiversité, structures sanitaires, projets agricoles durables.',
  },
};

// Calcul du résultat du Test 2 Étudiant
export function computeStudentOrientation2({ selectedDomaines = [], aptitudes = {} }) {
  const poleScores = {
    pole_tech: 0,
    pole_finance: 0,
    pole_business: 0,
    pole_management: 0,
    pole_droit: 0,
    pole_sciences: 0,
  };

  // 1. Prise en compte des domaines choisis
  selectedDomaines.forEach((domId) => {
    const dom = LISTE_DOMAINES_EXCELLENCE_ETUDIANT.find((d) => d.id === domId);
    if (dom && poleScores[dom.pole] !== undefined) {
      poleScores[dom.pole] += 4; // Poids fort
    }
  });

  // 2. Prise en compte des aptitudes évaluées (valeur de 1 à 3)
  LISTE_APTITUDES_ETUDIANT.forEach((apt) => {
    const val = aptitudes[apt.id] || 2;
    if (apt.pole && poleScores[apt.pole] !== undefined) {
      poleScores[apt.pole] += val * 1.5;
    }
  });

  const sortedPoles = Object.keys(poleScores).sort((a, b) => poleScores[b] - poleScores[a]);
  const dominantPoleKey = sortedPoles[0] || 'pole_tech';
  const dominantPole = TEST_ETUDIANT_POLES_INSERTION[dominantPoleKey];

  const orientationProvisoire2 = dominantPole.oriPro;

  // Compétences clés identifiées
  const competencesCles = [];
  LISTE_APTITUDES_ETUDIANT.forEach((apt) => {
    if ((aptitudes[apt.id] || 2) >= 3) {
      competencesCles.push(apt.label);
    }
  });
  if (competencesCles.length === 0) {
    competencesCles.push(dominantPole.label);
  }

  return {
    dominantPoleKey,
    dominantPole,
    poleScores,
    orientationProvisoire2,
    competencesCles,
    details: {
      selectedDomaines,
      aptitudes,
      poleScores,
      dominantPoleKey,
    },
  };
}

