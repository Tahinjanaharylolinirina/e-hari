/**
 * Catalogue constant et statique des tests e-HARI
 * Gestion 100% au niveau du code (questions, réponses possibles, points et traits de caractéristiques / résultats).
 * Aucune dépendance sur des tables statiques en BDD.
 */

const TESTS_CONSTANT_DATA = {
  "eleve_1": {
    "role": "eleve",
    "testNum": 1,
    "questions": [
      {
        "id": 1,
        "ordre": 1,
        "texte": "Pendant votre temps libre ou vos week-ends, quelle activité vous passionne le plus ?",
        "pts_sci": 2,
        "pts_lit": 2,
        "reponses": [
          {
            "id": 1,
            "code": "1a",
            "titre": "Explorer la technologie ou la logique",
            "description": "Programmer, bricoler des circuits, comprendre le fonctionnement des appareils ou résoudre des énigmes mathématiques.",
            "pts_sci": 2,
            "pts_lit": 0,
            "categorie": "sciences_tech",
            "pole": "sciences_tech"
          },
          {
            "id": 2,
            "code": "1b",
            "titre": "Lire, écrire et s'exprimer",
            "description": "Dévorer des livres, rédiger des récits, apprendre des langues étrangères ou débattre sur des idées d'actualité.",
            "pts_sci": 0,
            "pts_lit": 2,
            "categorie": "lettres_comm",
            "pole": "lettres_comm"
          },
          {
            "id": 3,
            "code": "1c",
            "titre": "Entreprendre et organiser",
            "description": "Imaginer un petit projet commercial, gérer l'argent, planifier des événements et motiver des camarades.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "eco_gestion",
            "pole": "eco_gestion"
          },
          {
            "id": 4,
            "code": "1d",
            "titre": "Prendre soin et aider les autres",
            "description": "Aider un ami en difficulté, faire du bénévolat, expliquer des cours aux plus jeunes ou soigner des proches.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "sante_social",
            "pole": "sante_social"
          },
          {
            "id": 5,
            "code": "1e",
            "titre": "Créer, dessiner ou composer",
            "description": "Dessiner, faire de la musique, concevoir des visuels graphiques, filmer ou imaginer des œuvres artistiques.",
            "pts_sci": 0,
            "pts_lit": 1,
            "categorie": "arts_creation",
            "pole": "arts_creation"
          },
          {
            "id": 6,
            "code": "1f",
            "titre": "Être au contact de la nature",
            "description": "Observer les plantes et animaux, jardiner, randonner et s'intéresser à la protection de l'environnement malgache.",
            "pts_sci": 1,
            "pts_lit": 0,
            "categorie": "nature_agri",
            "pole": "nature_agri"
          }
        ]
      },
      {
        "id": 2,
        "ordre": 2,
        "texte": "Quelle cause humaine ou collective résonne le plus avec vos valeurs profondes ?",
        "pts_sci": 2,
        "pts_lit": 2,
        "reponses": [
          {
            "id": 7,
            "code": "2a",
            "titre": "Le progrès scientifique et la compréhension du monde",
            "description": "Comprendre les mystères de l'univers, la logique des sciences et trouver des solutions ingénieuses.",
            "pts_sci": 2,
            "pts_lit": 0,
            "categorie": "sciences_tech",
            "pole": "sciences_tech"
          },
          {
            "id": 8,
            "code": "2b",
            "titre": "La justice, les droits humains et la culture",
            "description": "Défendre l'équité, faire entendre la voix de chacun et transmettre la richesse de nos langues et traditions.",
            "pts_sci": 0,
            "pts_lit": 2,
            "categorie": "lettres_comm",
            "pole": "lettres_comm"
          },
          {
            "id": 9,
            "code": "2c",
            "titre": "L'esprit d'initiative et l'autonomie",
            "description": "Encourager chacun à entreprendre, mener des projets collectifs concrets et dynamiser notre entourage.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "eco_gestion",
            "pole": "eco_gestion"
          },
          {
            "id": 10,
            "code": "2d",
            "titre": "La solidarité, le soin et la bienveillance",
            "description": "Venir en aide à ceux qui traversent des épreuves, préserver la santé et apporter une écoute sincère.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "sante_social",
            "pole": "sante_social"
          },
          {
            "id": 11,
            "code": "2e",
            "titre": "L'art, l'imaginaire et la liberté d'expression",
            "description": "Émouvoir par la musique, l'image et les mots, et faire rayonner les talents et la créativité.",
            "pts_sci": 0,
            "pts_lit": 1,
            "categorie": "arts_creation",
            "pole": "arts_creation"
          },
          {
            "id": 12,
            "code": "2f",
            "titre": "La protection de la nature et le respect du vivant",
            "description": "Préserver l'équilibre de la terre, des forêts et des cours d'eau, et vivre en harmonie avec le vivant.",
            "pts_sci": 1,
            "pts_lit": 0,
            "categorie": "nature_agri",
            "pole": "nature_agri"
          }
        ]
      },
      {
        "id": 3,
        "ordre": 3,
        "texte": "Quel trait de votre personnalité vos amis et proches remarquent-ils le plus chez vous ?",
        "pts_sci": 2,
        "pts_lit": 2,
        "reponses": [
          {
            "id": 13,
            "code": "3a",
            "titre": "Rationnel, méthodique et persévérant",
            "description": "Vous cherchez toujours la cause exacte des choses avec logique et rigueur intellectuelle.",
            "pts_sci": 2,
            "pts_lit": 0,
            "categorie": "sciences_tech",
            "pole": "sciences_tech"
          },
          {
            "id": 14,
            "code": "3b",
            "titre": "Éloquent, sensible et à l'aise avec les mots",
            "description": "Vous trouvez les mots justes, vous aimez argumenter et vous appréciez les belles formulations.",
            "pts_sci": 0,
            "pts_lit": 2,
            "categorie": "lettres_comm",
            "pole": "lettres_comm"
          },
          {
            "id": 15,
            "code": "3c",
            "titre": "Leader, négociateur et orienté résultats",
            "description": "Vous aimez prendre des initiatives, rassembler les gens autour d'un but et trouver des solutions pratiques.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "eco_gestion",
            "pole": "eco_gestion"
          },
          {
            "id": 16,
            "code": "3d",
            "titre": "Empathique, généreux et à l'écoute",
            "description": "Vous ressentez les émotions des autres et vous êtes toujours prêt à soutenir et réconforter.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "sante_social",
            "pole": "sante_social"
          },
          {
            "id": 17,
            "code": "3e",
            "titre": "Imaginatif, original et sensible à la beauté",
            "description": "Vous voyez le monde sous un angle différent et vous avez toujours mille idées créatives.",
            "pts_sci": 0,
            "pts_lit": 1,
            "categorie": "arts_creation",
            "pole": "arts_creation"
          },
          {
            "id": 18,
            "code": "3f",
            "titre": "Pragmatique, attentif au vivant et patient",
            "description": "Vous avez le sens de l'observation concrète, vous aimez le travail de terrain et le respect de la vie.",
            "pts_sci": 1,
            "pts_lit": 0,
            "categorie": "nature_agri",
            "pole": "nature_agri"
          }
        ]
      },
      {
        "id": 4,
        "ordre": 4,
        "texte": "Lors d'un moment en groupe ou d'un projet commun, quelle est votre posture naturelle ?",
        "pts_sci": 2,
        "pts_lit": 2,
        "reponses": [
          {
            "id": 19,
            "code": "4a",
            "titre": "L'esprit posé et méthodique",
            "description": "Observer calmement, vérifier les détails avec logique et structurer les étapes avec clarté.",
            "pts_sci": 2,
            "pts_lit": 0,
            "categorie": "sciences_tech",
            "pole": "sciences_tech"
          },
          {
            "id": 20,
            "code": "4b",
            "titre": "Le porte-parole à l'écoute",
            "description": "Faciliter le dialogue, exprimer les idées avec nuance et veiller à une communication fluide.",
            "pts_sci": 0,
            "pts_lit": 2,
            "categorie": "lettres_comm",
            "pole": "lettres_comm"
          },
          {
            "id": 21,
            "code": "4c",
            "titre": "Le moteur du groupe",
            "description": "Encourager tout le monde, proposer des actions concrètes et maintenir l'élan collectif.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "eco_gestion",
            "pole": "eco_gestion"
          },
          {
            "id": 22,
            "code": "4d",
            "titre": "Le soutien attentionné",
            "description": "Veiller à ce que chacun se sente respecté, encouragé et écouté dans une ambiance sereine.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "sante_social",
            "pole": "sante_social"
          },
          {
            "id": 23,
            "code": "4e",
            "titre": "L'esprit créatif et original",
            "description": "Apporter un regard neuf, imaginer des pistes inattendues et soigner la beauté d'ensemble.",
            "pts_sci": 0,
            "pts_lit": 1,
            "categorie": "arts_creation",
            "pole": "arts_creation"
          },
          {
            "id": 24,
            "code": "4f",
            "titre": "Le réaliste de bon sens",
            "description": "Garder les pieds sur terre, privilégier les solutions simples et observer avec patience.",
            "pts_sci": 1,
            "pts_lit": 0,
            "categorie": "nature_agri",
            "pole": "nature_agri"
          }
        ]
      },
      {
        "id": 5,
        "ordre": 5,
        "texte": "Quel sujet de documentaire ou d'article capte immédiatement toute votre attention ?",
        "pts_sci": 2,
        "pts_lit": 2,
        "reponses": [
          {
            "id": 25,
            "code": "5a",
            "titre": "Les mystères de l'univers et l'intelligence artificielle",
            "description": "Les robots du futur, les trous noirs, la physique quantique et les algorithmes informatiques.",
            "pts_sci": 2,
            "pts_lit": 0,
            "categorie": "sciences_tech",
            "pole": "sciences_tech"
          },
          {
            "id": 26,
            "code": "5b",
            "titre": "Les grands récits de l'histoire et les chefs-d'œuvre littéraires",
            "description": "Les discours historiques célèbres, les secrets des langues et les grandes révolutions humaines.",
            "pts_sci": 0,
            "pts_lit": 2,
            "categorie": "lettres_comm",
            "pole": "lettres_comm"
          },
          {
            "id": 27,
            "code": "5c",
            "titre": "La trajectoire des personnes audacieuses et entreprenantes",
            "description": "Comment naît une grande idée, comment se nouent les coopérations et se bâtissent les réussites.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "eco_gestion",
            "pole": "eco_gestion"
          },
          {
            "id": 28,
            "code": "5d",
            "titre": "Les actes de courage et le dévouement pour autrui",
            "description": "Les missions humanitaires, les découvertes médicales qui sauvent des vies et l'entraide humaine.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "sante_social",
            "pole": "sante_social"
          },
          {
            "id": 29,
            "code": "5e",
            "titre": "Les coulisses d'un atelier de création ou de spectacle",
            "description": "La confection d'un film, la composition d'une œuvre musicale ou la création architecturale.",
            "pts_sci": 0,
            "pts_lit": 1,
            "categorie": "arts_creation",
            "pole": "arts_creation"
          },
          {
            "id": 30,
            "code": "5f",
            "titre": "La vie sauvage fascinante et la force de la nature",
            "description": "Les espèces endémiques de Madagascar, les forêts primaires et la beauté des cycles naturels.",
            "pts_sci": 1,
            "pts_lit": 0,
            "categorie": "nature_agri",
            "pole": "nature_agri"
          }
        ]
      },
      {
        "id": 6,
        "ordre": 6,
        "texte": "Dans quel cadre ou atmosphère vous sentez-vous le plus épanoui(e) au quotidien ?",
        "pts_sci": 2,
        "pts_lit": 2,
        "reponses": [
          {
            "id": 31,
            "code": "6a",
            "titre": "Un espace calme et studieux",
            "description": "Où vous pouvez vous concentrer en paix, approfondir un sujet et résoudre des énigmes logiques.",
            "pts_sci": 2,
            "pts_lit": 0,
            "categorie": "sciences_tech",
            "pole": "sciences_tech"
          },
          {
            "id": 32,
            "code": "6b",
            "titre": "Un cadre d'échange et d'ouverture",
            "description": "Où la parole est libre, où l'on apprend des autres et où l'on partage des réflexions stimulantes.",
            "pts_sci": 0,
            "pts_lit": 2,
            "categorie": "lettres_comm",
            "pole": "lettres_comm"
          },
          {
            "id": 33,
            "code": "6c",
            "titre": "Un environnement actif et motivant",
            "description": "Où les initiatives sont encouragées, où l'on relève des challenges et où les projets prennent vie.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "eco_gestion",
            "pole": "eco_gestion"
          },
          {
            "id": 34,
            "code": "6d",
            "titre": "Une ambiance chaleureuse et solidaire",
            "description": "Où la bienveillance et le respect mutuel sont prioritaires, et où l'on veille les uns sur les autres.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "sante_social",
            "pole": "sante_social"
          },
          {
            "id": 35,
            "code": "6e",
            "titre": "Un lieu d'inspiration et de liberté",
            "description": "Un espace stimulant où l'imagination s'exprime librement à travers les sons, les mots et les images.",
            "pts_sci": 0,
            "pts_lit": 1,
            "categorie": "arts_creation",
            "pole": "arts_creation"
          },
          {
            "id": 36,
            "code": "6f",
            "titre": "Le grand air et le contact avec la nature",
            "description": "Un cadre vivant, paisible et enraciné, au contact de la terre, des plantes et des éléments vivants.",
            "pts_sci": 1,
            "pts_lit": 0,
            "categorie": "nature_agri",
            "pole": "nature_agri"
          }
        ]
      },
      {
        "id": 7,
        "ordre": 7,
        "texte": "Face à une situation imprévue et complexe, quelle est votre première réaction ?",
        "pts_sci": 2,
        "pts_lit": 2,
        "reponses": [
          {
            "id": 37,
            "code": "7a",
            "titre": "Décortiquer méthodiquement le problème",
            "description": "Analyser les faits étape par étape pour identifier l'origine logique de la panne ou du blocage.",
            "pts_sci": 2,
            "pts_lit": 0,
            "categorie": "sciences_tech",
            "pole": "sciences_tech"
          },
          {
            "id": 38,
            "code": "7b",
            "titre": "Dialoguer et rechercher des arguments solides",
            "description": "Poser les bonnes questions, consulter des textes fiables et convaincre par la parole.",
            "pts_sci": 0,
            "pts_lit": 2,
            "categorie": "lettres_comm",
            "pole": "lettres_comm"
          },
          {
            "id": 39,
            "code": "7c",
            "titre": "Agir avec efficacité et pragmatisme",
            "description": "Calculer le meilleur rapport bénéfice/risque et prendre une décision rapide sans hésiter.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "eco_gestion",
            "pole": "eco_gestion"
          },
          {
            "id": 40,
            "code": "7d",
            "titre": "Rassurer les personnes touchées",
            "description": "Veiller avant tout à la sécurité et au moral de son entourage avant de chercher la solution.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "sante_social",
            "pole": "sante_social"
          },
          {
            "id": 41,
            "code": "7e",
            "titre": "Trouver une issue créative et originale",
            "description": "Penser en dehors du cadre pour imaginer une solution inédite que personne n'avait envisagée.",
            "pts_sci": 0,
            "pts_lit": 1,
            "categorie": "arts_creation",
            "pole": "arts_creation"
          },
          {
            "id": 42,
            "code": "7f",
            "titre": "Observer avec patience et bon sens",
            "description": "Prendre le recul nécessaire, observer l'évolution naturelle des choses et agir avec pragmatisme.",
            "pts_sci": 1,
            "pts_lit": 0,
            "categorie": "nature_agri",
            "pole": "nature_agri"
          }
        ]
      }
    ],
    "caracteristiques": [
      {
        "id": 1,
        "code": "sciences_tech",
        "nom": "Caractère Réfléchi, Curieux & Méthodique",
        "short_nom": "Réfléchi & Méthodique",
        "description": "Vous possédez une nature posée, calme et persévérante. Vous aimez comprendre en profondeur comment fonctionnent les choses, analyser les situations avec logique et aborder chaque problème avec rigueur et bon sens.",
        "qualites": "Raisonnement logique, Curiosité intellectuelle, Patience et persévérance, Sens de l'analyse",
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 8,
        "pts_lit_min": 0
      },
      {
        "id": 2,
        "code": "lettres_comm",
        "nom": "Caractère Éloquent, Sensible & Humaniste",
        "short_nom": "Éloquent & Sensible",
        "description": "Vous vous distinguez par votre sensibilité humaine, votre clarté d'expression et votre goût pour l'échange d'idées. Vous aimez écouter, transmettre, dialoguer et défendre les valeurs de justice et de respect.",
        "qualites": "Aisance d'expression, Sens de l'écoute, Sensibilité humaine, Esprit critique et nuance",
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 0,
        "pts_lit_min": 8
      },
      {
        "id": 3,
        "code": "eco_gestion",
        "nom": "Caractère Entreprenant, Organisateur & Leader",
        "short_nom": "Entreprenant & Leader",
        "description": "Vous êtes dynamique, proactif et naturellement tourné vers l'action concrète. Vous aimez prendre des initiatives, rassembler les autres autour d'un but commun, organiser et trouver des solutions pratiques.",
        "qualites": "Esprit d'initiative, Capacité à fédérer, Sens de l'organisation, Pragmatisme et réactivité",
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 4,
        "pts_lit_min": 4
      },
      {
        "id": 4,
        "code": "sante_social",
        "nom": "Caractère Bienveillant, Altruiste & Protecteur",
        "short_nom": "Bienveillant & Altruiste",
        "description": "Votre plus belle qualité réside dans votre grand cœur, votre empathie naturelle et votre dévouement pour autrui. Vous êtes toujours à l'écoute, attentif au bien-être de votre entourage et prêt à soutenir ceux qui en ont besoin.",
        "qualites": "Profonde empathie, Dévouement sincère, Douceur et patience, Générosité d'esprit",
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 4,
        "pts_lit_min": 4
      },
      {
        "id": 5,
        "code": "arts_creation",
        "nom": "Caractère Créatif, Imaginatif & Expressif",
        "short_nom": "Créatif & Imaginatif",
        "description": "Vous avez une imagination féconde, un regard personnel sur le monde et une véritable sensibilité esthétique. Vous aimez inventer, concevoir des choses originales et exprimer vos émotions par la créativité et les formes.",
        "qualites": "Imagination fertile, Sensibilité artistique, Originalité d'esprit, Intuition et spontanéité",
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 0,
        "pts_lit_min": 4
      },
      {
        "id": 6,
        "code": "nature_agri",
        "nom": "Caractère Observateur, Proche de la Nature & Authentique",
        "short_nom": "Observateur & Naturel",
        "description": "Vous êtes quelqu'un de posé, franc et attentif à ce qui vous entoure. Vous avez un lien fort avec la nature et le vivant, une grande patience et un bon sens naturel qui vous permet de garder les pieds sur terre.",
        "qualites": "Sens de l'observation, Calme et patience, Respect du vivant, Bon sens et authenticité",
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 4,
        "pts_lit_min": 0
      }
    ]
  },
  "eleve_2": {
    "role": "eleve",
    "testNum": 2,
    "questions": [
      {
        "id": 1,
        "ordre": 1,
        "texte": "Sélectionnez les matières scolaires dans lesquelles vous vous sentez le plus à l'aise et motivé(e) :",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 1,
            "code": "maths",
            "titre": "Mathématiques",
            "description": "Calcul différentiel, probabilités, algèbre et géométrie dans l'espace.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "sciences_exactes",
            "pole": "sciences_exactes"
          },
          {
            "id": 2,
            "code": "physique",
            "titre": "Physique - Chimie",
            "description": "Mécanique, électricité, réactions chimiques et optique.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "sciences_exactes",
            "pole": "sciences_exactes"
          },
          {
            "id": 3,
            "code": "svt",
            "titre": "Sciences de la Vie et de la Terre (SVT)",
            "description": "Génétique, biologie humaine, géologie et écosystèmes.",
            "pts_sci": 2,
            "pts_lit": 0,
            "categorie": "sciences_vie_sante",
            "pole": "sciences_vie_sante"
          },
          {
            "id": 4,
            "code": "francais",
            "titre": "Français & Littérature",
            "description": "Analyse littéraire, dissertation, expression écrite et synthèse.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "lettres_langues",
            "pole": "lettres_langues"
          },
          {
            "id": 5,
            "code": "malagasy",
            "titre": "Malagasy (Teny sy Fomba)",
            "description": "Grammaire malgache, contes traditionnels, kabary et poésie.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "lettres_langues",
            "pole": "lettres_langues"
          },
          {
            "id": 6,
            "code": "anglais",
            "titre": "Anglais (English)",
            "description": "Compréhension orale, expression internationale et vocabulaire.",
            "pts_sci": 0,
            "pts_lit": 2,
            "categorie": "lettres_langues",
            "pole": "lettres_langues"
          },
          {
            "id": 7,
            "code": "histoire_geo",
            "titre": "Histoire - Géographie",
            "description": "Histoire de Madagascar et du monde, cartes et géopolitique.",
            "pts_sci": 0,
            "pts_lit": 2,
            "categorie": "eco_societe",
            "pole": "eco_societe"
          },
          {
            "id": 8,
            "code": "ses",
            "titre": "Sciences Économiques & Sociales (SES)",
            "description": "Mécanismes de marché, budget, monnaie et faits de société.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "eco_societe",
            "pole": "eco_societe"
          },
          {
            "id": 9,
            "code": "informatique",
            "titre": "Informatique & Technologie",
            "description": "Algorithmique, logique de programmation et outils numériques.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "technique_appliquee",
            "pole": "technique_appliquee"
          },
          {
            "id": 10,
            "code": "philo",
            "titre": "Philosophie & Pensée Critique",
            "description": "Réflexion morale, éthique, logique conceptuelle et dissertations.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "lettres_langues",
            "pole": "lettres_langues"
          }
        ]
      },
      {
        "id": 2,
        "ordre": 2,
        "texte": "Sélectionnez vos aptitudes dominantes et styles d'apprentissage :",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 11,
            "code": "apt_calcul",
            "titre": "Calcul mental, algèbre et rigueur chiffrée",
            "description": "Facilité à résoudre des équations, mémoriser des formules et raisonner abstraitement.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "sciences_exactes",
            "pole": "sciences_exactes"
          },
          {
            "id": 12,
            "code": "apt_redaction",
            "titre": "Rédaction écrite, orthographe et clarté d'idées",
            "description": "Aisance pour rédiger des dissertations, exprimer vos pensées avec précision et vocabulaire riche.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "lettres_langues",
            "pole": "lettres_langues"
          },
          {
            "id": 13,
            "code": "apt_oral",
            "titre": "Prise de parole en public et argumentation",
            "description": "Facilité à débattre, défendre un point de vue et captiver un auditoire à l'oral.",
            "pts_sci": 0,
            "pts_lit": 2,
            "categorie": "lettres_langues",
            "pole": "lettres_langues"
          },
          {
            "id": 14,
            "code": "apt_observation",
            "titre": "Démarche expérimentale et observation du vivant",
            "description": "Curiosité pour les mécanismes biologiques, la nature vivante et l'expérimentation scientifique.",
            "pts_sci": 2,
            "pts_lit": 0,
            "categorie": "sciences_vie_sante",
            "pole": "sciences_vie_sante"
          },
          {
            "id": 15,
            "code": "apt_analyse_societe",
            "titre": "Compréhension du monde, de l'histoire et de la société",
            "description": "Intérêt pour l'actualité, l'évolution historique, la géopolitique et l'économie.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "eco_societe",
            "pole": "eco_societe"
          },
          {
            "id": 16,
            "code": "apt_technique",
            "titre": "Pratique manuelle, sens technique et logique informatique",
            "description": "Sens pratique pour le montage, le bricolage, la conception technique et le code informatique.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "technique_appliquee",
            "pole": "technique_appliquee"
          }
        ]
      }
    ],
    "caracteristiques": [
      {
        "id": 1,
        "code": "sciences_exactes",
        "nom": "Sciences Exactes, Mathématiques & Ingénierie",
        "short_nom": "Série Scientifique S (C)",
        "description": "Vos facilités en Mathématiques et Physique-Chimie, alliées à votre rigueur de raisonnement, vous orientent naturellement vers les études scientifiques approfondies et les métiers d'ingénieur.",
        "qualites": null,
        "recommandations": "Série Scientifique S (spécialité C ou dominante Mathématiques / Physique)",
        "debouches": "Génie civil, Informatique & Algorithmique, Télécoms, Aéronautique, Statistiques, Énergies",
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 6,
        "pts_lit_min": 0
      },
      {
        "id": 2,
        "code": "sciences_vie_sante",
        "nom": "Sciences Biologiques, Santé & Médecine",
        "short_nom": "Série Scientifique S (D)",
        "description": "Vos atouts en SVT et Sciences Physiques, enrichis par votre goût pour l'observation expérimentale et le vivant, constituent d'excellents repères pour les carrières médicales, biologiques ou vétérinaires.",
        "qualites": null,
        "recommandations": "Série Scientifique S (spécialité D - dominante SVT & Chimie)",
        "debouches": "Médecine générale & spécialisée, Pharmacie, Dentaire, Agronomie & Foresterie, Biologie",
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 4,
        "pts_lit_min": 2
      },
      {
        "id": 3,
        "code": "lettres_langues",
        "nom": "Lettres, Langues & Sciences Humaines",
        "short_nom": "Série Littéraire L (A1/A2)",
        "description": "Votre aisance dans les matières d'expression (Français, Malagasy, Anglais, Philosophie) et vos qualités de réflexion constituent un tremplin privilégié pour briller dans le droit, la communication et les sciences humaines.",
        "qualites": null,
        "recommandations": "Série Littéraire L (spécialité A1, A2 ou Langues Vivantes)",
        "debouches": "Droit, Magistrature, Diplomatie, Traduction, Enseignement, Journalisme",
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 0,
        "pts_lit_min": 6
      },
      {
        "id": 4,
        "code": "eco_societe",
        "nom": "Sciences Économiques, Sociales & Gestion",
        "short_nom": "Série Économique (OSE / B)",
        "description": "Votre compréhension de l'Histoire-Géo, des sciences économiques et des grands enjeux de société vous positionne idéalement pour les métiers de l'économie, du management et de l'administration.",
        "qualites": null,
        "recommandations": "Série Économique et Sociale (OSE / B)",
        "debouches": "Économie, Comptabilité & Finance, Gestion d'entreprises, Marketing, Ressources Humaines",
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 2,
        "pts_lit_min": 4
      },
      {
        "id": 5,
        "code": "technique_appliquee",
        "nom": "Sciences Appliquées, Informatique & Technologies",
        "short_nom": "Série Technique & Technologique",
        "description": "Votre esprit pratique et vos aptitudes techniques et informatiques sont des forces précieuses pour réussir dans les formations technologiques concrètes et innovantes.",
        "qualites": null,
        "recommandations": "Série Technique (Génie Civil, Électronique, Maintenance Informatique ou Filières Tertiaires)",
        "debouches": "Développement de logiciels, Maintenance systèmes & réseaux, Électromécanique, Travaux publics",
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 4,
        "pts_lit_min": 1
      }
    ]
  },
  "etudiant_1": {
    "role": "etudiant",
    "testNum": 1,
    "questions": [
      {
        "id": 8,
        "ordre": 1,
        "texte": "Dans le cadre d'un projet universitaire majeur ou d'un mémoire de fin d'études, quel rôle prenez-vous spontanément ?",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 43,
            "code": "1a",
            "titre": "Le référent technique ou concepteur",
            "description": "Développer le prototype, programmer les modules, concevoir l'architecture ou valider la faisabilité technique.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "tech_ingenierie",
            "pole": "tech_ingenierie"
          },
          {
            "id": 44,
            "code": "1b",
            "titre": "L'analyste financier et modélisateur",
            "description": "Établir le budget prévisionnel, analyser les données statistiques et chiffrer précisément la viabilité du projet.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "analytique_finance",
            "pole": "analytique_finance"
          },
          {
            "id": 45,
            "code": "1c",
            "titre": "Le communicant et présentateur",
            "description": "Préparer la soutenance, concevoir le support visuel percutant et pitcher le projet pour convaincre le jury.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "comm_marketing",
            "pole": "comm_marketing"
          },
          {
            "id": 46,
            "code": "1d",
            "titre": "Le coordinateur d'équipe et facilitateur",
            "description": "Répartir équitablement les tâches, planifier le calendrier, motiver les collègues et veiller à la cohésion.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "management_rh",
            "pole": "management_rh"
          },
          {
            "id": 47,
            "code": "1e",
            "titre": "Le chercheur de fond et documentaliste",
            "description": "Explorer la littérature scientifique internationale, vérifier les sources et poser des hypothèses solides.",
            "pts_sci": 3,
            "pts_lit": 1,
            "categorie": "recherche_sciences",
            "pole": "recherche_sciences"
          },
          {
            "id": 48,
            "code": "1f",
            "titre": "Le garant de la conformité et de l'éthique",
            "description": "Vérifier la légalité, sécuriser les aspects réglementaires et mesurer l'impact sociétal ou environnemental.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "impact_juridique",
            "pole": "impact_juridique"
          }
        ]
      },
      {
        "id": 9,
        "ordre": 2,
        "texte": "Parmi ces types d'entreprises ou structures professionnelles, laquelle vous attire le plus pour votre stage ou premier emploi ?",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 49,
            "code": "2a",
            "titre": "Une entreprise technologique ou un bureau d'ingénierie",
            "description": "Un environnement d'innovation où l'on code, construit et conçoit des infrastructures de pointe.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "tech_ingenierie",
            "pole": "tech_ingenierie"
          },
          {
            "id": 50,
            "code": "2b",
            "titre": "Une institution financière, cabinet d'audit ou banque d'affaires",
            "description": "Un cadre d'analyse rigoureux orienté vers l'investissement, le contrôle des risques et la performance chiffrée.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "analytique_finance",
            "pole": "analytique_finance"
          },
          {
            "id": 51,
            "code": "2c",
            "titre": "Une agence digitale, un grand groupe commercial ou une start-up",
            "description": "Un univers dynamique tourné vers l'acquisition clients, le branding et la conquête de marchés.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "comm_marketing",
            "pole": "comm_marketing"
          },
          {
            "id": 52,
            "code": "2d",
            "titre": "La direction des opérations d'un groupe ou un cabinet RH",
            "description": "Une organisation axée sur la gestion humaine, le recrutement des talents et l'amélioration du travail.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "management_rh",
            "pole": "management_rh"
          },
          {
            "id": 53,
            "code": "2e",
            "titre": "Un institut de recherche, laboratoire ou département R&D",
            "description": "Un lieu dédié à la découverte scientifique, aux brevets et à l'expérimentation méthodologique.",
            "pts_sci": 3,
            "pts_lit": 1,
            "categorie": "recherche_sciences",
            "pole": "recherche_sciences"
          },
          {
            "id": 54,
            "code": "2f",
            "titre": "Un cabinet juridique, une grande ONG ou une institution publique",
            "description": "Une structure d'envergure engagée dans la défense du droit, la transparence et le développement durable.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "impact_juridique",
            "pole": "impact_juridique"
          }
        ]
      },
      {
        "id": 10,
        "ordre": 3,
        "texte": "Quelle compétence transversale (Soft Skill) considérez-vous comme votre plus grand atout ?",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 55,
            "code": "3a",
            "titre": "L'esprit d'ingénierie et la résolution de bugs",
            "description": "Votre capacité à comprendre les rouages complexes et à démonter un problème jusqu'à trouver la solution.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "tech_ingenierie",
            "pole": "tech_ingenierie"
          },
          {
            "id": 56,
            "code": "3b",
            "titre": "L'esprit critique et la maîtrise de la donnée",
            "description": "Votre habileté à détecter les anomalies dans les tableaux de bord et à tirer des conclusions objectives.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "analytique_finance",
            "pole": "analytique_finance"
          },
          {
            "id": 57,
            "code": "3c",
            "titre": "L'art de la persuasion et la négociation",
            "description": "Votre facilité à capter l'attention, valoriser une idée et créer une relation de confiance immédiate.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "comm_marketing",
            "pole": "comm_marketing"
          },
          {
            "id": 58,
            "code": "3d",
            "titre": "L'empathie managériale et l'écoute active",
            "description": "Votre aptitude à comprendre les besoins d'autrui, apaiser les tensions et fédérer un groupe vers un objectif.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "management_rh",
            "pole": "management_rh"
          },
          {
            "id": 59,
            "code": "3e",
            "titre": "La rigueur d'investigation et la persévérance",
            "description": "Votre capacité à approfondir sans relâche un sujet complexe jusqu'à en maîtriser chaque facette.",
            "pts_sci": 3,
            "pts_lit": 1,
            "categorie": "recherche_sciences",
            "pole": "recherche_sciences"
          },
          {
            "id": 60,
            "code": "3f",
            "titre": "Le sens de la justice et la clarté argumentative",
            "description": "Votre rigueur pour structurer une démonstration irréfutable et faire respecter des principes éthiques.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "impact_juridique",
            "pole": "impact_juridique"
          }
        ]
      },
      {
        "id": 11,
        "ordre": 4,
        "texte": "Face à une urgence professionnelle imprévue (défaillance système, crise client ou blocage d'équipe), quelle est votre attitude réflexe ?",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 61,
            "code": "4a",
            "titre": "Analyser les logs et réparer le mécanisme",
            "description": "Identifier immédiatement la panne technique, isoler la défaillance et déployer un correctif stable.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "tech_ingenierie",
            "pole": "tech_ingenierie"
          },
          {
            "id": 62,
            "code": "4b",
            "titre": "Mesurer l'impact financier et les risques",
            "description": "Calculer le coût direct et indirect de l'incident et recommander la décision financière la plus rationnelle.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "analytique_finance",
            "pole": "analytique_finance"
          },
          {
            "id": 63,
            "code": "4c",
            "titre": "Gérer la communication de crise",
            "description": "Rassurer les partenaires, formuler les bons messages et préserver la réputation de l'organisation.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "comm_marketing",
            "pole": "comm_marketing"
          },
          {
            "id": 64,
            "code": "4d",
            "titre": "Rassembler l'équipe et soutenir le moral",
            "description": "Éviter la panique, réassigner clairement les rôles dans le calme et s'assurer que chacun sait quoi faire.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "management_rh",
            "pole": "management_rh"
          },
          {
            "id": 65,
            "code": "4e",
            "titre": "Documenter le cas pour éviter toute récidive",
            "description": "Analyser les causes profondes avec recul scientifique et rédiger un protocole préventif rigoureux.",
            "pts_sci": 3,
            "pts_lit": 1,
            "categorie": "recherche_sciences",
            "pole": "recherche_sciences"
          },
          {
            "id": 66,
            "code": "4f",
            "titre": "Vérifier les engagements contractuels et légaux",
            "description": "Examiner les clauses juridiques, protéger la structure et négocier une issue conforme aux règlements.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "impact_juridique",
            "pole": "impact_juridique"
          }
        ]
      },
      {
        "id": 12,
        "ordre": 5,
        "texte": "Quelle mission valorisante vous procurerait le plus grand sentiment d'accomplissement personnel ?",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 67,
            "code": "5a",
            "titre": "Créer une application, une infrastructure ou un outil adopté par des milliers d'utilisateurs",
            "description": "Bâtir un système numérique performant et durable au service de la société.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "tech_ingenierie",
            "pole": "tech_ingenierie"
          },
          {
            "id": 68,
            "code": "5b",
            "titre": "Optimiser la santé financière d'une organisation et lui faire réussir un investissement stratégique",
            "description": "Guider une structure vers l'équilibre et la croissance par des choix chiffrés avisés.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "analytique_finance",
            "pole": "analytique_finance"
          },
          {
            "id": 69,
            "code": "5c",
            "titre": "Lancer une campagne à succès qui transforme une marque et développe ses parts de marché",
            "description": "Développer la notoriété et la valeur économique par une stratégie de communication exemplaire.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "comm_marketing",
            "pole": "comm_marketing"
          },
          {
            "id": 70,
            "code": "5d",
            "titre": "Faire progresser des collaborateurs, recruter des talents et bâtir une équipe soudée",
            "description": "Cultiver le potentiel humain et l'engagement collectif dans l'entreprise.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "management_rh",
            "pole": "management_rh"
          },
          {
            "id": 71,
            "code": "5e",
            "titre": "Découvrir un nouveau modèle théorique, publier dans une revue internationale ou breveter une innovation",
            "description": "Participer aux avancées scientifiques et techniques mondiales.",
            "pts_sci": 3,
            "pts_lit": 1,
            "categorie": "recherche_sciences",
            "pole": "recherche_sciences"
          },
          {
            "id": 72,
            "code": "5f",
            "titre": "Contribuer au développement équitable de Madagascar en défendant le droit et la bonne gouvernance",
            "description": "Faire triompher l'intégrité, la justice institutionnelle et le développement équitable.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "impact_juridique",
            "pole": "impact_juridique"
          }
        ]
      },
      {
        "id": 13,
        "ordre": 6,
        "texte": "Quel type de veille professionnelle ou de lecture aimez-vous consulter sur votre temps libre ?",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 73,
            "code": "6a",
            "titre": "Nouveaux frameworks, IA, innovations matérielles, GitHub, tech blogs",
            "description": "Suivi continu des évolutions logicielles et matérielles.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "tech_ingenierie",
            "pole": "tech_ingenierie"
          },
          {
            "id": 74,
            "code": "6b",
            "titre": "Actualités économiques, analyses de marchés, tendances cryptos/devises",
            "description": "Veille macroéconomique, marchés financiers et indicateurs d'entreprises.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "analytique_finance",
            "pole": "analytique_finance"
          },
          {
            "id": 75,
            "code": "6c",
            "titre": "Tendances marketing, storytelling de marques mondiales, stratégies publicitaires, réseaux sociaux",
            "description": "Analyse des campagnes marketing virales et des comportements consommateurs.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "comm_marketing",
            "pole": "comm_marketing"
          },
          {
            "id": 76,
            "code": "6d",
            "titre": "Articles de leadership, psychologie du travail, gestion des talents",
            "description": "Innovations managériales et bien-être des équipes au travail.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "management_rh",
            "pole": "management_rh"
          },
          {
            "id": 77,
            "code": "6e",
            "titre": "Revues scientifiques, vulgarisation de haut niveau, rapports universitaires",
            "description": "Publications académiques, découvertes de pointe et recherche fondamentale.",
            "pts_sci": 3,
            "pts_lit": 1,
            "categorie": "recherche_sciences",
            "pole": "recherche_sciences"
          },
          {
            "id": 78,
            "code": "6f",
            "titre": "Analyses géopolitiques, réformes du droit, rapports d'ONG, politiques publiques de développement",
            "description": "Évolutions des traités internationaux, jurisprudences et impact sociétal.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "impact_juridique",
            "pole": "impact_juridique"
          }
        ]
      },
      {
        "id": 14,
        "ordre": 7,
        "texte": "Si vous deviez définir votre ambition professionnelle d'ici 5 ans, elle ressemblerait à :",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 79,
            "code": "7a",
            "titre": "Architecte technique / Lead Developer reconnu pour son savoir-faire d'exception",
            "description": "Piloter la conception technique de grands projets technologiques.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "tech_ingenierie",
            "pole": "tech_ingenierie"
          },
          {
            "id": 80,
            "code": "7b",
            "titre": "Directeur financier, auditeur senior ou gestionnaire de fonds influent",
            "description": "Prendre en main la gestion financière et la stratégie d'investissements.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "analytique_finance",
            "pole": "analytique_finance"
          },
          {
            "id": 81,
            "code": "7c",
            "titre": "Directeur marketing ou entrepreneur ayant fondé son agence ou sa marque",
            "description": "Conduire la croissance commerciale d'une marque forte.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "comm_marketing",
            "pole": "comm_marketing"
          },
          {
            "id": 82,
            "code": "7d",
            "titre": "Directeur des ressources humaines ou directeur général pilotant de grandes équipes",
            "description": "Assurer la gouvernance humaine et l'excellence opérationnelle collective.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "management_rh",
            "pole": "management_rh"
          },
          {
            "id": 83,
            "code": "7e",
            "titre": "Docteur ou expert scientifique de référence dans son domaine de spécialisation",
            "description": "Diriger des travaux de recherche novateurs et enseigner au plus haut niveau.",
            "pts_sci": 3,
            "pts_lit": 1,
            "categorie": "recherche_sciences",
            "pole": "recherche_sciences"
          },
          {
            "id": 84,
            "code": "7f",
            "titre": "Avocat d'affaires, haut magistrat ou cadre dirigeant au sein d'une institution multilatérale",
            "description": "Défendre l'état de droit et réguler les relations économiques d'envergure.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "impact_juridique",
            "pole": "impact_juridique"
          }
        ]
      }
    ],
    "caracteristiques": [
      {
        "id": 1,
        "code": "tech_digital",
        "nom": "Profil Technologique & Digital",
        "short_nom": "Tech & Digital",
        "description": "Esprit orienté ingénierie, programmation logicielle et logique informatique.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 6,
        "pts_lit_min": 1
      },
      {
        "id": 2,
        "code": "finance_gestion",
        "nom": "Profil Analyse Financière, Audit & Stratégie",
        "short_nom": "Finance & Stratégie",
        "description": "Aptitudes mathématiques, comptables, organisationnelles et rigueur d'analyse.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 4,
        "pts_lit_min": 3
      },
      {
        "id": 3,
        "code": "communication_marketing",
        "nom": "Profil Communication, Médias & Marketing Digital",
        "short_nom": "Com & Marketing",
        "description": "Sens de la persuasion, créativité narrative, relationnel et langues.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 1,
        "pts_lit_min": 6
      },
      {
        "id": 4,
        "code": "social_sante",
        "nom": "Profil Sciences Humaines, Santé & Développement Social",
        "short_nom": "Social & Santé",
        "description": "Dévouement au service des populations, écoute active et accompagnement.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 3,
        "pts_lit_min": 4
      },
      {
        "id": 5,
        "code": "ingenierie_projets",
        "nom": "Profil Ingénierie, Systèmes & Projets Techniques",
        "short_nom": "Ingénierie & Projets",
        "description": "Conception de solutions matérielles, supervision d'infrastructures et gestion technique.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 5,
        "pts_lit_min": 2
      },
      {
        "id": 6,
        "code": "agri_environnement",
        "nom": "Profil Sciences Agronomiques, Environnement & Développement Durable",
        "short_nom": "Agri & Environnement",
        "description": "Valorisation des ressources naturelles et pratiques écologiques durables.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 4,
        "pts_lit_min": 2
      },
      {
        "id": 7,
        "code": "tech_ingenierie",
        "nom": "Profil Bâtisseur, Concepteur & Ingénieur",
        "short_nom": "Ingénierie & Systèmes",
        "description": "Vous êtes doté d'un esprit logique, structuré et passionné par la résolution de problèmes concrets. Vous aimez concevoir, programmer, bâtir des architectures robustes et transformer des idées en solutions fonctionnelles.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 8,
        "pts_lit_min": 0
      },
      {
        "id": 8,
        "code": "analytique_finance",
        "nom": "Profil Stratège, Analyste & Décideur",
        "short_nom": "Finance & Stratégie",
        "description": "Vous possédez un sens aigu des chiffres, de la rentabilité et de la prospective. Vous savez décrypter les indicateurs financiers, anticiper les risques de marché et éclairer les décisions stratégiques par la donnée.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 6,
        "pts_lit_min": 3
      },
      {
        "id": 9,
        "code": "comm_marketing",
        "nom": "Profil Communicant, Développeur & Négociateur",
        "short_nom": "Marketing & Business",
        "description": "Dynamique, persuasif et créatif, vous comprenez instinctivement les attentes du marché et de vos interlocuteurs. Vous excellez dans l'art de convaincre, de créer du lien et de promouvoir des projets innovants.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 0,
        "pts_lit_min": 8
      },
      {
        "id": 10,
        "code": "management_rh",
        "nom": "Profil Leader, Fédérateur & Gestionnaire de Talents",
        "short_nom": "Leadership & RH",
        "description": "Vous êtes guidé par l'intelligence émotionnelle, le sens des responsabilités et la coordination d'équipe. Vous savez motiver les collaborateurs, organiser le travail collectif et maintenir un climat de confiance.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 3,
        "pts_lit_min": 6
      },
      {
        "id": 11,
        "code": "recherche_sciences",
        "nom": "Profil Chercheur, Scientifique & Expert Méthodique",
        "short_nom": "Sciences & R&D",
        "description": "Rigoureux, observateur et passionné par l'investigation méthodique. Vous aimez explorer les concepts profonds, expérimenter en laboratoire ou sur le terrain et faire avancer les connaissances.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 8,
        "pts_lit_min": 3
      },
      {
        "id": 12,
        "code": "impact_juridique",
        "nom": "Profil Juriste, Auditeur & Acteur du Bien Commun",
        "short_nom": "Droit & Impact",
        "description": "Attentif aux règles éthiques, aux textes juridiques et à l'équité sociale. Vous aimez sécuriser les contrats, analyser les politiques publiques et veiller à la responsabilité sociétale.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 1,
        "pts_lit_min": 8
      }
    ]
  },
  "etudiant_2": {
    "role": "etudiant",
    "testNum": 2,
    "questions": [
      {
        "id": 3,
        "ordre": 1,
        "texte": "Sélectionnez vos domaines d'études ou spécialisations d'excellence universitaire",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 17,
            "code": "dom_informatique",
            "titre": "Informatique, IA & Systèmes d'Information",
            "description": "Développement web, architecture de données, intelligence artificielle et cybersécurité.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "pole_tech",
            "pole": "pole_tech"
          },
          {
            "id": 18,
            "code": "dom_finance_audit",
            "titre": "Finance d'Entreprise, Audit & Comptabilité",
            "description": "Contrôle de gestion, normes IFRS, analyse des états financiers et audit légal.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "pole_finance",
            "pole": "pole_finance"
          },
          {
            "id": 19,
            "code": "dom_ingenierie_btp",
            "titre": "Sciences de l'Ingénieur, Industrie & BTP",
            "description": "Calcul de structures, génie mécanique, électrotechnique et chantiers de construction.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "pole_tech",
            "pole": "pole_tech"
          },
          {
            "id": 20,
            "code": "dom_mkt_comm",
            "titre": "Marketing Digital, Communication & E-Commerce",
            "description": "Acquisition de trafic, gestion de communauté, relations publiques et publicité en ligne.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "pole_business",
            "pole": "pole_business"
          },
          {
            "id": 21,
            "code": "dom_rh_management",
            "titre": "Management, Organisation & Ressources Humaines",
            "description": "Recrutement, gestion des compétences, dialogue social et pilotage de projets.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "pole_management",
            "pole": "pole_management"
          },
          {
            "id": 22,
            "code": "dom_droit_fiscalite",
            "titre": "Droit des Affaires, Fiscalité & Conformité",
            "description": "Sécurité juridique des contrats, contentieux, fiscalité des sociétés et conformité.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "pole_droit",
            "pole": "pole_droit"
          },
          {
            "id": 23,
            "code": "dom_sciences_sante",
            "titre": "Sciences Médicales, Santé & Biotechnologies",
            "description": "Biologie, médecine, pharmacie, santé publique et recherche biomédicale.",
            "pts_sci": 3,
            "pts_lit": 1,
            "categorie": "pole_sciences",
            "pole": "pole_sciences"
          },
          {
            "id": 24,
            "code": "dom_agro_env",
            "titre": "Agronomie, Foresterie & Développement Durable",
            "description": "Filières agricoles, valorisation des ressources naturelles et conservation des forêts.",
            "pts_sci": 3,
            "pts_lit": 1,
            "categorie": "pole_sciences",
            "pole": "pole_sciences"
          },
          {
            "id": 25,
            "code": "dom_logistique_inter",
            "titre": "Logistique, Supply Chain & Commerce International",
            "description": "Gestion des expéditions, dédouanement maritime/aérien et chaîne d'approvisionnement.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "pole_business",
            "pole": "pole_business"
          },
          {
            "id": 26,
            "code": "dom_economie_data",
            "titre": "Économie, Statistiques & Politiques Publiques",
            "description": "Modélisation économétrique, analyse d'impact macroéconomique et politiques de développement.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "pole_finance",
            "pole": "pole_finance"
          }
        ]
      },
      {
        "id": 4,
        "ordre": 2,
        "texte": "Auto-évaluation de vos aptitudes opérationnelles clés pour votre insertion",
        "pts_sci": 2,
        "pts_lit": 2,
        "reponses": [
          {
            "id": 27,
            "code": "apt_analytique_data",
            "titre": "Analyse quantitative, rigueur chiffrée & modélisation",
            "description": "Facilité à traiter des volumes de données, interpréter des bilans ou extraire des tendances statistiques.",
            "pts_sci": 2,
            "pts_lit": 0,
            "categorie": "pole_finance",
            "pole": "pole_finance"
          },
          {
            "id": 28,
            "code": "apt_gestion_projet",
            "titre": "Gestion de projet, planification & tenue des délais",
            "description": "Aisance pour définir un rétroplanning, structurer des jalons et coordonner la réalisation d'objectifs.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "pole_management",
            "pole": "pole_management"
          },
          {
            "id": 29,
            "code": "apt_communication_pitch",
            "titre": "Aisance oratoire, négociation & pitch de soutenance",
            "description": "Facilité à captiver un auditoire, présenter des idées avec clarté et défendre une proposition à l'oral.",
            "pts_sci": 0,
            "pts_lit": 2,
            "categorie": "pole_business",
            "pole": "pole_business"
          },
          {
            "id": 30,
            "code": "apt_redaction_synthese",
            "titre": "Rédaction professionnelle, esprit de synthèse & rapports",
            "description": "Capacité à formuler des documents clairs, précis, sans fautes, et à vulgariser des sujets denses.",
            "pts_sci": 0,
            "pts_lit": 2,
            "categorie": "pole_droit",
            "pole": "pole_droit"
          },
          {
            "id": 31,
            "code": "apt_outils_numeriques",
            "titre": "Maîtrise des technologies, IA & logiciels spécialisés",
            "description": "Rapidité d'adoption des nouveaux outils digitaux, programmation ou logiciels avancés de votre discipline.",
            "pts_sci": 2,
            "pts_lit": 0,
            "categorie": "pole_tech",
            "pole": "pole_tech"
          },
          {
            "id": 32,
            "code": "apt_leadership_collectif",
            "titre": "Intelligence émotionnelle, travail d'équipe & leadership",
            "description": "Aptitude naturelle à écouter, encourager la coopération et surmonter les blocages collectifs.",
            "pts_sci": 0,
            "pts_lit": 2,
            "categorie": "pole_management",
            "pole": "pole_management"
          }
        ]
      }
    ],
    "caracteristiques": [
      {
        "id": 1,
        "code": "pole_tech_numerique",
        "nom": "Pôle Technologies Numériques, Web & Data",
        "short_nom": "Numérique & Data",
        "description": "Débouchés à fort recrutement dans le secteur technologique à Madagascar.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": "ESN, Start-ups, E-commerce, Télécoms",
        "metiers": "Développeur Web, Data Analyst, Administrateur Systèmes",
        "pts_sci_min": 5,
        "pts_lit_min": 1
      },
      {
        "id": 2,
        "code": "pole_finance_banque",
        "nom": "Pôle Banque, Finance, Audit & Assurance",
        "short_nom": "Banque & Finance",
        "description": "Gestion financière, conformité bancaire et investissement stratégique.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": "Institutions financières, Banques, Cabinets d'audit",
        "metiers": "Analyste financier, Auditeur junior, Gestionnaire de portefeuille",
        "pts_sci_min": 4,
        "pts_lit_min": 3
      },
      {
        "id": 3,
        "code": "pole_commerce_marketing",
        "nom": "Pôle Marketing, Vente & Relations Entreprises",
        "short_nom": "Commerce & Vente",
        "description": "Développement commercial, négociation et fidélisation de clientèle.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": "Grande distribution, B2B, Import-Export",
        "metiers": "Chef de produit, Responsable commercial, Chargé de partenariats",
        "pts_sci_min": 2,
        "pts_lit_min": 4
      },
      {
        "id": 4,
        "code": "pole_agronomie_agroalimentaire",
        "nom": "Pôle Agronomie, Élevage & Filières Vertes",
        "short_nom": "Agronomie & Vert",
        "description": "Valorisation du potentiel agricole et transformation locale.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": "Industrie agroalimentaire, Exploitations, ONG",
        "metiers": "Ingénieur agronome, Responsable filière, Consultant environnement",
        "pts_sci_min": 4,
        "pts_lit_min": 2
      },
      {
        "id": 5,
        "code": "pole_tech",
        "nom": "Filière Ingénierie, Technologies & Systèmes Numériques",
        "short_nom": "Tech & Systèmes",
        "description": "Compétences techniques et aisance avec les outils numériques avancés pour les secteurs de la tech, du génie et de l'innovation industrielle.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": "Informatique, Télécoms, BTP, Électromécanique, Data",
        "metiers": "Développeur Full-Stack, Ingénieur DevOps, Chef de Projet SI, Ingénieur BTP",
        "pts_sci_min": 8,
        "pts_lit_min": 0
      },
      {
        "id": 6,
        "code": "pole_finance",
        "nom": "Filière Banque, Finance, Audit & Gestion d'Entreprise",
        "short_nom": "Banque & Finance",
        "description": "Aptitudes analytiques, rigueur chiffrée et vision stratégique des flux financiers et des équilibres économiques.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": "Banque d'affaires, Cabinets d'audit, Microfinance, Contrôle de gestion",
        "metiers": "Auditeur financier, Contrôleur de gestion, Analyste crédit, Data Analyst BI",
        "pts_sci_min": 6,
        "pts_lit_min": 3
      },
      {
        "id": 7,
        "code": "pole_business",
        "nom": "Filière Marketing, Commerce International & Digital Business",
        "short_nom": "Commerce & Digital",
        "description": "Orientation client, force de conviction commerciale et stratégie marketing omnicanale.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": "Agences digitales, E-commerce, Import-Export, Grande distribution",
        "metiers": "Growth Manager, Responsable E-commerce, Chargé d'affaires internationales",
        "pts_sci_min": 2,
        "pts_lit_min": 6
      },
      {
        "id": 8,
        "code": "pole_management",
        "nom": "Filière Management, Gouvernance & Ressources Humaines",
        "short_nom": "Management & RH",
        "description": "Intelligence relationnelle, gouvernance responsable et conduite du changement humain.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": "Directions d'entreprises, Cabinets de recrutement, Organisation",
        "metiers": "Responsable RH, Coordinateur des opérations, Consultant en organisation",
        "pts_sci_min": 2,
        "pts_lit_min": 6
      },
      {
        "id": 9,
        "code": "pole_droit",
        "nom": "Filière Droit, Sciences Politiques & Développement Durable",
        "short_nom": "Droit & RSE",
        "description": "Sécurisation juridique, analyse des traités et conformité aux standards internationaux.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": "Cabinets d'avocats, Institutions publiques, ONG internationales",
        "metiers": "Juriste d'entreprise, Chargé de conformité (Compliance), Consultant RSE",
        "pts_sci_min": 1,
        "pts_lit_min": 8
      },
      {
        "id": 10,
        "code": "pole_sciences",
        "nom": "Filière Santé, Biotechnologies, Agronomie & Environnement",
        "short_nom": "Santé & Environnement",
        "description": "Rigueur expérimentale, valorisation de la biodiversité malgache et innovation scientifique durable.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": "Santé publique, Laboratoires, Agro-industrie, Gestion environnementale",
        "metiers": "Ingénieur agronome, Biologiste, Responsable qualité QHSE, Cadre de santé",
        "pts_sci_min": 8,
        "pts_lit_min": 2
      }
    ]
  },
  "emploi_1": {
    "role": "emploi",
    "testNum": 1,
    "questions": [
      {
        "id": 8,
        "ordre": 1,
        "texte": "Quel est votre objectif principal pour trouver un travail qui vous correspond aujourd'hui ?",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 43,
            "code": "1a",
            "titre": "Apprendre et exercer un métier d'avenir, moderne et très demandé dans le numérique",
            "description": "Acquérir des compétences techniques valorisées sur le marché digital.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "tech_numerique",
            "pole": "tech_numerique"
          },
          {
            "id": 44,
            "code": "1b",
            "titre": "Créer ma propre activité, gagner mon indépendance et développer un projet rentable",
            "description": "Développer une source de revenus autonome et pérenne.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "entrepreneuriat_agri",
            "pole": "entrepreneuriat_agri"
          },
          {
            "id": 45,
            "code": "1c",
            "titre": "Coordonner des projets, organiser le travail d'équipe et prendre des responsabilités",
            "description": "Assurer la coordination opérationnelle et le suivi rigoureux.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "management_conseil",
            "pole": "management_conseil"
          },
          {
            "id": 46,
            "code": "1d",
            "titre": "Trouver un travail utile avec du sens, qui contribue concrètement à la société malgache",
            "description": "Participer à l'essor économique et écologique de la communauté.",
            "pts_sci": 2,
            "pts_lit": 2,
            "categorie": "impact_vert_rse",
            "pole": "impact_vert_rse"
          },
          {
            "id": 47,
            "code": "1e",
            "titre": "Mettre l'humain au cœur de mon activité : former, conseiller, recruter et accompagner",
            "description": "Accompagner les personnes dans leur développement et leur orientation.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "formation_rh_humain",
            "pole": "formation_rh_humain"
          },
          {
            "id": 48,
            "code": "1f",
            "titre": "Avoir un métier concret et pragmatique, avec des résultats visibles chaque jour sur le terrain",
            "description": "Mener des interventions tangibles avec efficacité et méthode.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "expertise_terrain_qualite",
            "pole": "expertise_terrain_qualite"
          }
        ]
      },
      {
        "id": 9,
        "ordre": 2,
        "texte": "Quelle est votre posture face aux nouveaux apprentissages et aux défis professionnels ?",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 49,
            "code": "2a",
            "titre": "Audacieux et débrouillard : je teste sur le terrain, apprends de mes erreurs et persévère",
            "description": "Apprendre par l'expérimentation directe et l'adaptabilité.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "entrepreneuriat_agri",
            "pole": "entrepreneuriat_agri"
          },
          {
            "id": 50,
            "code": "2b",
            "titre": "Curieux et méthodique : je me forme avec rigueur sur des compétences concrètes et recherchées",
            "description": "Structurer ses compétences pas à pas avec discipline.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "tech_numerique",
            "pole": "tech_numerique"
          },
          {
            "id": 51,
            "code": "2c",
            "titre": "Structuré et analytique : j'évalue les priorités et organise un plan par étapes claires",
            "description": "Définir une méthode et mesurer chaque avancée avec objectivité.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "management_conseil",
            "pole": "management_conseil"
          },
          {
            "id": 52,
            "code": "2d",
            "titre": "Passionné et engagé : je m'investis sans compter si la mission correspond à mes valeurs",
            "description": "Donner le meilleur de soi pour une vision collective vertueuse.",
            "pts_sci": 2,
            "pts_lit": 2,
            "categorie": "impact_vert_rse",
            "pole": "impact_vert_rse"
          },
          {
            "id": 53,
            "code": "2e",
            "titre": "Écoute et bienveillance : je progresse au contact des autres et par l'échange d'expériences",
            "description": "Grandir grâce au partage humain et aux retours constructifs.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "formation_rh_humain",
            "pole": "formation_rh_humain"
          },
          {
            "id": 54,
            "code": "2f",
            "titre": "Pragmatique et réaliste : je privilégie les activités solides et indispensables au quotidien",
            "description": "Privilégier la solidité opérationnelle et les besoins concrets immédiats.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "expertise_terrain_qualite",
            "pole": "expertise_terrain_qualite"
          }
        ]
      },
      {
        "id": 10,
        "ordre": 3,
        "texte": "Dans quel type d'environnement quotidien vous projetez-vous le plus ?",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 55,
            "code": "3a",
            "titre": "Environnement connecté, outils digitaux modernes, travail en équipe agile ou hybride",
            "description": "Bureaux connectés, télétravail ou espaces de coworking modernes.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "tech_numerique",
            "pole": "tech_numerique"
          },
          {
            "id": 56,
            "code": "3b",
            "titre": "Mon propre espace ou commerce, sur le terrain au contact direct de mes clients",
            "description": "Point de vente, atelier personnel ou exploitation de proximité.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "entrepreneuriat_agri",
            "pole": "entrepreneuriat_agri"
          },
          {
            "id": 57,
            "code": "3c",
            "titre": "Entreprises dynamiques, suivi de projets, réunions de coordination et planification",
            "description": "Services administratifs et opérationnels structurés.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "management_conseil",
            "pole": "management_conseil"
          },
          {
            "id": 58,
            "code": "3d",
            "titre": "Au sein d'une ONG, d'un projet écologique ou sur le terrain auprès des communautés",
            "description": "Actions communautaires de proximité et préservation de l'environnement.",
            "pts_sci": 2,
            "pts_lit": 2,
            "categorie": "impact_vert_rse",
            "pole": "impact_vert_rse"
          },
          {
            "id": 59,
            "code": "3e",
            "titre": "Espaces d'échange, entretiens individuels, centres de formation ou départements RH",
            "description": "Lieux d'apprentissage, d'accueil et d'orientation.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "formation_rh_humain",
            "pole": "formation_rh_humain"
          },
          {
            "id": 60,
            "code": "3f",
            "titre": "Plateforme logistique, entrepôt, atelier de production ou chantiers opérationnels",
            "description": "Sites de fabrication, dépôts logistiques et zones techniques.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "expertise_terrain_qualite",
            "pole": "expertise_terrain_qualite"
          }
        ]
      },
      {
        "id": 11,
        "ordre": 4,
        "texte": "Quelle est votre plus grande force personnelle à faire valoir auprès d'un recruteur ou de clients ?",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 61,
            "code": "4a",
            "titre": "Mon sens de l'organisation, de la rigueur et de la coordination de plusieurs tâches",
            "description": "Garantir un travail méthodique sans oubli ni retard.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "management_conseil",
            "pole": "management_conseil"
          },
          {
            "id": 62,
            "code": "4b",
            "titre": "Mon aisance avec le numérique, mon esprit logique et ma rapidité d'apprentissage",
            "description": "Assimiler rapidement de nouveaux logiciels et outils techniques.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "tech_numerique",
            "pole": "tech_numerique"
          },
          {
            "id": 63,
            "code": "4c",
            "titre": "Mon sens du contact, mon autonomie, mon énergie commerciale et mon sens de la négociation",
            "description": "Créer des opportunités de vente et fidéliser les clients.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "entrepreneuriat_agri",
            "pole": "entrepreneuriat_agri"
          },
          {
            "id": 64,
            "code": "4d",
            "titre": "Ma pédagogie, ma patience, mon sens de l'écoute et ma capacité à motiver autrui",
            "description": "Créer de la confiance et faire monter les équipes en compétences.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "formation_rh_humain",
            "pole": "formation_rh_humain"
          },
          {
            "id": 65,
            "code": "4e",
            "titre": "Mon intégrité, mon sérieux et mon engagement envers des causes utiles pour la société",
            "description": "Faire preuve d'un dévouement sans faille pour les valeurs d'équité.",
            "pts_sci": 2,
            "pts_lit": 2,
            "categorie": "impact_vert_rse",
            "pole": "impact_vert_rse"
          },
          {
            "id": 66,
            "code": "4f",
            "titre": "Mon sens pratique, mon souci du travail bien fait et mon efficacité sur le terrain",
            "description": "Résoudre les problèmes techniques avec robustesse et rapidité.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "expertise_terrain_qualite",
            "pole": "expertise_terrain_qualite"
          }
        ]
      },
      {
        "id": 12,
        "ordre": 5,
        "texte": "Quel format d'apprentissage ou d'accompagnement vous intéresserait le plus pour trouver votre voie ?",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 67,
            "code": "5a",
            "titre": "Une formation pratique et intensive de 3 à 6 mois (développement web, data, outils numériques)",
            "description": "Acquérir rapidement des bases techniques appliquées directement aux projets.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "tech_numerique",
            "pole": "tech_numerique"
          },
          {
            "id": 68,
            "code": "5b",
            "titre": "Des ateliers pratiques de business plan, gestion de budget, vente et démarches concrètes",
            "description": "Apprendre à chiffrer, vendre et gérer sa propre entreprise au quotidien.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "entrepreneuriat_agri",
            "pole": "entrepreneuriat_agri"
          },
          {
            "id": 69,
            "code": "5c",
            "titre": "Une formation certifiante en gestion de projet, coordination d'équipe et organisation",
            "description": "Valider une méthode de conduite d'opérations et de suivi rigoureux.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "management_conseil",
            "pole": "management_conseil"
          },
          {
            "id": 70,
            "code": "5d",
            "titre": "Des modules spécialisés en gestion de projets associatifs, RSE ou protection environnementale",
            "description": "Maîtriser les méthodologies d'impact durable et de reporting sociétal.",
            "pts_sci": 2,
            "pts_lit": 2,
            "categorie": "impact_vert_rse",
            "pole": "impact_vert_rse"
          },
          {
            "id": 71,
            "code": "5e",
            "titre": "Des techniques d'animation d'ateliers, de recrutement et de communication interpersonnelle",
            "description": "Pratiquer les méthodes d'écoute, de coaching et d'évaluation des compétences.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "formation_rh_humain",
            "pole": "formation_rh_humain"
          },
          {
            "id": 72,
            "code": "5f",
            "titre": "Des formations en gestion des stocks, logiciels de gestion (ERP/Excel) et normes de qualité",
            "description": "Maîtriser les processus de chaîne logistique et de conformité opérationnelle.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "expertise_terrain_qualite",
            "pole": "expertise_terrain_qualite"
          }
        ]
      },
      {
        "id": 13,
        "ordre": 6,
        "texte": "Face à un problème imprévu ou une difficulté au travail, quelle est votre réaction spontanée ?",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 73,
            "code": "6a",
            "titre": "Je cherche la cause logique, teste différentes pistes avec méthode et cherche à fiabiliser",
            "description": "Remonter à la source de la panne informatique ou de la défaillance logique.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "tech_numerique",
            "pole": "tech_numerique"
          },
          {
            "id": 74,
            "code": "6b",
            "titre": "Je trouve une solution alternative immédiate, pragmatique et peu coûteuse sans attendre",
            "description": "Agir avec débrouillardise pour ne pas bloquer l'activité.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "entrepreneuriat_agri",
            "pole": "entrepreneuriat_agri"
          },
          {
            "id": 75,
            "code": "6c",
            "titre": "Je rassemble les faits, consulte les personnes concernées et établis un plan d'action clair",
            "description": "Prendre du recul pour décider en concertation avec l'équipe.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "management_conseil",
            "pole": "management_conseil"
          },
          {
            "id": 76,
            "code": "6d",
            "titre": "Je privilégie le dialogue et la bienveillance pour comprendre le blocage et motiver la personne",
            "description": "Désamorcer les tensions et restaurer un climat de coopération serein.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "formation_rh_humain",
            "pole": "formation_rh_humain"
          },
          {
            "id": 77,
            "code": "6e",
            "titre": "Je m'assure que la solution choisie respecte les personnes et apporte un bénéfice équitable",
            "description": "Protéger l'éthique et les intérêts durables de la collectivité.",
            "pts_sci": 2,
            "pts_lit": 2,
            "categorie": "impact_vert_rse",
            "pole": "impact_vert_rse"
          },
          {
            "id": 78,
            "code": "6f",
            "titre": "Je vais directement voir sur place pour comprendre le dysfonctionnement et le réparer",
            "description": "Constater sur le terrain l'anomalie matérielle et intervenir.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "expertise_terrain_qualite",
            "pole": "expertise_terrain_qualite"
          }
        ]
      },
      {
        "id": 14,
        "ordre": 7,
        "texte": "À quoi ressemblerait votre réussite professionnelle idéale d'ici 3 ans ?",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 79,
            "code": "7a",
            "titre": "Avoir développé ma propre activité autonome et rentable qui me procure fierté et liberté",
            "description": "Gérer avec succès sa propre entreprise et créer de la valeur à Madagascar.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "entrepreneuriat_agri",
            "pole": "entrepreneuriat_agri"
          },
          {
            "id": 80,
            "code": "7b",
            "titre": "Exercer un métier stimulant dans le numérique, avec un bon salaire et de solides débouchés",
            "description": "Évoluer au sein d'une équipe tech dynamique et innovante.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "tech_numerique",
            "pole": "tech_numerique"
          },
          {
            "id": 81,
            "code": "7c",
            "titre": "Occuper un rôle de coordinateur ou chargé de projet respecté pour sa méthode et ses résultats",
            "description": "Être le pivot organisationnel d'une structure en développement.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "management_conseil",
            "pole": "management_conseil"
          },
          {
            "id": 82,
            "code": "7d",
            "titre": "Avoir un impact positif concret sur les conditions de vie et l'environnement à Madagascar",
            "description": "Constater les retombées bénéfiques d'initiatives solidaires locales.",
            "pts_sci": 2,
            "pts_lit": 2,
            "categorie": "impact_vert_rse",
            "pole": "impact_vert_rse"
          },
          {
            "id": 83,
            "code": "7e",
            "titre": "Avoir formé, recruté et aidé de nombreuses personnes à réussir dans leur propre parcours",
            "description": "Participer à l'épanouissement professionnel de centaines d'actifs.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "formation_rh_humain",
            "pole": "formation_rh_humain"
          },
          {
            "id": 84,
            "code": "7f",
            "titre": "Maîtriser une activité opérationnelle fluide et efficace, reconnue pour sa rigueur et sa qualité",
            "description": "Assurer la fiabilité absolue des processus physiques et logistiques.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "expertise_terrain_qualite",
            "pole": "expertise_terrain_qualite"
          }
        ]
      }
    ],
    "caracteristiques": [
      {
        "id": 1,
        "code": "tech_numerique",
        "nom": "Profil Métiers du Numérique, Web & Nouvelles Technologies",
        "short_nom": "Numérique & Tech",
        "description": "Attrait pour l'informatique, les outils digitaux, l'automatisation et les compétences recherchées dans le web et la data.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 8,
        "pts_lit_min": 0
      },
      {
        "id": 2,
        "code": "entrepreneuriat_agri",
        "nom": "Profil Créateur d'Activité, Commerce & Métiers Autonomes",
        "short_nom": "Entrepreneuriat & Commerce",
        "description": "Esprit d'initiative, indépendance professionnelle, sens des opportunités commerciales et dynamisme de terrain.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 4,
        "pts_lit_min": 3
      },
      {
        "id": 3,
        "code": "management_conseil",
        "nom": "Profil Gestion de Projets, Coordination & Conseil Opérationnel",
        "short_nom": "Coordination & Gestion",
        "description": "Aptitude à organiser, planifier, suivre des indicateurs et animer des équipes pour atteindre des résultats tangibles.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 3,
        "pts_lit_min": 5
      },
      {
        "id": 4,
        "code": "formation_rh_humain",
        "nom": "Profil Accompagnement Humain, Formation & Recrutement",
        "short_nom": "RH & Formation",
        "description": "Écoute active, pédagogie, transmission de savoir et développement du potentiel des individus au travail.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 0,
        "pts_lit_min": 8
      },
      {
        "id": 8,
        "code": "impact_vert_rse",
        "nom": "Profil Écologie, Développement Durable & Impact Social",
        "short_nom": "Environnement & Impact",
        "description": "Engagement pour des missions porteuses de sens, l'agroécologie, la transition écologique et l'utilité collective.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 4,
        "pts_lit_min": 4
      },
      {
        "id": 10,
        "code": "expertise_terrain_qualite",
        "nom": "Profil Métiers de Terrain, Logistique & Qualité Opérationnelle",
        "short_nom": "Terrain & Logistique",
        "description": "Sens pratique, manipulation d'équipements, gestion physique des flux, contrôle qualité et rigueur d'exécution.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": null,
        "metiers": null,
        "pts_sci_min": 7,
        "pts_lit_min": 1
      }
    ]
  },
  "emploi_2": {
    "role": "emploi",
    "testNum": 2,
    "questions": [
      {
        "id": 3,
        "ordre": 1,
        "texte": "Sélectionnez vos domaines de compétences transférables ou d'expérience clé",
        "pts_sci": 3,
        "pts_lit": 3,
        "reponses": [
          {
            "id": 15,
            "code": "dom_orga_projets",
            "titre": "Organisation, Méthode & Planification",
            "description": "Suivi de plannings, gestion des priorités, respect des consignes et organisation méthodique.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "pole_conseil_management",
            "pole": "pole_conseil_management"
          },
          {
            "id": 16,
            "code": "dom_finance_gestion",
            "titre": "Chiffres, Calculs & Notions de Gestion",
            "description": "Calculs de coûts, factures, gestion de petites caisses, sens de la rigueur chiffrée.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "pole_conseil_management",
            "pole": "pole_conseil_management"
          },
          {
            "id": 17,
            "code": "dom_vente_negociation",
            "titre": "Contact Client, Vente & Négociation",
            "description": "Sens de l'accueil, argumentation commerciale, persuasion et fidélisation de clients.",
            "pts_sci": 1,
            "pts_lit": 2,
            "categorie": "pole_entrepreneuriat",
            "pole": "pole_entrepreneuriat"
          },
          {
            "id": 18,
            "code": "dom_management_equipe",
            "titre": "Communication, Écoute & Animation de Groupe",
            "description": "Aisance pour animer un groupe, faciliter l'entraide et motiver ses pairs.",
            "pts_sci": 0,
            "pts_lit": 2,
            "categorie": "pole_rh_formation",
            "pole": "pole_rh_formation"
          },
          {
            "id": 19,
            "code": "dom_outils_digitaux",
            "titre": "Outils Numériques, Bureautique & Internet",
            "description": "Bureautique (Word, Excel), navigation web efficace, réseaux sociaux et outils en ligne.",
            "pts_sci": 3,
            "pts_lit": 0,
            "categorie": "pole_tech_digital",
            "pole": "pole_tech_digital"
          },
          {
            "id": 20,
            "code": "dom_redaction_langues",
            "titre": "Expression Écrite, Synthèse & Langues",
            "description": "Rédaction soignée, clarté d'expression en français et/ou anglais, esprit de synthèse.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "pole_tech_digital",
            "pole": "pole_tech_digital"
          },
          {
            "id": 21,
            "code": "dom_technique_terrain",
            "titre": "Logistique, Organisation Pratique & Stocks",
            "description": "Comptage d'inventaires, rangement rigoureux, manipulation de colis, contrôle physique.",
            "pts_sci": 2,
            "pts_lit": 0,
            "categorie": "pole_logistique_supply",
            "pole": "pole_logistique_supply"
          },
          {
            "id": 22,
            "code": "dom_pedagogie_formation",
            "titre": "Pédagogie, Conseil & Transmission de Savoir",
            "description": "Capacité à expliquer clairement une tâche, former de nouveaux collègues avec patience.",
            "pts_sci": 0,
            "pts_lit": 3,
            "categorie": "pole_rh_formation",
            "pole": "pole_rh_formation"
          }
        ]
      },
      {
        "id": 4,
        "ordre": 2,
        "texte": "Évaluez vos atouts personnels d'employabilité et de réussite professionnelle",
        "pts_sci": 2,
        "pts_lit": 2,
        "reponses": [
          {
            "id": 23,
            "code": "apt_autonomie_debrouille",
            "titre": "Autonomie, sens des initiatives & débrouillardise",
            "description": "Capacité à avancer seul sur ses missions sans attendre qu'on me dise quoi faire à chaque étape.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "pole_entrepreneuriat",
            "pole": "pole_entrepreneuriat"
          },
          {
            "id": 24,
            "code": "apt_rigueur_precision",
            "titre": "Rigueur, ponctualité & précision du travail",
            "description": "Respect des horaires, souci du travail bien fait du premier coup et vigilance sur les détails.",
            "pts_sci": 2,
            "pts_lit": 0,
            "categorie": "pole_conseil_management",
            "pole": "pole_conseil_management"
          },
          {
            "id": 25,
            "code": "apt_relationnel_empathie",
            "titre": "Aisance relationnelle, écoute active & diplomatie",
            "description": "Facilité pour créer du lien, désamorcer les tensions et collaborer avec respect et courtoisie.",
            "pts_sci": 0,
            "pts_lit": 2,
            "categorie": "pole_rh_formation",
            "pole": "pole_rh_formation"
          },
          {
            "id": 26,
            "code": "apt_apprentissage_continu",
            "titre": "Curiosité, envie d'apprendre & adaptabilité",
            "description": "Enthousiasme à découvrir de nouvelles méthodes, apprendre un métier différent ou changer d'outils.",
            "pts_sci": 2,
            "pts_lit": 1,
            "categorie": "pole_tech_digital",
            "pole": "pole_tech_digital"
          },
          {
            "id": 27,
            "code": "apt_sens_responsabilite",
            "titre": "Sens des responsabilités & fiabilité sans faille",
            "description": "Tenue des engagements pris, honnêteté professionnelle et fidélité à la parole donnée.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "pole_conseil_management",
            "pole": "pole_conseil_management"
          },
          {
            "id": 28,
            "code": "apt_resistance_stress",
            "titre": "Gestion du stress & persévérance face aux imprévus",
            "description": "Capacité à garder son calme lors des périodes d'affluence ou face aux pannes techniques.",
            "pts_sci": 1,
            "pts_lit": 1,
            "categorie": "pole_logistique_supply",
            "pole": "pole_logistique_supply"
          }
        ]
      }
    ],
    "caracteristiques": [
      {
        "id": 1,
        "code": "pole_tech_digital",
        "nom": "Pôle Technologies Numériques, Web & Data",
        "short_nom": "Tech & Digital",
        "description": "Filière moderne en forte croissance à Madagascar avec de réelles opportunités d'embauche et d'évolution.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": "Développement Web, Gestion de Données, Maintenance Informatique, Marketing Digital",
        "metiers": "Développeur Junior, Gestionnaire de Contenu Web, Assistant Support Technique",
        "pts_sci_min": 8,
        "pts_lit_min": 1
      },
      {
        "id": 2,
        "code": "pole_entrepreneuriat",
        "nom": "Pôle Création d'Activité, Vente & Développement Commercial",
        "short_nom": "Commerce & Vente",
        "description": "Parcours pour les profils autonomes souhaitant créer leur propre source de revenus ou exceller dans la vente.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": "Commerce, Distribution, Entrepreneuriat individuel, Services de proximité",
        "metiers": "Commercial de terrain, Responsable de boutique, Entrepreneur indépendant",
        "pts_sci_min": 2,
        "pts_lit_min": 5
      },
      {
        "id": 3,
        "code": "pole_rh_formation",
        "nom": "Pôle Ressources Humaines, Formation & Services aux Personnes",
        "short_nom": "RH & Services",
        "description": "Métiers relationnels dédiés au développement des compétences et au bien-être au travail.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": "Agences de travail temporaire, Centres de formation, Pôles de relation client",
        "metiers": "Chargé de recrutement, Formateur d'adultes, Conseiller d'insertion",
        "pts_sci_min": 1,
        "pts_lit_min": 8
      },
      {
        "id": 5,
        "code": "pole_conseil_management",
        "nom": "Pôle Coordination de Projets, Gestion & Conseil",
        "short_nom": "Coordination & Projets",
        "description": "Métiers valorisant l'organisation méthodique, le respect des plannings et la communication interne.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": "Cabinets de conseil, Gestion de projets, Assistanat de direction, Administration",
        "metiers": "Coordinateur de projet, Assistant de gestion, Chargé de suivi et évaluation",
        "pts_sci_min": 3,
        "pts_lit_min": 5
      },
      {
        "id": 7,
        "code": "pole_impact_vert",
        "nom": "Pôle Environnement, RSE & Développement Durable",
        "short_nom": "Impact & Écologie",
        "description": "Filière d'avenir alliant utilité sociale et préservation du patrimoine naturel malgache.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": "ONG environnementales, Agroécologie, Gestion des déchets, Énergies renouvelables",
        "metiers": "Animateur de projet vert, Technicien écocitoyen, Assistant projets durables",
        "pts_sci_min": 5,
        "pts_lit_min": 4
      },
      {
        "id": 9,
        "code": "pole_logistique_supply",
        "nom": "Pôle Logistique, Supply Chain & Organisation Opérationnelle",
        "short_nom": "Logistique & Terrain",
        "description": "Secteur dynamique axé sur l'efficacité concrète, la précision des inventaires et la chaîne d'approvisionnement.",
        "qualites": null,
        "recommandations": null,
        "debouches": null,
        "secteurs": "Transport, Entreposage, Plateformes logistiques, Importation-Exportation",
        "metiers": "Gestionnaire de stocks, Assistant logistique, Magasinier qualifié",
        "pts_sci_min": 6,
        "pts_lit_min": 1
      }
    ]
  }
};

function getQuestions(role, testNum) {
  const key = `${role}_${testNum}`;
  return TESTS_CONSTANT_DATA[key]?.questions || [];
}

function getCaracteristiques(role, testNum) {
  const key = `${role}_${testNum}`;
  return TESTS_CONSTANT_DATA[key]?.caracteristiques || [];
}

/**
 * Calculer automatiquement le score, les points et le trait / résultat dominant
 */
function evaluateTest(role, testNum, answers = {}, selectedKeys = []) {
  const testInfo = TESTS_CONSTANT_DATA[`${role}_${testNum}`];
  if (!testInfo) return { pts_sci: 0, pts_lit: 0, resultat: null };

  const rawAnswers = Array.isArray(answers) 
    ? answers 
    : (typeof answers === 'object' ? Object.values(answers) : [answers]);

  const allSelected = [...rawAnswers, ...selectedKeys].filter(v => typeof v === 'string' || typeof v === 'number');

  let pts_sci = 0;
  let pts_lit = 0;
  const catCounts = {};

  // Parcourir toutes les options de réponses du test
  for (const q of testInfo.questions) {
    for (const r of q.reponses) {
      const match = allSelected.some(a => String(a) === String(r.code) || String(a) === String(r.id) || String(a) === String(r.titre));
      if (match) {
        pts_sci += r.pts_sci || 0;
        pts_lit += r.pts_lit || 0;
        const cat = r.categorie || r.pole;
        if (cat) catCounts[cat] = (catCounts[cat] || 0) + 1;
      }
    }
  }

  // Déterminer la catégorie / le pôle dominant
  const dominantCat = Object.keys(catCounts).sort((a, b) => catCounts[b] - catCounts[a])[0];

  // Associer la caractéristique correspondante
  let matchedCar = null;
  if (dominantCat) {
    matchedCar = testInfo.caracteristiques.find(c => c.code === dominantCat);
  }
  if (!matchedCar && testInfo.caracteristiques.length > 0) {
    matchedCar = testInfo.caracteristiques[0];
  }

  return {
    pts_sci,
    pts_lit,
    dominantCat,
    resultat: matchedCar?.nom || null,
    caracteristique: matchedCar,
    scores: catCounts,
  };
}

module.exports = {
  TESTS_CONSTANT_DATA,
  getQuestions,
  getCaracteristiques,
  evaluateTest,
};
