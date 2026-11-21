// Référentiel et moteur de simulation de l'Analyse Facebook (Pages suivies & Reels visionnés)

export function generateSimulatedFacebookAnalysis({ user, account }) {
  const p = user?.profil || {};
  const ori1 = (p.ele_ori_pro_1 || '').toLowerCase();
  const ori2 = (p.ele_ori_pro_2 || '').toLowerCase();
  const detMat = p.ele_det_mat || {};
  const dominantPoleKey = detMat?.dominantPoleKey || detMat?.dominantPole?.key || '';

  // Personnalisation du profil déduit selon le profil existant de l'élève
  let profilDominant = 'Sciences, Technologies & Découverte';
  let pagesSuivies = [];
  let reelsVisionnes = [];
  let traitsComportementaux = [];
  let correlationOrientation = '';

  if (ori1.includes('éloquent') || ori2.includes('lettres') || dominantPoleKey === 'lettres_langues') {
    profilDominant = 'Débats de Société, Droit & Expression Littéraire';
    pagesSuivies = [
      { nom: 'Revue Juridique & Citoyenne de Madagascar', categorie: 'Droit & Justice', affinite: '94%' },
      { nom: 'Actualités Politiques & Géopolitique Afrique', categorie: 'Actualités & Médias', affinite: '88%' },
      { nom: 'Littérature & Philosophie Malgache', categorie: 'Culture & Livres', affinite: '82%' },
      { nom: 'Éloquence & Art Oratoire Antananarivo', categorie: 'Communication', affinite: '79%' },
    ];
    reelsVisionnes = [
      { theme: 'Extraits de plaidoiries et débats d\'idées', pourcentage: 42, icon: '⚖️' },
      { theme: 'Analyses de citations et figures de style', pourcentage: 28, icon: '📖' },
      { theme: 'Reportages d\'investigation & documentaires', pourcentage: 20, icon: '🎙️' },
      { theme: 'Citations inspirantes et prises de parole', pourcentage: 10, icon: '🗣️' },
    ];
    traitsComportementaux = [
      'Temps de lecture moyen élevé sur les publications longues et articles de presse',
      'Forte interaction (commentaires argumentés, partages de tribunes citoyennes)',
      'Intérêt marqué pour les questions de justice sociale, de démocratie et de liberté d\'expression',
    ];
    correlationOrientation =
      'Votre consommation sur Facebook confirme votre vocation naturelle pour les filières juridiques, diplomatiques, journalistiques ou de communication (Série A2 / Faculté de Droit & CEDS).';
  } else if (ori1.includes('entreprenant') || ori2.includes('économiques') || dominantPoleKey === 'eco_societe') {
    profilDominant = 'Business, Startups & Économie à Madagascar';
    pagesSuivies = [
      { nom: 'Jeunes Entrepreneurs Malagasy (JEM)', categorie: 'Entrepreneuriat', affinite: '96%' },
      { nom: 'Économie & Bourse de l\'Océan Indien', categorie: 'Finance & Gestion', affinite: '89%' },
      { nom: 'Marketing Digital & E-Commerce Mada', categorie: 'Vente & Digital', affinite: '84%' },
      { nom: 'Success Stories d\'Entreprises Africaines', categorie: 'Management', affinite: '78%' },
    ];
    reelsVisionnes = [
      { theme: 'Conseils en investissement et microfinance', pourcentage: 40, icon: '💼' },
      { theme: 'Stratégies de vente et marketing sur les réseaux', pourcentage: 30, icon: '📈' },
      { theme: 'Interviews de chefs d\'entreprise malgaches', pourcentage: 20, icon: '🚀' },
      { theme: 'Astuces de productivité et leadership', pourcentage: 10, icon: '⚡' },
    ];
    traitsComportementaux = [
      'Veille active sur les tendances du marché et les opportunités commerciales',
      'Visionnage assidu de Reels orientés stratégie d\'entreprise et indépendance financière',
      'Esprit pragmatique orienté vers la création de valeur et l\'impact économique',
    ];
    correlationOrientation =
      'Votre flux Facebook met en lumière votre sensibilité au monde des affaires et de la gestion d\'entreprise (Série OSE / INSCAE, ISCAM, Faculté EGS).';
  } else if (ori1.includes('santé') || ori2.includes('biologiques') || dominantPoleKey === 'sciences_vie_sante') {
    profilDominant = 'Sciences de la Vie, Médecine & Écologie Durable';
    pagesSuivies = [
      { nom: 'Madagascar National Parks & Biodiversité', categorie: 'Faune & Flore', affinite: '95%' },
      { nom: 'Conseils Santé & Recherche Médicale', categorie: 'Santé Publique', affinite: '90%' },
      { nom: 'Agro-écologie & Fermes Durables', categorie: 'Agriculture Verte', affinite: '83%' },
      { nom: 'Biologie Marine & Forêts Tropicales', categorie: 'Écologie', affinite: '79%' },
    ];
    reelsVisionnes = [
      { theme: 'Vulgarisation anatomique et cas médicaux', pourcentage: 45, icon: '🩺' },
      { theme: 'Documentaires faune endémique de Madagascar', pourcentage: 30, icon: '🌿' },
      { theme: 'Innovations vétérinaires et pharmacopée locale', pourcentage: 15, icon: '🔬' },
      { theme: 'Nutrition saine et gestes de premiers secours', pourcentage: 10, icon: '🍎' },
    ];
    traitsComportementaux = [
      'Sensibilité sincère pour le bien-être humain et la préservation de la nature',
      'Enregistrement fréquent de vidéos explicatives sur la santé et les écosystèmes',
      'Intérêt continu pour l\'agronomie et la valorisation des ressources locales',
    ];
    correlationOrientation =
      'Vos centres d\'intérêt sur Facebook résonnent parfaitement avec les filières médicales, paramédicales et agronomiques (Série D / Faculté de Médecine & ESSA Ankatso).';
  } else {
    // Par défaut ou profil Sciences & Technologies
    profilDominant = 'Technologies, Informatique & Rigueur Scientifique';
    pagesSuivies = [
      { nom: 'Tech & Digital Madagascar', categorie: 'Informatique & Web', affinite: '95%' },
      { nom: 'Science & Cosmos (Astronomie & Physique)', categorie: 'Sciences Exactes', affinite: '91%' },
      { nom: 'Génie Civil & Grandes Infrastructures', categorie: 'Ingénierie', affinite: '84%' },
      { nom: 'IA, Robotique & Automatisation', categorie: 'Nouvelles Technologies', affinite: '80%' },
    ];
    reelsVisionnes = [
      { theme: 'Démonstrations de programmation et astuces tech', pourcentage: 44, icon: '💻' },
      { theme: 'Expériences physiques et calculs fascinants', pourcentage: 26, icon: '⚡' },
      { theme: 'Chantiers de construction et modélisation 3D', pourcentage: 18, icon: '🏗️' },
      { theme: 'Innovations d\'énergie solaire et robotique', pourcentage: 12, icon: '🤖' },
    ];
    traitsComportementaux = [
      'Curiosité technique spontanée : recherche du fonctionnement logique des choses',
      'Temps de concentration prolongé sur les vidéos de résolutions d\'énigmes et tutoriels',
      'Attrait pour la création numérique et les systèmes automatisés',
    ];
    correlationOrientation =
      'Votre activité Facebook reflète une appétence naturelle pour l\'ingénierie, le code et les sciences exactes (Série C ou Technique Industrielle / ESPA, ENI Fianarantsoa, IT University).';
  }

  return {
    account: account || 'Compte Facebook vérifié',
    analyzedAt: new Date().toISOString(),
    observationPeriod: '7 jours consécutifs (1 semaine)',
    statistiques: {
      pagesSuiviesCount: 38,
      reelsVisionnesCount: 142,
      tempsMoyenJournalier: '42 min/jour',
      engagementScore: '87/100',
    },
    profilDominant,
    pagesSuivies,
    reelsVisionnes,
    traitsComportementaux,
    correlationOrientation,
  };
}

// Vérifie si la période de 7 jours est écoulée
export function isFacebookAnalysisExpired(estimatedFinishAt) {
  if (!estimatedFinishAt) return false;
  return new Date() >= new Date(estimatedFinishAt);
}

// Formate le compte à rebours restant
export function formatRemainingTime(estimatedFinishAt) {
  if (!estimatedFinishAt) return '';
  const diffMs = new Date(estimatedFinishAt) - new Date();
  if (diffMs <= 0) return 'Analyse terminée';

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} jour${days > 1 ? 's' : ''} et ${hours} h restante${hours > 1 ? 's' : ''}`;
  }
  return `${hours} heure${hours > 1 ? 's' : ''} et ${minutes} min restante${minutes > 1 ? 's' : ''}`;
}

