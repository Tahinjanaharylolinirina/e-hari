// Moteur intelligent de détection des divergences et de génération d'emploi du temps de révision adapté
// Développé pour l'ONG HARI (e-hari Madagascar)

import { isTerminaleClass } from './madagascarSeries';
import { resolvePersonalityKey, resolvePoleKey } from './orientationBriefing';

// 1. Détection des divergences / contradictions entre série actuelle et résultats de tests
export function detectStudentContradictionOrDivergence({ currentUser, briefing }) {
  const eleveClasse = currentUser?.profil?.ele_cla || '';
  const eleveSerie = currentUser?.profil?.ele_ser || '';
  const isTerminale = isTerminaleClass(eleveClasse);

  const personalityKey = briefing?.personalityInfo?.key || resolvePersonalityKey(currentUser?.profil?.ele_ori_pro_1);
  const poleKey = briefing?.poleInfo?.key || resolvePoleKey(currentUser?.profil?.ele_ori_pro_2);

  const hasPersonalityTest = Boolean(personalityKey);
  const hasMatieresTest = Boolean(poleKey);

  // Cas 1 : Classe de Terminale avec série en contradiction avec les tests
  if (isTerminale && eleveSerie && (briefing?.terminaleCoherence?.hasDivergence || briefing?.divergentTracks?.isDivergent)) {
    const recommendedSerie = briefing?.terminaleCoherence?.recommendedSerieName || 'Filière recommandée par les tests';
    const targetCareer = briefing?.poleBriefing?.carrieres?.metiers?.[0]?.titre || 'Carrière visée';

    return {
      hasContradiction: true,
      reasonType: 'terminale_serie_divergence',
      reasonTitle: `Divergence détectée entre votre ${eleveSerie} et vos tests d'orientation`,
      reasonDescription: `Vous êtes actuellement inscrit(e) en ${eleveSerie}, mais vos aptitudes et passions révèlent une forte affinité avec les débouchés de la ${recommendedSerie} (vers les métiers de type ${targetCareer}).`,
      currentSerie: eleveSerie,
      recommendedSerie,
      targetCareer,
      trackA: {
        id: 'serie_actuelle',
        badge: eleveSerie,
        label: `Priorité Réussite ${eleveSerie}`,
        title: `Sécuriser et briller en ${eleveSerie}`,
        tagline: 'Focalisation sur les coefficients majeurs du Baccalauréat',
        description: `Concentrer les révisions sur les matières clés de la ${eleveSerie} pour obtenir une excellente note au Baccalauréat.`,
        keySubjects: getSubjectsForSerie(eleveSerie),
      },
      trackB: {
        id: 'passion_cible',
        label: `Priorité Métier Cible (${targetCareer})`,
        badge: targetCareer,
        title: `Préparer le métier de ${targetCareer}`,
        tagline: 'Acquérir dès maintenant les compétences de la filière cible',
        description: `Mettre l'accent sur les matières et connaissances requises pour réussir les concours d'entrée dans la filière de votre passion.`,
        keySubjects: getSubjectsForPole(poleKey, personalityKey),
      },
      trackC: {
        id: 'equilibre',
        badge: 'Recommandé e-hari',
        label: 'Chemin Équilibré (Bac + Métier)',
        title: 'Double Équilibre Stratégique',
        tagline: 'Le compromis gagnant pour ne rien sacrifier',
        description: `70% du temps dédié aux matières majeures de votre ${eleveSerie} + 30% d'approfondissement sur les matières du métier cible.`,
        keySubjects: combineSubjects(getSubjectsForSerie(eleveSerie), getSubjectsForPole(poleKey, personalityKey)),
      },
    };
  }

  // Cas 2 : Deux tests aux profils contradictoires (ex: Passions Littéraires vs Matières Scientifiques)
  if (hasPersonalityTest && hasMatieresTest) {
    const isConflicting = checkPolesConflict(personalityKey, poleKey);
    if (isConflicting) {
      const poleName = briefing?.poleInfo?.label || 'Pôle scolaire';
      const passionName = briefing?.personalityInfo?.label || 'Passion dominante';
      const targetCareer = briefing?.poleBriefing?.carrieres?.metiers?.[0]?.titre || 'Métier';

      return {
        hasContradiction: true,
        reasonType: 'tests_divergence',
        reasonTitle: `Double potentiel identifié : ${passionName} vs ${poleName}`,
        reasonDescription: `Votre tempérament naturel s'épanouit dans "${passionName}" tandis que vos facilités scolaires brillent dans "${poleName}".`,
        currentSerie: eleveSerie || 'Classe actuelle',
        recommendedSerie: poleName,
        targetCareer,
        trackA: {
          id: 'serie_actuelle',
          badge: poleName,
          label: `Priorité Points Forts Scolaires`,
          title: `Capitaliser sur vos facilités scolaires (${poleName})`,
          tagline: 'Maximiser les meilleures moyennes de classe',
          description: `Consolider les matières où vous avez déjà un potentiel élevé pour assurer un dossier scolaire d'excellence.`,
          keySubjects: getSubjectsForPole(poleKey),
        },
        trackB: {
          id: 'passion_cible',
          label: `Priorité Vocation & Passions`,
          badge: passionName,
          title: `Développer vos passions humaines (${passionName})`,
          tagline: 'Cultiver votre tempérament naturel',
          description: `Consacrer vos révisions aux compétences et matières qui correspondent à votre épanouissement personnel.`,
          keySubjects: getSubjectsForPersonality(personalityKey),
        },
        trackC: {
          id: 'equilibre',
          badge: 'Recommandé e-hari',
          label: 'Chemin Équilibré Hybride',
          title: 'Alliance des Passions et des Matières',
          tagline: 'Votre atout différenciant sur le marché',
          description: `Combiner vos facilités de cours avec votre tempérament naturel pour viser des métiers interdisciplinaires.`,
          keySubjects: combineSubjects(getSubjectsForPole(poleKey), getSubjectsForPersonality(personalityKey)),
        },
      };
    }
  }

  // Cas standard aligné
  return {
    hasContradiction: false,
    trackA: null,
    trackB: null,
    trackC: {
      id: 'aligne',
      label: 'Parcours Aligné',
      title: 'Planning d\'Orientation Harmonieux',
      description: 'Vos tests et votre parcours scolaire sont en parfaite synergie.',
      keySubjects: getSubjectsForSerie(eleveSerie) || getSubjectsForPole(poleKey) || ['Mathématiques', 'Français', 'Physique-Chimie', 'Malagasy'],
    },
  };
}

// Vérification de divergence entre pôle personnalité et pôle matières
function checkPolesConflict(personalityKey, poleKey) {
  if (!personalityKey || !poleKey) return false;
  const sciencesPoles = ['sciences_exactes', 'sciences_vie_sante', 'technique_appliquee'];
  const lettresPoles = ['lettres_langues', 'eco_societe'];

  const isPersoLettres = ['lettres_comm', 'arts_creation', 'sante_social'].includes(personalityKey);
  const isPoleSciences = sciencesPoles.includes(poleKey);

  const isPersoSciences = ['sciences_tech', 'nature_agri'].includes(personalityKey);
  const isPoleLettres = lettresPoles.includes(poleKey);

  return (isPersoLettres && isPoleSciences) || (isPersoSciences && isPoleLettres);
}

// Matières piliers selon la série
export function getSubjectsForSerie(serie) {
  const s = (serie || '').toLowerCase();
  if (s.includes('série c') || s.includes('serie c')) {
    return ['Mathématiques', 'Physique-Chimie', 'SVT', 'Philosophie', 'Français'];
  }
  if (s.includes('série d') || s.includes('serie d')) {
    return ['SVT', 'Physique-Chimie', 'Mathématiques', 'Français', 'Philosophie'];
  }
  if (s.includes('série a1') || s.includes('série a2') || s.includes('série a') || s.includes('littéraire')) {
    return ['Philosophie', 'Français', 'Malagasy', 'Histoire-Géographie', 'Anglais / LV2'];
  }
  if (s.includes('ose') || s.includes('économique')) {
    return ['Sciences Économiques & Sociales (SES)', 'Mathématiques', 'Histoire-Géographie', 'Français', 'Anglais'];
  }
  if (s.includes('technique')) {
    return ['Technologie & Dessin Technique', 'Mathématiques appliquées', 'Physique appliquée', 'Informatique'];
  }
  return ['Mathématiques', 'Physique-Chimie', 'Français', 'Malagasy', 'Histoire-Géographie'];
}

// Matières piliers selon le pôle matières
export function getSubjectsForPole(poleKey, personalityKey) {
  switch (poleKey) {
    case 'sciences_exactes':
      return ['Mathématiques', 'Physique-Chimie', 'Algorithmique & Logique', 'Anglais technique'];
    case 'sciences_vie_sante':
      return ['SVT (Biologie/Géologie)', 'Chimie', 'Mathématiques', 'Français médical'];
    case 'lettres_langues':
      return ['Français & Expression', 'Philosophie', 'Malagasy', 'Anglais / LV2', 'Culture Générale'];
    case 'eco_societe':
      return ['Sciences Économiques & Sociales (SES)', 'Mathématiques', 'Histoire-Géo', 'Comptabilité'];
    case 'technique_appliquee':
      return ['Technologie & Dessin', 'Mathématiques appliquées', 'Physique appliquée', 'Informatique'];
    default:
      return ['Mathématiques', 'Physique-Chimie', 'Français', 'Philosophie'];
  }
}

// Matières selon le tempérament
export function getSubjectsForPersonality(personalityKey) {
  switch (personalityKey) {
    case 'lettres_comm':
      return ['Communication & Éloquence', 'Français & Rédaction', 'Langues Vivantes', 'Histoire-Géo'];
    case 'arts_creation':
      return ['Arts Plastiques / Dessin', 'Français & Littérature', 'Création Numérique', 'Philosophie'];
    case 'eco_gestion':
      return ['Gestion de projet', 'Économie pratique', 'Mathématiques de gestion', 'Anglais des affaires'];
    case 'sante_social':
      return ['Sciences humaines', 'SVT & Santé publique', 'Français', 'Éthique & Civisme'];
    case 'nature_agri':
      return ['SVT & Écologie', 'Agronomie & Environnement', 'Sciences physiques', 'Mathématiques'];
    case 'sciences_tech':
    default:
      return ['Mathématiques avancées', 'Physique-Chimie', 'Informatique & Code', 'Anglais'];
  }
}

function combineSubjects(arr1 = [], arr2 = []) {
  const merged = Array.from(new Set([...arr1, ...arr2]));
  return merged.slice(0, 6);
}

// Modèle type d'emploi du temps scolaire pour lycée/collège à Madagascar
export function getDefaultSchoolSchedule(classe = '', serie = '') {
  const subjects = getSubjectsForSerie(serie);
  const m1 = subjects[0] || 'Mathématiques';
  const m2 = subjects[1] || 'Physique-Chimie';
  const m3 = subjects[2] || 'Français';
  const m4 = subjects[3] || 'Malagasy';
  const m5 = subjects[4] || 'Histoire-Géo';
  const m6 = subjects[5] || 'Philosophie';

  return {
    titre: `Emploi du temps officiel - Lycée (${classe || 'Lycée'}${serie ? ' ' + serie : ''})`,
    source: 'Modèle scolaire standard Madagascar',
    jours: [
      {
        nom: 'Lundi',
        creneaux: [
          { debut: '07:30', fin: '09:30', type: 'cours', matiere: m1 },
          { debut: '09:45', fin: '11:45', type: 'cours', matiere: m2 },
          { debut: '11:45', fin: '13:45', type: 'pause', matiere: 'Pause déjeuner & Repos' },
          { debut: '13:45', fin: '15:45', type: 'cours', matiere: m3 },
          { debut: '16:00', fin: '17:30', type: 'cours', matiere: 'Anglais' },
        ],
      },
      {
        nom: 'Mardi',
        creneaux: [
          { debut: '07:30', fin: '09:30', type: 'cours', matiere: m2 },
          { debut: '09:45', fin: '11:45', type: 'cours', matiere: m1 },
          { debut: '11:45', fin: '13:45', type: 'pause', matiere: 'Pause déjeuner & Repos' },
          { debut: '13:45', fin: '15:45', type: 'cours', matiere: m4 },
          { debut: '16:00', fin: '17:30', type: 'cours', matiere: m5 },
        ],
      },
      {
        nom: 'Mercredi',
        creneaux: [
          { debut: '07:30', fin: '09:30', type: 'cours', matiere: m1 },
          { debut: '09:45', fin: '11:45', type: 'cours', matiere: m6 },
          { debut: '11:45', fin: '13:45', type: 'pause', matiere: 'Pause déjeuner & Retour' },
          { debut: '13:45', fin: '17:30', type: 'libre', matiere: 'Après-midi libre (Sport / Activités / Révision)' },
        ],
      },
      {
        nom: 'Jeudi',
        creneaux: [
          { debut: '07:30', fin: '09:30', type: 'cours', matiere: m2 },
          { debut: '09:45', fin: '11:45', type: 'cours', matiere: m3 },
          { debut: '11:45', fin: '13:45', type: 'pause', matiere: 'Pause déjeuner & Repos' },
          { debut: '13:45', fin: '15:45', type: 'cours', matiere: 'Éducation Physique & Sportive (EPS)' },
          { debut: '16:00', fin: '17:30', type: 'cours', matiere: m5 },
        ],
      },
      {
        nom: 'Vendredi',
        creneaux: [
          { debut: '07:30', fin: '09:30', type: 'cours', matiere: m1 },
          { debut: '09:45', fin: '11:45', type: 'cours', matiere: m4 },
          { debut: '11:45', fin: '13:45', type: 'pause', matiere: 'Pause déjeuner & Repos' },
          { debut: '13:45', fin: '15:45', type: 'cours', matiere: m6 },
          { debut: '16:00', fin: '17:30', type: 'cours', matiere: 'Anglais / LV2' },
        ],
      },
      {
        nom: 'Samedi',
        creneaux: [
          { debut: '07:30', fin: '11:30', type: 'cours', matiere: 'Devoir Surveillé / Évaluation hebdomadaire' },
          { debut: '11:30', fin: '17:30', type: 'libre', matiere: 'Après-midi libre & détente' },
        ],
      },
    ],
  };
}

// 3. Génération automatique du planning de révision adapté selon le temps libre
export function generateAdaptedRevisionSchedule({
  schoolSchedule,
  chosenTrack,
  briefing,
  currentUser,
}) {
  const eleveClasse = currentUser?.profil?.ele_cla || '';
  const eleveSerie = currentUser?.profil?.ele_ser || '';
  const isTerminale = isTerminaleClass(eleveClasse);

  // Matières prioritaires selon le chemin choisi
  let prioritySubjects = chosenTrack?.keySubjects || [];
  if (!prioritySubjects || prioritySubjects.length === 0) {
    prioritySubjects = getSubjectsForSerie(eleveSerie);
  }

  const s1 = prioritySubjects[0] || 'Mathématiques';
  const s2 = prioritySubjects[1] || 'Physique-Chimie';
  const s3 = prioritySubjects[2] || 'Français';
  const s4 = prioritySubjects[3] || 'Philosophie';
  const s5 = prioritySubjects[4] || 'Anglais';
  const s6 = prioritySubjects[5] || 'Malagasy';

  const trackTitle = chosenTrack?.title || 'Planning de Révision Équilibré';

  return {
    titre: `Planning de Révision Adapté e-hari`,
    strategieChoisie: trackTitle,
    badgeStrategie: chosenTrack?.badge || 'Équilibré',
    heuresHebdoTotal: 14.5,
    repartition: [
      { matiere: s1, heures: 4.5, couleur: '#2563eb' },
      { matiere: s2, heures: 3.5, couleur: '#0d9488' },
      { matiere: s3, heures: 2.5, couleur: '#7c3aed' },
      { matiere: s4, heures: 2.0, couleur: '#d97706' },
      { matiere: s5 || 'Langues & Méthode', heures: 2.0, couleur: '#059669' },
    ],
    jours: [
      {
        nom: 'Lundi',
        statut: 'Soirée ciblée',
        creneaux: [
          {
            debut: '18:15',
            fin: '19:15',
            matiere: s1,
            type: 'exercices',
            objectif: 'Exercices d\'application & résolution de problèmes récents',
            conseil: 'Méthode Pomodoro : 45 min de travail concentré + 15 min de vérification',
            couleur: '#dbeafe',
            texteCouleur: '#1e40af',
          },
          {
            debut: '19:45',
            fin: '20:45',
            matiere: s3,
            type: 'synthese',
            objectif: 'Fiche de synthèse et vocabulaire clé',
            conseil: 'Relire les notes du jour et créer 3 fiches de mémorisation active',
            couleur: '#f3e8ff',
            texteCouleur: '#6b21a8',
          },
        ],
      },
      {
        nom: 'Mardi',
        statut: 'Soirée approfondissement',
        creneaux: [
          {
            debut: '18:15',
            fin: '19:30',
            matiere: s2,
            type: 'cours',
            objectif: 'Compréhension des formules & analyse des schémas / concepts clés',
            conseil: 'Refaire les calculs sans regarder le corrigé',
            couleur: '#ccfbf1',
            texteCouleur: '#115e59',
          },
          {
            debut: '20:00',
            fin: '20:45',
            matiere: s4,
            type: 'quiz',
            objectif: 'Réactivation des définitions et repères d\'auteurs',
            conseil: 'Test d\'auto-interrogation rapide avant le dîner',
            couleur: '#fef3c7',
            texteCouleur: '#92400e',
          },
        ],
      },
      {
        nom: 'Mercredi',
        statut: 'Session intensive (Après-midi libre)',
        creneaux: [
          {
            debut: '14:30',
            fin: '16:00',
            matiere: s1,
            type: 'examen',
            objectif: isTerminale ? 'Annales du Baccalauréat (Sujet type en temps limité)' : 'Série d\'exercices approfondis',
            conseil: 'Conditions réelles sans interruption pour tester votre rapidité',
            couleur: '#dbeafe',
            texteCouleur: '#1e40af',
          },
          {
            debut: '16:15',
            fin: '17:30',
            matiere: s5 || 'Langues & Culture',
            type: 'pratique',
            objectif: 'Lecture active, rédaction de paragraphe ou écoute audio',
            conseil: 'Enrichissement du vocabulaire utile pour l\'université et les concours',
            couleur: '#d1fae5',
            texteCouleur: '#065f46',
          },
          {
            debut: '18:30',
            fin: '21:00',
            matiere: 'Temps libre & Détente',
            type: 'repos',
            objectif: 'Sport, famille, lecture de loisir',
            conseil: 'Le cerveau consolide ses apprentissages pendant les phases de repos',
            couleur: '#f1f5f9',
            texteCouleur: '#475569',
          },
        ],
      },
      {
        nom: 'Jeudi',
        statut: 'Soirée consolidation',
        creneaux: [
          {
            debut: '18:15',
            fin: '19:15',
            matiere: s2,
            type: 'exercices',
            objectif: 'Résolution d\'exercices types & pièges classiques d\'évaluation',
            conseil: 'Identifier précisément vos erreurs du cours de la matinée',
            couleur: '#ccfbf1',
            texteCouleur: '#115e59',
          },
          {
            debut: '19:45',
            fin: '20:30',
            matiere: s6 || s3,
            type: 'synthese',
            objectif: 'Mémorisation des notions et règles de rédaction',
            conseil: 'Réciter les notions à voix haute pour ancrer la mémoire auditive',
            couleur: '#fee2e2',
            texteCouleur: '#991b1b',
          },
        ],
      },
      {
        nom: 'Vendredi',
        statut: 'Préparation du Devoir du Samedi',
        creneaux: [
          {
            debut: '18:15',
            fin: '19:30',
            matiere: s1,
            type: 'revision_globale',
            objectif: 'Revue complète des chapitres du Devoir Surveillé du lendemain',
            conseil: 'Refaire les exercices types avec chronomètre',
            couleur: '#dbeafe',
            texteCouleur: '#1e40af',
          },
          {
            debut: '19:45',
            fin: '20:30',
            matiere: 'Revue Méthodologique & Préparation matériel',
            type: 'methode',
            objectif: 'Vérifier stylos, calculatrice, fiches et sommeil réparateur',
            conseil: 'Se coucher tôt (avant 22h) pour un esprit vif au DS du samedi matin',
            couleur: '#f1f5f9',
            texteCouleur: '#334155',
          },
        ],
      },
      {
        nom: 'Samedi',
        statut: 'Après-midi consolidation & Projet',
        creneaux: [
          {
            debut: '14:30',
            fin: '16:00',
            matiere: s2,
            type: 'projet_concours',
            objectif: 'Approfondissement des thèmes du métier cible & concours supérieurs',
            conseil: 'Aller au-delà du programme scolaire pour développer un profil d\'élite',
            couleur: '#ccfbf1',
            texteCouleur: '#115e59',
          },
          {
            debut: '16:15',
            fin: '17:15',
            matiere: s4,
            type: 'redaction',
            objectif: 'Structure de dissertation ou entraînement à l\'argumentation',
            conseil: 'Travailler la clarté du raisonnement et les transitions logiques',
            couleur: '#fef3c7',
            texteCouleur: '#92400e',
          },
        ],
      },
      {
        nom: 'Dimanche',
        statut: 'Bilan matinal & Repos complet',
        creneaux: [
          {
            debut: '09:00',
            fin: '10:30',
            matiere: 'Auto-évaluation & Organisation de la semaine',
            type: 'bilan',
            objectif: 'Organiser le classeur, planifier les devoirs à rendre et identifier les lacunes',
            conseil: 'Une semaine bien planifiée élimine 80% du stress scolaire',
            couleur: '#e0e7ff',
            texteCouleur: '#3730a3',
          },
          {
            debut: '10:30',
            fin: '21:00',
            matiere: 'Repos Sacré & Ressourcement',
            type: 'repos',
            objectif: 'Famille, communauté, loisirs, sommeil',
            conseil: 'Repos complet obligatoire pour entamer le lundi avec un maximum d\'énergie !',
            couleur: '#f8fafc',
            texteCouleur: '#64748b',
          },
        ],
      },
    ],
    conseilsRegles: [
      {
        titre: 'La règle des 8h de sommeil',
        texte: 'Un élève fatigué perd 40% de sa capacité de concentration. Couchez-vous avant 22h.',
        icone: '🌙',
      },
      {
        titre: 'La méthode Pomodoro',
        texte: 'Révisez par blocs de 45 minutes intenses sans téléphone, suivis de 10 minutes de pause.',
        icone: '⏱️',
      },
      {
        titre: 'Révision espacée',
        texte: 'Relisez vos cours le jour même (J0), puis à J+2 et J+7 pour transformer la mémoire courte en mémoire longue.',
        icone: '🧠',
      },
    ],
  };
}

// 5. Constantes et Moteur de la Grille Hebdomadaire Tranchée par 1h (5h à 21h, Lundi à Dimanche)
export const SCHEDULE_HOURS = [
  '05:00 - 06:00',
  '06:00 - 07:00',
  '07:00 - 08:00',
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
];

export const SCHEDULE_DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

// Grille vierge initiale (5h à 21h)
export function getInitialWeeklyGrid() {
  const grid = {};
  SCHEDULE_DAYS.forEach((day) => {
    grid[day] = {};
    SCHEDULE_HOURS.forEach((h) => {
      grid[day][h] = '';
    });
  });
  return grid;
}

// Modèle indicatif type lycée à Madagascar découpé par tranche de 1 heure
export function getDefaultLycéeWeeklyGrid(classe = '', serie = '') {
  const grid = getInitialWeeklyGrid();
  const subjects = getSubjectsForSerie(serie);
  const m1 = subjects[0] || 'Mathématiques';
  const m2 = subjects[1] || 'Physique-Chimie';
  const m3 = subjects[2] || 'Français';
  const m4 = subjects[3] || 'Malagasy';
  const m5 = subjects[4] || 'Histoire-Géo';
  const m6 = subjects[5] || 'Philosophie';

  // Lundi
  grid['Lundi']['07:00 - 08:00'] = m1;
  grid['Lundi']['08:00 - 09:00'] = m1;
  grid['Lundi']['09:00 - 10:00'] = m2;
  grid['Lundi']['10:00 - 11:00'] = m2;
  grid['Lundi']['12:00 - 13:00'] = 'Pause déjeuner';
  grid['Lundi']['14:00 - 15:00'] = m3;
  grid['Lundi']['15:00 - 16:00'] = m3;
  grid['Lundi']['16:00 - 17:00'] = 'Anglais';

  // Mardi
  grid['Mardi']['07:00 - 08:00'] = m2;
  grid['Mardi']['08:00 - 09:00'] = m2;
  grid['Mardi']['09:00 - 10:00'] = m1;
  grid['Mardi']['10:00 - 11:00'] = m1;
  grid['Mardi']['12:00 - 13:00'] = 'Pause déjeuner';
  grid['Mardi']['14:00 - 15:00'] = m4;
  grid['Mardi']['15:00 - 16:00'] = m4;
  grid['Mardi']['16:00 - 17:00'] = m5;

  // Mercredi
  grid['Mercredi']['07:00 - 08:00'] = m1;
  grid['Mercredi']['08:00 - 09:00'] = m1;
  grid['Mercredi']['09:00 - 10:00'] = m6;
  grid['Mercredi']['10:00 - 11:00'] = m6;
  grid['Mercredi']['12:00 - 13:00'] = 'Pause déjeuner';

  // Jeudi
  grid['Jeudi']['07:00 - 08:00'] = m2;
  grid['Jeudi']['08:00 - 09:00'] = m2;
  grid['Jeudi']['09:00 - 10:00'] = m3;
  grid['Jeudi']['10:00 - 11:00'] = m3;
  grid['Jeudi']['12:00 - 13:00'] = 'Pause déjeuner';
  grid['Jeudi']['14:00 - 15:00'] = 'Éducation Physique & Sportive (EPS)';
  grid['Jeudi']['15:00 - 16:00'] = 'Éducation Physique & Sportive (EPS)';
  grid['Jeudi']['16:00 - 17:00'] = m5;

  // Vendredi
  grid['Vendredi']['07:00 - 08:00'] = m1;
  grid['Vendredi']['08:00 - 09:00'] = m1;
  grid['Vendredi']['09:00 - 10:00'] = m4;
  grid['Vendredi']['10:00 - 11:00'] = m4;
  grid['Vendredi']['12:00 - 13:00'] = 'Pause déjeuner';
  grid['Vendredi']['14:00 - 15:00'] = m6;
  grid['Vendredi']['15:00 - 16:00'] = m6;
  grid['Vendredi']['16:00 - 17:00'] = 'Anglais / LV2';

  // Samedi
  grid['Samedi']['07:00 - 08:00'] = 'Devoir Surveillé (DS)';
  grid['Samedi']['08:00 - 09:00'] = 'Devoir Surveillé (DS)';
  grid['Samedi']['09:00 - 10:00'] = 'Devoir Surveillé (DS)';
  grid['Samedi']['10:00 - 11:00'] = 'Devoir Surveillé (DS)';

  return grid;
}

// Convertit un EDT scolaire existant en grille 1h
export function convertSchoolScheduleToWeeklyGrid(schoolSchedule) {
  const grid = getInitialWeeklyGrid();
  if (!schoolSchedule?.jours) return grid;

  schoolSchedule.jours.forEach((dayObj) => {
    const dayName = dayObj.nom;
    if (!grid[dayName]) return;

    (dayObj.creneaux || []).forEach((c) => {
      if (!c.debut || !c.fin || !c.matiere) return;
      const startH = parseInt(c.debut.split(':')[0], 10);
      const endH = parseInt(c.fin.split(':')[0], 10);
      const endM = parseInt(c.fin.split(':')[1] || '0', 10);
      const actualEnd = endM > 15 ? endH + 1 : endH;

      for (let h = startH; h < actualEnd && h < 21; h++) {
        const slotKey = `${String(h).padStart(2, '0')}:00 - ${String(h + 1).padStart(2, '0')}:00`;
        if (grid[dayName][slotKey] !== undefined) {
          grid[dayName][slotKey] = c.matiere;
        }
      }
    });
  });

  return grid;
}

// Conversion de la grille vers le format épuré pour la BDD (uniquement les tâches par tranches numérotées 1..16)
export function convertWeeklyGridToNumberedTasks(weeklyGrid) {
  const bddTasks = {};
  SCHEDULE_DAYS.forEach((day) => {
    const dayTasks = {};
    SCHEDULE_HOURS.forEach((h, idx) => {
      const slotNum = String(idx + 1); // 1 pour 05:00 - 06:00, ..., 16 pour 20:00 - 21:00
      const val = (weeklyGrid?.[day]?.[h] || '').trim();
      if (val && val.toLowerCase() !== 'libre' && val.toLowerCase() !== 'repos') {
        dayTasks[slotNum] = val;
      }
    });
    if (Object.keys(dayTasks).length > 0) {
      bddTasks[day] = dayTasks;
    }
  });
  return bddTasks;
}

// Chargement de la grille à partir des données sauvegardées (format épuré ou rétrocompatible)
export function loadWeeklyGridFromSavedData(savedData, classe = '', serie = '') {
  if (!savedData) {
    return getDefaultLycéeWeeklyGrid(classe, serie);
  }

  // 1. Détection du format épuré de la BDD { Lundi: { "1": "Tâche", "4": "Maths" }, ... }
  const source = savedData.tasks || savedData.weeklyGrid || savedData;
  const hasNumberedKeys = SCHEDULE_DAYS.some((day) => {
    const daySlots = source[day];
    return daySlots && typeof daySlots === 'object' && Object.keys(daySlots).some((k) => !isNaN(parseInt(k, 10)));
  });

  if (hasNumberedKeys) {
    const grid = getInitialWeeklyGrid();
    SCHEDULE_DAYS.forEach((day) => {
      const daySlots = source[day] || {};
      SCHEDULE_HOURS.forEach((h, idx) => {
        const slotNum = String(idx + 1);
        if (daySlots[slotNum]) {
          grid[day][h] = daySlots[slotNum];
        }
      });
    });
    return grid;
  }

  // 2. Ancien format weeklyGrid avec heures textuelles ('08:00 - 09:00')
  if (savedData.weeklyGrid) {
    const grid = getInitialWeeklyGrid();
    SCHEDULE_DAYS.forEach((day) => {
      const daySlots = savedData.weeklyGrid[day] || {};
      SCHEDULE_HOURS.forEach((h) => {
        if (daySlots[h]) {
          grid[day][h] = daySlots[h];
        }
      });
    });
    return grid;
  }

  // 3. Conversion depuis schoolSchedule rétrocompatible
  if (savedData.schoolSchedule) {
    return convertSchoolScheduleToWeeklyGrid(savedData.schoolSchedule);
  }

  return getDefaultLycéeWeeklyGrid(classe, serie);
}

// Analyse intelligente de la grille renseignée par l'élève et génération des révisions adaptées à son temps libre
export function analyzeAndGenerateFromWeeklyGrid({
  weeklyGrid,
  chosenTrack,
  briefing,
  currentUser,
}) {
  const eleveClasse = currentUser?.profil?.ele_cla || '';
  const eleveSerie = currentUser?.profil?.ele_ser || '';
  const isTerminale = isTerminaleClass(eleveClasse);

  // 1. Matières prioritaires selon la série / le cap choisi
  let prioritySubjects = chosenTrack?.keySubjects || [];
  if (!prioritySubjects || prioritySubjects.length === 0) {
    prioritySubjects = getSubjectsForSerie(eleveSerie);
  }
  if (!prioritySubjects || prioritySubjects.length === 0) {
    prioritySubjects = ['Mathématiques', 'Physique-Chimie', 'Français', 'Philosophie', 'Anglais', 'SVT'];
  }

  const subjectMetadata = {
    'Mathématiques': {
      objectif: isTerminale ? 'Annales du Bac & résolution de problèmes récents' : 'Exercices d\'application & théorèmes clés',
      conseil: 'Méthode Pomodoro : 45 min sans calculatrice pour les bases, puis vérification.',
      couleur: '#dbeafe',
      texteCouleur: '#1e40af',
    },
    'Physique-Chimie': {
      objectif: 'Maîtrise des lois physiques, équations chimiques et calculs',
      conseil: 'Refaire les démonstrations de cours sans regarder la solution.',
      couleur: '#ccfbf1',
      texteCouleur: '#115e59',
    },
    'SVT': {
      objectif: 'Schémas bilans légendés et restitution organisée des connaissances',
      conseil: 'Dessiner les schémas de mémoire pour ancrer la mémoire visuelle.',
      couleur: '#d1fae5',
      texteCouleur: '#065f46',
    },
    'Français': {
      objectif: 'Structure de dissertation, analyse de texte et citations clés',
      conseil: 'Rédiger une introduction et un plan détaillé en 30 minutes chrono.',
      couleur: '#f3e8ff',
      texteCouleur: '#6b21a8',
    },
    'Philosophie': {
      objectif: 'Définitions des notions clés, repères d\'auteurs et problématisation',
      conseil: 'Créer des fiches d\'arguments pour et contre sur les thèmes centraux.',
      couleur: '#fef3c7',
      texteCouleur: '#92400e',
    },
    'Histoire-Géographie': {
      objectif: 'Frises chronologiques, cartes de repérage et argumentation',
      conseil: 'Réactiver la mémoire avec des fiches de dates et repères spatiaux.',
      couleur: '#fee2e2',
      texteCouleur: '#991b1b',
    },
    'Anglais': {
      objectif: 'Vocabulaire d\'actualité, grammaire et compréhension écrite',
      conseil: 'Noter 10 mots nouveaux par session et les employer dans des phrases.',
      couleur: '#e0e7ff',
      texteCouleur: '#3730a3',
    },
    'Malagasy': {
      objectif: 'Grammaire, analyse littéraire malgache et culture générale',
      conseil: 'Relire les textes classiques et travailler l\'expression soignée.',
      couleur: '#ecfdf5',
      texteCouleur: '#047857',
    },
    'Sciences Économiques & Sociales (SES)': {
      objectif: 'Mécanismes économiques, lecture de tableaux et dissertations SES',
      conseil: 'Relier chaque notion théorique à un exemple concret de l\'actualité.',
      couleur: '#ffedd5',
      texteCouleur: '#9a3412',
    },
  };

  const getMeta = (subjectName) => {
    for (const [key, val] of Object.entries(subjectMetadata)) {
      if (subjectName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(subjectName.toLowerCase())) {
        return val;
      }
    }
    return {
      objectif: 'Consolidation active des cours et exercices d\'entraînement',
      conseil: 'Méthode des 45 minutes : travail concentré sans téléphone.',
      couleur: '#eff6ff',
      texteCouleur: '#1e40af',
    };
  };

  let totalHeuresRevision = 0;
  let totalHeuresCours = 0;
  let subjectCounter = 0;

  // Créneaux horaires optimaux pour placer les révisions quand ils sont libres
  const idealHoursForRevision = [
    '18:00 - 19:00',
    '19:00 - 20:00',
    '17:00 - 18:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '20:00 - 21:00',
  ];

  const unifiedDays = SCHEDULE_DAYS.map((dayName) => {
    const daySlots = weeklyGrid?.[dayName] || {};
    const coursesList = [];
    const freeSlots = [];

    SCHEDULE_HOURS.forEach((h) => {
      const task = (daySlots[h] || '').trim();
      const [debut, fin] = h.split(' - ');

      if (task) {
        totalHeuresCours += 1;
        const lower = task.toLowerCase();
        const isPause = lower.includes('pause') || lower.includes('repas') || lower.includes('déjeuner') || lower.includes('midi');
        coursesList.push({
          debut,
          fin,
          matiere: task,
          type: isPause ? 'pause' : 'cours',
          categorie: isPause ? 'pause' : 'cours',
          badge: isPause ? '🥪 Pause' : 'Cours scolaire',
        });
      } else {
        freeSlots.push({ debut, fin, heureRange: h });
      }
    });

    // Détermination des créneaux de révision adaptés dans les plages de temps libre
    const revisionSlots = [];
    const maxRevisionPerDay = dayName === 'Dimanche' ? 1 : (dayName === 'Mercredi' || dayName === 'Samedi' ? 2 : 2);
    let countRevision = 0;

    for (const idealH of idealHoursForRevision) {
      if (countRevision >= maxRevisionPerDay) break;
      const isFree = freeSlots.some((fs) => fs.heureRange === idealH);
      if (isFree) {
        const [debut, fin] = idealH.split(' - ');
        const targetSubject = prioritySubjects[subjectCounter % prioritySubjects.length];
        subjectCounter++;
        const meta = getMeta(targetSubject);

        revisionSlots.push({
          debut,
          fin,
          matiere: targetSubject,
          type: 'revision',
          categorie: 'revision',
          badge: '🎯 Révision ciblée',
          objectif: meta.objectif,
          conseil: meta.conseil,
          couleur: meta.couleur,
          texteCouleur: meta.texteCouleur,
        });

        countRevision++;
        totalHeuresRevision += 1;
      }
    }

    // Fusion et tri chronologique
    const allSlots = [...coursesList, ...revisionSlots];
    allSlots.sort((a, b) => {
      const timeToMin = (t) => {
        const [h, m] = (t || '00:00').split(':').map(Number);
        return h * 60 + (m || 0);
      };
      return timeToMin(a.debut) - timeToMin(b.debut);
    });

    return {
      nom: dayName,
      statut: revisionSlots.length > 0 ? `${coursesList.length}h cours • ${revisionSlots.length}h révision` : `${coursesList.length}h cours • Détente`,
      creneaux: allSlots,
    };
  });

  return {
    titre: 'Emploi du Temps Hebdomadaire Unifié e-hari',
    jours: unifiedDays,
    statistiques: {
      heuresCours: totalHeuresCours,
      heuresRevision: totalHeuresRevision,
    },
    weeklyGrid,
    dateGeneration: new Date().toISOString(),
  };
}

export function buildUnifiedSchedule({
  schoolSchedule,
  revisionSchedule,
  chosenTrack,
  currentUser,
  briefing,
}) {
  const eleveClasse = currentUser?.profil?.ele_cla || '';
  const eleveSerie = currentUser?.profil?.ele_ser || '';
  const targetCareer = briefing?.poleBriefing?.carrieres?.metiers?.[0]?.titre || 'Carrière visée';
  const targetPole = briefing?.poleInfo?.label || 'Orientation d\'avenir';
  const trackTitle = chosenTrack?.title || chosenTrack?.label || 'Stratégie Équilibrée e-hari';

  // Jours de la semaine
  const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const jours = dayNames.map((dayName) => {
    const schoolDay = schoolSchedule?.jours?.find((j) => j.nom === dayName);
    const revisionDay = revisionSchedule?.jours?.find((j) => j.nom === dayName);

    // Extraction et normalisation des créneaux scolaires
    const schoolSlots = (schoolDay?.creneaux || []).map((c) => ({
      ...c,
      categorie: c.type === 'cours' ? 'cours' : (c.type === 'pause' ? 'pause' : 'libre'),
      source: 'ecole',
      badge: c.type === 'cours' ? 'Cours scolaire' : (c.type === 'pause' ? '🥪 Pause' : '🌱 Temps personnel'),
    }));

    // Extraction et normalisation des créneaux de révision
    const revSlots = (revisionDay?.creneaux || []).map((cr) => ({
      ...cr,
      categorie: cr.type === 'repos' ? 'repos' : 'revision',
      source: 'ehari',
      badge: cr.type === 'repos' ? '🌙 Repos & Sommeil' : '🎯 Révision ciblée',
    }));

    // Fusion de tous les créneaux pour le jour
    const merged = [...schoolSlots, ...revSlots];

    // Tri chronologique rigoureux selon l'heure de début "HH:MM"
    merged.sort((a, b) => {
      const timeToMinutes = (t) => {
        if (!t) return 0;
        const [h, m] = t.split(':').map(Number);
        return (h || 0) * 60 + (m || 0);
      };
      return timeToMinutes(a.debut) - timeToMinutes(b.debut);
    });

    return {
      nom: dayName,
      statut: revisionDay?.statut || (dayName === 'Dimanche' ? 'Repos & Bilan' : 'Journée de cours & révision'),
      creneaux: merged,
    };
  });

  return {
    titre: `Emploi du Temps Hebdomadaire Unifié e-hari`,
    objectifUtilisateur: {
      metierCible: targetCareer,
      poleCible: targetPole,
      classe: eleveClasse,
      serie: eleveSerie,
      strategie: trackTitle,
      strategieBadge: chosenTrack?.badge || 'Équilibré',
      descriptionObjectif: `Réussite scolaire (${eleveClasse}${eleveSerie ? ' ' + eleveSerie : ''}) & Préparation active vers ${targetCareer}`,
    },
    statistiques: {
      heuresCours: 32,
      heuresRevision: revisionSchedule?.heuresHebdoTotal || 14.5,
      heuresSommeil: '8h / nuit',
    },
    jours,
    schoolSchedule,
    revisionSchedule,
    chosenTrack,
    dateGeneration: new Date().toISOString(),
  };
}
