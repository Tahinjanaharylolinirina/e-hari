// ========================================================
// TESTS D'ORIENTATION PROFESSIONNELLE & EMPLOI e-HARI
// Adapté à toute personne souhaitant trouver le travail correspondant
// à son profil (débutants, en recherche d'emploi, autodidactes ou en transition)
// Plateforme e-HARI (ONG HARI Madagascar)
// ========================================================

// ========================================================
// 1. TEST 1 : ASPIRATIONS & MÉTIER IDÉAL (6 ARCHÉTYPES PROFESSIONNELS)
// ========================================================

export const TEST_RECONVERSION_INTERETS_CATEGORIES = {
  tech_numerique: {
    key: 'tech_numerique',
    label: 'Profil Métiers du Numérique, Web & Data',
    shortLabel: 'Numérique & Digital',
    icon: '💻',
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#93c5fd',
    oriPro: 'Métiers du Numérique, Développement Web & Analyse de Données',
    badge: 'Numérique & Digital',
    description:
      'Vous avez un attrait prononcé pour la logique, les outils digitaux et les technologies actuelles. Vous souhaitez vous orienter vers le secteur le plus dynamique et porteur à Madagascar : développement logiciel, analyse de données, support informatique, communication ou gestion digitale.',
    forces: [
      'Capacité d\'apprentissage autonome et curiosité',
      'Esprit logique, rigoureux et structuré',
      'Aisance naturelle avec les outils digitaux',
      'Adaptabilité rapide aux évolutions technologiques',
    ],
    debouches: [
      'Développeur Web / Mobile (Full-Stack)',
      'Data Analyst / Gestionnaire de bases de données',
      'Chef de Projet Digital / Assistant Support Applicatif',
      'Community Manager & Créateur de Contenu Digital',
    ],
  },
  entrepreneuriat_agri: {
    key: 'entrepreneuriat_agri',
    label: 'Profil Esprit d\'Entreprise, Commerce & Indépendance',
    shortLabel: 'Commerce & Entrepreneuriat',
    icon: '🚀',
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fcd34d',
    oriPro: 'Création d\'Activité, Commerce & Métiers Indépendants',
    badge: 'Entrepreneuriat & Autonomie',
    description:
      'Vous ressentez le besoin d\'autonomie et d\'initiative. Vous aspirez à bâtir votre propre activité, gérer un commerce ou développer des prestations indépendantes rentables à Madagascar (services de proximité, vente, transformation locale, distribution).',
    forces: [
      'Sens de l\'initiative et volonté d\'avancer',
      'Persévérance face aux imprévus et adaptabilité',
      'Sens du contact client et de la négociation',
      'Polyvalence pratique et recherche de rentabilité',
    ],
    debouches: [
      'Créateur d\'entreprise / Responsable de micro-entreprise',
      'Prestataire indépendant / Consultant indépendant',
      'Responsable de point de vente / Commerce & Distribution',
      'Entrepreneur dans l\'agro-transformation locale ou l\'artisanat',
    ],
  },
  management_conseil: {
    key: 'management_conseil',
    label: 'Profil Organisation, Pilotage de Projets & Conseil',
    shortLabel: 'Organisation & Projets',
    icon: '📊',
    color: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    oriPro: 'Gestion de Projets, Coordination & Organisation d\'Entreprise',
    badge: 'Organisation & Projets',
    description:
      'Vous avez une vision structurée et méthodique du travail. Vous aimez organiser, planifier les tâches, coordonner des équipes et vous assurer que les objectifs fixés sont atteints avec efficacité et clarté.',
    forces: [
      'Sens de l\'organisation et gestion méthodique des priorités',
      'Capacité d\'écoute, de coordination et d\'animation d\'équipe',
      'Rigueur de suivi, respect des délais et maîtrise des ressources',
      'Aptitude à simplifier et clarifier les méthodes de travail',
    ],
    debouches: [
      'Coordinateur de Projet / Assistant Chef de Projet',
      'Chargé d\'Organisation & Amélioration des Processus',
      'Responsable Administratif & de Suivi Opérationnel',
      'Superviseur d\'Équipe / Responsable d\'Unité',
    ],
  },
  impact_vert_rse: {
    key: 'impact_vert_rse',
    label: 'Profil Métiers d\'Impact Social, Écologie & Développement Durable',
    shortLabel: 'Impact Social & Vert',
    icon: '🌱',
    color: '#16a34a',
    bgColor: '#f0fdf4',
    borderColor: '#86efac',
    oriPro: 'Développement Durable, Projets d\'Impact, Énergies & ONG',
    badge: 'Impact & Développement',
    description:
      'Votre recherche de travail est guidée par le besoin de faire une différence positive : contribuer au développement durable de Madagascar, préserver les ressources naturelles, ou œuvrer dans le milieu associatif et humanitaire.',
    forces: [
      'Engagement sincère et sens aigu de l\'intérêt collectif',
      'Sensibilité aux enjeux écologiques et sociétaux',
      'Capacité à mobiliser et sensibiliser les communautés',
      'Persévérance dans les projets de terrain à long terme',
    ],
    debouches: [
      'Chargé de Projet en ONG / Associations de Développement',
      'Animateur de Sensibilisation Environnementale & Éco-projets',
      'Technicien / Assistant en Énergies Renouvelables (Solaire)',
      'Chargé de Mission Développement Local & RSE',
    ],
  },
  formation_rh_humain: {
    key: 'formation_rh_humain',
    label: 'Profil Ressources Humaines, Formation & Accompagnement',
    shortLabel: 'Humain, RH & Formation',
    icon: '🤝',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    borderColor: '#c4b5fd',
    oriPro: 'Ressources Humaines, Formation Professionnelle & Recrutement',
    badge: 'Humain & Formation',
    description:
      'Votre énergie se déploie dans le contact humain : conseiller, écouter, guider, recruter ou transmettre des connaissances. Vous aimez valoriser les compétences des personnes et favoriser leur épanouissement personnel et professionnel.',
    forces: [
      'Excellente communication interpersonnelle et empathie',
      'Pédagogie naturelle et plaisir de transmettre',
      'Aptitude à l\'écoute active et à la résolution de conflits',
      'Sens du recrutement et de la détection de potentiels',
    ],
    debouches: [
      'Chargé de Recrutement & Sourcing de Talents',
      'Formateur d\'Adultes / Animateur Pédagogique',
      'Conseiller en Insertion Professionnelle & Orientation',
      'Assistant Ressources Humaines & Développement des Talents',
    ],
  },
  expertise_terrain_qualite: {
    key: 'expertise_terrain_qualite',
    label: 'Profil Opérations Concrètes, Logistique & Qualité Terrain',
    shortLabel: 'Opérations & Logistique',
    icon: '⚙️',
    color: '#0891b2',
    bgColor: '#ecfeff',
    borderColor: '#a5f3fc',
    oriPro: 'Logistique, Gestion des Flux, Qualité & Opérations Terrain',
    badge: 'Opérations & Logistique',
    description:
      'Vous êtes une personne d\'action pratique. Vous préférez les missions concrètes, l\'organisation physique des stocks, la supervision des flux d\'approvisionnement, le contrôle qualité et le travail sur le terrain.',
    forces: [
      'Sens pratique affûté et réactivité directe',
      'Rigueur de contrôle et respect strict des procédures',
      'Organisation méthodique des espaces et des stocks',
      'Aisance dans le suivi opérationnel quotidien',
    ],
    debouches: [
      'Gestionnaire de Stocks / Magasinier Expert',
      'Assistant Logistique & Planification des Livraisons',
      'Agent Contrôle Qualité, Hygiène & Sécurité (QHSE)',
      'Superviseur des Opérations Terrain & Approvisionnements',
    ],
  },
};

// 7 Situations professionnelles universelles
export const TEST_RECONVERSION_INTERETS_QUESTIONS = [
  {
    id: 1,
    question: "Quel est votre objectif principal pour trouver un travail qui vous correspond aujourd'hui ?",
    options: [
      {
        id: '1a',
        category: 'tech_numerique',
        icon: '💻',
        title: 'Apprendre et exercer un métier d\'avenir, moderne et très demandé dans le numérique',
      },
      {
        id: '1b',
        category: 'entrepreneuriat_agri',
        icon: '🚀',
        title: 'Créer ma propre activité, gagner mon indépendance et développer un projet rentable',
      },
      {
        id: '1c',
        category: 'management_conseil',
        icon: '📊',
        title: 'Coordonner des projets, organiser le travail d\'équipe et prendre des responsabilités',
      },
      {
        id: '1d',
        category: 'impact_vert_rse',
        icon: '🌱',
        title: 'Trouver un travail utile avec du sens, qui contribue concrètement à la société malgache',
      },
      {
        id: '1e',
        category: 'formation_rh_humain',
        icon: '🤝',
        title: 'Mettre l\'humain au cœur de mon activité : former, conseiller, recruter et accompagner',
      },
      {
        id: '1f',
        category: 'expertise_terrain_qualite',
        icon: '⚙️',
        title: 'Avoir un métier concret et pragmatique, avec des résultats visibles chaque jour sur le terrain',
      },
    ],
  },
  {
    id: 2,
    question: "Quelle est votre posture face aux nouveaux apprentissages et aux défis professionnels ?",
    options: [
      {
        id: '2a',
        category: 'entrepreneuriat_agri',
        icon: '⚡',
        title: 'Audacieux et débrouillard : je teste sur le terrain, apprends de mes erreurs et persévère',
      },
      {
        id: '2b',
        category: 'tech_numerique',
        icon: '🎯',
        title: 'Curieux et méthodique : je me forme avec rigueur sur des compétences concrètes et recherchées',
      },
      {
        id: '2c',
        category: 'management_conseil',
        icon: '🛡️',
        title: 'Structuré et analytique : j\'évalue les priorités et organise un plan par étapes claires',
      },
      {
        id: '2d',
        category: 'impact_vert_rse',
        icon: '🌍',
        title: 'Passionné et engagé : je m\'investis sans compter si la mission correspond à mes valeurs',
      },
      {
        id: '2e',
        category: 'formation_rh_humain',
        icon: '📚',
        title: 'Écoute et bienveillance : je progresse au contact des autres et par l\'échange d\'expériences',
      },
      {
        id: '2f',
        category: 'expertise_terrain_qualite',
        icon: '🏗️',
        title: 'Pragmatique et réaliste : je privilégie les activités solides et indispensables au quotidien',
      },
    ],
  },
  {
    id: 3,
    question: "Dans quel type d'environnement quotidien vous projetez-vous le plus ?",
    options: [
      {
        id: '3a',
        category: 'tech_numerique',
        icon: '🖥️',
        title: 'Environnement connecté, outils digitaux modernes, travail en équipe agile ou hybride',
      },
      {
        id: '3b',
        category: 'entrepreneuriat_agri',
        icon: '🏪',
        title: 'Mon propre espace ou commerce, sur le terrain au contact direct de mes clients',
      },
      {
        id: '3c',
        category: 'management_conseil',
        icon: '🏢',
        title: 'Entreprises dynamiques, suivi de projets, réunions de coordination et planification',
      },
      {
        id: '3d',
        category: 'impact_vert_rse',
        icon: '🇲🇬',
        title: 'Au sein d\'une ONG, d\'un projet écologique ou sur le terrain auprès des communautés',
      },
      {
        id: '3e',
        category: 'formation_rh_humain',
        icon: '👥',
        title: 'Espaces d\'échange, entretiens individuels, centres de formation ou départements RH',
      },
      {
        id: '3f',
        category: 'expertise_terrain_qualite',
        icon: '📦',
        title: 'Plateforme logistique, entrepôt, atelier de production ou chantiers opérationnels',
      },
    ],
  },
  {
    id: 4,
    question: "Quelle est votre plus grande force personnelle à faire valoir auprès d'un recruteur ou de clients ?",
    options: [
      {
        id: '4a',
        category: 'management_conseil',
        icon: '🏆',
        title: 'Mon sens de l\'organisation, de la rigueur et de la coordination de plusieurs tâches',
      },
      {
        id: '4b',
        category: 'tech_numerique',
        icon: '🔄',
        title: 'Mon aisance avec le numérique, mon esprit logique et ma rapidité d\'apprentissage',
      },
      {
        id: '4c',
        category: 'entrepreneuriat_agri',
        icon: '💼',
        title: 'Mon sens du contact, mon autonomie, mon énergie commerciale et mon sens de la négociation',
      },
      {
        id: '4d',
        category: 'formation_rh_humain',
        icon: '🎓',
        title: 'Ma pédagogie, ma patience, mon sens de l\'écoute et ma capacité à motiver autrui',
      },
      {
        id: '4e',
        category: 'impact_vert_rse',
        icon: '🤝',
        title: 'Mon intégrité, mon sérieux et mon engagement envers des causes utiles pour la société',
      },
      {
        id: '4f',
        category: 'expertise_terrain_qualite',
        icon: '🔧',
        title: 'Mon sens pratique, mon souci du travail bien fait et mon efficacité sur le terrain',
      },
    ],
  },
  {
    id: 5,
    question: "Quel format d'apprentissage ou d'accompagnement vous intéresserait le plus pour trouver votre voie ?",
    options: [
      {
        id: '5a',
        category: 'tech_numerique',
        icon: '⚡',
        title: 'Une formation pratique et intensive de 3 à 6 mois (développement web, data, outils numériques)',
      },
      {
        id: '5b',
        category: 'entrepreneuriat_agri',
        icon: '💡',
        title: 'Des ateliers pratiques de business plan, gestion de budget, vente et démarches concrètes',
      },
      {
        id: '5c',
        category: 'management_conseil',
        icon: '📜',
        title: 'Une formation certifiante en gestion de projet, coordination d\'équipe et organisation',
      },
      {
        id: '5d',
        category: 'impact_vert_rse',
        icon: '🌿',
        title: 'Des modules spécialisés en gestion de projets associatifs, RSE ou protection environnementale',
      },
      {
        id: '5e',
        category: 'formation_rh_humain',
        icon: '🗣️',
        title: 'Des techniques d\'animation d\'ateliers, de recrutement et de communication interpersonnelle',
      },
      {
        id: '5f',
        category: 'expertise_terrain_qualite',
        icon: '📦',
        title: 'Des formations en gestion des stocks, logiciels de gestion (ERP/Excel) et normes de qualité',
      },
    ],
  },
  {
    id: 6,
    question: "Face à un problème imprévu ou une difficulté au travail, quelle est votre réaction spontanée ?",
    options: [
      {
        id: '6a',
        category: 'tech_numerique',
        icon: '🔍',
        title: 'Je cherche la cause logique, teste différentes pistes avec méthode et cherche à fiabiliser',
      },
      {
        id: '6b',
        category: 'entrepreneuriat_agri',
        icon: '💡',
        title: 'Je trouve une solution alternative immédiate, pragmatique et peu coûteuse sans attendre',
      },
      {
        id: '6c',
        category: 'management_conseil',
        icon: '📋',
        title: 'Je rassemble les faits, consulte les personnes concernées et établis un plan d\'action clair',
      },
      {
        id: '6d',
        category: 'formation_rh_humain',
        icon: '🤝',
        title: 'Je privilégie le dialogue et la bienveillance pour comprendre le blocage et motiver la personne',
      },
      {
        id: '6e',
        category: 'impact_vert_rse',
        icon: '🌱',
        title: 'Je m\'assure que la solution choisie respecte les personnes et apporte un bénéfice équitable',
      },
      {
        id: '6f',
        category: 'expertise_terrain_qualite',
        icon: '⚙️',
        title: 'Je vais directement voir sur place pour comprendre le dysfonctionnement et le réparer',
      },
    ],
  },
  {
    id: 7,
    question: "À quoi ressemblerait votre réussite professionnelle idéale d'ici 3 ans ?",
    options: [
      {
        id: '7a',
        category: 'entrepreneuriat_agri',
        icon: '🏆',
        title: 'Avoir développé ma propre activité autonome et rentable qui me procure fierté et liberté',
      },
      {
        id: '7b',
        category: 'tech_numerique',
        icon: '💻',
        title: 'Exercer un métier stimulant dans le numérique, avec un bon salaire et de solides débouchés',
      },
      {
        id: '7c',
        category: 'management_conseil',
        icon: '📊',
        title: 'Occuper un rôle de coordinateur ou chargé de projet respecté pour sa méthode et ses résultats',
      },
      {
        id: '7d',
        category: 'impact_vert_rse',
        icon: '🇲🇬',
        title: 'Avoir un impact positif concret sur les conditions de vie et l\'environnement à Madagascar',
      },
      {
        id: '7e',
        category: 'formation_rh_humain',
        icon: '🎓',
        title: 'Avoir formé, recruté et aidé de nombreuses personnes à réussir dans leur propre parcours',
      },
      {
        id: '7f',
        category: 'expertise_terrain_qualite',
        icon: '📦',
        title: 'Maîtriser une activité opérationnelle fluide et efficace, reconnue pour sa rigueur et sa qualité',
      },
    ],
  },
];

// Calcul du Test 1
export function computeReconversionOrientation1(answers = {}) {
  const scores = {
    tech_numerique: 0,
    entrepreneuriat_agri: 0,
    management_conseil: 0,
    impact_vert_rse: 0,
    formation_rh_humain: 0,
    expertise_terrain_qualite: 0,
  };

  TEST_RECONVERSION_INTERETS_QUESTIONS.forEach((q, index) => {
    const selectedOptId = answers[index];
    if (selectedOptId) {
      const opt = q.options.find((o) => o.id === selectedOptId);
      if (opt && opt.category && scores[opt.category] !== undefined) {
        scores[opt.category] += 1;
      }
    }
  });

  const sortedCategories = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  const dominantKey = sortedCategories[0] || 'tech_numerique';
  const secondaryKey = sortedCategories[1] || 'entrepreneuriat_agri';

  const dominantCat = TEST_RECONVERSION_INTERETS_CATEGORIES[dominantKey];
  const secondaryCat = TEST_RECONVERSION_INTERETS_CATEGORIES[secondaryKey];

  const motivationsCles = [dominantCat.shortLabel, secondaryCat.shortLabel];
  const orientationProvisoire1 = dominantCat.label;

  return {
    dominantKey,
    secondaryKey,
    dominantCat,
    secondaryCat,
    scores,
    motivationsCles,
    orientationProvisoire1,
    details: {
      dominantKey,
      secondaryKey,
      scores,
      answers,
    },
  };
}

// ========================================================
// 2. TEST 2 : COMPÉTENCES & PÔLES D'EMPLOI CIBLES
// ========================================================

// 10 Domaines de compétences clés
export const LISTE_DOMAINES_COMPETENCES_RECONVERSION = [
  {
    id: 'dom_orga_projets',
    label: 'Organisation, Méthode & Planification',
    icon: '📋',
    pole: 'pole_conseil_management',
    description: 'Suivi de plannings, gestion des priorités, respect des consignes et organisation méthodique.',
  },
  {
    id: 'dom_finance_gestion',
    label: 'Chiffres, Calculs & Notions de Gestion',
    icon: '💶',
    pole: 'pole_conseil_management',
    description: 'Calculs de coûts, factures, gestion de petites caisses, sens de la rigueur chiffrée.',
  },
  {
    id: 'dom_vente_negociation',
    label: 'Contact Client, Vente & Négociation',
    icon: '🤝',
    pole: 'pole_entrepreneuriat',
    description: 'Sens de l\'accueil, argumentation commerciale, persuasion et fidélisation de clients.',
  },
  {
    id: 'dom_management_equipe',
    label: 'Communication, Écoute & Animation de Groupe',
    icon: '👥',
    pole: 'pole_rh_formation',
    description: 'Aisance pour animer un groupe, faciliter l\'entraide et motiver ses pairs.',
  },
  {
    id: 'dom_outils_digitaux',
    label: 'Outils Numériques, Bureautique & Internet',
    icon: '💻',
    pole: 'pole_tech_digital',
    description: 'Bureautique (Word, Excel), navigation web efficace, réseaux sociaux et outils en ligne.',
  },
  {
    id: 'dom_redaction_langues',
    label: 'Expression Écrite, Synthèse & Langues',
    icon: '✍️',
    pole: 'pole_tech_digital',
    description: 'Rédaction soignée, clarté d\'expression en français et/ou anglais, esprit de synthèse.',
  },
  {
    id: 'dom_technique_terrain',
    label: 'Logistique, Organisation Pratique & Stocks',
    icon: '🔧',
    pole: 'pole_logistique_supply',
    description: 'Comptage d\'inventaires, rangement rigoureux, manipulation de colis, contrôle physique.',
  },
  {
    id: 'dom_pedagogie_formation',
    label: 'Pédagogie, Conseil & Transmission de Savoir',
    icon: '🎓',
    pole: 'pole_rh_formation',
    description: 'Plaisir d\'expliquer simplement, guider des débutants et transmettre des méthodes de travail.',
  },
  {
    id: 'dom_ecologie_rse',
    label: 'Sensibilité Écologique & Actions Locales',
    icon: '🌱',
    pole: 'pole_agro_ecologie',
    description: 'Intérêt pour l\'agriculture saine, la gestion des déchets, l\'énergie propre et le développement local.',
  },
  {
    id: 'dom_creativite_design',
    label: 'Créativité, Présentation Visuelle & Idées',
    icon: '🎨',
    pole: 'pole_entrepreneuriat',
    description: 'Sens de la mise en valeur esthétique, imagination d\'offres attractives et originalité.',
  },
];

// 6 Aptitudes professionnelles universelles
export const LISTE_APTITUDES_RECONVERSION = [
  {
    id: 'apt_adaptabilite',
    label: 'Adaptabilité & Soif d\'Apprendre',
    desc: 'Capacité à s\'adapter à de nouvelles méthodes et à assimiler rapidement des compétences utiles.',
    icon: '🔄',
    poidsPole: {
      pole_tech_digital: 3,
      pole_entrepreneuriat: 3,
      pole_conseil_management: 2,
      pole_agro_ecologie: 2,
      pole_rh_formation: 2,
      pole_logistique_supply: 2,
    },
  },
  {
    id: 'apt_communication',
    label: 'Aisance Relationnelle & Communication',
    desc: 'Facilité à dialoguer, exprimer clairement ses idées et comprendre les besoins de son interlocuteur.',
    icon: '🗣️',
    poidsPole: {
      pole_rh_formation: 3,
      pole_entrepreneuriat: 3,
      pole_conseil_management: 2,
      pole_tech_digital: 1,
      pole_agro_ecologie: 2,
      pole_logistique_supply: 1,
    },
  },
  {
    id: 'apt_rigueur_organisation',
    label: 'Rigueur, Ponctualité & Fiabilité',
    desc: 'Respect des consignes, organisation dans le travail et conscience professionnelle sans faille.',
    icon: '📐',
    poidsPole: {
      pole_logistique_supply: 3,
      pole_conseil_management: 3,
      pole_tech_digital: 2,
      pole_agro_ecologie: 2,
      pole_entrepreneuriat: 2,
      pole_rh_formation: 1,
    },
  },
  {
    id: 'apt_initiative',
    label: 'Sens de l\'Initiative & Proactivité',
    desc: 'Capacité à agir sans attendre qu\'on vous le demande et à proposer des solutions utiles.',
    icon: '⚡',
    poidsPole: {
      pole_entrepreneuriat: 3,
      pole_tech_digital: 2,
      pole_conseil_management: 2,
      pole_agro_ecologie: 2,
      pole_logistique_supply: 2,
      pole_rh_formation: 1,
    },
  },
  {
    id: 'apt_resolution_problemes',
    label: 'Résolution Pragmatique de Problèmes',
    desc: 'Débrouillardise constructive, bon sens et recherche de solutions concrètes aux imprévus.',
    icon: '🧩',
    poidsPole: {
      pole_tech_digital: 3,
      pole_logistique_supply: 3,
      pole_entrepreneuriat: 2,
      pole_conseil_management: 2,
      pole_agro_ecologie: 2,
      pole_rh_formation: 1,
    },
  },
  {
    id: 'apt_esprit_equipe',
    label: 'Esprit d\'Équipe & Entraide',
    desc: 'Facilité à collaborer, partager l\'information et contribuer positivement à la bonne entente.',
    icon: '🤝',
    poidsPole: {
      pole_rh_formation: 3,
      pole_agro_ecologie: 3,
      pole_conseil_management: 2,
      pole_logistique_supply: 2,
      pole_tech_digital: 2,
      pole_entrepreneuriat: 1,
    },
  },
];

// 6 Pôles d'insertion professionnelle & opportunités à Madagascar
export const TEST_RECONVERSION_POLES_INSERTION = {
  pole_tech_digital: {
    key: 'pole_tech_digital',
    label: 'Pôle Technologies Numériques, Web & Data',
    icon: '💻',
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#93c5fd',
    oriPro: 'Pôle Technologies Numériques, Développement Web & Métiers Digitaux',
    description:
      'Secteur en forte croissance à Madagascar offrant de réels débouchés : développement web, support technique, traitement de données, téléopérations spécialisées et marketing digital.',
    metiersCibles: [
      'Développeur Web / Mobile (Full-Stack)',
      'Assistant Data / Gestionnaire de bases de données',
      'Chargé de Support Applicatif & Outils No-Code',
      'Community Manager & Créateur de Contenu Web',
    ],
    domainesAssocies: ['dom_outils_digitaux', 'dom_redaction_langues'],
  },
  pole_entrepreneuriat: {
    key: 'pole_entrepreneuriat',
    label: 'Pôle Commerce, Entrepreneuriat & Métiers Indépendants',
    icon: '🚀',
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fcd34d',
    oriPro: 'Pôle Entrepreneuriat, Commerce & Activités Indépendantes',
    description:
      'Opportunités pour créer son propre emploi ou gérer une activité autonome : commerce de détail/gros, prestation de services, artisanat à valeur ajoutée et distribution locale.',
    metiersCibles: [
      'Créateur / Gérant de micro-entreprise',
      'Commercial Indépendant / Prestataire de services B2B',
      'Responsable de point de vente / Distribution',
      'Entrepreneur dans l\'artisanat ou la transformation locale',
    ],
    domainesAssocies: ['dom_vente_negociation', 'dom_creativite_design'],
  },
  pole_conseil_management: {
    key: 'pole_conseil_management',
    label: 'Pôle Organisation, Gestion de Projet & Coordination',
    icon: '📊',
    color: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    oriPro: 'Pôle Organisation, Gestion de Projets & Coordination Opérationnelle',
    description:
      'Métiers axés sur la méthode et la structure au sein des entreprises et organisations malgaches : planification, gestion administrative, suivi des opérations et optimisation des tâches.',
    metiersCibles: [
      'Assistant Chef de Projet / Coordinateur d\'Opérations',
      'Chargé de Suivi Administratif & Budgétaire',
      'Superviseur d\'Équipe Opérationnelle',
      'Chargé de Méthodes & Organisation Interne',
    ],
    domainesAssocies: ['dom_orga_projets', 'dom_finance_gestion'],
  },
  pole_agro_ecologie: {
    key: 'pole_agro_ecologie',
    label: 'Pôle Développement Durable, Agro-écologie & RSE',
    icon: '🌱',
    color: '#16a34a',
    bgColor: '#f0fdf4',
    borderColor: '#86efac',
    oriPro: 'Pôle Développement Durable, Agro-écologie, ONG & Projets d\'Impact',
    description:
      'Secteur porteur soutenu par les ONG, les coopératives et les entreprises engagées à Madagascar : agro-transformation responsable, valorisation des terroirs, énergies solaires et projets communautaires.',
    metiersCibles: [
      'Animateur de Projet Agricole / Filières Durables',
      'Assistant RSE & Développement Durable en Entreprise',
      'Technicien Solaire & Énergies Renouvelables',
      'Chargé de Terrain en ONG & Programmes de Développement',
    ],
    domainesAssocies: ['dom_ecologie_rse'],
  },
  pole_rh_formation: {
    key: 'pole_rh_formation',
    label: 'Pôle Ressources Humaines, Formation & Recrutement',
    icon: '🤝',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    borderColor: '#c4b5fd',
    oriPro: 'Pôle Ressources Humaines, Formation Professionnelle & Recrutement',
    description:
      'Métiers centrés sur les compétences humaines au sein des entreprises en croissance, des centres de contact et des cabinets de formation à Madagascar : recrutement, animation et accompagnement.',
    metiersCibles: [
      'Chargé de Recrutement & Sourcing de Candidats',
      'Formateur Professionnel / Facilitateur d\'Ateliers',
      'Conseiller en Insertion Professionnelle & Orientation',
      'Assistant Ressources Humaines & Gestion du Personnel',
    ],
    domainesAssocies: ['dom_management_equipe', 'dom_pedagogie_formation'],
  },
  pole_logistique_supply: {
    key: 'pole_logistique_supply',
    label: 'Pôle Opérations Terrain, Logistique & Qualité',
    icon: '⚙️',
    color: '#0891b2',
    bgColor: '#ecfeff',
    borderColor: '#a5f3fc',
    oriPro: 'Pôle Logistique, Gestion des Stocks & Opérations Terrain',
    description:
      'Métiers pratiques essentiels au tissu économique malgache : gestion des stocks et inventaires, logistique de distribution, contrôle qualité et suivi rigoureux des approvisionnements.',
    metiersCibles: [
      'Gestionnaire de Stocks & Magasinier Référent',
      'Assistant Logistique & Dispatching de Livraisons',
      'Agent de Contrôle Qualité, Hygiène & Sécurité (QHSE)',
      'Assistant Approvisionnements & Achats',
    ],
    domainesAssocies: ['dom_technique_terrain'],
  },
};

// Calcul du Test 2
export function computeReconversionOrientation2({
  selectedDomaines = [],
  aptitudesRatings = {},
  aptitudes = {},
}) {
  const ratings = Object.keys(aptitudesRatings).length > 0 ? aptitudesRatings : aptitudes;

  const poleScores = {
    pole_tech_digital: 0,
    pole_entrepreneuriat: 0,
    pole_conseil_management: 0,
    pole_agro_ecologie: 0,
    pole_rh_formation: 0,
    pole_logistique_supply: 0,
  };

  // 1. Points issus des domaines de compétences sélectionnés
  const competencesCles = selectedDomaines.map((domId) => {
    const dom = LISTE_DOMAINES_COMPETENCES_RECONVERSION.find((d) => d.id === domId);
    if (dom && dom.pole && poleScores[dom.pole] !== undefined) {
      poleScores[dom.pole] += 4;
    }
    return dom ? dom.label : domId;
  });

  // 2. Points issus de l'auto-évaluation des 6 aptitudes
  LISTE_APTITUDES_RECONVERSION.forEach((apt) => {
    const rating = ratings[apt.id] || 2;
    if (apt.poidsPole) {
      Object.entries(apt.poidsPole).forEach(([pKey, pWeight]) => {
        if (poleScores[pKey] !== undefined) {
          poleScores[pKey] += rating * pWeight;
        }
      });
    }
  });

  const sortedPoles = Object.keys(poleScores).sort((a, b) => poleScores[b] - poleScores[a]);
  const dominantPoleKey = sortedPoles[0] || 'pole_tech_digital';
  const secondaryPoleKey = sortedPoles[1] || 'pole_entrepreneuriat';

  const dominantPole = TEST_RECONVERSION_POLES_INSERTION[dominantPoleKey];
  const secondaryPole = TEST_RECONVERSION_POLES_INSERTION[secondaryPoleKey];

  const orientationProvisoire2 = dominantPole.label;

  return {
    dominantPoleKey,
    secondaryPoleKey,
    dominantPole,
    secondaryPole,
    poleScores,
    competencesCles,
    orientationProvisoire2,
    details: {
      selectedDomaines,
      competencesCles,
      aptitudesRatings: ratings,
      poleScores,
      dominantPoleKey,
      secondaryPoleKey,
    },
  };
}
