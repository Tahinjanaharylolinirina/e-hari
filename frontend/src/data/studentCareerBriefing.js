// ========================================================
// MOTEUR DE CONSEILS ET BILAN CARRIÈRE POUR L'ÉTUDIANT e-HARI
// Inspiré de orientationBriefing.js et adapté aux études supérieures
// Plateforme e-HARI (ONG HARI Madagascar)
// ========================================================

import {
  TEST_ETUDIANT_INTERETS_CATEGORIES,
  TEST_ETUDIANT_POLES_INSERTION,
} from './studentOrientationTests';

// Résolution de la clé de personnalité professionnelle
export function resolveStudentPersonalityKey(keyOrLabel) {
  if (!keyOrLabel) return 'tech_ingenierie';
  if (TEST_ETUDIANT_INTERETS_CATEGORIES[keyOrLabel]) return keyOrLabel;

  const found = Object.values(TEST_ETUDIANT_INTERETS_CATEGORIES).find(
    (c) =>
      c.label.toLowerCase() === keyOrLabel.toLowerCase() ||
      c.oriPro.toLowerCase() === keyOrLabel.toLowerCase() ||
      c.shortLabel.toLowerCase() === keyOrLabel.toLowerCase()
  );
  if (found) return found.key;

  const low = keyOrLabel.toLowerCase();
  if (low.includes('bâtisseur') || low.includes('ingénieur') || low.includes('systèmes') || low.includes('tech')) return 'tech_ingenierie';
  if (low.includes('stratège') || low.includes('analyste') || low.includes('finance')) return 'analytique_finance';
  if (low.includes('communicant') || low.includes('marketing') || low.includes('business')) return 'comm_marketing';
  if (low.includes('leader') || low.includes('management') || low.includes('rh')) return 'management_rh';
  if (low.includes('chercheur') || low.includes('scientifique') || low.includes('recherche')) return 'recherche_sciences';
  if (low.includes('défenseur') || low.includes('juriste') || low.includes('droit')) return 'impact_juridique';

  return 'tech_ingenierie';
}

// Résolution de la clé de pôle d'insertion professionnelle
export function resolveStudentPoleKey(keyOrLabel) {
  if (!keyOrLabel) return 'pole_tech';
  if (TEST_ETUDIANT_POLES_INSERTION[keyOrLabel]) return keyOrLabel;

  const found = Object.values(TEST_ETUDIANT_POLES_INSERTION).find(
    (p) =>
      p.label.toLowerCase() === keyOrLabel.toLowerCase() ||
      p.oriPro.toLowerCase() === keyOrLabel.toLowerCase()
  );
  if (found) return found.key;

  const low = keyOrLabel.toLowerCase();
  if (low.includes('ingénierie') || low.includes('technologies') || low.includes('numérique') || low.includes('tech')) return 'pole_tech';
  if (low.includes('finance') || low.includes('audit') || low.includes('banque')) return 'pole_finance';
  if (low.includes('marketing') || low.includes('business') || low.includes('commercial')) return 'pole_business';
  if (low.includes('management') || low.includes('organisations') || low.includes('projets')) return 'pole_management';
  if (low.includes('droit') || low.includes('gouvernance') || low.includes('affaires')) return 'pole_droit';
  if (low.includes('sciences') || low.includes('santé') || low.includes('durable')) return 'pole_sciences';

  return 'pole_tech';
}

// Conseils stratégiques d'insertion professionnelle par pôle
const STUDENT_POLES_DATA = {
  pole_tech: {
    title: 'Pôle Ingénierie, Technologies & Systèmes Numériques',
    icon: '💻',
    color: '#1d4ed8',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    contexteMadagascar:
      'Le secteur technologique à Madagascar connaît une expansion fulgurante (ESN, BPO de haut niveau, start-ups, fintechs et télécoms). Les profils maîtrisant le code propre, le cloud et la sécurité sont très recherchés dès la fin de licence.',
    metiersPrioritaires: [
      { nom: 'Ingénieur Full-Stack / DevOps', salaireIndicatif: 'Marché porteur & opportunités internationales', niveau: 'L3 / Master' },
      { nom: 'Data Engineer & Analyste Big Data', salaireIndicatif: 'Forte demande dans la banque et les télécoms', niveau: 'Master' },
      { nom: 'Administrateur Systèmes, Réseaux & Sécurité', salaireIndicatif: 'Poste clé en infrastructure d\'entreprise', niveau: 'L3 / Master' },
      { nom: 'Chef de Projet Informatique / Product Owner', salaireIndicatif: 'Management agile d\'équipes de développement', niveau: 'Master' },
    ],
    recommandationsStages: {
      l1_l2: 'Stage d\'immersion en support informatique, intégration web ou maintenance réseau pour découvrir l\'organisation d\'un parc d\'entreprise.',
      l3: 'Stage de fin de cycle (Licence) centré sur la réalisation d\'un module logiciel complet, d\'une API ou de la refonte d\'une base de données.',
      master: 'Stage de pré-embauche (PFE) sur un projet d\'architecture logicielle, de déploiement cloud ou d\'audit de sécurité avec soutenance publique.',
    },
    certificationsRecommandees: [
      { code: 'AWS / Cloud', nom: 'AWS Certified Cloud Practitioner ou Solutions Architect', impact: 'Reconnaissance mondiale immédiate' },
      { code: 'Réseaux', nom: 'Cisco CCNA (Routing & Switching / Security)', impact: 'Standard absolu en télécoms' },
      { code: 'Data & IA', nom: 'Google Data Analytics Professional Certificate', impact: 'Très prisé des recruteurs modernes' },
    ],
    planDaction: [
      'Constituer un portfolio GitHub documenté avec au moins 2 projets applicatifs réels déployés en ligne.',
      'Valider au moins une certification internationale reconnue avant la fin de votre cursus.',
      'Participer aux hackathons et tech-meetups d\'Antananarivo pour développer votre réseau de pairs.',
    ],
  },
  pole_finance: {
    title: 'Pôle Audit, Finance, Banque & Stratégie d\'Entreprise',
    icon: '📈',
    color: '#047857',
    gradient: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
    contexteMadagascar:
      'Les cabinets d\'audit internationaux (Big 4) ainsi que les institutions bancaires et microfinances malgaches recrutent activement des diplômés alliant compétences chiffrées et rigueur analytique.',
    metiersPrioritaires: [
      { nom: 'Auditeur Financier Junior / Contrôleur de Gestion', salaireIndicatif: 'Tremplin d\'excellence vers les directions financières', niveau: 'L3 / Master' },
      { nom: 'Analyste Crédit & Risques Bancaires', salaireIndicatif: 'Poste stratégique au sein des banques commerciales', niveau: 'Master' },
      { nom: 'Expert-Comptable Stagiaire / Auditeur Légal', salaireIndicatif: 'Profession réglementée à très forte valeur ajoutée', niveau: 'Master / DSCG' },
      { nom: 'Consultant en Modélisation Financière & BI', salaireIndicatif: 'Recherche avancée pour les fusions et investissements', niveau: 'Master' },
    ],
    recommandationsStages: {
      l1_l2: 'Stage d\'assistance comptable, saisie des opérations courantes et réconciliation bancaire.',
      l3: 'Stage en cabinet d\'expertise ou au contrôle de gestion d\'une PME/grande entreprise (analyse des écarts et budgets).',
      master: 'Stage d\'audit financier de fin d\'études (PFE) avec participation aux missions de commissariat aux comptes et inventaires.',
    },
    certificationsRecommandees: [
      { code: 'Excel & BI', nom: 'Microsoft Office Specialist Excel Expert & Power BI', impact: 'Indispensable pour tout financier moderne' },
      { code: 'Finance', nom: 'CFA (Chartered Financial Analyst) - Préparation Level 1', impact: 'Passeport d\'or pour les banques d\'investissement' },
      { code: 'Audit', nom: 'Certifications en normes comptables IFRS & SYSCOHADA', impact: 'Maîtrise indispensable à Madagascar' },
    ],
    planDaction: [
      'Maîtriser parfaitement Excel avancé (RechercheX, Tableaux Croisés Dynamiques, Power Query et macros).',
      'Suivre l\'actualité financière et économique malgache et régionale (Banque Centrale, lois de finances).',
      'Soigner la présentation rigoureuse de vos rapports financiers et analyses chiffrées.',
    ],
  },
  pole_business: {
    title: 'Pôle Marketing Stratégique, Business Development & E-Commerce',
    icon: '🚀',
    color: '#b45309',
    gradient: 'linear-gradient(135deg, #9a3412 0%, #d97706 100%)',
    contexteMadagascar:
      'Avec la démocratisation du mobile money, du digital et du commerce omnicanal, les entreprises malgaches investissent massivement dans leur acquisition client et leur transformation marketing.',
    metiersPrioritaires: [
      { nom: 'Responsable Marketing Digital & Social Media Manager', salaireIndicatif: 'Rôle central pour l\'image et les ventes digitales', niveau: 'L3 / Master' },
      { nom: 'Business Developer B2B / Responsable Grands Comptes', salaireIndicatif: 'Rémunération attractive liée aux résultats commerciaux', niveau: 'L3 / Master' },
      { nom: 'Chef de Marque / Responsable E-Commerce', salaireIndicatif: 'Pilotage complet des gammes de produits et catalogues', niveau: 'Master' },
      { nom: 'Consultant en Stratégie de Vente & CRM', salaireIndicatif: 'Optimisation des tunnels de conversion et fidélisation', niveau: 'Master' },
    ],
    recommandationsStages: {
      l1_l2: 'Stage en prospection commerciale, gestion des réseaux sociaux ou animation de points de vente.',
      l3: 'Stage en gestion de campagnes publicitaires digitales, création de contenu de marque et relation clients.',
      master: 'Stage de fin d\'études sur le lancement d\'un nouveau service, l\'expansion commerciale ou l\'audit marketing.',
    },
    certificationsRecommandees: [
      { code: 'Google', nom: 'Google Ads Search & Google Analytics 4 (GA4)', impact: 'Certification de base exigée par les agences' },
      { code: 'HubSpot', nom: 'Inbound Marketing & Content Marketing Certification', impact: 'Très valorisée pour la stratégie B2B' },
      { code: 'Meta', nom: 'Meta Certified Digital Marketing Associate', impact: 'Maîtrise des régies Facebook/Instagram/WhatsApp' },
    ],
    planDaction: [
      'Créer et gérer une page ou un projet concret pour prouver votre capacité à générer de l\'engagement mesurable.',
      'Apprendre à utiliser les outils d\'analyse pour mesurer le ROI (Retour sur Investissement) des actions.',
      'Développer votre réseau de contacts sur LinkedIn avec les directeurs commerciaux et marketing.',
    ],
  },
  pole_management: {
    title: 'Pôle Management des Organisations, RH & Pilotage de Projets',
    icon: '🤝',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
    contexteMadagascar:
      'Dans un environnement économique compétitif, la capacité à coordonner les équipes, optimiser les processus et attirer les meilleurs profils constitue un avantage concurrentiel déterminant.',
    metiersPrioritaires: [
      { nom: 'Chef de Projet Organisationnel & Agile Scrum Master', salaireIndicatif: 'Pilotage de la transformation et respect des jalons', niveau: 'L3 / Master' },
      { nom: 'Responsable du Recrutement & Gestion des Talents', salaireIndicatif: 'Attraction, évaluation et fidélisation des collaborateurs', niveau: 'Master' },
      { nom: 'Responsable RSE & Dialogue Social', salaireIndicatif: 'Éthique, bien-être au travail et conformité sociale', niveau: 'Master' },
      { nom: 'Directeur des Opérations / Manager d\'Unité', salaireIndicatif: 'Gouvernance globale et performance opérationnelle', niveau: 'Master' },
    ],
    recommandationsStages: {
      l1_l2: 'Stage d\'observation des flux de travail, support administratif et assistance d\'équipe.',
      l3: 'Stage en ressources humaines (gestion des dossiers, sourcing de candidats) ou assistant chef de projet.',
      master: 'Stage de fin d\'études sur la mise en place d\'une méthodologie agile, d\'une politique RH ou d\'un plan RSE.',
    },
    certificationsRecommandees: [
      { code: 'PMI', nom: 'CAPM (Certified Associate in Project Management) ou PMP', impact: 'Référence mondiale en gestion de projet' },
      { code: 'Agile', nom: 'Professional Scrum Master (PSM I / Scrum.org)', impact: 'Essentiel pour piloter des équipes modernes' },
      { code: 'Qualité', nom: 'Fondamentaux Lean Six Sigma / Kaizen', impact: 'Optimisation continue très prisée en industrie' },
    ],
    planDaction: [
      'Pratiquer les outils collaboratifs professionnels (Trello, Notion, Asana, Jira, Slack).',
      'Travailler votre communication interpersonnelle et votre gestion du stress en public.',
      'S\'engager dans une association étudiante ou ONG pour exercer le leadership sur le terrain.',
    ],
  },
  pole_droit: {
    title: 'Pôle Droit des Affaires, Gouvernance & Relations Internationales',
    icon: '⚖️',
    color: '#b91c1c',
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)',
    contexteMadagascar:
      'La sécurisation des contrats d\'investissement, la conformité anti-blanchiment et le droit minier/foncier font du juriste d\'affaires un partenaire incontournable du développement de Madagascar.',
    metiersPrioritaires: [
      { nom: 'Juriste d\'Entreprise en Droit des Affaires & Contrats', salaireIndicatif: 'Protection légale des opérations et négociations', niveau: 'Master (M2)' },
      { nom: 'Responsable Conformité & Éthique (Compliance Officer)', salaireIndicatif: 'Très recherché dans le secteur bancaire et minier', niveau: 'Master' },
      { nom: 'Avocat d\'Affaires / Conseiller Juridique et Fiscal', salaireIndicatif: 'Exercice libéral ou au sein de cabinets spécialisés', niveau: 'Master + Barreau' },
      { nom: 'Chargé de Mission en Organisation Internationale / Diplomatie', salaireIndicatif: 'Représentation, plaidoyer et accords bilatéraux', niveau: 'Master' },
    ],
    recommandationsStages: {
      l1_l2: 'Stage en greffe, tribunal ou assistance au secrétariat juridique d\'un cabinet.',
      l3: 'Stage en cabinet d\'avocats ou notariat : recherches doctrinales et rédaction d\'actes simples.',
      master: 'Stage d\'audit contractuel ou conformité au sein du service juridique d\'une banque ou multinationale.',
    },
    certificationsRecommandees: [
      { code: 'Affaires', nom: 'Certifications Droit OHADA & Droit Bancaire CEMAC/UEMOA', impact: 'Atout régional décisif' },
      { code: 'Compliance', nom: 'Certifications en Lutte Anti-Blanchiment et Financement du Terrorisme', impact: 'Obligatoire dans la finance' },
      { code: 'Langues', nom: 'TOEFL / IELTS (Niveau B2/C1 en anglais juridique)', impact: 'Incontournable pour les dossiers internationaux' },
    ],
    planDaction: [
      'Suivre l\'évolution de la jurisprudence malgache et des réformes du code des investissements.',
      'Participer à des concours de plaidoirie ou simulations de procès pour parfaire votre éloquence.',
      'Maîtriser la langue anglaise professionnelle en plus du français et du malagasy.',
    ],
  },
  pole_sciences: {
    title: 'Pôle Sciences Appliquées, Santé Publique & Développement Durable',
    icon: '🌿',
    color: '#0f766e',
    gradient: 'linear-gradient(135deg, #134e4a 0%, #0f766e 100%)',
    contexteMadagascar:
      'Madagascar possède une biodiversité unique au monde et des enjeux capitaux d\'autosuffisance alimentaire et de santé publique, offrant un terrain d\'engagement exceptionnel aux scientifiques.',
    metiersPrioritaires: [
      { nom: 'Ingénieur Agronome / Spécialiste Agroécologie', salaireIndicatif: 'Rôle clé dans la transition agricole et la sécurité alimentaire', niveau: 'Master / Diplôme d\'Ingénieur' },
      { nom: 'Épidémiologiste / Responsable de Projet Santé Publique', salaireIndicatif: 'Action sanitaire auprès des institutions et ONG', niveau: 'Master / Doctorat' },
      { nom: 'Expert en Gestion des Ressources Naturelles & Forêts', salaireIndicatif: 'Conservation de la biodiversité et crédits carbone', niveau: 'Master' },
      { nom: 'Responsable Qualité, Hygiène & Sécurité Alimentaire (QHSE)', salaireIndicatif: 'Conformité obligatoire dans les industries agroalimentaires', niveau: 'L3 / Master' },
    ],
    recommandationsStages: {
      l1_l2: 'Stage ouvrier agricole, stage hospitalier de base ou découverte sur le terrain.',
      l3: 'Stage d\'expérimentation en station agronomique ou laboratoire d\'analyses microbiologiques.',
      master: 'Stage de fin d\'études (PFE) sur un projet de recherche appliquée, d\'évaluation d\'impact ou d\'essai clinique.',
    },
    certificationsRecommandees: [
      { code: 'SIG', nom: 'Certifications en Systèmes d\'Information Géographique (QGIS / ArcGIS)', impact: 'Essentiel pour l\'analyse environnementale' },
      { code: 'Qualité', nom: 'Normes HACCP & ISO 22000 (Sécurité des aliments)', impact: 'Exigé par les exportateurs de vanille, cacao, etc.' },
      { code: 'Projet', nom: 'Gestion de projet de développement international (PCM)', impact: 'Très recherché par les bailleurs de fonds' },
    ],
    planDaction: [
      'Allier obligatoirement la théorie de laboratoire à une expérience solide et concrète de terrain.',
      'S\'informer sur les financements de recherche et bourses de mobilité internationale (AUF, Chevening, etc.).',
      'Publier ou présenter des communications lors des journées scientifiques universitaires.',
    ],
  },
};

// Fonction principale de génération du briefing de carrière étudiant
export function generateStudentCareerBriefing({
  personalityKeyOrLabel,
  poleKeyOrLabel,
  studentNiveau = 'Licence',
  studentFiliere = 'Enseignement Supérieur',
  studentEtablissement = 'Université',
}) {
  const pKey = resolveStudentPersonalityKey(personalityKeyOrLabel);
  const poleKey = resolveStudentPoleKey(poleKeyOrLabel);

  const personalityData = TEST_ETUDIANT_INTERETS_CATEGORIES[pKey] || TEST_ETUDIANT_INTERETS_CATEGORIES.tech_ingenierie;
  const rawPoleData = STUDENT_POLES_DATA[poleKey] || STUDENT_POLES_DATA.pole_tech;
  const poleData = {
    ...rawPoleData,
    certifications: rawPoleData.certificationsRecommandees || [],
  };

  // Détermination du conseil de stage selon le niveau d'études
  const nivLow = (studentNiveau || '').toLowerCase();
  let stageConseil = poleData.recommandationsStages.l3;
  if (nivLow.includes('1') || nivLow.includes('2') || nivLow.includes('l1') || nivLow.includes('l2') || nivLow.includes('deug')) {
    stageConseil = poleData.recommandationsStages.l1_l2;
  } else if (nivLow.includes('master') || nivLow.includes('m1') || nivLow.includes('m2') || nivLow.includes('ingénieur') || nivLow.includes('doctorat')) {
    stageConseil = poleData.recommandationsStages.master;
  }

  return {
    personalityKey: pKey,
    personalityData,
    poleKey,
    poleData,
    studentNiveau: studentNiveau || 'Universitaire',
    studentFiliere: studentFiliere || 'Filière Supérieure',
    studentEtablissement: studentEtablissement || 'Université',
    stageConseil,
    title: `Bilan Stratégique & Feuille de Route d'Insertion : ${personalityData.shortLabel} × ${poleData.title}`,
    description: `Ce briefing personnalisé synthétise votre profil de personnalité professionnelle et vos compétences d'excellence pour vous guider vers un premier emploi ou stage à haute valeur ajoutée.`,
  };
}

