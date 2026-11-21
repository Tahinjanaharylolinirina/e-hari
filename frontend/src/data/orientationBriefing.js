// Moteur de synthèse et de briefing d'orientation personnalisé pour l'élève e-hari (ONG HARI)

import { TEST_INTERETS_CATEGORIES, TEST_MATIERES_POLES } from './orientationTests';
import {
  evaluateTerminaleCoherence,
  isTerminaleClass,
  mapSerieToPoleKey,
  getTerminaleSerieTrackAdvice,
  getTerminalePasserelleAdvice,
} from './madagascarSeries';

// Normalisation de la clé de personnalité à partir de la clé ou du label
export function resolvePersonalityKey(keyOrLabel) {
  if (!keyOrLabel) return null;
  if (TEST_INTERETS_CATEGORIES[keyOrLabel]) return keyOrLabel;

  const found = Object.values(TEST_INTERETS_CATEGORIES).find(
    (c) => c.label.toLowerCase() === keyOrLabel.toLowerCase() || c.oriPro.toLowerCase() === keyOrLabel.toLowerCase()
  );
  if (found) return found.key;

  const low = keyOrLabel.toLowerCase();
  if (low.includes('réfléchi') || low.includes('méthodique') || low.includes('sciences')) return 'sciences_tech';
  if (low.includes('éloquent') || low.includes('humaniste') || low.includes('lettres')) return 'lettres_comm';
  if (low.includes('entreprenant') || low.includes('leader') || low.includes('gestion')) return 'eco_gestion';
  if (low.includes('bienveillant') || low.includes('altruiste') || low.includes('santé')) return 'sante_social';
  if (low.includes('créatif') || low.includes('imaginatif') || low.includes('arts')) return 'arts_creation';
  if (low.includes('observateur') || low.includes('nature') || low.includes('agri')) return 'nature_agri';

  return 'sciences_tech';
}

// Normalisation du pôle scolaire à partir de la clé ou du label
export function resolvePoleKey(keyOrLabel) {
  if (!keyOrLabel) return null;
  if (TEST_MATIERES_POLES[keyOrLabel]) return keyOrLabel;

  const found = Object.values(TEST_MATIERES_POLES).find(
    (p) => p.label.toLowerCase() === keyOrLabel.toLowerCase() || p.oriPro.toLowerCase() === keyOrLabel.toLowerCase()
  );
  if (found) return found.key;

  const low = keyOrLabel.toLowerCase();
  if (low.includes('exactes') || low.includes('mathématiques') || low.includes('ingénierie')) return 'sciences_exactes';
  if (low.includes('biologiques') || low.includes('santé') || low.includes('médecine')) return 'sciences_vie_sante';
  if (low.includes('lettres') || low.includes('langues') || low.includes('humaines')) return 'lettres_langues';
  if (low.includes('économiques') || low.includes('gestion') || low.includes('société')) return 'eco_societe';
  if (low.includes('appliquées') || low.includes('technique') || low.includes('informatique')) return 'technique_appliquee';

  return 'sciences_exactes';
}

// Base de données structurée des briefings par pôle scolaire principal
const POLES_BRIEFING_DATA = {
  sciences_exactes: {
    lycee: {
      seriePrincipale: 'Série C',
      serieCode: 'Série C',
      pourquoi:
        'Votre facilité pour les équations, le calcul et les sciences expérimentales trouvera son plein potentiel dans cette série d\'excellence, réputée pour ouvrir le plus large éventail de portes vers les études supérieures.',
      matieresCles: ['Mathématiques (Coeff. fort)', 'Physique-Chimie', 'SVT', 'Français / Anglais'],
      serieAlternative: 'Série Technique Industrielle ou Série D',
      conseilSerie:
        'Maintenez un entraînement régulier en résolution d\'exercices types et soignez la rédaction scientifique : la rigueur de méthode rapporte la moitié des points au Baccalauréat malgache.',
    },
    etudesSuperieures: {
      filieres: [
        'Écoles d\'Ingénieurs (Génie Civil, Télécoms, Énergies, Mécanique)',
        'Informatique, Génie Logiciel, Cybersécurité & Intelligence Artificielle',
        'Sciences Mathématiques, Statistiques & Actuariat',
        'Sciences Physiques & Énergies Renouvelables (Solaire, Hydro-électrique)',
        'Architecture, Topographie & Aménagement du Territoire',
      ],
      etablissementsMada: [
        'ESPA Vontovorona (École Supérieure Polytechnique d\'Antananarivo)',
        'Faculté des Sciences d\'Ankatso (Mentions Mathématiques & Informatique, Physique)',
        'ENI Fianarantsoa (École Nationale d\'Informatique)',
        'ISPM (Institut Supérieur Polytechnique de Madagascar)',
        'IT University & ESTI (Écoles supérieures d\'informatique et technologies)',
      ],
      parcoursTypes: 'Licence (Bac+3) ➔ Master / Diplôme d\'Ingénieur d\'État (Bac+5)',
    },
    carrieres: {
      secteursPorteurs: [
        'Infrastructures & Travaux Publics à Madagascar',
        'Transition numérique & Technologies de l\'Information',
        'Énergies vertes & Électrification rurale',
      ],
      metiers: [
        {
          titre: 'Ingénieur en Génie Civil & Ouvrages',
          description: 'Conception et supervision de routes, ponts, bâtiments et aménagements durables.',
        },
        {
          titre: 'Développeur Full-Stack & Architecte Cloud',
          description: 'Création d\'applications innovantes, de plateformes bancaires et de solutions SaaS.',
        },
        {
          titre: 'Data Scientist & Analyste Décisionnel',
          description: 'Traitement des données massives pour guider les décisions des entreprises et institutions.',
        },
        {
          titre: 'Ingénieur Énergies Renouvelables',
          description: 'Déploiement de centrales solaires et hydrauliques adaptées au contexte malgache.',
        },
      ],
    },
  },

  sciences_vie_sante: {
    lycee: {
      seriePrincipale: 'Série D',
      serieCode: 'Série D',
      pourquoi:
        'Votre intérêt pour la biologie, l\'observation du vivant et les phénomènes expérimentaux s\'accorde parfaitement avec le programme renforcé en SVT et chimie de la série D.',
      matieresCles: ['SVT (Coeff. prépondérant)', 'Physique-Chimie', 'Mathématiques', 'Français'],
      serieAlternative: 'Série C ou Série Technique Industrielle',
      conseilSerie:
        'Privilégiez la précision du vocabulaire scientifique et la maîtrise des schémas d\'observation : en SVT, la clarté visuelle et la démarche expérimentale sont déterminantes.',
    },
    etudesSuperieures: {
      filieres: [
        'Médecine Humaine, Médecine Générale & Chirurgie',
        'Pharmacie & Industrie du Médicament',
        'Odontostomatologie (Chirurgie Dentaire)',
        'Agronomie, Foresterie, Élevage & Gestion des Écosystèmes',
        'Sciences Infirmières, Sage-Femme & Métiers Paramédicaux',
        'Biotechnologies, Contrôle Qualité Alimentaire & Vétérinaire',
      ],
      etablissementsMada: [
        'Faculté de Médecine d\'Antananarivo, Mahajanga ou Fianarantsoa',
        'ESSA Ankatso (École Supérieure des Sciences Agronomiques)',
        'Institut National de Santé Publique et Communautaire (INSPC)',
        'Faculté des Sciences (Mention Biologie et Écologie Végétale / Animale)',
        'Instituts de Formation Paramédicale agréés par l\'État (IFIRP, etc.)',
      ],
      parcoursTypes: 'Doctorat d\'État en Médecine (Bac+8) ou Diplôme d\'Ingénieur Agronome / Master (Bac+5)',
    },
    carrieres: {
      secteursPorteurs: [
        'Santé publique, Cliniques privées & Centres Hospitaliers',
        'Agrobusiness, filières agricoles d\'exportation (Vanille, Girofle, Cacao)',
        'Protection de la biodiversité & Parcs Nationaux de Madagascar',
      ],
      metiers: [
        {
          titre: 'Médecin Praticien ou Spécialiste',
          description: 'Consultations, diagnostics, soins et suivi médical de la population.',
        },
        {
          titre: 'Ingénieur Agronome / Chef de Projet Agro-écologie',
          description: 'Amélioration des rendements agricoles et valorisation durable des sols.',
        },
        {
          titre: 'Pharmacien d\'Officine ou Industriel',
          description: 'Dispensation des médicaments, recherche phytothérapique et veille sanitaire.',
        },
        {
          titre: 'Biologiste / Responsable Qualité Agroalimentaire',
          description: 'Analyses bactériologiques et certification des normes sanitaires.',
        },
      ],
    },
  },

  lettres_langues: {
    lycee: {
      seriePrincipale: 'Série A2',
      serieCode: 'Série A2',
      pourquoi:
        'Votre aisance avec les mots, la dissertation, les langues vivantes (Français, Malagasy, Anglais) et votre sens critique trouvent leur champ d\'expression naturel en série A2.',
      matieresCles: ['Français', 'Philosophie', 'Malagasy', 'Anglais', 'Histoire-Géographie'],
      serieAlternative: 'Série A1 ou Série OSE',
      conseilSerie:
        'Lisez abondamment des œuvres classiques et contemporaines, suivez l\'actualité politique et géopolitique, et exercez-vous à structurer des plans de dissertation clairs et percutants.',
    },
    etudesSuperieures: {
      filieres: [
        'Droit Privé, Droit des Affaires, Droit Public & Sciences Politiques',
        'Diplomatie, Relations Internationales & Coopération Humanitaire',
        'Journalisme, Médias Numériques, Communication & Relations Publiques',
        'Traduction, Interprétariat & Langues Étrangères Appliquées (Anglais, Chinois, Allemand)',
        'Enseignement, Lettres Modernes, Philosophie & Sciences de l\'Éducation',
      ],
      etablissementsMada: [
        'Faculté de Droit et Sciences Politiques (FDSP Ankatso)',
        'CEDS (Centre d\'Études Diplomatiques et Stratégiques)',
        'FLSH Ankatso (Faculté des Lettres et Sciences Humaines)',
        'SAMIS-ESIC (École Supérieure d\'Information et de Communication)',
        'Institut Catholique de Madagascar (ICM - Faculté des Sciences Sociales)',
      ],
      parcoursTypes: 'Licence (Bac+3) ➔ Master Professionnel / Recherche (Bac+5) ➔ Barreau / Concours',
    },
    carrieres: {
      secteursPorteurs: [
        'Justice, Cabinets d\'Avocats & Notariat',
        'Organisations Internationales (ONU, Union Africaine, ONG internationales)',
        'Médias, Presse écrite, Audiovisuel & Agences de Communication',
      ],
      metiers: [
        {
          titre: 'Avocat d\'Affaires / Magistrat / Juriste d\'Entreprise',
          description: 'Défense des droits, conseil juridique et sécurisation des contrats.',
        },
        {
          titre: 'Diplomate / Chargé de Relations Internationales',
          description: 'Négociation d\'accords bilatéraux et représentation extérieure.',
        },
        {
          titre: 'Journaliste d\'Investigation & Rédacteur en Chef',
          description: 'Reportages de terrain, analyse de l\'actualité et diffusion de l\'information.',
        },
        {
          titre: 'Traducteur - Interprète de Conférence',
          description: 'Traduction simultanée de sommets internationaux et documents officiels.',
        },
      ],
    },
  },

  eco_societe: {
    lycee: {
      seriePrincipale: 'Série OSE',
      serieCode: 'Série OSE',
      pourquoi:
        'Votre curiosité pour l\'économie, la gestion, l\'histoire et les interactions humaines fait de vous le candidat idéal pour la série OSE, passerelle par excellence vers le monde de l\'entreprise.',
      matieresCles: ['Économie & Sociologie (SES)', 'Mathématiques appliquées', 'Histoire-Géographie', 'Français / Anglais'],
      serieAlternative: 'Série Technique Tertiaire ou Série A2',
      conseilSerie:
        'Développez votre culture économique : comprenez l\'inflation, le taux de change de l\'Ariary, le fonctionnement des banques et l\'entrepreneuriat à Madagascar.',
    },
    etudesSuperieures: {
      filieres: [
        'Gestion d\'Entreprise, Management & Stratégie',
        'Comptabilité, Audit, Contrôle de Gestion & Finance d\'Entreprise',
        'Banque, Assurance & Microfinance rurale / urbaine',
        'Commerce International, Supply Chain, Douanes & Logistique',
        'Marketing Stratégique, Publicité & E-Commerce',
        'Économie du Développement & Gestion de Projets ONG',
      ],
      etablissementsMada: [
        'Faculté EGS Ankatso (Économie, Gestion, Sociologie)',
        'INSCAE (Institut National des Sciences Comptables et de l\'Administration d\'Entreprises)',
        'ISCAM (Institut Supérieur de la Communication, des Affaires et du Management)',
        'CNTEMAD (Centre National de Télé-Enseignement de Madagascar)',
        'ISSEDD (Institut Supérieur de la Sécurité et du Développement Durable)',
      ],
      parcoursTypes: 'Licence Pro (Bac+3) ➔ Master en Management / MBA (Bac+5) ➔ Expertise-Comptable',
    },
    carrieres: {
      secteursPorteurs: [
        'Système Bancaire, Microfinance & FinTech (Paiement mobile)',
        'Commerce, Grande Distribution & Import-Export à Madagascar',
        'Startups innovantes & Petites et Moyennes Entreprises (PME)',
      ],
      metiers: [
        {
          titre: 'Contrôleur de Gestion / Auditeur Financier',
          description: 'Optimisation des budgets, analyse de rentabilité et certification des comptes.',
        },
        {
          titre: 'Directeur Commercial & Marketing',
          description: 'Élaboration de stratégies de vente, conquête de parts de marché et partenariats.',
        },
        {
          titre: 'Analyste Crédit & Risques en Microfinance',
          description: 'Financement des projets d\'artisans, d\'agriculteurs et d\'entrepreneurs locaux.',
        },
        {
          titre: 'Entrepreneur / Créateur d\'Entreprise',
          description: 'Lancement et pilotage d\'une entreprise répondant à un besoin malgache.',
        },
      ],
    },
  },

  technique_appliquee: {
    lycee: {
      seriePrincipale: 'Série Technique Industrielle',
      serieCode: 'Série Technique Industrielle',
      pourquoi:
        'Votre habileté manuelle, votre goût du concret et votre affinité pour les systèmes techniques vous garantissent un apprentissage valorisant dès le lycée avec une mise en pratique immédiate.',
      matieresCles: ['Technologie & Dessin Technique', 'Mathématiques appliquées', 'Physique appliquée', 'Informatique'],
      serieAlternative: 'Série C ou Série Technique Tertiaire',
      conseilSerie:
        'Cultivez autant la théorie mathématique que les travaux pratiques : un bon technicien ou ingénieur moderne doit allier réflexion intellectuelle et savoir-faire opérationnel.',
    },
    etudesSuperieures: {
      filieres: [
        'Maintenance des Systèmes Électroniques & Électromécanique',
        'Réseaux Télécoms & Administration des Systèmes Informatiques',
        'Génie Mécanique, Maintenance Automobile & Engins Lourds',
        'Bâtiment, Topographie & Conducteur de Travaux',
        'Domotique, Automatismes Industriels & Robotique',
      ],
      etablissementsMada: [
        'ESPA Vontovorona (Départements Techniques & Génie Industriel)',
        'ISTS (Institut Supérieur de Technologie de Mahajanga / Antsiranana / Antananarivo)',
        'ESTI & Écoles techniques supérieures agréées',
        'CPA (Centre de Perfectionnement Agricole et Mécanique)',
      ],
      parcoursTypes: 'BTS / DTS (Bac+2) ➔ Licence Professionnelle (Bac+3) ➔ Ingéniorat Professionnel',
    },
    carrieres: {
      secteursPorteurs: [
        'Mines, Énergie & Industrie manufacturière à Madagascar',
        'Télécommunications (Opérateurs mobiles, Fournisseurs d\'accès internet)',
        'Maintenance aéronautique, maritime & ferroviaire',
      ],
      metiers: [
        {
          titre: 'Administrateur Systèmes & Réseaux Télécoms',
          description: 'Installation et maintenance de serveurs et d\'infrastructures de connexion.',
        },
        {
          titre: 'Chef de Chantier BTP / Conducteur de Travaux',
          description: 'Coordination sur le terrain des équipes d\'ouvriers et des matériaux de construction.',
        },
        {
          titre: 'Technicien Supérieur en Électromécanique',
          description: 'Dépannage et optimisation des machines d\'usines de transformation.',
        },
        {
          titre: 'Spécialiste en Maintenance d\'Équipements Énergétiques',
          description: 'Suivi et entretien des générateurs, onduleurs et panneaux solaires industriels.',
        },
      ],
    },
  },
};

// Analyse croisée Personnalité + Matières Scolaires
const SYNERGY_NUANCES = {
  sciences_tech: {
    bonusText:
      'Votre tempérament réfléchi et méthodique renforce votre capacité à résoudre des problèmes complexes avec calme et rigueur. Dans votre future carrière, vous serez reconnu(e) pour votre esprit analytique et votre sens de la méthode.',
  },
  lettres_comm: {
    bonusText:
      'Votre aisance relationnelle et votre sensibilité humaine vous donnent un avantage décisif pour fédérer les équipes, expliquer clairement des concepts difficiles et porter des projets avec conviction et élégance.',
  },
  eco_gestion: {
    bonusText:
      'Votre dynamisme naturel et votre tempérament de leader vous prédisposent à diriger des projets, prendre des initiatives concrètes et transformer des idées en succès tangibles. Vous alliez compétences techniques et vision managériale.',
  },
  sante_social: {
    bonusText:
      'Votre bienveillance et votre empathie naturelle orientent vos compétences vers le service sincère d\'autrui. Dans n\'importe quelle profession, votre conscience professionnelle et votre écoute feront de vous une référence appréciée.',
  },
  arts_creation: {
    bonusText:
      'Votre créativité féconde et votre regard novateur vous permettent de trouver des solutions originales là où d\'autres restent bloqués. Vous apportez une touche d\'innovation esthétique et conceptuelle indispensable.',
  },
  nature_agri: {
    bonusText:
      'Votre bon sens authentique et votre lien étroit avec le vivant vous permettent de garder les pieds sur terre et de proposer des solutions durables et réalistes, particulièrement adaptées aux défis de développement de Madagascar.',
  },
};

// Fonction principale : génération du briefing complet
export function generateOrientationBriefing({ personalityKeyOrLabel, poleKeyOrLabel, userGrade, userSerie }) {
  const personalityKey = resolvePersonalityKey(personalityKeyOrLabel);
  const poleKey = resolvePoleKey(poleKeyOrLabel);

  const hasPersonalityTest = Boolean(personalityKey);
  const hasMatieresTest = Boolean(poleKey);

  const personalityInfo = personalityKey ? TEST_INTERETS_CATEGORIES[personalityKey] : null;
  const poleInfo = poleKey ? TEST_MATIERES_POLES[poleKey] : null;
  const poleBriefing = poleKey ? POLES_BRIEFING_DATA[poleKey] : null;
  const synergyInfo = personalityKey ? SYNERGY_NUANCES[personalityKey] : null;

  const isTerminale = isTerminaleClass(userGrade);
  let terminaleCoherence = null;
  let divergentTracks = null;

  if (isTerminale && userSerie && (poleKey || personalityKey)) {
    terminaleCoherence = evaluateTerminaleCoherence({
      currentSerie: userSerie,
      poleKey,
      personalityKey,
    });

    if (terminaleCoherence && !terminaleCoherence.isAligned && poleBriefing) {
      const currentSeriePoleKey = mapSerieToPoleKey(userSerie);
      const serieBriefing = POLES_BRIEFING_DATA[currentSeriePoleKey] || poleBriefing;
      const testBriefing = poleBriefing;

      divergentTracks = {
        isDivergent: true,
        currentSerie: userSerie,
        recommendedSerieName: terminaleCoherence.recommendedSerieName,
        currentSeriePoleKey,
        testPoleKey: poleKey,
        serieTrack: {
          title: `Voie 1 : Débouchés selon votre Série actuelle (${userSerie})`,
          badge: userSerie,
          poleKey: currentSeriePoleKey,
          etudesSuperieures: serieBriefing.etudesSuperieures,
          carrieres: serieBriefing.carrieres,
          conseil: getTerminaleSerieTrackAdvice({ currentSerie: userSerie }),
        },
        testTrack: {
          title: `Voie 2 : Débouchés selon les résultats de vos Tests (${terminaleCoherence.recommendedSerieName})`,
          badge: terminaleCoherence.recommendedSerieName,
          poleKey,
          etudesSuperieures: testBriefing.etudesSuperieures,
          carrieres: testBriefing.carrieres,
          conseil: getTerminalePasserelleAdvice({ currentSerie: userSerie, testPoleKey: poleKey }),
        },
      };
    }
  }

  // Calcul du conseil spécifique selon la classe de l'élève (3ème, 2nde, 1ère, Terminale)
  let classeConseil = null;
  const normalizedGrade = (userGrade || '').toLowerCase();
  if (normalizedGrade.includes('3') || normalizedGrade.includes('trois') || normalizedGrade.includes('collège')) {
    classeConseil = {
      classe: 'Collège (3ème)',
      action: 'Préparer votre passage en classe de Seconde',
      description:
        'En fin de 3ème, votre objectif prioritaire est d\'obtenir votre BEPC avec mention et de consolider vos bases dans les matières piliers de votre future série.',
    };
  } else if (normalizedGrade.includes('seconde') || normalizedGrade.includes('2nde')) {
    classeConseil = {
      classe: 'Lycée (Classe de Seconde)',
      action: 'Arrêter définitivement votre choix de série pour la Première',
      description:
        'La Seconde est l\'année charnière : c\'est le moment de maximiser vos notes dans les matières à forts coefficients de la série visée pour obtenir l\'avis favorable du conseil de classe.',
    };
  } else if (normalizedGrade.includes('première') || normalizedGrade.includes('1ère')) {
    classeConseil = {
      classe: 'Lycée (Classe de Première)',
      action: 'Approfondir vos spécialités et explorer les concours post-bac',
      description:
        'Votre série est choisie : travaillez pour obtenir de bons bulletins scolaires et commencez à visiter les salons étudiants et journées portes ouvertes à Madagascar.',
    };
  } else if (normalizedGrade.includes('terminale') || normalizedGrade.includes('term')) {
    classeConseil = {
      classe: 'Lycée (Classe de Terminale)',
      action: 'Préparer le Baccalauréat et constituer vos dossiers d\'inscription supérieure',
      description:
        'Priorité absolue à la réussite du Bac avec mention, tout en préparant les dates de dépôt de dossiers et les concours d\'entrée des grandes écoles et facultés (ESPA, Médecine, INSCAE, Ankatso, etc.).',
    };
  } else {
    classeConseil = {
      classe: 'Parcours Scolaire',
      action: 'Construire méthodiquement votre projet d\'études',
      description:
        'L\'orientation réussie est une construction continue. Utilisez ce bilan comme boussole pour faire vos choix scolaires en toute confiance.',
    };
  }

  return {
    hasPersonalityTest,
    hasMatieresTest,
    isComplete: hasPersonalityTest && hasMatieresTest,
    personalityInfo,
    poleInfo,
    poleBriefing,
    synergyInfo,
    classeConseil,
    isTerminale,
    terminaleCoherence,
    divergentTracks,
  };
}

