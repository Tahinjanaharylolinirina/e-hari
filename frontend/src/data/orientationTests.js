// Données et algorithmes des tests d'orientation pour l'élève e-hari (ONG HARI)

// ========================================================
// TÂCHE 2 : TEST DES CENTRES D'INTÉRÊT & PASSIONS + PERSONNALITÉ
// ========================================================

export const TEST_INTERETS_CATEGORIES = {
  sciences_tech: {
    key: 'sciences_tech',
    label: 'Caractère Réfléchi, Curieux & Méthodique',
    shortLabel: 'Réfléchi & Méthodique',
    icon: '🔬',
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#93c5fd',
    oriPro: 'Caractère Réfléchi, Curieux & Méthodique',
    description:
      'Vous possédez une nature posée, calme et persévérante. Vous aimez comprendre en profondeur comment fonctionnent les choses, analyser les situations avec logique et aborder chaque problème avec rigueur et bon sens.',
    qualites: ['Raisonnement logique', 'Curiosité intellectuelle', 'Patience et persévérance', 'Sens de l\'analyse'],
  },
  lettres_comm: {
    key: 'lettres_comm',
    label: 'Caractère Éloquent, Sensible & Humaniste',
    shortLabel: 'Éloquent & Sensible',
    icon: '📖',
    color: '#9333ea',
    bgColor: '#faf5ff',
    borderColor: '#d8b4fe',
    oriPro: 'Caractère Éloquent, Sensible & Humaniste',
    description:
      'Vous vous distinguez par votre sensibilité humaine, votre clarté d\'expression et votre goût pour l\'échange d\'idées. Vous aimez écouter, transmettre, dialoguer et défendre les valeurs de justice et de respect.',
    qualites: ['Aisance d\'expression', 'Sens de l\'écoute', 'Sensibilité humaine', 'Esprit critique et nuance'],
  },
  eco_gestion: {
    key: 'eco_gestion',
    label: 'Caractère Entreprenant, Organisateur & Leader',
    shortLabel: 'Entreprenant & Leader',
    icon: '💼',
    color: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    oriPro: 'Caractère Entreprenant, Organisateur & Leader',
    description:
      'Vous êtes dynamique, proactif et naturellement tourné vers l\'action concrète. Vous aimez prendre des initiatives, rassembler les autres autour d\'un but commun, organiser et trouver des solutions pratiques.',
    qualites: ['Esprit d\'initiative', 'Capacité à fédérer', 'Sens de l\'organisation', 'Pragmatisme et réactivité'],
  },
  sante_social: {
    key: 'sante_social',
    label: 'Caractère Bienveillant, Altruiste & Protecteur',
    shortLabel: 'Bienveillant & Altruiste',
    icon: '❤️',
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fca5a5',
    oriPro: 'Caractère Bienveillant, Altruiste & Protecteur',
    description:
      'Votre plus belle qualité réside dans votre grand cœur, votre empathie naturelle et votre dévouement pour autrui. Vous êtes toujours à l\'écoute, attentif au bien-être de votre entourage et prêt à soutenir ceux qui en ont besoin.',
    qualites: ['Profonde empathie', 'Dévouement sincère', 'Douceur et patience', 'Générosité d\'esprit'],
  },
  arts_creation: {
    key: 'arts_creation',
    label: 'Caractère Créatif, Imaginatif & Expressif',
    shortLabel: 'Créatif & Imaginatif',
    icon: '🎨',
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fcd34d',
    oriPro: 'Caractère Créatif, Imaginatif & Expressif',
    description:
      'Vous avez une imagination féconde, un regard personnel sur le monde et une véritable sensibilité esthétique. Vous aimez inventer, concevoir des choses originales et exprimer vos émotions par la créativité et les formes.',
    qualites: ['Imagination fertile', 'Sensibilité artistique', 'Originalité d\'esprit', 'Intuition et spontanéité'],
  },
  nature_agri: {
    key: 'nature_agri',
    label: 'Caractère Observateur, Proche de la Nature & Authentique',
    shortLabel: 'Observateur & Naturel',
    icon: '🌱',
    color: '#16a34a',
    bgColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    oriPro: 'Caractère Observateur, Proche de la Nature & Authentique',
    description:
      'Vous êtes quelqu\'un de posé, franc et attentif à ce qui vous entoure. Vous avez un lien fort avec la nature et le vivant, une grande patience et un bon sens naturel qui vous permet de garder les pieds sur terre.',
    qualites: ['Sens de l\'observation', 'Calme et patience', 'Respect du vivant', 'Bon sens et authenticité'],
  },
};

export const TEST_INTERETS_QUESTIONS = [
  {
    id: 1,
    question: "Pendant votre temps libre ou vos week-ends, quelle activité vous passionne le plus ?",
    options: [
      {
        id: '1a',
        category: 'sciences_tech',
        icon: '💻',
        title: 'Explorer la technologie ou la logique',
        desc: 'Programmer, bricoler des circuits, comprendre le fonctionnement des appareils ou résoudre des énigmes mathématiques.',
      },
      {
        id: '1b',
        category: 'lettres_comm',
        icon: '📖',
        title: 'Lire, écrire et s\'exprimer',
        desc: 'Dévorer des livres, rédiger des récits, apprendre des langues étrangères ou débattre sur des idées d\'actualité.',
      },
      {
        id: '1c',
        category: 'eco_gestion',
        icon: '📈',
        title: 'Entreprendre et organiser',
        desc: 'Imaginer un petit projet commercial, gérer l\'argent, planifier des événements et motiver des camarades.',
      },
      {
        id: '1d',
        category: 'sante_social',
        icon: '❤️',
        title: 'Prendre soin et aider les autres',
        desc: 'Aider un ami en difficulté, faire du bénévolat, expliquer des cours aux plus jeunes ou soigner des proches.',
      },
      {
        id: '1e',
        category: 'arts_creation',
        icon: '🎨',
        title: 'Créer, dessiner ou composer',
        desc: 'Dessiner, faire de la musique, concevoir des visuels graphiques, filmer ou imaginer des œuvres artistiques.',
      },
      {
        id: '1f',
        category: 'nature_agri',
        icon: '🌱',
        title: 'Être au contact de la nature',
        desc: 'Observer les plantes et animaux, jardiner, randonner et s\'intéresser à la protection de l\'environnement malgache.',
      },
    ],
  },
  {
    id: 2,
    question: "Quelle cause humaine ou collective résonne le plus avec vos valeurs profondes ?",
    options: [
      {
        id: '2a',
        category: 'sciences_tech',
        icon: '🚀',
        title: 'Le progrès scientifique et la compréhension du monde',
        desc: 'Comprendre les mystères de l\'univers, la logique des sciences et trouver des solutions ingénieuses.',
      },
      {
        id: '2b',
        category: 'lettres_comm',
        icon: '⚖️',
        title: 'La justice, les droits humains et la culture',
        desc: 'Défendre l\'équité, faire entendre la voix de chacun et transmettre la richesse de nos langues et traditions.',
      },
      {
        id: '2c',
        category: 'eco_gestion',
        icon: '🏢',
        title: 'L\'esprit d\'initiative et l\'autonomie',
        desc: 'Encourager chacun à entreprendre, mener des projets collectifs concrets et dynamiser notre entourage.',
      },
      {
        id: '2d',
        category: 'sante_social',
        icon: '❤️',
        title: 'La solidarité, le soin et la bienveillance',
        desc: 'Venir en aide à ceux qui traversent des épreuves, préserver la santé et apporter une écoute sincère.',
      },
      {
        id: '2e',
        category: 'arts_creation',
        icon: '🎬',
        title: 'L\'art, l\'imaginaire et la liberté d\'expression',
        desc: 'Émouvoir par la musique, l\'image et les mots, et faire rayonner les talents et la créativité.',
      },
      {
        id: '2f',
        category: 'nature_agri',
        icon: '🌳',
        title: 'La protection de la nature et le respect du vivant',
        desc: 'Préserver l\'équilibre de la terre, des forêts et des cours d\'eau, et vivre en harmonie avec le vivant.',
      },
    ],
  },
  {
    id: 3,
    question: "Quel trait de votre personnalité vos amis et proches remarquent-ils le plus chez vous ?",
    options: [
      {
        id: '3a',
        category: 'sciences_tech',
        icon: '🔬',
        title: 'Rationnel, méthodique et persévérant',
        desc: 'Vous cherchez toujours la cause exacte des choses avec logique et rigueur intellectuelle.',
      },
      {
        id: '3b',
        category: 'lettres_comm',
        icon: '🗣️',
        title: 'Éloquent, sensible et à l\'aise avec les mots',
        desc: 'Vous trouvez les mots justes, vous aimez argumenter et vous appréciez les belles formulations.',
      },
      {
        id: '3c',
        category: 'eco_gestion',
        icon: '🤝',
        title: 'Leader, négociateur et orienté résultats',
        desc: 'Vous aimez prendre des initiatives, rassembler les gens autour d\'un but et trouver des solutions pratiques.',
      },
      {
        id: '3d',
        category: 'sante_social',
        icon: '🤗',
        title: 'Empathique, généreux et à l\'écoute',
        desc: 'Vous ressentez les émotions des autres et vous êtes toujours prêt à soutenir et réconforter.',
      },
      {
        id: '3e',
        category: 'arts_creation',
        icon: '✨',
        title: 'Imaginatif, original et sensible à la beauté',
        desc: 'Vous voyez le monde sous un angle différent et vous avez toujours mille idées créatives.',
      },
      {
        id: '3f',
        category: 'nature_agri',
        icon: '🌾',
        title: 'Pragmatique, attentif au vivant et patient',
        desc: 'Vous avez le sens de l\'observation concrète, vous aimez le travail de terrain et le respect de la vie.',
      },
    ],
  },
  {
    id: 4,
    question: "Lors d'un moment en groupe ou d'un projet commun, quelle est votre posture naturelle ?",
    options: [
      {
        id: '4a',
        category: 'sciences_tech',
        icon: '⚙️',
        title: 'L\'esprit posé et méthodique',
        desc: 'Observer calmement, vérifier les détails avec logique et structurer les étapes avec clarté.',
      },
      {
        id: '4b',
        category: 'lettres_comm',
        icon: '📝',
        title: 'Le porte-parole à l\'écoute',
        desc: 'Faciliter le dialogue, exprimer les idées avec nuance et veiller à une communication fluide.',
      },
      {
        id: '4c',
        category: 'eco_gestion',
        icon: '📋',
        title: 'Le moteur du groupe',
        desc: 'Encourager tout le monde, proposer des actions concrètes et maintenir l\'élan collectif.',
      },
      {
        id: '4d',
        category: 'sante_social',
        icon: '🕊️',
        title: 'Le soutien attentionné',
        desc: 'Veiller à ce que chacun se sente respecté, encouragé et écouté dans une ambiance sereine.',
      },
      {
        id: '4e',
        category: 'arts_creation',
        icon: '🎨',
        title: 'L\'esprit créatif et original',
        desc: 'Apporter un regard neuf, imaginer des pistes inattendues et soigner la beauté d\'ensemble.',
      },
      {
        id: '4f',
        category: 'nature_agri',
        icon: '🔍',
        title: 'Le réaliste de bon sens',
        desc: 'Garder les pieds sur terre, privilégier les solutions simples et observer avec patience.',
      },
    ],
  },
  {
    id: 5,
    question: "Quel sujet de documentaire ou d'article capte immédiatement toute votre attention ?",
    options: [
      {
        id: '5a',
        category: 'sciences_tech',
        icon: '🤖',
        title: 'Les mystères de l\'univers et l\'intelligence artificielle',
        desc: 'Les robots du futur, les trous noirs, la physique quantique et les algorithmes informatiques.',
      },
      {
        id: '5b',
        category: 'lettres_comm',
        icon: '📜',
        title: 'Les grands récits de l\'histoire et les chefs-d\'œuvre littéraires',
        desc: 'Les discours historiques célèbres, les secrets des langues et les grandes révolutions humaines.',
      },
      {
        id: '5c',
        category: 'eco_gestion',
        icon: '💼',
        title: 'La trajectoire des personnes audacieuses et entreprenantes',
        desc: 'Comment naît une grande idée, comment se nouent les coopérations et se bâtissent les réussites.',
      },
      {
        id: '5d',
        category: 'sante_social',
        icon: '🩺',
        title: 'Les actes de courage et le dévouement pour autrui',
        desc: 'Les missions humanitaires, les découvertes médicales qui sauvent des vies et l\'entraide humaine.',
      },
      {
        id: '5e',
        category: 'arts_creation',
        icon: '🎭',
        title: 'Les coulisses d\'un atelier de création ou de spectacle',
        desc: 'La confection d\'un film, la composition d\'une œuvre musicale ou la création architecturale.',
      },
      {
        id: '5f',
        category: 'nature_agri',
        icon: '🌿',
        title: 'La vie sauvage fascinante et la force de la nature',
        desc: 'Les espèces endémiques de Madagascar, les forêts primaires et la beauté des cycles naturels.',
      },
    ],
  },
  {
    id: 6,
    question: "Dans quel cadre ou atmosphère vous sentez-vous le plus épanoui(e) au quotidien ?",
    options: [
      {
        id: '6a',
        category: 'sciences_tech',
        icon: '🧩',
        title: 'Un espace calme et studieux',
        desc: 'Où vous pouvez vous concentrer en paix, approfondir un sujet et résoudre des énigmes logiques.',
      },
      {
        id: '6b',
        category: 'lettres_comm',
        icon: '💬',
        title: 'Un cadre d\'échange et d\'ouverture',
        desc: 'Où la parole est libre, où l\'on apprend des autres et où l\'on partage des réflexions stimulantes.',
      },
      {
        id: '6c',
        category: 'eco_gestion',
        icon: '⚡',
        title: 'Un environnement actif et motivant',
        desc: 'Où les initiatives sont encouragées, où l\'on relève des challenges et où les projets prennent vie.',
      },
      {
        id: '6d',
        category: 'sante_social',
        icon: '🤝',
        title: 'Une ambiance chaleureuse et solidaire',
        desc: 'Où la bienveillance et le respect mutuel sont prioritaires, et où l\'on veille les uns sur les autres.',
      },
      {
        id: '6e',
        category: 'arts_creation',
        icon: '🎨',
        title: 'Un lieu d\'inspiration et de liberté',
        desc: 'Un espace stimulant où l\'imagination s\'exprime librement à travers les sons, les mots et les images.',
      },
      {
        id: '6f',
        category: 'nature_agri',
        icon: '🏞️',
        title: 'Le grand air et le contact avec la nature',
        desc: 'Un cadre vivant, paisible et enraciné, au contact de la terre, des plantes et des éléments vivants.',
      },
    ],
  },
  {
    id: 7,
    question: "Face à une situation imprévue et complexe, quelle est votre première réaction ?",
    options: [
      {
        id: '7a',
        category: 'sciences_tech',
        icon: '🧩',
        title: 'Décortiquer méthodiquement le problème',
        desc: 'Analyser les faits étape par étape pour identifier l\'origine logique de la panne ou du blocage.',
      },
      {
        id: '7b',
        category: 'lettres_comm',
        icon: '💬',
        title: 'Dialoguer et rechercher des arguments solides',
        desc: 'Poser les bonnes questions, consulter des textes fiables et convaincre par la parole.',
      },
      {
        id: '7c',
        category: 'eco_gestion',
        icon: '⚡',
        title: 'Agir avec efficacité et pragmatisme',
        desc: 'Calculer le meilleur rapport bénéfice/risque et prendre une décision rapide sans hésiter.',
      },
      {
        id: '7d',
        category: 'sante_social',
        icon: '🤝',
        title: 'Rassurer les personnes touchées',
        desc: 'Veiller avant tout à la sécurité et au moral de son entourage avant de chercher la solution.',
      },
      {
        id: '7e',
        category: 'arts_creation',
        icon: '💡',
        title: 'Trouver une issue créative et originale',
        desc: 'Penser « en dehors du cadre » pour imaginer une solution inédite que personne n\'avait envisagée.',
      },
      {
        id: '7f',
        category: 'nature_agri',
        icon: '⏳',
        title: 'Observer avec patience et bon sens',
        desc: 'Prendre le recul nécessaire, observer l\'évolution naturelle des choses et agir avec pragmatisme.',
      },
    ],
  },
];

// Calcul des résultats du Test 1
export function computeOrientation1(answers = {}) {
  const scores = {
    sciences_tech: 0,
    lettres_comm: 0,
    eco_gestion: 0,
    sante_social: 0,
    arts_creation: 0,
    nature_agri: 0,
  };

  // Trouver la catégorie associée à chaque réponse choisie
  TEST_INTERETS_QUESTIONS.forEach((q, index) => {
    const selectedOptId = answers[index];
    if (selectedOptId) {
      const opt = q.options.find((o) => o.id === selectedOptId);
      if (opt && opt.category && scores[opt.category] !== undefined) {
        scores[opt.category] += 1;
      }
    }
  });

  // Trier les catégories par score décroissant
  const sortedCategories = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  const dominantKey = sortedCategories[0] || 'sciences_tech';
  const secondaryKey = sortedCategories[1] || 'lettres_comm';

  const dominantCat = TEST_INTERETS_CATEGORIES[dominantKey];
  const secondaryCat = TEST_INTERETS_CATEGORIES[secondaryKey];

  const centresInteret = [dominantCat.label, secondaryCat.label];
  const orientationProvisoire1 = dominantCat.oriPro;

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
// TÂCHE 3 : QUESTIONNAIRE DES MATIÈRES & APTITUDES
// ========================================================

export const LISTE_MATIERES_DISPONIBLES = [
  { id: 'maths', label: 'Mathématiques', icon: '📐', pole: 'sciences_exactes' },
  { id: 'physique', label: 'Physique - Chimie', icon: '⚗️', pole: 'sciences_exactes' },
  { id: 'svt', label: 'Sciences de la Vie et de la Terre (SVT)', icon: '🌿', pole: 'sciences_vie_sante' },
  { id: 'francais', label: 'Français & Littérature', icon: '✍️', pole: 'lettres_langues' },
  { id: 'malagasy', label: 'Malagasy (Teny sy Fomba)', icon: '🇲🇬', pole: 'lettres_langues' },
  { id: 'anglais', label: 'Anglais (English)', icon: '🌍', pole: 'lettres_langues' },
  { id: 'histoire_geo', label: 'Histoire - Géographie', icon: '🗺️', pole: 'eco_societe' },
  { id: 'ses', label: 'Sciences Économiques & Sociales (SES)', icon: '📊', pole: 'eco_societe' },
  { id: 'informatique', label: 'Informatique & Technologie', icon: '💻', pole: 'technique_appliquee' },
  { id: 'philo', label: 'Philosophie & Pensée Critique', icon: '💡', pole: 'lettres_langues' },
];

export const LISTE_APTITUDES = [
  {
    id: 'apt_calcul',
    pole: 'sciences_exactes',
    label: 'Calcul mental, algèbre et rigueur chiffrée',
    desc: 'Facilité à résoudre des équations, mémoriser des formules et raisonner abstraitement.',
  },
  {
    id: 'apt_redaction',
    pole: 'lettres_langues',
    label: 'Rédaction écrite, orthographe et clarté d\'idées',
    desc: 'Aisance pour rédiger des dissertations, exprimer vos pensées avec précision et vocabulaire riche.',
  },
  {
    id: 'apt_oral',
    pole: 'lettres_langues',
    label: 'Prise de parole en public et argumentation',
    desc: 'Facilité à débattre, défendre un point de vue et captiver un auditoire à l\'oral.',
  },
  {
    id: 'apt_observation',
    pole: 'sciences_vie_sante',
    label: 'Démarche expérimentale et observation du vivant',
    desc: 'Curiosité pour les mécanismes biologiques, la nature vivante et l\'expérimentation scientifique.',
  },
  {
    id: 'apt_analyse_societe',
    pole: 'eco_societe',
    label: 'Compréhension du monde, de l\'histoire et de la société',
    desc: 'Intérêt pour l\'actualité, l\'évolution historique, la géopolitique et l\'économie.',
  },
  {
    id: 'apt_technique',
    pole: 'technique_appliquee',
    label: 'Pratique manuelle, sens technique et logique informatique',
    desc: 'Sens pratique pour le montage, le bricolage, la conception technique et le code informatique.',
  },
];

export const TEST_MATIERES_POLES = {
  sciences_exactes: {
    key: 'sciences_exactes',
    label: 'Sciences Exactes, Mathématiques & Ingénierie',
    icon: '📐',
    color: '#1d4ed8',
    bgColor: '#eff6ff',
    borderColor: '#93c5fd',
    oriPro: 'Sciences Exactes, Mathématiques & Ingénierie',
    description:
      'Vos facilités en Mathématiques et Physique-Chimie, alliées à votre rigueur de raisonnement, vous orientent naturellement vers les études scientifiques approfondies et les métiers d\'ingénieur.',
    recommandations: 'Série Scientifique S (spécialité C ou dominante Mathématiques / Physique)',
    debouches: 'Génie civil, Informatique & Algorithmique, Télécoms, Aéronautique, Statistiques, Énergies',
  },
  sciences_vie_sante: {
    key: 'sciences_vie_sante',
    label: 'Sciences Biologiques, Santé & Médecine',
    icon: '🌿',
    color: '#047857',
    bgColor: '#ecfdf5',
    borderColor: '#6ee7b7',
    oriPro: 'Sciences Biologiques, Santé & Médecine',
    description:
      'Vos atouts en SVT et Sciences Physiques, enrichis par votre goût pour l\'observation expérimentale et le vivant, constituent d\'excellents repères pour les carrières médicales, biologiques ou vétérinaires.',
    recommandations: 'Série Scientifique S (spécialité D - dominante SVT & Chimie)',
    debouches: 'Médecine générale & spécialisée, Pharmacie, Dentaire, Agronomie & Foresterie, Biologie',
  },
  lettres_langues: {
    key: 'lettres_langues',
    label: 'Lettres, Langues & Sciences Humaines',
    icon: '✍️',
    color: '#7e22ce',
    bgColor: '#faf5ff',
    borderColor: '#d8b4fe',
    oriPro: 'Lettres, Langues & Sciences Humaines',
    description:
      'Votre aisance dans les matières d\'expression (Français, Malagasy, Anglais, Philosophie) et vos qualités de réflexion constituent un tremplin privilégié pour briller dans le droit, la communication et les sciences humaines.',
    recommandations: 'Série Littéraire L (spécialité A1, A2 ou Langues Vivantes)',
    debouches: 'Droit, Magistrature, Diplomatie, Traduction, Enseignement, Journalisme',
  },
  eco_societe: {
    key: 'eco_societe',
    label: 'Sciences Économiques, Sociales & Gestion',
    icon: '📊',
    color: '#b45309',
    bgColor: '#fffbeb',
    borderColor: '#fcd34d',
    oriPro: 'Sciences Économiques, Sociales & Gestion',
    description:
      'Votre compréhension de l\'Histoire-Géo, des sciences économiques et des grands enjeux de société vous positionne idéalement pour les métiers de l\'économie, du management et de l\'administration.',
    recommandations: 'Série Économique et Sociale (OSE / B)',
    debouches: 'Économie, Comptabilité & Finance, Gestion d\'entreprises, Marketing, Ressources Humaines',
  },
  technique_appliquee: {
    key: 'technique_appliquee',
    label: 'Sciences Appliquées, Informatique & Technologies',
    icon: '💻',
    color: '#0f766e',
    bgColor: '#f0fdfa',
    borderColor: '#99f6e4',
    oriPro: 'Sciences Appliquées, Informatique & Technologies',
    description:
      'Votre esprit pratique et vos aptitudes techniques et informatiques sont des forces précieuses pour réussir dans les formations technologiques concrètes et innovantes.',
    recommandations: 'Série Technique (Génie Civil, Électronique, Maintenance Informatique ou Filières Tertiaires)',
    debouches: 'Développement de logiciels, Maintenance systèmes & réseaux, Électromécanique, Travaux publics',
  },
};

// Calcul indépendant de l'Orientation Provisoire 2
export function computeOrientation2(favoriteSubjectIds = [], aptitudeRatings = {}) {
  const scoresByPole = {
    sciences_exactes: 0,
    sciences_vie_sante: 0,
    lettres_langues: 0,
    eco_societe: 0,
    technique_appliquee: 0,
  };

  // 1. Points attribués par les matières favorites (+3 pts par matière sélectionnée)
  favoriteSubjectIds.forEach((subjId) => {
    const subj = LISTE_MATIERES_DISPONIBLES.find((s) => s.id === subjId);
    if (subj && scoresByPole[subj.pole] !== undefined) {
      scoresByPole[subj.pole] += 3;
    }
  });

  // 2. Points attribués par l'auto-évaluation des aptitudes (1 à 4 pts)
  LISTE_APTITUDES.forEach((apt) => {
    const rating = aptitudeRatings[apt.id] || 2; // niveau par défaut 2 (Moyen)
    if (scoresByPole[apt.pole] !== undefined) {
      scoresByPole[apt.pole] += rating;
    }
  });

  // 3. Déterminer le pôle gagnant (indépendamment du Test 1)
  const sortedPoles = Object.keys(scoresByPole).sort((a, b) => scoresByPole[b] - scoresByPole[a]);
  const dominantPoleKey = sortedPoles[0] || 'sciences_exactes';
  const dominantPole = TEST_MATIERES_POLES[dominantPoleKey];

  // Liste des matières préférées textuelles
  const matieresPreferees = favoriteSubjectIds
    .map((id) => {
      const s = LISTE_MATIERES_DISPONIBLES.find((item) => item.id === id);
      return s ? s.label : null;
    })
    .filter(Boolean);

  const orientationProvisoire2 = dominantPole.oriPro;

  return {
    dominantPoleKey,
    dominantPole,
    scoresByPole,
    matieresPreferees,
    orientationProvisoire2,
    details: {
      scoresByPole,
      dominantPoleKey,
      dominantPoleLabel: dominantPole.label,
      favoriteSubjectIds,
      aptitudeRatings,
    },
  };
}

