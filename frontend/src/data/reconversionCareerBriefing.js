// ========================================================
// MOTEUR DE CONSEILS & BILAN D'ACCÈS À L'EMPLOI e-HARI
// Adapté à toute personne souhaitant trouver l'emploi correspondant
// à son profil (débutants, demandeurs d'emploi, autodidactes ou en évolution)
// Plateforme e-HARI (ONG HARI Madagascar)
// ========================================================

import {
  TEST_RECONVERSION_INTERETS_CATEGORIES,
  TEST_RECONVERSION_POLES_INSERTION,
} from './reconversionOrientationTests';

// Résolution de la clé de profil professionnel
export function resolveReconversionPersonalityKey(keyOrLabel) {
  if (!keyOrLabel) return 'tech_numerique';
  if (TEST_RECONVERSION_INTERETS_CATEGORIES[keyOrLabel]) return keyOrLabel;

  const found = Object.values(TEST_RECONVERSION_INTERETS_CATEGORIES).find(
    (c) =>
      c.label.toLowerCase() === keyOrLabel.toLowerCase() ||
      c.oriPro.toLowerCase() === keyOrLabel.toLowerCase() ||
      c.shortLabel.toLowerCase() === keyOrLabel.toLowerCase()
  );
  if (found) return found.key;

  const low = keyOrLabel.toLowerCase();
  if (low.includes('numérique') || low.includes('digital') || low.includes('tech') || low.includes('web')) return 'tech_numerique';
  if (low.includes('créateur') || low.includes('indépendant') || low.includes('entrepreneur') || low.includes('commerce')) return 'entrepreneuriat_agri';
  if (low.includes('stratège') || low.includes('conseil') || low.includes('management') || low.includes('organisation') || low.includes('projet')) return 'management_conseil';
  if (low.includes('sens') || low.includes('écologie') || low.includes('impact') || low.includes('vert') || low.includes('durable')) return 'impact_vert_rse';
  if (low.includes('humain') || low.includes('rh') || low.includes('formation') || low.includes('recrutement')) return 'formation_rh_humain';
  if (low.includes('logistique') || low.includes('terrain') || low.includes('qualité') || low.includes('opérations') || low.includes('stocks')) return 'expertise_terrain_qualite';

  return 'tech_numerique';
}

// Résolution de la clé du pôle d'emploi cible
export function resolveReconversionPoleKey(keyOrLabel) {
  if (!keyOrLabel) return 'pole_tech_digital';
  if (TEST_RECONVERSION_POLES_INSERTION[keyOrLabel]) return keyOrLabel;

  const found = Object.values(TEST_RECONVERSION_POLES_INSERTION).find(
    (p) =>
      p.label.toLowerCase() === keyOrLabel.toLowerCase() ||
      p.oriPro.toLowerCase() === keyOrLabel.toLowerCase()
  );
  if (found) return found.key;

  const low = keyOrLabel.toLowerCase();
  if (low.includes('numérique') || low.includes('web') || low.includes('digital') || low.includes('data')) return 'pole_tech_digital';
  if (low.includes('entrepreneuriat') || low.includes('commerce') || low.includes('business')) return 'pole_entrepreneuriat';
  if (low.includes('conseil') || low.includes('organisation') || low.includes('projet')) return 'pole_conseil_management';
  if (low.includes('agro') || low.includes('écologie') || low.includes('rse') || low.includes('durable')) return 'pole_agro_ecologie';
  if (low.includes('rh') || low.includes('formation') || low.includes('recrutement') || low.includes('humain')) return 'pole_rh_formation';
  if (low.includes('logistique') || low.includes('supply') || low.includes('stocks') || low.includes('qualité')) return 'pole_logistique_supply';

  return 'pole_tech_digital';
}

// Données stratégiques détaillées par pôle d'emploi à Madagascar
const RECONVERSION_POLES_DATA = {
  pole_tech_digital: {
    title: 'Pôle Technologies Numériques, Développement Web & Data',
    icon: '💻',
    color: '#2563eb',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    contexteMadagascar:
      'À Madagascar, le secteur des technologies et des services numériques (ESN, agences web, start-ups, centres d\'externalisation informatique) connaît une demande continue de talents motivés. Les recruteurs recherchent particulièrement la curiosité technique, la rigueur logique et l\'envie d\'apprendre par la pratique.',
    metiersPrioritaires: [
      { nom: 'Développeur Web / Mobile (Full-Stack)', secteur: 'ESN, Start-ups, Agences Digitales', profilType: 'Accessible après 3 à 6 mois de pratique intensive' },
      { nom: 'Assistant Data & Gestionnaire de Bases de Données', secteur: 'Banques, Assurances, Entreprises B2B', profilType: 'Idéal pour profils méthodiques et organisés' },
      { nom: 'Chargé de Support Applicatif & Outils No-Code', secteur: 'Entreprises de services, Cabinets', profilType: 'Mise en œuvre rapide sans compétences mathématiques lourdes' },
      { nom: 'Community Manager & Créateur de Contenu Digital', secteur: 'Marques locales, E-commerce, Médias', profilType: 'Aisance relationnelle, créativité et présence sur les réseaux' },
    ],
    recommandationsTransition: {
      en_poste: 'Consolidez votre socle de compétences en vous formant le soir ou le week-end (HTML/CSS, JavaScript, Python ou outils no-code), puis réalisez un mini-projet concret avant de postuler.',
      recherche_emploi: 'Consacrez votre temps à une formation pratique intensive de 3 à 6 mois. Bâtissez 2 ou 3 projets démonstrateurs en ligne (portfolio GitHub ou site web) pour prouver votre savoir-faire directement.',
      independant: 'Proposez des services ciblés aux TPE et commerces locaux : création de pages Facebook professionnelles, sites vitrines, numérisation de fiches clients ou petits catalogues en ligne.',
    },
    certificationsRecommandees: [
      { code: 'Code & Web', nom: 'FreeCodeCamp / Meta Front-End & Back-End Developer Certification', impact: 'Preuve concrète de savoir-faire pratique' },
      { code: 'Data', nom: 'Google Data Analytics Professional Certificate', impact: 'Idéal pour valoriser un esprit analytique' },
      { code: 'Bureautique', nom: 'Maîtrise Excel Avancé & Outils Collaboratifs Cloud (Google Workspace)', impact: 'Atout immédiat en entreprise à Madagascar' },
    ],
    planDaction: [
      'Valider son socle technique : consacrer 10 à 15 heures par semaine à la pratique concrète du code, du design ou de la gestion de données.',
      'Bâtir 2 projets démonstrateurs réels et les rendre consultables en ligne pour convaincre les recruteurs de votre motivation.',
      'Rejoindre la communauté tech et digitale d\'Antananarivo (meetups tech, groupes LinkedIn ONG HARI) pour élargir son réseau.',
      'Réaliser une première mission pratique, un stage d\'insertion ou un projet bénévole pour sécuriser une première référence.',
    ],
  },
  pole_entrepreneuriat: {
    title: 'Pôle Commerce, Entrepreneuriat & Métiers Indépendants',
    icon: '🚀',
    color: '#d97706',
    gradient: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
    contexteMadagascar:
      'L\'esprit d\'entreprise est le principal moteur de création d\'activités à Madagascar. Face aux besoins locaux en produits de proximité, services de distribution et artisanat de qualité, un profil doté de bon sens commercial et de persévérance peut rapidement générer ses propres revenus.',
    metiersPrioritaires: [
      { nom: 'Créateur de Micro-Entreprise de Proximité', secteur: 'Alimentation, Services, Équipement', profilType: 'Répond à un besoin concret et quotidien du quartier' },
      { nom: 'Commerçant Spécialisé / Vendeur en Ligne (E-commerce)', secteur: 'Mode, Produits locaux, High-Tech', profilType: 'Faible coût de démarrage grâce aux réseaux sociaux' },
      { nom: 'Prestataire de Services Indépendant', secteur: 'Comptabilité, Maintenance, Démarches administratives', profilType: 'Valorise un savoir-faire pratique sans stock physique' },
      { nom: 'Artisan / Transformateur de Produits Locaux', secteur: 'Épices, Vanille, Miel, Artisanat d\'art', profilType: 'Fort potentiel de valorisation et de vente locale' },
    ],
    recommandationsTransition: {
      en_poste: 'Testez votre idée le week-end à petite échelle. Validez l\'intérêt de vos premiers clients avant d\'engager des dépenses importantes.',
      recherche_emploi: 'Évaluez les besoins non satisfaits autour de vous. Construisez une offre simple, chiffrez vos coûts de départ et commencez avec des moyens modestes pour tester rapidement le marché.',
      independant: 'Améliorez votre visibilité (page professionnelle, bouche-à-oreille soigné, tarifs clairs) et établissez des relations durables avec vos clients fidèles.',
    },
    certificationsRecommandees: [
      { code: 'Gestion', nom: 'Formation Gestion de Trésorerie & Micro-Entreprise (ONG HARI)', impact: 'Apprentissage des bases du calcul de marge et du bénéfice réel' },
      { code: 'Vente', nom: 'Techniques de Prospection & Négociation Commerciale', impact: 'Aisance pour convaincre et fidéliser les clients' },
      { code: 'Marketing', nom: 'Vente & Visibilité sur Réseaux Sociaux (Facebook & WhatsApp Business)', impact: 'Canal n°1 d\'acquisition client à Madagascar' },
    ],
    planDaction: [
      'Tester son produit ou service auprès d\'au moins 15 clients potentiels pour vérifier le prix acceptable et l\'intérêt réel.',
      'Établir un budget prévisionnel simple sur 3 mois : coûts de départ, prix de vente et bénéfice net estimé.',
      'Organiser ses premiers outils de travail et formaliser son activité (statut adapté, registre, NIF si applicable).',
      'Lancer les premières ventes et réinvestir une partie des premiers gains dans l\'amélioration de l\'activité.',
    ],
  },
  pole_conseil_management: {
    key: 'pole_conseil_management',
    title: 'Pôle Organisation, Gestion de Projet & Coordination',
    icon: '📊',
    color: '#059669',
    gradient: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
    contexteMadagascar:
      'Les entreprises et institutions malgaches ont un besoin croissant de personnes structurées capables d\'assurer le suivi des opérations, d\'organiser les méthodes de travail et de veiller au respect des plannings et budgets.',
    metiersPrioritaires: [
      { nom: 'Assistant / Coordinateur de Projet', secteur: 'Entreprises de services, Télécoms, ONG', profilType: 'Coordination quotidienne des tâches et compte-rendu d\'avancement' },
      { nom: 'Chargé de Suivi Administratif & Opérationnel', secteur: 'PME, Import/Export, Bâtiment', profilType: 'Rigueur dans la gestion des dossiers et des délais' },
      { nom: 'Superviseur d\'Équipe Opérationnelle', secteur: 'Distribution, BPO, Centres d\'appels', profilType: 'Animation d\'équipe, suivi des objectifs et esprit d\'équité' },
      { nom: 'Assistant Contrôle de Gestion & Méthodes', secteur: 'Sociétés industrielles, Banques, Moyennes entreprises', profilType: 'Analyse des chiffres et recherche d\'efficacité' },
    ],
    recommandationsTransition: {
      en_poste: 'Portez-vous volontaire pour organiser de nouveaux dossiers ou structurer des processus internes pour valoriser votre rôle.',
      recherche_emploi: 'Mettez en avant dans votre candidature votre rigueur, votre sens du détail et votre maîtrise des outils de suivi (tableaux Excel, plannings, comptes-rendus soignés).',
      independant: 'Proposez des prestations d\'organisation administrative ou de réorganisation documentaire aux PME locales submergées par la gestion courante.',
    },
    certificationsRecommandees: [
      { code: 'Projets', nom: 'Fondamentaux de la Gestion de Projet (CAPM / PMI ou équivalent)', impact: 'Méthodologie reconnue pour piloter des livrables' },
      { code: 'Agilité', nom: 'Scrum Fundamentals / Notions de Méthodes Agiles', impact: 'Très apprécié dans les structures modernes' },
      { code: 'Excel', nom: 'Certification Tableaux de Bord & Fonctions Avancées Excel', impact: 'Compétence reine pour tous les postes d\'organisation' },
    ],
    planDaction: [
      'Restructurer son CV pour mettre en valeur les réalisations concrètes : projets menés, délais tenus, résultats mesurables.',
      'S\'entraîner à concevoir des tableaux de bord clairs et des plannings visuels sous Excel ou Notion.',
      'Postuler de manière ciblée auprès des entreprises de taille intermédiaire à Antananarivo et en provinces.',
      'Préparer ses entretiens en illustrant son sens de l\'organisation par des exemples vécus précis.',
    ],
  },
  pole_agro_ecologie: {
    key: 'pole_agro_ecologie',
    title: 'Pôle Développement Durable, Agro-écologie & RSE',
    icon: '🌱',
    color: '#16a34a',
    gradient: 'linear-gradient(135deg, #14532d 0%, #16a34a 100%)',
    contexteMadagascar:
      'Avec la richesse unique de la biodiversité malgache et l\'importance de l\'agriculture, les métiers verts, l\'agro-écologie, les énergies solaires et les projets associatifs représentent un réservoir d\'emplois porteurs de sens et d\'avenir.',
    metiersPrioritaires: [
      { nom: 'Animateur de Projet Agricole & Filières Durables', secteur: 'ONG, Projets ruraux, Coopératives', profilType: 'Sensibilisation des producteurs et suivi des cultures saines' },
      { nom: 'Assistant RSE & Transition Écologique en Entreprise', secteur: 'Agro-alimentaire, Textile responsable, Mines', profilType: 'Mise en place de bonnes pratiques environnementales' },
      { nom: 'Technicien / Installateur en Énergie Solaire', secteur: 'Entreprises solaires, Électrification rurale', profilType: 'Compétence technique pratique très recherchée en province' },
      { nom: 'Chargé de Terrain & Animation Communautaire', secteur: 'Associations, ONG locales et internationales', profilType: 'Écoute, dynamisme de terrain et proximité humaine' },
    ],
    recommandationsTransition: {
      en_poste: 'Engagez des initiatives écologiques simples au sein de votre environnement (gestion des déchets, économies d\'énergie) pour créer une première référence.',
      recherche_emploi: 'Rapprochez-vous des ONG, projets environnementaux et entreprises solaires locales en mettant en avant votre disponibilité terrain et votre intégrité.',
      independant: 'Explorez la valorisation de produits naturels ou d\'agro-écologie en circuit court dans votre région.',
    },
    certificationsRecommandees: [
      { code: 'Énergie', nom: 'Formation Pratique en Énergie Solaire Photovoltaïque', impact: 'Débouchés immédiats partout à Madagascar' },
      { code: 'Projets', nom: 'Gestion de Cycle de Projet de Développement Communautaire', impact: 'Très recherché par les ONG et associations' },
      { code: 'Qualité', nom: 'Normes d\'Agriculture Biologique & Bonnes Pratiques d\'Hygiène', impact: 'Atout pour les coopératives et exportateurs' },
    ],
    planDaction: [
      'S\'informer sur les projets écologiques et humanitaires en cours à Madagascar (GIZ, WWF, ONG partenaires HARI).',
      'Participer à une mission bénévole ou un projet de terrain pour démontrer son implication pratique.',
      'Cibler les postes d\'animateurs de terrain ou techniciens en valorisant sa polyvalence et sa mobilité.',
      'Construire une candidature axée sur sa motivation éthique et son sérieux opérationnel.',
    ],
  },
  pole_rh_formation: {
    key: 'pole_rh_formation',
    title: 'Pôle Ressources Humaines, Formation & Recrutement',
    icon: '🤝',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
    contexteMadagascar:
      'Avec le développement des centres d\'appels, du BPO et des entreprises de services, le recrutement, l\'intégration des collaborateurs et la formation professionnelle sont au cœur de la performance des entreprises malgaches.',
    metiersPrioritaires: [
      { nom: 'Chargé de Recrutement & Sourcing de Profils', secteur: 'Centres de contact, BPO, ESN, Cabinets RH', profilType: 'Présélection, entretiens téléphoniques et diffusion d\'annonces' },
      { nom: 'Formateur Professionnel / Facilitateur d\'Ateliers', secteur: 'Instituts de formation, Entreprises, ONG', profilType: 'Pédagogie d\'animation et sens de la transmission' },
      { nom: 'Conseiller en Insertion & Orientation Professionnelle', secteur: 'Structures d\'aide à l\'emploi, ONG, Écoles', profilType: 'Écoute active, bilan de compétences et accompagnement' },
      { nom: 'Assistant Ressources Humaines & Gestion du Personnel', secteur: 'PME, Hôtellerie, Entreprises de services', profilType: 'Suivi des présences, contrats et vie des salariés' },
    ],
    recommandationsTransition: {
      en_poste: 'Participez à l\'accueil et au parrainage des nouveaux arrivants pour mettre en valeur vos talents pédagogiques et relationnels.',
      recherche_emploi: 'Développez votre maîtrise des outils de sourcing (LinkedIn, groupes d\'emploi Facebook) et proposez vos compétences d\'animation ou d\'assistance RH.',
      independant: 'Proposez des ateliers de formation thématiques (expression orale, techniques d\'entretien, efficacité au travail) pour les jeunes et professionnels.',
    },
    certificationsRecommandees: [
      { code: 'Recrutement', nom: 'Techniques d\'Entretiens d\'Embauche & Sourcing Candidats', impact: 'Compétence très demandée par les centres BPO' },
      { code: 'Formation', nom: 'Ingénierie Pédagogique & Animation d\'Ateliers d\'Adultes', impact: 'Reconnaissance pour animer des sessions professionnelles' },
      { code: 'RH', nom: 'Bases de la Gestion Administrative du Personnel à Madagascar', impact: 'Connaissance du Code du travail et des obligations locales' },
    ],
    planDaction: [
      'Concevoir un premier plan d\'atelier pratique ou une grille d\'entretien de recrutement pour montrer sa compétence concrète.',
      'S\'entraîner à animer des échanges en groupe pour affiner sa posture d\'écoute et de dynamisation.',
      'Développer son profil sur LinkedIn et se connecter avec les recruteurs et responsables RH à Madagascar.',
      'Postuler auprès des ESN, centres BPO et organismes de formation d\'Antananarivo.',
    ],
  },
  pole_logistique_supply: {
    key: 'pole_logistique_supply',
    title: 'Pôle Opérations Terrain, Logistique & Qualité',
    icon: '⚙️',
    color: '#0891b2',
    gradient: 'linear-gradient(135deg, #155e75 0%, #0891b2 100%)',
    contexteMadagascar:
      'Dans une économie insulaire comme Madagascar, la gestion des approvisionnements, le stockage des marchandises et la distribution sont indispensables à toutes les entreprises commerciales, importatrices et industrielles.',
    metiersPrioritaires: [
      { nom: 'Gestionnaire de Stocks & Magasinier Référent', secteur: 'Grande distribution, Grossistes, Quincaillerie', profilType: 'Contrôle des entrées/sorties, inventaires et tenue d\'entrepôt' },
      { nom: 'Assistant Logistique & Planification des Livraisons', secteur: 'Messagerie, Transport, E-commerce local', profilType: 'Optimisation des tournées et suivi des livraisons' },
      { nom: 'Agent Contrôle Qualité, Hygiène & Sécurité (QHSE)', secteur: 'Industrie textile, Agro-alimentaire, BTP', profilType: 'Vérification du respect des normes et des règles de sécurité' },
      { nom: 'Assistant Approvisionnements & Achats', secteur: 'Moyennes entreprises, Hôtellerie, Industrie', profilType: 'Suivi des commandes auprès des fournisseurs locaux' },
    ],
    recommandationsTransition: {
      en_poste: 'Observez et analysez les flux de matériel et de marchandises dans votre organisation pour comprendre les enjeux de gestion des stocks.',
      recherche_emploi: 'Mettez en avant votre sens pratique, votre rigueur de comptage et votre ponctualité. Les employeurs recherchent avant tout des personnes fiables et organisées.',
      independant: 'Offrez des services d\'inventaire ponctuel et de réorganisation physique de dépôts aux commerçants de votre zone.',
    },
    certificationsRecommandees: [
      { code: 'Stocks', nom: 'Gestion Pratique des Stocks & Méthodes d\'Inventaire sous Excel', impact: 'Essentiel pour tout poste de magasinier ou logisticien' },
      { code: 'Qualité', nom: 'Initiation aux Normes QHSE & Règles d\'Hygiène Industrielle', impact: 'Atout pour l\'industrie agro-alimentaire et textile' },
      { code: 'Outils', nom: 'Notions de Logiciels de Gestion Commerciale & Stocks (Odoo / Sage)', impact: 'Opérationnel plus vite en entreprise' },
    ],
    planDaction: [
      'Maîtriser les bases du suivi de stocks sur Excel (fiches d\'entrées/sorties, alertes de rupture, calcul de moyenne).',
      'Identifier les zones d\'activités logistiques et commerciales de votre ville (Ankorondrano, Tanjombato, etc.).',
      'Déposer sa candidature directement auprès des dépôts, grossistes et distributeurs de produits courants.',
      'Mettre en avant sa fiabilité, sa condition physique et sa conscience professionnelle lors des entretiens.',
    ],
  },
};

// Fonction principale de génération du bilan d'accès à l'emploi
export function generateReconversionCareerBriefing({
  personalityKeyOrLabel,
  poleKeyOrLabel,
  situationActuelle = 'En recherche d\'opportunité',
  metierActuel = 'Profil Polyvalent',
  anneesExp = 0,
  secteurActuel = 'Domaine Général',
}) {
  const pKey = resolveReconversionPersonalityKey(personalityKeyOrLabel);
  const poleKey = resolveReconversionPoleKey(poleKeyOrLabel);

  const personalityData = TEST_RECONVERSION_INTERETS_CATEGORIES[pKey] || TEST_RECONVERSION_INTERETS_CATEGORIES.tech_numerique;
  const rawPoleData = RECONVERSION_POLES_DATA[poleKey] || RECONVERSION_POLES_DATA.pole_tech_digital;

  const poleData = {
    ...rawPoleData,
    certifications: rawPoleData.certificationsRecommandees || [],
  };

  // Recommandation d'accès à l'emploi personnalisée selon la situation actuelle
  const sitLow = (situationActuelle || '').toLowerCase();
  let transitionConseil = poleData.recommandationsTransition.recherche_emploi;
  if (sitLow.includes('en poste') || sitLow.includes('salarié') || sitLow.includes('salarie') || sitLow.includes('travail') || sitLow.includes('employé')) {
    transitionConseil = poleData.recommandationsTransition.en_poste;
  } else if (sitLow.includes('indépendant') || sitLow.includes('freelance') || sitLow.includes('libéral') || sitLow.includes('créateur')) {
    transitionConseil = poleData.recommandationsTransition.independant;
  }

  return {
    personalityKey: pKey,
    personalityData,
    poleKey,
    poleData,
    situationActuelle: situationActuelle || 'En recherche d\'opportunité',
    metierActuel: metierActuel || 'Profil Polyvalent',
    anneesExp: anneesExp || 0,
    secteurActuel: secteurActuel || 'Domaine d\'Intérêt',
    transitionConseil,
    title: `Bilan d'Orientation & Plan d'Accès à l'Emploi : ${personalityData.shortLabel} × ${poleData.title}`,
    description: `Feuille de route méthodologique sur-mesure pour accéder à un travail épanouissant correspondant à votre profil à Madagascar, valoriser vos talents et réussir votre insertion professionnelle.`,
  };
}
