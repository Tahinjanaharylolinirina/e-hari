// Référentiel des Séries officielles du Baccalauréat à Madagascar (Enseignement Général et Technique)

export const MADAGASCAR_SERIES = [
  { code: 'A1', value: 'Série A1', label: 'Série A1' },
  { code: 'A2', value: 'Série A2', label: 'Série A2' },
  { code: 'C', value: 'Série C', label: 'Série C' },
  { code: 'D', value: 'Série D', label: 'Série D' },
  { code: 'OSE', value: 'Série OSE', label: 'Série OSE' },
  { code: 'Technique Industrielle', value: 'Série Technique Industrielle', label: 'Série Technique Industrielle' },
  { code: 'Technique Tertiaire', value: 'Série Technique Tertiaire', label: 'Série Technique Tertiaire' },
];

export function isTerminaleClass(classe) {
  if (!classe) return false;
  return classe.trim().toLowerCase().includes('terminale');
}

export function normalizeSerieCode(serie) {
  if (!serie) return '';
  const s = serie.toUpperCase();
  if (s.includes('A1')) return 'A1';
  if (s.includes('A2')) return 'A2';
  if (s.includes('C')) return 'C';
  if (s.includes('D')) return 'D';
  if (s.includes('OSE') || s.includes(' B')) return 'OSE';
  if (s.includes('TERTIAIRE') || s.includes('G2') || s.includes('GESTION')) return 'TERTIAIRE';
  if (s.includes('TECHNIQUE') || s.includes('INDUSTRIELLE') || s.includes('GC') || s.includes('TGI')) return 'TECHNIQUE';
  return '';
}

// Propose la série recommandée à un élève en classe inférieure à la Terminale
// selon les résultats de ses tests d'orientation (comme avec Vololona)
export function getRecommendedSerieForPupil(user) {
  if (!user || !user.profil) return null;
  const p = user.profil;
  const detMat = p.ele_det_mat;
  const oriPro2 = p.ele_ori_pro_2 || '';
  const dominantPoleKey = detMat?.dominantPoleKey || detMat?.dominantPole?.key;

  // 1. Déduction par le pôle scolaire des matières favorites (Test 2)
  if (dominantPoleKey === 'sciences_exactes' || oriPro2.toLowerCase().includes('exactes') || oriPro2.toLowerCase().includes('ingénierie')) {
    return 'Série C';
  }
  if (dominantPoleKey === 'sciences_vie_sante' || oriPro2.toLowerCase().includes('santé') || oriPro2.toLowerCase().includes('biologiques')) {
    return 'Série D';
  }
  if (dominantPoleKey === 'lettres_langues' || oriPro2.toLowerCase().includes('lettres') || oriPro2.toLowerCase().includes('langues')) {
    return 'Série A2';
  }
  if (dominantPoleKey === 'eco_societe' || oriPro2.toLowerCase().includes('économiques') || oriPro2.toLowerCase().includes('gestion') || oriPro2.toLowerCase().includes('société')) {
    return 'Série OSE';
  }
  if (dominantPoleKey === 'technique_appliquee' || oriPro2.toLowerCase().includes('technique')) {
    return 'Série Technique Industrielle';
  }

  // 2. Déduction par le profil de personnalité (Test 1)
  const oriPro1 = p.ele_ori_pro_1 || '';
  const low1 = oriPro1.toLowerCase();
  if (low1.includes('réfléchi') || low1.includes('méthodique')) {
    return 'Série C';
  }
  if (low1.includes('éloquent') || low1.includes('humaniste')) {
    return 'Série A2';
  }
  if (low1.includes('entreprenant') || low1.includes('leader')) {
    return 'Série OSE';
  }
  if (low1.includes('bienveillant') || low1.includes('altruiste')) {
    return 'Série D';
  }
  if (low1.includes('créatif') || low1.includes('imaginatif')) {
    return 'Série A2';
  }
  if (low1.includes('observateur') || low1.includes('nature')) {
    return 'Série D';
  }

  return null;
}

// Évalue la cohérence pour un élève en Terminale entre sa série actuelle et les résultats de ses tests
export function evaluateTerminaleCoherence({ currentSerie, poleKey, personalityKey }) {
  if (!currentSerie) return null;

  const currentCode = normalizeSerieCode(currentSerie);
  let recommendedSerieName = 'Série C';
  let poleNatureName = 'les sciences exactes et la rigueur chiffrée';

  if (poleKey === 'sciences_exactes') {
    recommendedSerieName = 'Série C';
    poleNatureName = 'les mathématiques, la physique-chimie et le raisonnement abstrait';
  } else if (poleKey === 'sciences_vie_sante') {
    recommendedSerieName = 'Série D';
    poleNatureName = 'la biologie, la santé et l\'expérimentation du vivant (SVT)';
  } else if (poleKey === 'lettres_langues') {
    recommendedSerieName = 'Série A2';
    poleNatureName = 'l\'expression écrite, les langues vivantes, la philosophie et les sciences humaines';
  } else if (poleKey === 'eco_societe') {
    recommendedSerieName = 'Série OSE';
    poleNatureName = 'l\'économie, l\'actualité sociale, la gestion et la compréhension du monde';
  } else if (poleKey === 'technique_appliquee') {
    recommendedSerieName = 'Série Technique Industrielle';
    poleNatureName = 'la pratique manuelle, la technologie concrète et l\'ingénierie appliquée';
  }

  // Vérification de cohérence / alignement
  let isAligned = false;
  if (currentCode === 'C' && (poleKey === 'sciences_exactes' || poleKey === 'technique_appliquee')) isAligned = true;
  if (currentCode === 'D' && poleKey === 'sciences_vie_sante') isAligned = true;
  if ((currentCode === 'A1' || currentCode === 'A2') && poleKey === 'lettres_langues') isAligned = true;
  if (currentCode === 'OSE' && poleKey === 'eco_societe') isAligned = true;
  if (currentCode === 'TECHNIQUE' && (poleKey === 'technique_appliquee' || poleKey === 'sciences_exactes')) isAligned = true;
  if (currentCode === 'TERTIAIRE' && (poleKey === 'eco_societe' || poleKey === 'technique_appliquee')) isAligned = true;

  if (isAligned) {
    return {
      isAligned: true,
      currentSerie,
      recommendedSerieName,
      diagnostic: `Excellente cohérence ! Votre choix de ${currentSerie} correspond parfaitement à vos forces démontrées dans les tests (${poleNatureName}). Vous êtes dans la filière idéale pour valoriser vos compétences et viser la mention au Baccalauréat.`,
      matieresAEffort: [
        'Maintenez votre avance sur les matières principales de votre série pour décrocher une mention très favorable aux admissions supérieures.',
        'Préparez dès maintenant les concours d\'entrée des grandes écoles et facultés à Madagascar adaptées à votre série.',
      ],
      comportementsAAdopter: [
        'Pratiquez des épreuves types en temps réel sous conditions d\'examen.',
        'Partagez vos méthodes et animez des groupes de travail pour consolider vos acquis.',
      ],
      perspectivePostBac: 'Votre parcours scolaire est en adéquation totale avec vos futures études supérieures.',
    };
  }

  // CAS DIVERGENT / OPPOSÉ : Génération des conseils constructifs et cohérents
  let matieresAEffort = [];
  let comportementsAAdopter = [];
  let perspectivePostBac = '';

  if (currentCode === 'C') {
    matieresAEffort = [
      'Mathématiques (Coefficients forts au Baccalauréat) : Reprenez méthodiquement les chapitres d\'analyse (dérivées, primitives, équations différentielles) et la géométrie dans l\'espace. Faites au moins 3 exercices types de Bac par semaine.',
      'Physique-Chimie (Coefficient 5) : Apprenez par cœur les formules, les unités internationales et soignez la rigueur des démonstrations écrites.',
    ];
    comportementsAAdopter = [
      'Discipline quotidienne : Consacrez au minimum 1h30 chaque soir uniquement aux exercices de maths et physique, sans attendre la veille des évaluations.',
      'Ne jamais laisser une incompréhension s\'installer : Sollicitez vos enseignants à la fin du cours, travaillez en binôme avec un camarade à l\'aise en calcul, ou participez aux séances de tutorat de l\'ONG HARI.',
      'Capitaliser sur vos matières littéraires : Utilisez votre aisance d\'expression pour obtenir le maximum de points en Français, Malagasy, Anglais et Philosophie au Baccalauréat C.',
    ];
    perspectivePostBac =
      'Décrocher un Bac C avec vos atouts humains ou managériaux est une opportunité formidable : vous accéderez à des métiers qui marient rigueur technique et vision stratégique (Architecture, Management de projets d\'ingénierie, Droit des nouvelles technologies, Économie quantitative).';
  } else if (currentCode === 'D') {
    matieresAEffort = [
      'Sciences de la Vie et de la Terre (SVT - Coefficient prépondérant) : Maîtrisez parfaitement la démarche scientifique expérimentale, les bilans de métabolisme et les schémas d\'observation soignés et légendés.',
      'Physique-Chimie & Mathématiques : Entraînez-vous à lier la théorie aux applications concrètes du vivant (dosages, cinétique chimique, génétique statistique).',
    ];
    comportementsAAdopter = [
      'Fiches de synthèse illustrées : Réalisez vos propres fiches mémo en couleurs avec des schémas annotés pour faciliter la mémorisation visuelle.',
      'Régularité des annales : Refaites systématiquement les sujets du Baccalauréat D des cinq dernières sessions à Madagascar.',
      'Exploiter votre aisance rédactionnelle : Soignez la clarté et l\'orthographe de vos copies de SVT, car une copie bien rédigée gagne des points précieux.',
    ];
    perspectivePostBac =
      'Votre profil combiné à un Bac D vous donne une voie royale vers l\'agrobusiness, la gestion hospitalière, la pharmacie commerciale ou l\'écotourisme durable à Madagascar.';
  } else if (currentCode === 'A1' || currentCode === 'A2') {
    matieresAEffort = [
      'Philosophie (Épreuve reine de la Série A) : Entraînez-vous sans relâche à problématiser un sujet, structurer une argumentation dialectique (Thèse / Antithèse / Dépassement) et convoquer les grands repères d\'auteurs.',
      'Français & Littérature : Soignez le style d\'écriture, la précision lexicale et l\'analyse approfondie des textes.',
      'Histoire-Géographie : Consolidez les repères historiques de Madagascar et les enjeux géopolitiques contemporains.',
    ];
    comportementsAAdopter = [
      'Pratique d\'écriture hebdomadaire : Rédigez au moins un plan détaillé et une introduction complète chaque semaine.',
      'Utiliser votre esprit logique : Votre rigueur scientifique ou technique est un atout rare en série littéraire pour bâtir des plans de dissertation parfaitement construits et logiques.',
      'Lecture active : Lisez les œuvres au programme en prenant des notes personnelles de citations clés.',
    ];
    perspectivePostBac =
      'Cette alliance entre rigueur logique et maîtrise des lettres est idéale pour exceller en Droit des affaires, Magistrature, Diplomatie, Sciences Politiques ou Journalisme d\'investigation.';
  } else if (currentCode === 'OSE') {
    matieresAEffort = [
      'Sciences Économiques et Sociales (SES) : Maîtrisez les concepts de macroéconomie (PIB, inflation, politique monétaire de la Banky Foiben\'i Madagasikara) et les théories sociologiques.',
      'Histoire-Géographie & Mathématiques appliquées : Entraînez-vous à analyser rigoureusement des graphiques, des courbes et des données statistiques chiffrées.',
    ];
    comportementsAAdopter = [
      'Suivre l\'actualité économique : Lisez régulièrement les nouvelles économiques malgaches et internationales pour nourrir vos exemples d\'épreuves.',
      'Méthodologie de dissertation économique : Articulez toujours vos théories avec des données et des faits concrets.',
    ];
    perspectivePostBac =
      'L\'alliance de votre Série OSE et de votre tempérament vous propulsera vers le management d\'entreprises, l\'entrepreneuriat innovant, l\'audit ou le secteur bancaire à Madagascar.';
  } else {
    matieresAEffort = [
      'Concentrez-vous sur les matières professionnelles et technologiques à forts coefficients de votre série.',
      'Ne délaissez pas les matières générales (Mathématiques, Français, Langues) qui assurent l\'équilibre de vos moyennes.',
    ];
    comportementsAAdopter = [
      'Alliez la pratique en atelier/laboratoire et la théorie écrite.',
      'Demandez conseil auprès de vos enseignants techniques pour affiner votre méthodologie.',
    ];
    perspectivePostBac =
      'Votre maîtrise technique combinée à vos atouts personnels sera directement valorisée sur le marché du travail ou en écoles supérieures spécialisées.';
  }

  return {
    isAligned: false,
    currentSerie,
    recommendedSerieName,
    poleNatureName,
    diagnostic: `D'après les résultats de vos tests d'orientation (matières favorites et aptitudes concrètes), votre profil scolaire et personnel s'accorde plus naturellement avec la ${recommendedSerieName} (${poleNatureName}). Cependant, vous êtes actuellement en classe de Terminale en ${currentSerie}.`,
    poursuiteConseil: `Si vous choisissez de poursuivre dans votre ${currentSerie} jusqu'au Baccalauréat, c'est tout à fait possible et honorable, mais cela exigera de la lucidité, des efforts ciblés et une méthode de travail renforcée :`,
    matieresAEffort,
    comportementsAAdopter,
    perspectivePostBac,
  };
}

// Associe un libellé ou code de série au pôle scolaire correspondant
export function mapSerieToPoleKey(serie) {
  const code = normalizeSerieCode(serie);
  if (code === 'C') return 'sciences_exactes';
  if (code === 'D') return 'sciences_vie_sante';
  if (code === 'A1' || code === 'A2') return 'lettres_langues';
  if (code === 'OSE' || code === 'TERTIAIRE') return 'eco_societe';
  if (code === 'TECHNIQUE') return 'technique_appliquee';
  return 'sciences_exactes';
}

// Conseil pour les études supérieures et carrières selon la série actuelle au Bac
export function getTerminaleSerieTrackAdvice({ currentSerie }) {
  const code = normalizeSerieCode(currentSerie);
  if (code === 'C') {
    return "Les filières d'ingénierie et de technologies à Madagascar (ESPA Vontovorona, ENI Fianarantsoa, ISPM, IT University) sélectionnent sur concours très exigeants basés sur les mathématiques et la physique. Pour réussir dans cette voie, entraînez-vous intensivement sur les sujets d'annales dès aujourd'hui. Vos atouts humains ou créatifs vous permettront en plus de viser des postes d'architecture, de design industriel ou de chefferie de projet technologique.";
  }
  if (code === 'D') {
    return "Les facultés de Médecine et l'École Supérieure d'Agronomie (ESSA Ankatso) imposent un numerus clausus très sélectif. Pour réussir dans cette voie, soignez la rigueur de vos raisonnements expérimentaux en SVT et chimie. Vos compétences relationnelles ou managériales feront la différence plus tard en gestion de santé ou agrobusiness.";
  }
  if (code === 'A1' || code === 'A2') {
    return "Les études supérieures juridiques, diplomatiques et littéraires (FDSP Ankatso, CEDS, FLSH) demandent un volume de lecture et de rédaction très important. Développez une culture générale solide et entraînez-vous à structurer des argumentations dialectiques percutantes pour réussir les concours du Barreau ou de la Fonction Publique.";
  }
  if (code === 'OSE') {
    return "Les grandes écoles de commerce et gestion à Madagascar (INSCAE, ISCAM, Faculté EGS) recherchent des profils polyvalents alliant rigueur des chiffres et compréhension des dynamiques sociales. Préparez activement les épreuves de mathématiques appliquées, de synthèse de texte et d'anglais des concours d'entrée.";
  }
  return "Misez sur les compétences pratiques acquises dans vos matières techniques pour intégrer des instituts de technologie réputés (ISTS, ESPA Génie Industriel) ou des cycles courts professionnalisants (DTS/BTS) menant rapidement à un emploi qualifié.";
}

// Conseil de passerelle pour accéder aux études et carrières des tests avec sa série actuelle
export function getTerminalePasserelleAdvice({ currentSerie, testPoleKey }) {
  const code = normalizeSerieCode(currentSerie);

  if (code === 'C') {
    if (testPoleKey === 'lettres_langues') {
      return "Excellente nouvelle : à Madagascar, les bacheliers Série C sont admissibles d'office et extrêmement appréciés en Faculté de Droit (FDSP Ankatso), en Sciences Politiques et en Diplomatie. Votre esprit cartésien et votre logique de démonstration constituent une arme redoutable pour bâtir des argumentations juridiques solides face aux épreuves du Barreau ou de la Magistrature.";
    }
    if (testPoleKey === 'eco_societe') {
      return "Une passerelle royale : les instituts de commerce et de gestion (INSCAE, ISCAM, Faculté EGS) accueillent les bacheliers Série C avec enthousiasme. Votre aisance en mathématiques vous donnera une avance considérable en mathématiques financières, analyse de rentabilité, comptabilité analytique et audit.";
    }
    if (testPoleKey === 'sciences_vie_sante') {
      return "Les concours d'entrée en Médecine (Ankatso, Mahajanga) et en Agronomie (ESSA) comportent des épreuves éliminatoires de physique, chimie et mathématiques où les bacheliers C se classent souvent parmi les premiers. Un renforcement en SVT pendant les vacances post-bac suffira à combler l'écart.";
    }
    return "Votre diplôme Série C vous permet de postuler dans la quasi-totalité des filières supérieures à Madagascar. Votre profil combiné vous permettra de relier la technicité aux besoins concrets du terrain.";
  }

  if (code === 'D') {
    if (testPoleKey === 'sciences_exactes') {
      return "Nombre d'écoles d'informatique, de télécoms et d'ingénierie appliquée (ENI Fianarantsoa, IT University, ISPM) acceptent directement les bacheliers Série D. Un travail régulier en algèbre et algorithmique en début de cursus facilitera grandement votre intégration.";
    }
    if (testPoleKey === 'lettres_langues') {
      return "Un Bac D vous ouvre sans obstacle les portes de la Faculté de Droit et des Sciences Humaines. Vous aurez un avantage distinctif pour vous spécialiser dans le droit médical, le droit de l'environnement ou la bioéthique, des secteurs en plein essor à Madagascar.";
    }
    if (testPoleKey === 'eco_societe') {
      return "Les concours d'entrée à l'INSCAE, à l'ISCAM et à la Faculté EGS sont largement ouverts aux bacheliers D. Votre profil scientifique équilibré est très prisé dans le secteur bancaire, la microfinance et la gestion de projets de développement durable.";
    }
    return "Votre formation scientifique équilibrée constitue une excellente base pour bifurquer vers des études appliquées en phase avec vos talents.";
  }

  if (code === 'A1' || code === 'A2') {
    if (testPoleKey === 'eco_societe') {
      return "La passerelle vers la Gestion des Ressources Humaines, le Marketing, le Droit des Affaires et le Commerce International est naturelle. Vos qualités rédactionnelles et votre maîtrise des langues seront un atout majeur en communication d'entreprise.";
    }
    if (testPoleKey === 'sciences_exactes' || testPoleKey === 'sciences_vie_sante') {
      return "Les cursus scientifiques purs étant très sélectifs sur les mathématiques au départ, privilégiez des formations hybrides valorisant vos forces littéraires : Journalisme scientifique, Gestion documentaire hospitalière, Communication environnementale ou Infographie et Création numérique.";
    }
    return "Vos aptitudes littéraires et linguistiques vous permettent de valoriser vos passions à travers la communication, l'enseignement supérieur ou la gestion de projets culturels.";
  }

  if (code === 'OSE') {
    if (testPoleKey === 'lettres_langues') {
      return "La Série OSE ouvre directement la voie vers la Faculté de Droit (FDSP Ankatso), les Sciences Politiques et la Communication. Vous maîtrisez déjà les enjeux sociétaux et économiques contemporains.";
    }
    if (testPoleKey === 'sciences_exactes') {
      return "Pour rejoindre les nouvelles technologies, privilégiez les filières d'Informatique de Gestion, de Business Analytics, de Webmarketing ou de Gestion de Projets Numériques (ESTI, CNTEMAD, universités privées).";
    }
    if (testPoleKey === 'sciences_vie_sante') {
      return "Misez sur l'Économie de la Santé, la gestion des structures hospitalières, ou le management des filières agricoles durables (Agrobusiness), où les compétences OSE sont indispensables.";
    }
    return "La polyvalence de votre série OSE vous donne la flexibilité nécessaire pour réussir cette bifurcation post-bac.";
  }

  if (testPoleKey === 'eco_societe') {
    return "Votre formation technique alliée à des études en gestion vous prépare idéalement à devenir technico-commercial, responsable d'achats industriels ou entrepreneur autonome.";
  }
  return "Votre savoir-faire concret sera hautement valorisé si vous décidez de compléter votre cursus technique par une formation supérieure en accord avec vos passions.";
}
