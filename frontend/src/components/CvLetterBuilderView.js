import React, { useState, useEffect } from 'react';

/**
 * Atelier de Création de CV & Lettre de Motivation (Style Canva)
 * Dédié aux Étudiants et aux Personnes en Recherche d'Emploi
 */

// Couleurs thématiques sélectionnables (Canva Palette)
const THEME_COLORS = [
  { id: 'blue', label: 'Bleu e-HARI', hex: '#1d4ed8', light: '#eff6ff', border: '#bfdbfe' },
  { id: 'emerald', label: 'Vert Émeraude', hex: '#059669', light: '#ecfdf5', border: '#a7f3d0' },
  { id: 'navy', label: 'Bleu Marine Sombre', hex: '#0f172a', light: '#f8fafc', border: '#cbd5e1' },
  { id: 'amber', label: 'Ambre Doré', hex: '#d97706', light: '#fffbeb', border: '#fde68a' },
  { id: 'purple', label: 'Pourpre Moderne', hex: '#7c3aed', light: '#faf5ff', border: '#e9d5ff' },
  { id: 'ruby', label: 'Bordeaux Exécutif', hex: '#991b1b', light: '#fef2f2', border: '#fecaca' },
];

// Polices sélectionnables
const THEME_FONTS = [
  { id: 'sans', label: 'Moderne (Sans-Serif)', family: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
  { id: 'serif', label: 'Élégant (Serif)', family: 'Georgia, Cambria, "Times New Roman", serif' },
  { id: 'tech', label: 'Technique & Épuré', family: '"Trebuchet MS", "Lucida Sans Unicode", sans-serif' },
];

export default function CvLetterBuilderView({ currentUser, currentRole }) {
  const userId = currentUser?.id || currentUser?.use_id || 'guest';
  const isStudent = currentRole === 'etudiant';

  // 1. Initialisation intelligente depuis le profil utilisateur
  const nomComplet = [currentUser?.use_pre, currentUser?.use_nom].filter(Boolean).join(' ') || 'RAKOTO Jean';
  const initialEmail = currentUser?.use_ema || 'jean.rakoto@email.mg';
  const initialTel = currentUser?.use_tel || '+261 34 00 000 00';
  const initialVille = currentUser?.use_vil || currentUser?.use_adr || 'Antananarivo, Madagascar';

  const defaultTitre = isStudent
    ? `Étudiant en ${currentUser?.profil?.etu_fil || currentUser?.profil?.etud_fili || 'Informatique & Gestion'}`
    : `${currentUser?.profil?.emp_met_vis || currentUser?.profil?.emp_met_act || 'Professionnel Qualifié'}`;

  // Clés de stockage persistant
  const storageKeyCv = `hari_cv_data_${userId}`;
  const storageKeyLetter = `hari_letter_data_${userId}`;

  // 2. États du Mode & Design
  const [activeMode, setActiveMode] = useState('cv'); // 'cv' | 'letter'
  const [selectedTemplate, setSelectedTemplate] = useState('template_modern'); // 'template_modern' | 'template_classic' | 'template_tech'
  const [selectedColor, setSelectedColor] = useState(THEME_COLORS[0]);
  const [selectedFont, setSelectedFont] = useState(THEME_FONTS[0]);
  const [isPreviewOnly, setIsPreviewOnly] = useState(false);

  // 3. Données du CV
  const initialCvData = {
    nom: nomComplet,
    titre: defaultTitre,
    email: initialEmail,
    telephone: initialTel,
    ville: initialVille,
    linkedin: 'linkedin.com/in/votre-profil',
    resume: isStudent
      ? 'Étudiant rigoureux et motivé, doté d\'une solide formation académique et d\'une grande adaptabilité. À la recherche d\'un stage conventionné pour mettre en pratique mes compétences et contribuer activement aux missions d\'une entreprise dynamique.'
      : 'Professionnel méthodique et orienté résultats, fort d\'une solide expérience et d\'un réel sens de l\'engagement. Désireux d\'intégrer une structure en plein essor pour accompagner ses projets stratégiques.',
    experiences: [
      {
        id: 1,
        poste: isStudent ? 'Stagiaire Assistant Projet' : 'Chargé de Mission / Poste Opérationnel',
        entreprise: 'Société Partenaire Madagascar',
        periode: '2025 (3 mois)',
        missions: 'Participation au suivi opérationnel des dossiers, assistance aux réunions d\'équipe, rédaction de comptes-rendus et modélisation de tableaux de bord sur Excel.',
      },
      {
        id: 2,
        poste: isStudent ? 'Projet Académique Majeur' : 'Expérience Précédente',
        entreprise: isStudent ? (currentUser?.profil?.etu_eta || 'Université') : 'Entreprise Précédente',
        periode: '2024',
        missions: 'Coordination d\'un travail de groupe de 4 personnes, élaboration d\'un cahier des charges et présentation finale devant jury.',
      },
    ],
    formations: [
      {
        id: 1,
        diplome: isStudent ? (currentUser?.profil?.etu_niv_etu || 'Licence 3') + ' en ' + (currentUser?.profil?.etu_fil || 'Informatique & Gestion') : 'Diplôme Supérieur / Certifications',
        etablissement: currentUser?.profil?.etu_eta || currentUser?.profil?.etud_etab || 'Université d\'Antananarivo',
        annee: '2023 - 2026',
        details: 'Cursus axé sur la gestion de projet, l\'analyse méthodique et les outils modernes de prise de décision.',
      },
      {
        id: 2,
        diplome: 'Baccalauréat de l\'Enseignement Général',
        etablissement: 'Lycée de Madagascar',
        annee: '2022',
        details: 'Mention Bien. Spécialités mathématiques et sciences.',
      },
    ],
    competences: [
      'Gestion de projet & planification',
      'Suite Bureautique (Excel, Word, PowerPoint)',
      'Analyse de données & reporting',
      'Communication orale et écrite',
      'Résolution méthodique de problèmes',
      'Travail collaboratif & esprit d\'équipe',
    ],
    langues: [
      { nom: 'Malagasy', niveau: 'Langue maternelle' },
      { nom: 'Français', niveau: 'Courant / Bilingue professionnel' },
      { nom: 'Anglais', niveau: 'Technique / Professionnel' },
    ],
    interets: 'Technologies émergentes, lecture économique, bénévolat associatif, sport collectif.',
  };

  const [cvData, setCvData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKeyCv);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignorer
    }
    return initialCvData;
  });

  // Sauvegarde automatique du CV
  useEffect(() => {
    try {
      localStorage.setItem(storageKeyCv, JSON.stringify(cvData));
    } catch (e) {
      // Ignorer
    }
  }, [cvData, storageKeyCv]);

  // 4. Données de la Lettre de Motivation
  const initialLetterData = {
    expediteurNom: nomComplet,
    expediteurEmail: initialEmail,
    expediteurTel: initialTel,
    expediteurVille: initialVille,
    destinataireTitre: 'Madame, Monsieur le Responsable du Recrutement',
    destinataireEntreprise: 'Entreprise Cible Madagascar',
    destinataireVille: 'Antananarivo, Madagascar',
    dateLieu: `Antananarivo, le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`,
    objet: isStudent ? 'Candidature pour un Stage Conventionné de Fin d\'Études (PFE)' : 'Candidature pour le poste de Chargé(e) de Mission',
    intro: `Actuellement en ${isStudent ? 'cursus universitaire à ' + (currentUser?.profil?.etu_eta || 'l\'Université') : 'recherche active d\'une nouvelle opportunité professionnelle'}, je me permets de vous adresser ma candidature afin de rejoindre vos équipes.`,
    vous: 'Votre entreprise jouit d\'une solide réputation dans son secteur à Madagascar, reconnue tant pour l\'exigence de ses réalisations que pour la qualité de son management. Contribuer à vos projets représente pour moi une opportunité particulièrement stimulante.',
    moi: 'Au cours de mon parcours, j\'ai acquis une méthodologie rigoureuse, un sens aigu de l\'organisation et une réelle capacité d\'apprentissage. Habitué(e) à travailler en équipe et à respecter les échéances, je sais faire preuve de proactivité face aux missions qui me sont confiées.',
    nous: 'Intégrer votre structure me permettrait d\'apporter mon dynamisme et ma motivation sans réserve. Je serais honoré(e) de pouvoir échanger avec vous lors d\'un entretien afin de vous détailler mes motivations.',
    formulePolitesse: 'Je vous prie d\'agréer, Madame, Monsieur, l\'expression de mes salutations les plus distinguées.',
  };

  const [letterData, setLetterData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKeyLetter);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignorer
    }
    return initialLetterData;
  });

  // Sauvegarde automatique de la lettre
  useEffect(() => {
    try {
      localStorage.setItem(storageKeyLetter, JSON.stringify(letterData));
    } catch (e) {
      // Ignorer
    }
  }, [letterData, storageKeyLetter]);

  // 5. Gestion des listes dynamiques (Expériences, Formations, Compétences)
  const handleAddExperience = () => {
    const newExp = {
      id: Date.now(),
      poste: 'Nouveau Poste / Stage',
      entreprise: 'Entreprise / Structure',
      periode: '2025',
      missions: 'Description synthétique de vos responsabilités et missions réalisées.',
    };
    setCvData({ ...cvData, experiences: [...cvData.experiences, newExp] });
  };

  const handleRemoveExperience = (id) => {
    setCvData({ ...cvData, experiences: cvData.experiences.filter((e) => e.id !== id) });
  };

  const handleUpdateExperience = (id, field, value) => {
    const updated = cvData.experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp));
    setCvData({ ...cvData, experiences: updated });
  };

  const handleAddFormation = () => {
    const newForm = {
      id: Date.now(),
      diplome: 'Nouveau Diplôme / Formation',
      etablissement: 'Établissement / Université',
      annee: '2025',
      details: 'Spécialités, matières dominantes ou mentions.',
    };
    setCvData({ ...cvData, formations: [...cvData.formations, newForm] });
  };

  const handleRemoveFormation = (id) => {
    setCvData({ ...cvData, formations: cvData.formations.filter((f) => f.id !== id) });
  };

  const handleUpdateFormation = (id, field, value) => {
    const updated = cvData.formations.map((f) => (f.id === id ? { ...f, [field]: value } : f));
    setCvData({ ...cvData, formations: updated });
  };

  // Ajout de compétence
  const [newCompetenceInput, setNewCompetenceInput] = useState('');
  const handleAddCompetence = (e) => {
    e.preventDefault();
    if (!newCompetenceInput.trim()) return;
    setCvData({ ...cvData, competences: [...cvData.competences, newCompetenceInput.trim()] });
    setNewCompetenceInput('');
  };

  const handleRemoveCompetence = (index) => {
    setCvData({ ...cvData, competences: cvData.competences.filter((_, i) => i !== index) });
  };

  // Modèles de lettres pré-rédigés en 1 clic
  const handleApplyLetterTemplate = (templateType) => {
    if (templateType === 'pfe') {
      setLetterData({
        ...letterData,
        objet: 'Candidature : Stage de Fin d\'Études (PFE) conventionné',
        intro: `Actuellement en dernière année de cursus à ${currentUser?.profil?.etu_eta || 'l\'Université'}, je suis à la recherche d'un stage de fin d'études conventionné de 4 à 6 mois.`,
        vous: 'Votre structure s\'impose comme une référence incontournable grâce à son expertise reconnue et ses projets à fort impact à Madagascar.',
        moi: 'Mon cursus m\'a permis d\'acquérir des compétences solides et une démarche de travail méthodique, prêtes à être déployées au sein de vos équipes opérationnelles.',
        nous: 'Je serais ravi(e) de mettre mon énergie et mes capacités au service de vos défis actuels dans le cadre de ce stage de pré-embauche.',
      });
    } else if (templateType === 'spontanee') {
      setLetterData({
        ...letterData,
        objet: 'Candidature Spontanée : Proposition de collaboration',
        intro: 'Suivant avec un grand intérêt le développement et les perspectives de votre entreprise à Madagascar, je me permets de vous proposer ma collaboration.',
        vous: 'L\'innovation de vos services et votre culture de la rigueur constituent pour moi un cadre idéal pour exprimer mon potentiel professionnel.',
        moi: 'Doté(e) d\'une réelle polyvalence et d\'un excellent relationnel, je suis en mesure de m\'adapter rapidement à vos processus et d\'apporter une réelle valeur ajoutée.',
        nous: 'Je sollicite l\'opportunité d\'un échange afin de vous exposer plus en détail la manière dont mes compétences peuvent s\'inscrire dans vos projets.',
      });
    } else if (templateType === 'emploi') {
      setLetterData({
        ...letterData,
        objet: 'Candidature pour un poste opérationnel',
        intro: 'Ayant développé une pratique affirmée de mon métier, je souhaite aujourd\'hui mettre mon expérience et ma rigueur au service de votre organisation.',
        vous: 'Votre entreprise se distingue par son professionnalisme et ses ambitions de croissance sur le marché national.',
        moi: 'Mon parcours m\'a forgé un esprit d\'analyse, un grand sens des responsabilités et une capacité éprouvée à atteindre des objectifs exigeants.',
        nous: 'Disponible immédiatement, je me tiens à votre entière disposition pour tout entretien de présentation.',
      });
    }
  };

  // Déclencher l'impression native propre (format A4)
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cv-builder-workspace" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. BARRE D'OUTILS PRINCIPALE STYLE CANVA (NO-PRINT) */}
      <div
        className="no-print"
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '1rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Sélecteur de Mode : CV vs Lettre de Motivation */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: '10px', gap: '0.25rem' }}>
          <button
            type="button"
            onClick={() => setActiveMode('cv')}
            style={{
              background: activeMode === 'cv' ? '#ffffff' : 'transparent',
              color: activeMode === 'cv' ? '#1d4ed8' : '#64748b',
              fontWeight: 800,
              fontSize: '0.85rem',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: activeMode === 'cv' ? '0 2px 5px rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="7" y1="8" x2="17" y2="8" />
              <line x1="7" y1="12" x2="17" y2="12" />
              <line x1="7" y1="16" x2="13" y2="16" />
            </svg>
            <span>Mon CV (Curriculum Vitae)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('letter')}
            style={{
              background: activeMode === 'letter' ? '#ffffff' : 'transparent',
              color: activeMode === 'letter' ? '#1d4ed8' : '#64748b',
              fontWeight: 800,
              fontSize: '0.85rem',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: activeMode === 'letter' ? '0 2px 5px rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>Ma Lettre de Motivation</span>
          </button>
        </div>

        {/* Personnalisation Canva : Modèles, Couleurs & Typo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {/* Choix du Modèle */}
          {activeMode === 'cv' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>Modèle :</span>
              <select
                className="form-control"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
              >
                <option value="template_modern">1. Moderne Bicolore (Barre latérale)</option>
                <option value="template_classic">2. Épuré Minimaliste (Haut standing)</option>
                <option value="template_tech">3. Tech & Compétences (Badges)</option>
              </select>
            </div>
          )}

          {/* Nuancier de Couleurs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>Thème :</span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {THEME_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  title={c.label}
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: c.hex,
                    border: selectedColor.id === c.id ? '2.5px solid #ffffff' : 'none',
                    outline: selectedColor.id === c.id ? `2px solid ${c.hex}` : 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'transform 0.15s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Choix de la Police */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <select
              className="form-control"
              value={selectedFont.id}
              onChange={(e) => {
                const found = THEME_FONTS.find((f) => f.id === e.target.value);
                if (found) setSelectedFont(found);
              }}
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
            >
              {THEME_FONTS.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Bouton Toggle Aperçu Plein Écran */}
          <button
            type="button"
            onClick={() => setIsPreviewOnly(!isPreviewOnly)}
            style={{
              background: isPreviewOnly ? '#1e293b' : '#f1f5f9',
              color: isPreviewOnly ? '#ffffff' : '#334155',
              border: 'none',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{isPreviewOnly ? 'Afficher l\'éditeur' : 'Aperçu seul'}</span>
          </button>

          {/* Bouton Télécharger / Imprimer en PDF (A4 parfait) */}
          <button
            type="button"
            onClick={handlePrint}
            style={{
              background: selectedColor.hex,
              color: '#ffffff',
              border: 'none',
              padding: '0.5rem 1.15rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
              transition: 'transform 0.15s ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span>Télécharger en PDF / Imprimer</span>
          </button>
        </div>
      </div>

      {/* 2. ESPACE DE TRAVAIL (GRILLE ÉDITEUR + CANVA A4 LIVE PREVIEW) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isPreviewOnly ? '1fr' : 'minmax(340px, 460px) 1fr',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* ========================================================
            COLONNE GAUCHE : PANNEAU ÉDITEUR (MASQUÉ EN PREVIEW / PRINT)
            ======================================================== */}
        {!isPreviewOnly && (
          <div
            className="cv-editor-panel no-print"
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              maxHeight: 'calc(100vh - 160px)',
              overflowY: 'auto',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.15rem',
            }}
          >
            {/* Titre du panneau */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e3a8a', textTransform: 'uppercase' }}>
                {activeMode === 'cv' ? 'Éditer les données du CV' : 'Éditer la Lettre de Motivation'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Enregistré automatiquement</span>
              </span>
            </div>

            {/* FORMULAIRE CV */}
            {activeMode === 'cv' && (
              <>
                {/* Informations de Contact */}
                <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.65rem' }}>
                    1. Coordonnées & Titre
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nom complet"
                      value={cvData.nom}
                      onChange={(e) => setCvData({ ...cvData, nom: e.target.value })}
                      style={{ fontSize: '0.85rem' }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Titre du CV (ex: Développeur Web Junior)"
                      value={cvData.titre}
                      onChange={(e) => setCvData({ ...cvData, titre: e.target.value })}
                      style={{ fontSize: '0.85rem' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={cvData.email}
                        onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                        style={{ fontSize: '0.85rem' }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Téléphone"
                        value={cvData.telephone}
                        onChange={(e) => setCvData({ ...cvData, telephone: e.target.value })}
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ville, Pays"
                      value={cvData.ville}
                      onChange={(e) => setCvData({ ...cvData, ville: e.target.value })}
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* Profil & Accroche */}
                <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.45rem' }}>
                    2. Résumé du Profil (Accroche)
                  </div>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder="Présentez votre projet professionnel en quelques lignes percutantes..."
                    value={cvData.resume}
                    onChange={(e) => setCvData({ ...cvData, resume: e.target.value })}
                    style={{ width: '100%', fontSize: '0.84rem', resize: 'vertical' }}
                  />
                </div>

                {/* Expériences & Stages */}
                <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>
                      3. Expériences & Stages ({cvData.experiences.length})
                    </div>
                    <button
                      type="button"
                      onClick={handleAddExperience}
                      style={{
                        background: '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      + Ajouter
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {cvData.experiences.map((exp, index) => (
                      <div key={exp.id} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.75rem', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Poste #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(exp.id)}
                            style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                          >
                            Supprimer
                          </button>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Intitulé du poste ou stage"
                          value={exp.poste}
                          onChange={(e) => handleUpdateExperience(exp.id, 'poste', e.target.value)}
                          style={{ fontSize: '0.82rem', marginBottom: '0.4rem' }}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.4rem' }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Entreprise"
                            value={exp.entreprise}
                            onChange={(e) => handleUpdateExperience(exp.id, 'entreprise', e.target.value)}
                            style={{ fontSize: '0.82rem' }}
                          />
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Période (ex: 2024 - 3 mois)"
                            value={exp.periode}
                            onChange={(e) => handleUpdateExperience(exp.id, 'periode', e.target.value)}
                            style={{ fontSize: '0.82rem' }}
                          />
                        </div>
                        <textarea
                          rows={2}
                          className="form-control"
                          placeholder="Missions et réalisations clés..."
                          value={exp.missions}
                          onChange={(e) => handleUpdateExperience(exp.id, 'missions', e.target.value)}
                          style={{ width: '100%', fontSize: '0.8rem', resize: 'vertical' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formations & Diplômes */}
                <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>
                      4. Formations & Diplômes ({cvData.formations.length})
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFormation}
                      style={{
                        background: '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      + Ajouter
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {cvData.formations.map((f, index) => (
                      <div key={f.id} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>Diplôme #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFormation(f.id)}
                            style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                          >
                            Supprimer
                          </button>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Intitulé du diplôme"
                          value={f.diplome}
                          onChange={(e) => handleUpdateFormation(f.id, 'diplome', e.target.value)}
                          style={{ fontSize: '0.82rem', marginBottom: '0.4rem' }}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.4rem' }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Université / Faculté / Lycée"
                            value={f.etablissement}
                            onChange={(e) => handleUpdateFormation(f.id, 'etablissement', e.target.value)}
                            style={{ fontSize: '0.82rem' }}
                          />
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Année (ex: 2023 - 2026)"
                            value={f.annee}
                            onChange={(e) => handleUpdateFormation(f.id, 'annee', e.target.value)}
                            style={{ fontSize: '0.82rem' }}
                          />
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Détails, mention, spécialités..."
                          value={f.details}
                          onChange={(e) => handleUpdateFormation(f.id, 'details', e.target.value)}
                          style={{ fontSize: '0.8rem' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compétences Clés */}
                <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.45rem' }}>
                    5. Compétences Clés
                  </div>
                  <form onSubmit={handleAddCompetence} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.65rem' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ajouter une compétence..."
                      value={newCompetenceInput}
                      onChange={(e) => setNewCompetenceInput(e.target.value)}
                      style={{ fontSize: '0.82rem', flex: 1 }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0 0.8rem',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      +
                    </button>
                  </form>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {cvData.competences.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '14px',
                          fontSize: '0.78rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <span>{c}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCompetence(i)}
                          style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, fontWeight: 700 }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* FORMULAIRE LETTRE DE MOTIVATION */}
            {activeMode === 'letter' && (
              <>
                {/* Modèles en 1 clic */}
                <div style={{ background: '#eff6ff', padding: '0.85rem', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#1e3a8a', marginBottom: '0.4rem' }}>
                    Modèles Pré-Rédigés en 1 Clic :
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleApplyLetterTemplate('pfe')}
                      style={{ background: '#ffffff', border: '1px solid #93c5fd', borderRadius: '6px', padding: '0.3rem 0.6rem', fontSize: '0.76rem', fontWeight: 700, color: '#1d4ed8', cursor: 'pointer' }}
                    >
                      Stage Fin d'Études (PFE)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyLetterTemplate('spontanee')}
                      style={{ background: '#ffffff', border: '1px solid #93c5fd', borderRadius: '6px', padding: '0.3rem 0.6rem', fontSize: '0.76rem', fontWeight: 700, color: '#1d4ed8', cursor: 'pointer' }}
                    >
                      Candidature Spontanée
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyLetterTemplate('emploi')}
                      style={{ background: '#ffffff', border: '1px solid #93c5fd', borderRadius: '6px', padding: '0.3rem 0.6rem', fontSize: '0.76rem', fontWeight: 700, color: '#1d4ed8', cursor: 'pointer' }}
                    >
                      Recherche d'Emploi
                    </button>
                  </div>
                </div>

                {/* Destinataire & Objet */}
                <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.55rem' }}>
                    Destinataire & Objet
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Entreprise ou organisme ciblé"
                      value={letterData.destinataireEntreprise}
                      onChange={(e) => setLetterData({ ...letterData, destinataireEntreprise: e.target.value })}
                      style={{ fontSize: '0.84rem' }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Titre du destinataire (ex: Madame, Monsieur le Responsable RH)"
                      value={letterData.destinataireTitre}
                      onChange={(e) => setLetterData({ ...letterData, destinataireTitre: e.target.value })}
                      style={{ fontSize: '0.84rem' }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Objet de la lettre"
                      value={letterData.objet}
                      onChange={(e) => setLetterData({ ...letterData, objet: e.target.value })}
                      style={{ fontSize: '0.84rem', fontWeight: 700 }}
                    />
                  </div>
                </div>

                {/* Paragraphes de la lettre */}
                <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.55rem' }}>
                    Corps de la Lettre (Méthode Vous - Moi - Nous)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div>
                      <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Introduction :</label>
                      <textarea
                        rows={2}
                        className="form-control"
                        value={letterData.intro}
                        onChange={(e) => setLetterData({ ...letterData, intro: e.target.value })}
                        style={{ width: '100%', fontSize: '0.82rem', resize: 'vertical' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#1d4ed8' }}>Le « Vous » (Pourquoi cette entreprise) :</label>
                      <textarea
                        rows={3}
                        className="form-control"
                        value={letterData.vous}
                        onChange={(e) => setLetterData({ ...letterData, vous: e.target.value })}
                        style={{ width: '100%', fontSize: '0.82rem', resize: 'vertical' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#15803d' }}>Le « Moi » (Vos compétences et atouts) :</label>
                      <textarea
                        rows={3}
                        className="form-control"
                        value={letterData.moi}
                        onChange={(e) => setLetterData({ ...letterData, moi: e.target.value })}
                        style={{ width: '100%', fontSize: '0.82rem', resize: 'vertical' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#b45309' }}>Le « Nous » (Entretien & conclusion) :</label>
                      <textarea
                        rows={2}
                        className="form-control"
                        value={letterData.nous}
                        onChange={(e) => setLetterData({ ...letterData, nous: e.target.value })}
                        style={{ width: '100%', fontSize: '0.82rem', resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ========================================================
            COLONNE DROITE : FEUILLE A4 WYSIWYG CANVA EN TEMPS RÉEL
            (ZONE IMPRIMABLE ENTRAÎNANT LE TÉLÉCHARGEMENT PDF)
            ======================================================== */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', overflowX: 'auto', paddingBottom: '2rem' }}>
          {/* FEUILLE CV A4 */}
          {activeMode === 'cv' && (
            <div
              id="cv-printable-sheet"
              className="cv-a4-sheet"
              style={{
                width: '100%',
                maxWidth: '794px', // Standard 210mm à 96dpi
                minHeight: '1123px', // Standard 297mm à 96dpi
                background: '#ffffff',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                borderRadius: '4px',
                fontFamily: selectedFont.family,
                color: '#1e293b',
                boxSizing: 'border-box',
                position: 'relative',
              }}
            >
              {/* ====================
                  MODÈLE 1 : MODERNE BICOLORE (Barre latérale)
                  ==================== */}
              {selectedTemplate === 'template_modern' && (
                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '1123px' }}>
                  {/* Colonne Latérale */}
                  <div
                    style={{
                      background: selectedColor.light,
                      borderRight: `2px solid ${selectedColor.border}`,
                      padding: '2rem 1.4rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.5rem',
                    }}
                  >
                    {/* Avatar Initials */}
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          width: '74px',
                          height: '74px',
                          borderRadius: '50%',
                          background: selectedColor.hex,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 0.75rem auto',
                          fontSize: '1.75rem',
                          fontWeight: 800,
                          letterSpacing: '1px',
                        }}
                      >
                        {(cvData.nom || 'R').split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: selectedColor.hex, textTransform: 'uppercase' }}>
                        Curriculum Vitae
                      </div>
                    </div>

                    {/* Contact */}
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: selectedColor.hex, textTransform: 'uppercase', borderBottom: `1.5px solid ${selectedColor.border}`, paddingBottom: '0.25rem', marginBottom: '0.65rem' }}>
                        Contact
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.78rem', color: '#334155' }}>
                        <div><strong>Email :</strong><br />{cvData.email}</div>
                        <div><strong>Tél :</strong><br />{cvData.telephone}</div>
                        <div><strong>Ville :</strong><br />{cvData.ville}</div>
                        {cvData.linkedin && <div><strong>Profil :</strong><br />{cvData.linkedin}</div>}
                      </div>
                    </div>

                    {/* Compétences */}
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: selectedColor.hex, textTransform: 'uppercase', borderBottom: `1.5px solid ${selectedColor.border}`, paddingBottom: '0.25rem', marginBottom: '0.65rem' }}>
                        Compétences
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {cvData.competences.map((c, i) => (
                          <div key={i} style={{ fontSize: '0.77rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ color: selectedColor.hex, fontWeight: 800 }}>•</span>
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Langues */}
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: selectedColor.hex, textTransform: 'uppercase', borderBottom: `1.5px solid ${selectedColor.border}`, paddingBottom: '0.25rem', marginBottom: '0.65rem' }}>
                        Langues
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.77rem' }}>
                        {cvData.langues.map((l, i) => (
                          <div key={i}>
                            <strong>{l.nom}</strong> : <span style={{ color: '#64748b' }}>{l.niveau}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Centres d'intérêt */}
                    {cvData.interets && (
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: selectedColor.hex, textTransform: 'uppercase', borderBottom: `1.5px solid ${selectedColor.border}`, paddingBottom: '0.25rem', marginBottom: '0.45rem' }}>
                          Centres d'intérêt
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.45 }}>
                          {cvData.interets}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Corps Principal */}
                  <div style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    {/* Header Nom & Titre */}
                    <div>
                      <h1 style={{ margin: '0 0 0.35rem 0', fontSize: '2rem', color: '#0f172a', fontWeight: 800, letterSpacing: '-0.5px' }}>
                        {cvData.nom}
                      </h1>
                      <div style={{ fontSize: '1.15rem', color: selectedColor.hex, fontWeight: 700 }}>
                        {cvData.titre}
                      </div>
                    </div>

                    {/* Résumé / Profil */}
                    {cvData.resume && (
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <span style={{ width: '8px', height: '8px', background: selectedColor.hex, borderRadius: '50%' }}></span>
                          <span>Profil Professionnel</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>
                          {cvData.resume}
                        </p>
                      </div>
                    )}

                    {/* Expériences */}
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ width: '8px', height: '8px', background: selectedColor.hex, borderRadius: '50%' }}></span>
                        <span>Expériences & Stages</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        {cvData.experiences.map((exp) => (
                          <div key={exp.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.15rem' }}>
                              <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>{exp.poste}</span>
                              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{exp.periode}</span>
                            </div>
                            <div style={{ fontSize: '0.84rem', color: selectedColor.hex, fontWeight: 700, marginBottom: '0.35rem' }}>
                              {exp.entreprise}
                            </div>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                              {exp.missions}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Formations */}
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ width: '8px', height: '8px', background: selectedColor.hex, borderRadius: '50%' }}></span>
                        <span>Formations & Diplômes</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                        {cvData.formations.map((f) => (
                          <div key={f.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.15rem' }}>
                              <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{f.diplome}</span>
                              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{f.annee}</span>
                            </div>
                            <div style={{ fontSize: '0.82rem', color: selectedColor.hex, fontWeight: 700, marginBottom: '0.2rem' }}>
                              {f.etablissement}
                            </div>
                            {f.details && (
                              <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.45 }}>
                                {f.details}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ====================
                  MODÈLE 2 : ÉPURÉ MINIMALISTE (Haut Standing)
                  ==================== */}
              {selectedTemplate === 'template_classic' && (
                <div style={{ padding: '2.75rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '1123px' }}>
                  {/* En-tête centré épuré */}
                  <div style={{ textAlign: 'center', borderBottom: `2px solid ${selectedColor.hex}`, paddingBottom: '1.25rem' }}>
                    <h1 style={{ margin: '0 0 0.35rem 0', fontSize: '2.1rem', color: '#0f172a', fontWeight: 800 }}>
                      {cvData.nom}
                    </h1>
                    <div style={{ fontSize: '1.15rem', color: selectedColor.hex, fontWeight: 700, marginBottom: '0.65rem' }}>
                      {cvData.titre}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.82rem', color: '#475569' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <span>{cvData.email}</span>
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <span>{cvData.telephone}</span>
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{cvData.ville}</span>
                      </span>
                    </div>
                  </div>

                  {/* Résumé */}
                  {cvData.resume && (
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: selectedColor.hex, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.35rem' }}>
                        Profil
                      </div>
                      <p style={{ margin: 0, fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>
                        {cvData.resume}
                      </p>
                    </div>
                  )}

                  {/* Expériences */}
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: selectedColor.hex, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>
                      Expériences Professionnelles & Stages
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {cvData.experiences.map((exp) => (
                        <div key={exp.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>{exp.poste} — <em>{exp.entreprise}</em></span>
                            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{exp.periode}</span>
                          </div>
                          <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                            {exp.missions}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Formations */}
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: selectedColor.hex, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>
                      Formation Académique
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {cvData.formations.map((f) => (
                        <div key={f.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{f.diplome} — <em>{f.etablissement}</em></span>
                            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{f.annee}</span>
                          </div>
                          {f.details && <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>{f.details}</div>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compétences & Langues (Deux colonnes) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: selectedColor.hex, textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                        Compétences Clés
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {cvData.competences.map((c, i) => (
                          <span key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.76rem', color: '#1e293b' }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: selectedColor.hex, textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                        Langues & Atouts
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.78rem' }}>
                        {cvData.langues.map((l, i) => (
                          <div key={i}><strong>{l.nom} :</strong> {l.niveau}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ====================
                  MODÈLE 3 : TECH & COMPÉTENCES (Badges)
                  ==================== */}
              {selectedTemplate === 'template_tech' && (
                <div style={{ padding: '2.5rem', minHeight: '1123px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Header Tech avec bandeau coloré */}
                  <div style={{ background: selectedColor.hex, color: '#ffffff', padding: '1.5rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.85rem', fontWeight: 800, color: '#ffffff' }}>
                        {cvData.nom}
                      </h1>
                      <div style={{ fontSize: '1.1rem', opacity: 0.95, fontWeight: 600 }}>
                        {cvData.titre}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.82rem', opacity: 0.9, textAlign: 'right', lineHeight: 1.5 }}>
                      <div>{cvData.email}</div>
                      <div>{cvData.telephone}</div>
                      <div>{cvData.ville}</div>
                    </div>
                  </div>

                  {/* Résumé */}
                  {cvData.resume && (
                    <div style={{ background: '#f8fafc', borderLeft: `4px solid ${selectedColor.hex}`, padding: '0.85rem 1rem', borderRadius: '4px', fontSize: '0.84rem', color: '#334155', lineHeight: 1.55 }}>
                      {cvData.resume}
                    </div>
                  )}

                  {/* Compétences en vedette */}
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: selectedColor.hex, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Stack & Compétences Clés
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                      {cvData.competences.map((c, i) => (
                        <span
                          key={i}
                          style={{
                            background: selectedColor.light,
                            color: selectedColor.hex,
                            border: `1px solid ${selectedColor.border}`,
                            padding: '0.25rem 0.65rem',
                            borderRadius: '16px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expériences */}
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: selectedColor.hex, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>
                      Expériences & Projets Récents
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {cvData.experiences.map((exp) => (
                        <div key={exp.id} style={{ borderLeft: `2px solid ${selectedColor.border}`, paddingLeft: '0.85rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{exp.poste}</span>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{exp.periode}</span>
                          </div>
                          <div style={{ fontSize: '0.82rem', color: selectedColor.hex, fontWeight: 700, marginBottom: '0.25rem' }}>
                            {exp.entreprise}
                          </div>
                          <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                            {exp.missions}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Formations */}
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: selectedColor.hex, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>
                      Parcours Académique
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {cvData.formations.map((f) => (
                        <div key={f.id} style={{ borderLeft: `2px solid ${selectedColor.border}`, paddingLeft: '0.85rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>{f.diplome}</span>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{f.annee}</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: selectedColor.hex, fontWeight: 700 }}>
                            {f.etablissement}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FEUILLE LETTRE DE MOTIVATION A4 */}
          {activeMode === 'letter' && (
            <div
              id="letter-printable-sheet"
              className="cv-a4-sheet"
              style={{
                width: '100%',
                maxWidth: '794px', // Standard 210mm
                minHeight: '1123px', // Standard 297mm
                background: '#ffffff',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                borderRadius: '4px',
                padding: '3rem 2.75rem',
                fontFamily: selectedFont.family,
                color: '#1e293b',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* En-tête Expéditeur & Destinataire */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                  {/* Expéditeur */}
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: selectedColor.hex }}>
                      {letterData.expediteurNom}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.2rem', lineHeight: 1.45 }}>
                      <div>{letterData.expediteurEmail}</div>
                      <div>{letterData.expediteurTel}</div>
                      <div>{letterData.expediteurVille}</div>
                    </div>
                  </div>

                  {/* Destinataire & Date */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.85rem' }}>
                      {letterData.dateLieu}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                      {letterData.destinataireTitre}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                      {letterData.destinataireEntreprise}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      {letterData.destinataireVille}
                    </div>
                  </div>
                </div>

                {/* Objet */}
                <div style={{ background: selectedColor.light, borderLeft: `4px solid ${selectedColor.hex}`, padding: '0.65rem 0.95rem', borderRadius: '4px', marginBottom: '1.75rem' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: selectedColor.hex }}>
                    Objet : {letterData.objet}
                  </div>
                </div>

                {/* Salutation */}
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', marginBottom: '1.25rem' }}>
                  Madame, Monsieur,
                </div>

                {/* Paragraphes de la lettre */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', fontSize: '0.88rem', lineHeight: 1.65, color: '#334155', textAlign: 'justify' }}>
                  <p style={{ margin: 0 }}>
                    {letterData.intro}
                  </p>
                  <p style={{ margin: 0 }}>
                    {letterData.vous}
                  </p>
                  <p style={{ margin: 0 }}>
                    {letterData.moi}
                  </p>
                  <p style={{ margin: 0 }}>
                    {letterData.nous}
                  </p>
                  <p style={{ margin: 0 }}>
                    {letterData.formulePolitesse}
                  </p>
                </div>
              </div>

              {/* Signature */}
              <div style={{ marginTop: '2.5rem', textAlign: 'right' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                  {letterData.expediteurNom}
                </div>
                <div style={{ fontSize: '0.82rem', color: selectedColor.hex, fontStyle: 'italic', marginTop: '0.2rem' }}>
                  Candidat(e) e-HARI
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
