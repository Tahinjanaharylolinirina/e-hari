// ========================================================
// DONNÉES CONCRÈTES DES SECTEURS QUI RECRUTENT À MADAGASCAR
// Entreprises réelles, implantations, profils recherchés & voies d'accès
// Plateforme e-HARI (ONG HARI Madagascar)
// ========================================================

import {
  TEST_RECONVERSION_INTERETS_CATEGORIES,
  TEST_RECONVERSION_POLES_INSERTION,
} from './reconversionOrientationTests';

import {
  resolveReconversionPersonalityKey,
  resolveReconversionPoleKey,
} from './reconversionCareerBriefing';

export const SECTEURS_RECRUTEMENT_MADA = [
  {
    id: 'secteur_tech_bpo',
    title: 'Économie Numérique, Tech, Web & BPO',
    shortTitle: 'Numérique & BPO',
    icon: '💻',
    color: '#2563eb',
    badge: 'Secteur n°1 d\'embauche à Antananarivo',
    matchedPoleKeys: ['pole_tech_digital', 'pole_rh_formation'],
    primaryPoleKey: 'pole_tech_digital',
    matchedTest1Keys: ['tech_numerique', 'formation_rh_humain'],
    primaryTest1Key: 'tech_numerique',
    description:
      'Le secteur des technologies et de l\'externalisation de services (BPO, centres de contact, ESN, développement logiciel) est le plus dynamique en création d\'emplois formels à Madagascar. Très accessible aux débutants et autodidactes motivés grâce à des formations internes assurées.',
    voieASuivre: {
      preRequis: [
        'Excellente maîtrise du français à l\'oral et à l\'écrit (niveau B2/C1 sans accent bloquant)',
        'Aisance générale avec un clavier d\'ordinateur (frappe d\'au moins 35 mots par minute)',
        'Sens du service client, courtoisie, réactivité et bonne capacité d\'écoute',
        'Pour les métiers du code : logique algorithmique, curiosité et portfolio de projets concrets (GitHub)',
      ],
      formationsRecommandees: [
        'Ateliers d\'insertion professionnelle & expression professionnelle e-HARI',
        'Formations certifiantes gratuites en ligne : FreeCodeCamp, OpenClassrooms, Google Digital Garage',
        'Bootcamps de développement web locaux : Sayna, Passerelles Numériques Madagascar, Epitech Tana',
        'Modules de relation client & téléopération dispensés lors de l\'intégration en entreprise',
      ],
      etapesConseillees: [
        '1. Tester son niveau de français et s\'entraîner quotidiennement à la lecture à voix haute et à l\'orthographe.',
        '2. Créer un CV moderne synthétique (1 page) valorisant ses compétences pratiques plutôt que la simple liste des diplômes.',
        '3. Pour les profils développeurs : publier 2 projets personnels fonctionnels en ligne démontrant votre code.',
        '4. Participer aux vagues de recrutement directes organisées chaque mois dans les zones de Galaxy Andraharo et d\'Ankorondrano.',
        '5. Postuler en ligne sur les portails dédiés et via les pages Facebook Carrière des entreprises.',
      ],
      canauxRecrutement: ['PortalJob Madagascar', 'LinkedIn', 'Facebook Jobs Tana', 'Candidature directe en agence'],
    },
    entreprises: [
      {
        id: 'ent_intelcia',
        nom: 'Intelcia Madagascar',
        secteurDetail: 'BPO, Relation Client Multicanal & Support Technique',
        implantation: 'Antananarivo (Zone Galaxy Andraharo, Zone Futura Andranomahery)',
        postesRecrutes: [
          'Conseiller Clientèle Francophone / Anglophone',
          'Télé-enquêteur & Chargé d\'Études de Marché',
          'Modérateur de Contenus Digitaux',
          'Superviseur d\'Équipe Junior (après 6 mois d\'expérience)',
        ],
        accessibilite: 'Accessible aux débutants avec bon français. Formation rémunérée dispensée dès l\'embauche.',
        profilRecherche: 'Baccalauréat minimum, élocution fluide, disponibilité horaire (shifts possibles), dynamisme.',
        emailContact: 'recrutement-madagascar@intelcia.com',
        siteWeb: 'https://recrutement.intelcia.com',
        conseilPostulation: 'Présentez-vous directement avec CV et pièce d\'identité aux sessions de recrutement sans rendez-vous au Galaxy Andraharo.',
      },
      {
        id: 'ent_concentrix_webhelp',
        nom: 'Concentrix / Webhelp Madagascar',
        secteurDetail: 'Expérience Client Internationale & Modération Digitale',
        implantation: 'Antananarivo (Zone Galaxy Andraharo, Enceinte Batpro)',
        postesRecrutes: [
          'Spécialiste Support Utilisateur / Relation Client',
          'Agent de Modération de Contenus Réseaux Sociaux',
          'Conseiller B2B & Support Applicatif',
          'Chargé de Qualité & Conformité des Échanges',
        ],
        accessibilite: 'Débutants bienvenus. Programmes d\'intégration et évolution interne rapide.',
        profilRecherche: 'Excellente compréhension du français métropolitain, bon relationnel, résistance au stress.',
        emailContact: 'recrutement.tana@webhelp.com',
        siteWeb: 'https://jobs.concentrix.com',
        conseilPostulation: 'Préparez votre test oral en vous exerçant à simuler une conversation professionnelle bienveillante au téléphone.',
      },
      {
        id: 'ent_vivetic',
        nom: 'Vivetic Group Madagascar',
        secteurDetail: 'Traitement de Données, Qualification de Fichiers, Annotation IA & Relation Client',
        implantation: 'Antananarivo (Ankorondrano & Tanjombato)',
        postesRecrutes: [
          'Opérateur de Qualification de Données & Saisie Experte',
          'Annotateur de Données pour Intelligence Artificielle (Computer Vision & NLP)',
          'Téléconseiller Réception / Émission d\'Appels',
          'Rédacteur Web & Assistant SEO',
        ],
        accessibilite: 'Parfait pour un premier emploi. Très ouvert aux personnes rigoureuses et attentives aux consignes.',
        profilRecherche: 'Bac minimum, bonne orthographe en français, rapidité de saisie et concentration soutenue.',
        emailContact: 'recrutement@vivetic.mg',
        siteWeb: 'https://www.viveticgroup.com',
        conseilPostulation: 'Passez des tests de vitesse de frappe en ligne pour mentionner votre score sur votre CV.',
      },
      {
        id: 'ent_bocasay',
        nom: 'Bocasay Madagascar',
        secteurDetail: 'Entreprise de Services du Numérique (ESN), Ingénierie Logicielle Offshore',
        implantation: 'Antananarivo (Zone Tana Waterfront Ambodivona)',
        postesRecrutes: [
          'Développeur Web Full-Stack Junior (React, Node.js, PHP/Symfony)',
          'Développeur Mobile (Flutter, React Native)',
          'Testeur QA Logiciel & Recette Applicative',
          'Intégrateur Web & WordPress',
        ],
        accessibilite: 'Diplômés ou autodidactes passionnés disposant de projets concrets à présenter.',
        profilRecherche: 'Logique de programmation, autonomie, capacité à apprendre vite et à travailler en méthode Agile.',
        emailContact: 'jobs@bocasay.com',
        siteWeb: 'https://www.bocasay.com/fr/carrieres',
        conseilPostulation: 'Ajoutez impérativement le lien de votre GitHub ou de vos mini-applications fonctionnelles dans votre candidature.',
      },
      {
        id: 'ent_etech',
        nom: 'Etech Consulting (Arkeup Group)',
        secteurDetail: 'Développement d\'Applications Web, Cloud, Mobile & E-commerce',
        implantation: 'Antananarivo (Ankorondrano & Andraharo)',
        postesRecrutes: [
          'Développeur PHP / Symfony / Laravel',
          'Développeur Front-End (Vue.js, React, Angular)',
          'Consultant ERP Open-Source (Odoo)',
          'Assistant Chef de Projet Digital',
        ],
        accessibilite: 'Organise régulièrement des pépinières de talents et des sessions de test de code pour juniors.',
        profilRecherche: 'Bases solides en programmation orientée objet, passion pour les nouvelles technos, esprit d\'équipe.',
        emailContact: 'recrutement@etechconsulting-mg.com',
        siteWeb: 'https://www.etechconsulting-mg.com',
        conseilPostulation: 'Entraînez-vous aux tests d\'algorithmes classiques avant de vous rendre à l\'entretien technique.',
      },
      {
        id: 'ent_axian',
        nom: 'Groupe Axian (Telma, Mvola, Pulse, EDMI)',
        secteurDetail: 'Télécommunications, Fintech Mobile, Énergie & Services Digitaux',
        implantation: 'Antananarivo (Alarobia, Ankorondrano) & agences régionales partout à Madagascar',
        postesRecrutes: [
          'Conseiller Clientèle en Boutique Telma',
          'Animateur Commercial Terrain Mvola',
          'Technicien Support Réseau & Télécoms',
          'Assistant Administratif & Gestion de Données',
        ],
        accessibilite: 'Nombreuses opportunités pour jeunes diplômés et débutants ayant le sens du contact direct.',
        profilRecherche: 'Excellent relationnel, sens commercial affûté, sens des responsabilités et rigueur de caisse.',
        emailContact: 'recrutement@telma.mg',
        siteWeb: 'https://www.axian-group.com/carrieres',
        conseilPostulation: 'Mettez en avant vos qualités d\'accueil et votre aisance avec les services financiers mobiles Mvola.',
      },
    ],
  },
  {
    id: 'secteur_agro_transformation',
    title: 'Agro-business, Terroir & Transformation Locale',
    shortTitle: 'Agro-business & Terroir',
    icon: '🌾',
    color: '#16a34a',
    badge: 'Forte valeur ajoutée locale & Export',
    matchedPoleKeys: ['pole_entrepreneuriat', 'pole_agro_ecologie'],
    primaryPoleKey: 'pole_entrepreneuriat',
    matchedTest1Keys: ['entrepreneuriat_agri', 'impact_vert_rse'],
    primaryTest1Key: 'entrepreneuriat_agri',
    description:
      'Madagascar possède des matières premières agricoles d\'exception (vanille, cacao, épices, fruits, miel, huiles essentielles). Les entreprises de transformation et d\'exportation recrutent des profils de terrain, des techniciens qualité, des logisticiens et des commerciaux.',
    voieASuivre: {
      preRequis: [
        'Sensibilisation aux règles d\'hygiène, de traçabilité et aux normes de sécurité alimentaire (HACCP)',
        'Sens pratique affûté, rigueur dans le comptage et la pesée des produits',
        'Capacité à travailler en équipe dans des environnements de production ou d\'entrepôt',
        'Pour les postes de terrain : disponibilité pour des déplacements en zone rurale',
      ],
      formationsRecommandees: [
        'Formations d\'initiation aux normes de qualité et d\'hygiène alimentaire (ONG HARI, CNFTP)',
        'Certifications en gestion des stocks et méthodes d\'inventaire sous Excel',
        'Formations en négociation et vente de produits locaux',
      ],
      etapesConseillees: [
        '1. Identifier les filières fortes de votre région (cacao dans le Nord, vanille dans la SAVA, fruits/légumes sur les Hauts-Plateaux).',
        '2. Mettre en valeur toute expérience pratique précédente (commerce, vente, manutention, agriculture familiale).',
        '3. Rédiger un CV clair mettant en avant la rigueur, l\'intégrité et la disponibilité physique.',
        '4. Déposer son dossier en candidature spontanée directement auprès des usines et sièges sociaux situés à Tanjombato et Andraharo.',
        '5. Visiter les salons professionnels malgaches (Foire Internationale de Madagascar FIM, Foire FIA).',
      ],
      canauxRecrutement: ['Candidature physique en usine', 'Avis de presse locale', 'PortalJob Madagascar', 'Salons de l\'agriculture'],
    },
    entreprises: [
      {
        id: 'ent_chocolat_robert',
        nom: 'Chocolaterie Robert / Ramanandraibe Exportation',
        secteurDetail: 'Transformation de Cacao Fin, Chocolaterie Haut de Gamme & Exportation',
        implantation: 'Antananarivo (Soixante-Sept Hectares, Tanjombato) & plantations à Ambanja (Vallée du Sambirano)',
        postesRecrutes: [
          'Agent de Production & Conditionnement de Chocolat',
          'Contrôleur Qualité Produits Finis & Traçabilité',
          'Vendeur-Conseil en Boutique Spécialisée',
          'Gestionnaire de Stocks & Magasinier Emballages',
        ],
        accessibilite: 'Postes d\'opérateurs accessibles avec Bac ou niveau terminale et bonne rigueur.',
        profilRecherche: 'Propreté irréprochable, respect strict des normes sanitaires, dextérité manuelle.',
        emailContact: 'recrutement@chocolatserobert.com',
        siteWeb: 'https://www.chocolatserobert.com',
        conseilPostulation: 'Déposez votre CV au siège social avec une lettre manuscrite soulignant votre minutie et votre ponctualité.',
      },
      {
        id: 'ent_star_madagascar',
        nom: 'Star Madagascar (Groupe Castel)',
        secteurDetail: 'Brasserie, Boissons Gazeuses, Eaux Minérales & Logistique de Distribution',
        implantation: 'Antananarivo (Andraharo), Ambatolampy, Antsirabe & agences régionales',
        postesRecrutes: [
          'Opérateur de Ligne de Conditionnement / Embouteillage',
          'Agent de Distribution & Chauffeur-Livreur',
          'Magasinier Manutentionnaire & Cariste',
          'Promoteur Commercial Terrain & Vendeur Itinérant',
        ],
        accessibilite: 'Nombreux recrutements réguliers de personnel opérationnel et commercial.',
        profilRecherche: 'Bonne condition physique, honnêteté, permis de conduire (pour livreurs), sens du contact.',
        emailContact: 'recrutement@star.mg',
        siteWeb: 'https://www.star.mg',
        conseilPostulation: 'Précisez votre zone d\'habitation pour être affecté au centre de distribution le plus proche.',
      },
      {
        id: 'ent_floribis',
        nom: 'Floribis Madagascar',
        secteurDetail: 'Transformation de Vanille Naturelle, Extraction d\'Huiles Essentielles & Cosmétiques Bio',
        implantation: 'Vohémar (Région SAVA) & agence commerciale à Antananarivo',
        postesRecrutes: [
          'Technicien d\'Extraction & Distillation',
          'Agent de Triage et Calibrage de Gousses de Vanille',
          'Assistant Contrôle Qualité & Certifications Bio (Ecocert)',
          'Commercial Produits du Terroir & Cosmétiques',
        ],
        accessibilite: 'Ouvert aux profils rigoureux habitant la région SAVA ou prêts à une installation.',
        profilRecherche: 'Minutie, patience, odorat affûté, respect des standards internationaux d\'exportation.',
        emailContact: 'contact@floribis.com',
        siteWeb: 'https://www.floribis.com',
        conseilPostulation: 'Mettez en avant toute connaissance préalable des plantes et des huiles essentielles de Madagascar.',
      },
      {
        id: 'ent_sahanala',
        nom: 'Groupe Sahanala Madagascar',
        secteurDetail: 'Fédération de Coopératives Paysannes, Commerce Équitable, Vanille, Miel & Épices',
        implantation: 'Antananarivo (Ankorondrano) & zones d\'action rurales (Analanjirofo, Atsinanana, Menabe)',
        postesRecrutes: [
          'Coordinateur de Collecte sur le Terrain',
          'Assistant Logistique Rurale & Suivi des Pesées',
          'Auditeur Interne Normes Bio & Fairtrade',
          'Comptable d\'Agence Régionale',
        ],
        accessibilite: 'Très favorable aux profils polyvalents passionnés par le développement rural communautaire.',
        profilRecherche: 'Goût du terrain, excellente écoute des agriculteurs, intégrité totale dans la gestion des fonds.',
        emailContact: 'recrutement@sahanala.net',
        siteWeb: 'https://www.sahanala.net',
        conseilPostulation: 'Soulignez vos attaches régionales et votre capacité d\'adaptation aux réalités villageoises.',
      },
      {
        id: 'ent_homeopharma',
        nom: 'Homéopharma Madagascar',
        secteurDetail: 'Cosmétiques Naturels, Phytothérapie Malgache & Réseau de Boutiques Bien-Être',
        implantation: 'Antananarivo (Laboratoires Tanjombato) & plus de 40 instituts dans toute l\'île',
        postesRecrutes: [
          'Vendeur-Conseil en Boutique & Institut Bien-Être',
          'Préparateur en Laboratoire Cosmétique',
          'Assistant Gestion des Stocks & Expéditions Magasins',
          'Esthéticien(ne) / Praticien(ne) Bien-Être',
        ],
        accessibilite: 'Formations internes régulières aux produits naturels et aux protocoles de vente.',
        profilRecherche: 'Présentation soignée, empathie naturelle, fibre commerciale bienveillante, écoute.',
        emailContact: 'recrutement@homeopharma.mg',
        siteWeb: 'https://www.homeopharma.mg',
        conseilPostulation: 'Déposez votre CV directement en boutique centrale ou au siège avec une lettre axée sur la santé naturelle.',
      },
    ],
  },
  {
    id: 'secteur_energie_ecologie',
    title: 'Énergies Renouvelables, Écologie & Projets ONG',
    shortTitle: 'Énergie Solaire & Écologie',
    icon: '⚡',
    color: '#d97706',
    badge: 'Soutenu par les financements internationaux',
    matchedPoleKeys: ['pole_agro_ecologie'],
    primaryPoleKey: 'pole_agro_ecologie',
    matchedTest1Keys: ['impact_vert_rse'],
    primaryTest1Key: 'impact_vert_rse',
    description:
      'Avec un taux d\'électrification rurale inférieur à 20% à Madagascar et des financements massifs pour l\'adaptation climatique, les entreprises solaires, les mini-réseaux et les ONG environnementales recrutent activement des techniciens, des gestionnaires de mission et des animateurs de terrain.',
    voieASuivre: {
      preRequis: [
        'Pour les postes techniques : notions de base en électricité (courant continu, batteries, câblage sécurisé)',
        'Pour les postes de projet : sens de l\'écoute des communautés locales, polyvalence et bon relationnel',
        'Mobilité géographique indispensable : volonté d\'effectuer des missions régulières en provinces et zones rurales',
        'Rigueur dans le suivi des équipements et des fiches d\'intervention technique',
      ],
      formationsRecommandees: [
        'Formations courtes en électricité photovoltaïque et maintenance de kits solaires (ONG HARI, CNFTP, centres techniques)',
        'Modules de gestion de projet de développement communautaire et suivi d\'indicateurs',
        'Permis moto ou tout-terrain (très apprécié pour les missions rurales)',
      ],
      etapesConseillees: [
        '1. Maîtriser le fonctionnement basique d\'une installation solaire autonome (panneau, régulateur, batterie, onduleur).',
        '2. Mettre en avant sa capacité de mobilité et son endurance sur le terrain.',
        '3. Suivre les appels d\'offres et recrutements publiés sur les portails associatifs et LinkedIn.',
        '4. Proposer ses services comme technicien stagiaire ou assistant de mission pour faire ses preuves sur le terrain.',
      ],
      canauxRecrutement: ['Sites carrière des ONG', 'Madajob Madagascar', 'LinkedIn ONG HARI', 'Candidatures spontanées aux entreprises solaires'],
    },
    entreprises: [
      {
        id: 'ent_welight',
        nom: 'WeLight Madagascar',
        secteurDetail: 'Électrification Rurale Propre, Mini-Réseaux Solaires & Énergie Productive',
        implantation: 'Antananarivo (Galaxy Andraharo) & plus de 60 villages ruraux électrifiés dans toute l\'île',
        postesRecrutes: [
          'Technicien Solaire & Électricien Réseau Rural',
          'Agent Commercial de Proximité & Raccordement Clients',
          'Responsable d\'Exploitation de Mini-Centrale Locale',
          'Gestionnaire de Données Télérelève & Compteurs Intelligents',
        ],
        accessibilite: 'Embauche régulièrement des jeunes techniciens motivés formés aux bases électriques.',
        profilRecherche: 'Autonomie de travail, sens des responsabilités, respect strict des normes de sécurité électrique.',
        emailContact: 'recrutement@welight-africa.com',
        siteWeb: 'https://www.welight-africa.com',
        conseilPostulation: 'Indiquez clairement votre région d\'origine et votre disponibilité immédiate pour le terrain.',
      },
      {
        id: 'ent_jirove',
        nom: 'Jiro-Ve Madagascar',
        secteurDetail: 'Distribution Inclusive d\'Énergie Solaire & Lampes à Bas Coût',
        implantation: 'Antananarivo, Tamatave, Majunga, Toliara, Antsirabe',
        postesRecrutes: [
          'Superviseur de Réseau de Franchisés Locaux',
          'Technicien Réparation de Lampes et Batteries Solaires',
          'Agent Commercial Terrain de Sensibilisation',
          'Gestionnaire de Dépôt Régional',
        ],
        accessibilite: 'Modèle entrepreneurial très ouvert aux profils débrouillards et autonomes.',
        profilRecherche: 'Sens du contact avec les petits commerçants et ménages, persévérance, sens de la gestion.',
        emailContact: 'jobs@jirove.com',
        siteWeb: 'https://www.jirove.com',
        conseilPostulation: 'Faites valoir votre facilité à créer du lien et à expliquer des solutions techniques simplement.',
      },
      {
        id: 'ent_solarmad',
        nom: 'Solarmad / Green Energy Solutions (GES)',
        secteurDetail: 'Installations Solaires Industrielles, Pompage Agricole & Centrales Hybrides',
        implantation: 'Antananarivo (Zone Forello Tanjombato)',
        postesRecrutes: [
          'Monteur / Installateur de Panneaux Photovoltaïques',
          'Électricien Bâtiment & Industriel Spécialisé Solaire',
          'Technico-Commercial Solutions d\'Énergie Solaire',
          'Assistant Logistique Matériel & Onduleurs',
        ],
        accessibilite: 'Postes d\'installateurs ouverts aux profils manuels et sérieux après formation pratique.',
        profilRecherche: 'Aptitude au travail en hauteur (toitures), rigueur de câblage, ponctualité exemplaire.',
        emailContact: 'contact@solarmad.mg',
        siteWeb: 'https://www.solarmad.mg',
        conseilPostulation: 'Mentionnez vos compétences manuelles et vos expériences en électricité ou métallerie.',
      },
      {
        id: 'ent_wwf_mada',
        nom: 'WWF Madagascar',
        secteurDetail: 'Organisation Non Gouvernementale Internationale de Conservation & Développement',
        implantation: 'Antananarivo (Près d\'Ambatobe) & bureaux de terrain (Mahafaly, Menabe, Diana, etc.)',
        postesRecrutes: [
          'Assistant de Projet de Terrain & Suivi Communautaire',
          'Animateur de Sensibilisation Environnementale',
          'Assistant Administratif & Financier de Mission',
          'Chauffeur-Mécanicien de Mission Tout-Terrain',
        ],
        accessibilite: 'Recrutements sur concours et dossiers selon les programmes en cours.',
        profilRecherche: 'Intégrité morale irréprochable, compréhension des enjeux écologiques, respect des communautés.',
        emailContact: 'recrutement@wwf.mg',
        siteWeb: 'https://www.wwf.mg/carrieres',
        conseilPostulation: 'Rédigez une lettre de motivation personnalisée démontrant votre attachement concret à la préservation de Madagascar.',
      },
    ],
  },
  {
    id: 'secteur_logistique_distribution',
    title: 'Logistique, Transport, Distribution & Industrie',
    shortTitle: 'Logistique & Distribution',
    icon: '🚚',
    color: '#0891b2',
    badge: 'Emplois pérennes & essentiels',
    matchedPoleKeys: ['pole_logistique_supply', 'pole_conseil_management'],
    primaryPoleKey: 'pole_logistique_supply',
    matchedTest1Keys: ['expertise_terrain_qualite', 'management_conseil'],
    primaryTest1Key: 'expertise_terrain_qualite',
    description:
      'Dans une grande île où l\'acheminement des vivres, des matériaux de construction et des produits manufacturés est quotidien, les transporteurs, transitaires, entrepôts logistiques et grands distributeurs recrutent des agents fiables et méthodiques.',
    voieASuivre: {
      preRequis: [
        'Rigueur absolue dans la vérification des marchandises et la tenue des fiches d\'inventaire',
        'Sens de l\'organisation spatiale, gestion méthodique des flux d\'entrées et de sorties',
        'Bonne condition physique pour les activités d\'entrepôt et de manutention',
        'Aisance avec les outils informatiques simples (Excel, logiciel de caisse, lecteur de code-barres)',
      ],
      formationsRecommandees: [
        'Formation gestion de stocks & comptage d\'inventaire e-HARI',
        'Notions de base en transit douanier et documents de transport (B/L, lettre de voiture, bon de livraison)',
        'Permis de conduire B/C/D pour les postes de conduite ou manutention motorisée',
      ],
      etapesConseillees: [
        '1. Soigner sa réputation de ponctualité et d\'honnêteté (critère éliminatoire n°1 en logistique à Madagascar).',
        '2. S\'entraîner à l\'utilisation d\'un tableur Excel pour concevoir des fiches d\'entrées/sorties claires.',
        '3. Cibler les zones industrielles et commerciales d\'Antananarivo (Ankorondrano, Tanjombato, Ankadimbahoaka, Andraharo).',
        '4. Déposer son CV directement auprès des chefs de quai ou directeurs de magasin pour montrer sa motivation directe.',
      ],
      canauxRecrutement: ['Dépôt physique sur site', 'PortalJob Madagascar', 'Réseau professionnel de chauffeurs & magasiniers'],
    },
    entreprises: [
      {
        id: 'ent_agl',
        nom: 'Africa Global Logistics (AGL) Madagascar',
        secteurDetail: 'Transit Maritime/Aérien, Entreposage Sous Douane & Logistique Industrielle',
        implantation: 'Antananarivo (Ankorondrano), Tamatave (Port International), Majunga, Diego',
        postesRecrutes: [
          'Déclarant en Douane Junior / Assistant Transit',
          'Magasinier d\'Entrepôt Sous Douane',
          'Agent de Suivi des Livraisons & Tracking Conteneurs',
          'Agent de Facturation Logistique',
        ],
        accessibilite: 'Formation interne assurée aux procédures douanières et logistiques malgaches.',
        profilRecherche: 'Rigueur administrative, minutie des dossiers, discrétion et respect des délais portuaires.',
        emailContact: 'recrutement.madagascar@aglgroup.com',
        siteWeb: 'https://www.aglgroup.com',
        conseilPostulation: 'Mettez en avant toute compétence liée au droit commercial, à l\'anglais maritime ou au transit.',
      },
      {
        id: 'ent_dhl',
        nom: 'DHL Express & Global Forwarding Madagascar',
        secteurDetail: 'Fret Express International, Courrier Express & Gestion Logistique',
        implantation: 'Antananarivo (Ankorondrano, Aéroport Ivato) & agences provinciales',
        postesRecrutes: [
          'Agent de Guichet d\'Expédition & Accueil Client',
          'Agent de Tri et Dispatching des Colis',
          'Coursier / Chauffeur Livreur Express',
          'Opérateur Saisie Manifestes Aériens',
        ],
        accessibilite: 'Standards internationaux élevés, opportunités de formation continue reconnue.',
        profilRecherche: 'Excellente présentation, ponctualité stricte, grand sens de l\'intégrité, réactivité.',
        emailContact: 'dhl-madagascar.recrutement@dhl.com',
        siteWeb: 'https://www.dhl.com/mg-fr',
        conseilPostulation: 'Rédigez un CV irréprochable avec photo professionnelle et références professionnelles vérifiables.',
      },
      {
        id: 'ent_jumbo_score',
        nom: 'Jumbo Score / Supermaki (Groupe Vindemia / GBH)',
        secteurDetail: 'Grande Distribution Alimentaire, Supermarchés & Réassort Logistique',
        implantation: 'Antananarivo (Ankorondrano, Tanjombato, Digue, Talatamaty) & principales provinces',
        postesRecrutes: [
          'Employé Libre-Service & Mise en Rayon',
          'Hôte / Hôtesse de Caisse',
          'Réceptionnaire de Marchandises & Contrôleur Entrepôt',
          'Préparateur de Commandes / Magasinier Frais',
        ],
        accessibilite: 'Très accessible sans expérience préalable. Idéal pour débuter dans la vie active.',
        profilRecherche: 'Dynamisme, esprit d\'équipe, sens du service au client, rigueur de tenue de caisse.',
        emailContact: 'recrutement@vindemia.mg',
        siteWeb: 'https://www.gbh.fr',
        conseilPostulation: 'Déposez votre CV à l\'accueil des magasins Jumbo Score d\'Ankorondrano ou de Tanjombato un matin en semaine.',
      },
      {
        id: 'ent_filatex',
        nom: 'Groupe Filatex',
        secteurDetail: 'Parcs Industriels, Promotion Immobilière, Logistique & Énergie',
        implantation: 'Antananarivo (Ankadimbahoaka, Tanjombato) & Tamatave',
        postesRecrutes: [
          'Gestionnaire de Bâtiment & Maintenance de Site',
          'Contrôleur d\'Accès & Sécurité Opérationnelle',
          'Assistant Administratif Logistique',
          'Superviseur de Travaux d\'Entretien',
        ],
        accessibilite: 'Recherche régulièrement des profils méthodiques pour la gestion de ses zones industrielles.',
        profilRecherche: 'Sens de l\'organisation, vigilance, polyvalence technique, capacité à faire respecter les consignes.',
        emailContact: 'recrutement@groupefilatex.com',
        siteWeb: 'https://www.groupefilatex.com',
        conseilPostulation: 'Soulignez votre disponibilité et vos connaissances pratiques des installations techniques.',
      },
    ],
  },
  {
    id: 'secteur_finance_services',
    title: 'Services Financiers, Banques & Microfinance',
    shortTitle: 'Finance & Microfinance',
    icon: '🏢',
    color: '#7c3aed',
    badge: 'Inclusion financière & Croissance PME',
    matchedPoleKeys: ['pole_conseil_management', 'pole_rh_formation', 'pole_entrepreneuriat'],
    primaryPoleKey: 'pole_conseil_management',
    matchedTest1Keys: ['management_conseil', 'formation_rh_humain'],
    primaryTest1Key: 'management_conseil',
    description:
      'Les institutions de microfinance et les banques de détail à Madagascar connaissent une expansion continue pour accompagner les commerçants, artisans et ménages. Elles recrutent chaque année des centaines de chargés de clientèle, agents de crédit et gestionnaires de caisse.',
    voieASuivre: {
      preRequis: [
        'Honnêteté et intégrité exemplaires (casier judiciaire vierge exigé)',
        'Minutie, aisance dans le calcul mental et la vérification des pièces justificatives',
        'Aisance relationnelle et aptitude à la négociation commerciale respectueuse',
        'Pour les agents de crédit : capacité d\'évaluation réaliste de l\'activité d\'un commerçant sur le terrain',
      ],
      formationsRecommandees: [
        'Notions de gestion de petite entreprise, analyse de chiffre d\'affaires et de marge (e-HARI)',
        'Formations aux techniques de vente et d\'entretien de crédit',
        'Formation d\'intégration complète de 1 à 2 mois généralement dispensée par les institutions',
      ],
      etapesConseillees: [
        '1. S\'entraîner aux tests de logique mathématique simple et de rapidité de calcul.',
        '2. Mettre en valeur toute expérience liée à la gestion de caisse, au commerce ou à l\'accueil.',
        '3. Postuler aux campagnes de recrutement de masse des institutions de microfinance (AccèsBanque, Baobab, SIPEM).',
        '4. Préparer ses entretiens en soignant son élocution et en démontrant sa fiabilité personnelle.',
      ],
      canauxRecrutement: ['Sites web des institutions', 'PortalJob Madagascar', 'LinkedIn', 'Sessions de recrutement ouvertes'],
    },
    entreprises: [
      {
        id: 'ent_accesbanque',
        nom: 'AccèsBanque Madagascar',
        secteurDetail: 'Banque Commerciale de Microfinance & Financement des Micro-Entrepreneurs',
        implantation: 'Antananarivo (plus de 10 agences urbaines) & réseau national dans toutes les grandes villes',
        postesRecrutes: [
          'Chargé de Clientèle Micro-Entreprises / Agent de Crédit',
          'Guichetier - Payeur / Caissier d\'Agence',
          'Conseiller Accueil & Téléopérateur Centre d\'Appels',
          'Assistant Recouvrement Amiable',
        ],
        accessibilite: 'L\'un des plus grands recruteurs de jeunes débutants à Madagascar, avec école de formation interne rémunérée.',
        profilRecherche: 'Bac+2 à Bac+4 (gestion, éco, droit, commerce ou scientifique), aisance relationnelle, honnêteté.',
        emailContact: 'recrutement@accesbanque.mg',
        siteWeb: 'https://www.accesbanque.mg/carrieres',
        conseilPostulation: 'Postulez en ligne sur leur portail : les candidatures sont traitées régulièrement par promotions de stagiaires.',
      },
      {
        id: 'ent_baobab',
        nom: 'Baobab Madagascar (ex-Microcred)',
        secteurDetail: 'Services Financiers Inclusifs, Crédits de Proximité & Épargne',
        implantation: 'Antananarivo (Analakely, Andravoahangy, 67Ha, etc.) & agences provinciales',
        postesRecrutes: [
          'Gestionnaire de Portefeuille Crédit de Proximité',
          'Chargé de Service Clientèle en Agence',
          'Agent de Prospection Terrain',
          'Caissier d\'Agence Bancaire',
        ],
        accessibilite: 'Formation initiale approfondie assurée aux techniques d\'analyse financière de terrain.',
        profilRecherche: 'Goût du contact humain de proximité (marchés, ateliers), rigueur d\'analyse, dynamisme.',
        emailContact: 'recrutement-mada@baobabgroup.com',
        siteWeb: 'https://www.baobabgroup.com/fr/madagascar',
        conseilPostulation: 'Préparez-vous à expliquer comment vous évalueriez les revenus d\'un épicier ou d\'un atelier de menuiserie.',
      },
      {
        id: 'ent_bni',
        nom: 'BNI Madagascar',
        secteurDetail: 'Première Banque à Capitaux Malgaches, Banque de Détail & Entreprises',
        implantation: 'Siège à Analakely (Antananarivo) et agences sur l\'ensemble du territoire national',
        postesRecrutes: [
          'Téléconseiller Centre de Relation Client BNI',
          'Agent d\'Accueil et d\'Orientation en Agence',
          'Chargé de Traitement des Opérations Bancaires',
          'Assistant Administratif Crédit',
        ],
        accessibilite: 'Recrutements réguliers de profils commerciaux et de téléconseillers pour son centre d\'appels.',
        profilRecherche: 'Excellente élocution en français et malgache, présentation irréprochable, sens de l\'écoute client.',
        emailContact: 'recrutement@bni.mg',
        siteWeb: 'https://www.bni.mg',
        conseilPostulation: 'Déposez votre candidature sur le site officiel de la BNI dans la rubrique Carrière.',
      },
      {
        id: 'ent_boa',
        nom: 'Bank of Africa (BOA) Madagascar',
        secteurDetail: 'Premier Réseau Bancaire de Madagascar, Particuliers, Professionnels & Grandes Entreprises',
        implantation: 'Réseau le plus dense de Madagascar avec plus de 90 agences sur toute l\'île',
        postesRecrutes: [
          'Conseiller d\'Accueil & Orientation en Agence',
          'Assistant Commercial Particuliers & Professionnels',
          'Agent Administratif du Réseau d\'Agences',
          'Téléopérateur Service Client',
        ],
        accessibilite: 'Programmes de stages de fin d\'études et premiers emplois pour jeunes diplômés.',
        profilRecherche: 'Rigueur, discrétion professionnelle absolue, présentation soignée, esprit d\'équipe.',
        emailContact: 'recrutement@boa.mg',
        siteWeb: 'https://www.boa.mg',
        conseilPostulation: 'Postulez aux campagnes annuelles de recrutement de début d\'exercice (janvier-mars).',
      },
      {
        id: 'ent_mazars',
        nom: 'Cabinet Mazars Fivoarana Madagascar',
        secteurDetail: 'Audit, Expertise Comptable Externalisée, Conseil Fiscal & Juridique',
        implantation: 'Antananarivo (Zone Zital Ankorondrano)',
        postesRecrutes: [
          'Assistant Comptable Junior en Externalisation',
          'Auditeur Junior Débutant',
          'Gestionnaire de Paie & Déclarations Sociales (CNaPS / OSTIE)',
          'Opérateur de Saisie Comptable',
        ],
        accessibilite: 'Excellente école pour les profils rigoureux souhaitant se former aux standards internationaux.',
        profilRecherche: 'Bases en comptabilité générale (PCG 2005), rigueur chiffrée, maîtrise d\'Excel.',
        emailContact: 'recrutement@mazars.mg',
        siteWeb: 'https://www.mazars.mg',
        conseilPostulation: 'Faites relire votre lettre de motivation avec le plus grand soin : zéro faute tolérée en cabinet d\'audit.',
      },
    ],
  },
];

// ========================================================
// MOTEUR DE CORRESPONDANCE ENTRE TESTS ET SECTEURS RECRUTEURS
// Calcule les secteurs et entreprises recommandés pour l'utilisateur
// en fonction de ses résultats au Test 1 et au Test 2
// ========================================================

export function getRecommendedSecteursForUser({ oriPro1 = '', oriPro2 = '', detMot = null, detTra = null } = {}) {
  const hasTest1 = Boolean(oriPro1);
  const hasTest2 = Boolean(oriPro2);

  if (!hasTest1 && !hasTest2) {
    return {
      hasTests: false,
      hasTest1: false,
      hasTest2: false,
      test1Key: null,
      test2Key: null,
      userArchetypeLabel: '',
      userPoleLabel: '',
      topSecteur: null,
      topSecteurId: null,
      recommendedSecteurIds: [],
      recommendedSecteurs: [],
      recommendedEntreprisesCount: 0,
      scoredSecteurs: SECTEURS_RECRUTEMENT_MADA.map((s) => ({
        ...s,
        matchScore: 0,
        isRecommended: false,
        matchReasons: [],
      })),
    };
  }

  // 1. Résolution de la clé du Test 1 (Aspirations & Personnalité)
  let test1Key = detMot?.dominantKey || '';
  if (!test1Key && oriPro1) {
    test1Key = resolveReconversionPersonalityKey(oriPro1);
  }
  const secondaryTest1Key = detMot?.secondaryKey || '';
  const test1Cat = (test1Key && TEST_RECONVERSION_INTERETS_CATEGORIES[test1Key]) || null;
  const userArchetypeLabel = test1Cat?.label || oriPro1 || '';

  // 2. Résolution de la clé du Test 2 (Pôle d'emploi cible)
  let test2Key = detTra?.dominantPoleKey || '';
  if (!test2Key && oriPro2) {
    test2Key = resolveReconversionPoleKey(oriPro2);
  }
  const test2Pole = (test2Key && TEST_RECONVERSION_POLES_INSERTION[test2Key]) || null;
  const userPoleLabel = test2Pole?.label || oriPro2 || '';

  // 3. Calcul des scores d'adéquation pour chaque secteur de Madagascar
  const scoredSecteurs = SECTEURS_RECRUTEMENT_MADA.map((secteur) => {
    let score = 0;
    const reasons = [];

    // Impact du Test 2 (Pôle cible validé par les compétences et aptitudes)
    if (test2Key && Array.isArray(secteur.matchedPoleKeys) && secteur.matchedPoleKeys.includes(test2Key)) {
      if (secteur.primaryPoleKey === test2Key) {
        score += 15;
        reasons.push(`Correspond exactement à votre pôle d'emploi cible : ${userPoleLabel || 'Pôle Validé'}`);
      } else {
        score += 8;
        reasons.push(`Secteur d'insertion en forte synergie avec votre pôle cible`);
      }
    }

    // Impact du Test 1 (Aspirations dominantes & tempérament)
    if (test1Key && Array.isArray(secteur.matchedTest1Keys) && secteur.matchedTest1Keys.includes(test1Key)) {
      if (secteur.primaryTest1Key === test1Key) {
        score += 10;
        reasons.push(`Aligné avec vos motivations profondes : ${userArchetypeLabel || 'Aspirations Idéales'}`);
      } else {
        score += 5;
        reasons.push(`En adéquation avec vos aspirations professionnelles`);
      }
    }

    // Impact du Test 1 (Aspiration secondaire)
    if (secondaryTest1Key && Array.isArray(secteur.matchedTest1Keys) && secteur.matchedTest1Keys.includes(secondaryTest1Key)) {
      score += 3;
    }

    const isRecommended = score >= 8;

    return {
      ...secteur,
      matchScore: score,
      isRecommended,
      matchReasons: reasons,
    };
  });

  // Trier par score décroissant
  const sorted = [...scoredSecteurs].sort((a, b) => b.matchScore - a.matchScore);
  const topSecteur = sorted[0]?.matchScore > 0 ? sorted[0] : null;

  // Récupérer les secteurs recommandés
  let recommendedSecteurs = sorted.filter((s) => s.isRecommended);
  if (recommendedSecteurs.length === 0 && topSecteur) {
    recommendedSecteurs = [topSecteur];
  }

  const recommendedSecteurIds = recommendedSecteurs.map((s) => s.id);
  const recommendedEntreprisesCount = recommendedSecteurs.reduce(
    (acc, s) => acc + (s.entreprises?.length || 0),
    0
  );

  return {
    hasTests: true,
    hasTest1,
    hasTest2,
    test1Key,
    test2Key,
    userArchetypeLabel,
    userPoleLabel,
    topSecteur,
    topSecteurId: topSecteur?.id || null,
    recommendedSecteurs,
    recommendedSecteurIds,
    recommendedEntreprisesCount,
    scoredSecteurs: sorted,
  };
}


