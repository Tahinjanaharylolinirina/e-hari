import React, { useState } from 'react';

/**
 * Guide Détaillé & Cadre Général des Stages à Madagascar
 * Vue 'etudiant_insertion'
 * 
 * Présente de manière informative et objective :
 * - Le cadre général des stages à Madagascar (Convention tripartite, indemnités, formats)
 * - Une feuille de route interactive avec sauvegarde de session (localStorage)
 * - Un guide pas-à-pas détaillé fourni par le système pour chaque étape
 */

export default function StudentInsertionView({
  currentUser,
}) {
  const nomComplet = [currentUser?.use_pre, currentUser?.use_nom].filter(Boolean).join(' ') || 'Étudiant';
  const filiere = currentUser?.profil?.etu_fil || currentUser?.profil?.etud_fili || 'Enseignement Supérieur';
  const etablissement = currentUser?.profil?.etu_eta || currentUser?.profil?.etud_etab || 'Université / Faculté';
  const niveau = currentUser?.profil?.etu_niv_etu || currentUser?.profil?.etud_nive_etud || 'Licence';

  // 1. Sauvegarde persistante de la progression de session
  const checklistStorageKey = `hari_stage_guide_progress_${currentUser?.id || currentUser?.use_id || 'guest'}`;

  const defaultSteps = [
    {
      id: 'step_cv',
      numero: 1,
      titre: 'CV moderne & synthétique rédigé',
      descriptionCourte: '1 page claire, photo professionnelle sobre, mise en valeur des projets académiques et compétences clés.',
      checked: false,
    },
    {
      id: 'step_lettre',
      numero: 2,
      titre: 'Message d\'intérêt & lettre personnalisée',
      descriptionCourte: 'Message d\'approche court ciblé pour chaque entreprise (méthode Vous - Moi - Nous).',
      checked: false,
    },
    {
      id: 'step_convention',
      numero: 3,
      titre: 'Convention de stage tripartite prête à signer',
      descriptionCourte: 'Document officiel délivré par l\'université, à faire signer par l\'établissement, l\'entreprise et le stagiaire.',
      checked: false,
    },
    {
      id: 'step_dossier',
      numero: 4,
      titre: 'Dossier administratif complet',
      descriptionCourte: 'Attestation d\'inscription en cours, relevés de notes récents, copie certifiée CIN et convention.',
      checked: false,
    },
    {
      id: 'step_pitch',
      numero: 5,
      titre: 'Pitch oral de 2 minutes préparé',
      descriptionCourte: 'Présentation structurée (« Qui suis-je, mes atouts, pourquoi votre entreprise ») pour l\'entretien.',
      checked: false,
    },
  ];

  const [steps, setSteps] = useState(() => {
    try {
      const saved = localStorage.getItem(checklistStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 5) {
          return defaultSteps.map((s) => {
            const match = parsed.find((p) => p.id === s.id);
            return match ? { ...s, checked: Boolean(match.checked) } : s;
          });
        }
      }
    } catch (e) {
      // Ignorer
    }
    return defaultSteps;
  });

  // Étape actuellement ouverte dans le guide détaillé (par défaut l'étape 1)
  const [openedStepId, setOpenedStepId] = useState('step_cv');

  // État du générateur de modèle d'email (Étape 2)
  const [modelTypeStage, setModelTypeStage] = useState('Stage de Fin d\'Études (PFE)');
  const [modelDuree, setModelDuree] = useState('3 à 6 mois');
  const [modelSecteur, setModelSecteur] = useState('votre entreprise');
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Basculer l'état coché/non coché d'une étape
  const toggleStep = (id, e) => {
    if (e) e.stopPropagation();
    const updated = steps.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s));
    setSteps(updated);
    try {
      localStorage.setItem(checklistStorageKey, JSON.stringify(updated));
    } catch (err) {
      // Ignorer
    }
  };

  // Progression en pourcentage
  const validatedCount = steps.filter((s) => s.checked).length;
  const progressPercent = Math.round((validatedCount / steps.length) * 100);

  // Modèle d'email généré dynamiquement
  const sampleEmailBody = `Madame, Monsieur le Responsable du Recrutement,

Actuellement étudiant(e) en ${niveau} - ${filiere} au sein de l'établissement ${etablissement}, je sollicite une opportunité de ${modelTypeStage} d'une durée de ${modelDuree} auprès de ${modelSecteur}.

Au cours de mon cursus universitaire, j'ai développé des compétences méthodologiques et pratiques solides, notamment à travers la réalisation de projets académiques et le travail en équipe. Rejoindre votre structure me permettrait d'apporter mon dynamisme et ma rigueur tout en contribuant activement à vos missions opérationnelles.

Ce stage fera l'objet d'une convention tripartite délivrée par mon établissement universitaire garantissant le cadre régulier et légal de mon immersion.

Je reste à votre entière disposition pour tout entretien d'échange ou pour vous transmettre mon curriculum vitae ainsi que mon dossier académique.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${nomComplet}
${filiere} — ${etablissement}
${currentUser?.use_ema ? `Email : ${currentUser.use_ema}` : ''}
${currentUser?.use_tel ? `Téléphone : ${currentUser.use_tel}` : ''}`;

  const handleCopyModel = () => {
    navigator.clipboard.writeText(sampleEmailBody).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 3000);
    });
  };

  return (
    <div className="student-insertion-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. EN-TÊTE INFORMATIF GÉNÉRAL */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
          border: '1px solid #dbeafe',
          borderLeft: '5px solid #2563eb',
          borderRadius: '14px',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
          <span style={{ color: '#2563eb', display: 'inline-flex' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
              <path d="M6 10h7" />
            </svg>
          </span>
          <h1 style={{ margin: 0, fontSize: '1.35rem', color: '#1e3a8a', fontWeight: 800 }}>
            Guide & Préparation aux Stages à Madagascar
          </h1>
        </div>
        <p style={{ margin: 0, color: '#475569', fontSize: '0.92rem', lineHeight: 1.55, maxWidth: '850px' }}>
          Consultez les règles légales et administratives indispensables aux stages d'enseignement supérieur à Madagascar.
          Suivez la feuille de route pas-à-pas pour constituer un dossier irréprochable et préparer efficacement vos démarches auprès des recruteurs.
        </p>
      </div>

      {/* 2. SECTION INTRODUCTION & CADRE GÉNÉRAL INFORMATIF À MADAGASCAR */}
      <div className="card" style={{ padding: '1.5rem', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: '0 0 0.35rem 0', fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
            Cadre Général des Stages en Milieu Professionnel à Madagascar
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5 }}>
            À Madagascar, le stage universitaire s'inscrit dans un cadre académique et pédagogique précis, distinct du contrat de travail de droit commun. Voici les fondamentaux à connaître :
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.25rem' }}>
          {/* Bloc A : Formats de stage */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid #2563eb' }}>
            <h3 style={{ margin: '0 0 0.6rem 0', fontSize: '0.98rem', color: '#1d4ed8', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span>1. Les Formats de Stage Universitaire</span>
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#334155', fontSize: '0.86rem', lineHeight: 1.6 }}>
              <li>
                <strong>Stage d'Observation (L1 / L2) :</strong> Durée de 1 à 2 mois. Découverte de l'organisation, des flux de travail et des métiers.
              </li>
              <li>
                <strong>Stage d'Application (L3) :</strong> Durée de 2 à 3 mois. Prise en charge de tâches opérationnelles réelles, indispensable à la validation de la Licence.
              </li>
              <li>
                <strong>Stage de Fin d'Études / PFE (Master 1 & 2) :</strong> Durée de 4 à 6 mois. Traitement d'un projet d'envergure, mémoire universitaire et soutenance académique.
              </li>
            </ul>
          </div>

          {/* Bloc B : Convention Tripartite (Mise en avant selon la consigne de l'utilisateur) */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid #16a34a' }}>
            <h3 style={{ margin: '0 0 0.6rem 0', fontSize: '0.98rem', color: '#15803d', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span>2. Convention Tripartite Obligatoire</span>
            </h3>
            <p style={{ margin: '0 0 0.45rem 0', color: '#334155', fontSize: '0.86rem', lineHeight: 1.5 }}>
              À Madagascar, tout stage régulier doit obligatoirement faire l'objet d'une convention tripartite signée par :
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#1e293b', fontSize: '0.86rem', lineHeight: 1.55 }}>
              <li><strong>Le Responsable de votre Établissement Universitaire / Faculté</strong></li>
              <li><strong>Le Représentant Légal de l'Entreprise d'Accueil (ou DRH)</strong></li>
              <li><strong>Vous-même en qualité de stagiaire</strong></li>
            </ul>
            <div style={{ marginTop: '0.6rem', padding: '0.5rem 0.65rem', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0', fontSize: '0.8rem', color: '#065f46', lineHeight: 1.45 }}>
              Cette convention garantit votre couverture en cas d'accident du travail ou de trajet et désigne obligatoirement le tuteur de stage en entreprise.
            </div>
          </div>

          {/* Bloc C : Indemnité de Stage & Transport (Mise en avant selon la consigne de l'utilisateur) */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid #d97706' }}>
            <h3 style={{ margin: '0 0 0.6rem 0', fontSize: '0.98rem', color: '#b45309', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span>3. Indemnité de Stage & Frais de Transport</span>
            </h3>
            <p style={{ margin: '0 0 0.45rem 0', color: '#334155', fontSize: '0.86rem', lineHeight: 1.5 }}>
              Bien que le code du travail n'impose pas de salaire complet pour les stages scolaires, la pratique courante des entreprises prévoit :
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#1e293b', fontSize: '0.86rem', lineHeight: 1.55 }}>
              <li>La prise en charge des <strong>frais de transport</strong> ou l'accès aux navettes d'entreprise</li>
              <li>Une <strong>indemnité de stage / repas</strong> mensuelle pour les stages de plus de 2 mois</li>
              <li>La possibilité d'un <strong>contrat de travail (CDD / CDI)</strong> à l'issue d'un PFE réussi</li>
            </ul>
            <div style={{ marginTop: '0.6rem', padding: '0.5rem 0.65rem', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '0.8rem', color: '#92400e', lineHeight: 1.45 }}>
              Le stage de fin d'études constitue le principal vivier de recrutement pour les entreprises malgaches.
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECTION FEUILLE DE ROUTE & PROGRESSION (JAUGE INTERACTIVE) */}
      <div className="card" style={{ padding: '1.5rem', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Suivi Opérationnel de l'Étudiant
            </span>
            <h2 style={{ margin: '0.2rem 0 0.35rem 0', fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>
              Feuille de Route : Vos 5 Étapes vers le Stage
            </h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
              Cochez chaque étape franchie. Votre progression est automatiquement enregistrée sur votre session.
            </p>
          </div>

          {/* Affichage chiffré */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.65rem 1.15rem', textAlign: 'right', minWidth: '170px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: progressPercent === 100 ? '#16a34a' : '#2563eb' }}>
              {progressPercent}%
            </div>
            <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700 }}>
              {validatedCount} sur {steps.length} étapes validées
            </div>
          </div>
        </div>

        {/* Barre de progression visuelle */}
        <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: progressPercent === 100 ? 'linear-gradient(90deg, #16a34a, #22c55e)' : 'linear-gradient(90deg, #2563eb, #3b82f6)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Message de complétion si 100% */}
        {progressPercent === 100 && (
          <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.96rem' }}>Félicitations ! Toutes les étapes sont validées.</div>
              <div style={{ fontSize: '0.84rem', color: '#166534' }}>Votre dossier administratif est complet et votre pitch d'entretien est prêt pour répondre aux opportunités d'insertion.</div>
            </div>
          </div>
        )}

        {/* Liste des 5 étapes (Clic pour ouvrir le guide complet de l'étape) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {steps.map((s) => {
            const isOpened = openedStepId === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setOpenedStepId(isOpened ? null : s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.9rem 1.15rem',
                  borderRadius: '10px',
                  background: isOpened ? '#eff6ff' : s.checked ? '#f0fdf4' : '#f8fafc',
                  border: isOpened ? '1.5px solid #93c5fd' : s.checked ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                {/* Checkbox moderne et Titre */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '240px' }}>
                  <div
                    role="checkbox"
                    aria-checked={s.checked}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStep(s.id, e);
                    }}
                    title={s.checked ? 'Cliquer pour décocher' : 'Cliquer pour valider cette étape'}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      border: s.checked ? '2px solid #16a34a' : '2px solid #cbd5e1',
                      background: s.checked ? '#16a34a' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.18s ease',
                      boxShadow: s.checked ? '0 2px 4px rgba(22, 163, 74, 0.25)' : 'none',
                    }}
                  >
                    {s.checked && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.15rem' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: s.checked ? '#15803d' : '#64748b', textTransform: 'uppercase' }}>
                        Étape {s.numero}
                      </span>
                      {s.checked && (
                        <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', padding: '0.15rem 0.5rem', borderRadius: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Validée</span>
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.92rem', color: s.checked ? '#166534' : '#0f172a', fontWeight: 700 }}>
                      {s.titre}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.1rem' }}>
                      {s.descriptionCourte}
                    </div>
                  </div>
                </div>

                {/* Bouton pour consulter le guide de l'étape */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isOpened ? '#1d4ed8' : '#64748b' }}>
                    {isOpened ? 'Masquer le guide' : 'Consulter le guide'}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isOpened ? '#1d4ed8' : '#64748b'}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transform: isOpened ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. LE GUIDE DÉTAILLÉ FOURNI PAR LE SYSTÈME POUR L'ÉTAPE SÉLECTIONNÉE */}
      {openedStepId && (
        <div className="card" style={{ padding: '1.75rem', borderRadius: '14px', background: '#ffffff', border: '1.5px solid #bfdbfe' }}>
          {/* ========================================================
              GUIDE DÉTAILLÉ : ÉTAPE 1 (CV)
              ======================================================== */}
          {openedStepId === 'step_cv' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase' }}>
                    Guide Détaillé Système • Étape 1
                  </span>
                  <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.25rem', color: '#1e3a8a', fontWeight: 800 }}>
                    Rédiger un CV Moderne, Synthétique & Percutant (1 Page)
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => toggleStep('step_cv')}
                  style={{
                    background: steps[0].checked ? '#dcfce7' : '#2563eb',
                    color: steps[0].checked ? '#15803d' : '#ffffff',
                    border: 'none',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  {steps[0].checked ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Étape Validée</span>
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                      </svg>
                      <span>Marquer comme validée</span>
                    </>
                  )}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                {/* Les 5 sections indispensables */}
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ margin: '0 0 0.65rem 0', fontSize: '0.96rem', color: '#0f172a', fontWeight: 800 }}>
                    1. La Structure Standardisée d'un CV Étudiant
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: '#334155' }}>
                    <div>
                      <strong style={{ color: '#1e3a8a' }}>A. En-tête sobre :</strong> Nom, Prénom, Numéro de téléphone joignable, Adresse email professionnelle (ex: <em>prenom.nom@gmail.com</em>), Ville de résidence (ex: <em>Antananarivo</em>).
                    </div>
                    <div>
                      <strong style={{ color: '#1e3a8a' }}>B. Titre de recherche :</strong> Une ligne claire sous votre nom, ex : <em>« Étudiant en {niveau} {filiere} — Recherche de stage conventionné ({modelDuree}) »</em>.
                    </div>
                    <div>
                      <strong style={{ color: '#1e3a8a' }}>C. Formation & Cursus :</strong> Diplôme préparé, nom exact de l'établissement ({etablissement}), cours clés et mentions éventuelles.
                    </div>
                    <div>
                      <strong style={{ color: '#1e3a8a' }}>D. Projets Académiques & Réalisations :</strong> Si vous n'avez pas encore d'expérience formelle, détaillez 2 ou 3 projets d'études concrets (exposés majeurs, logiciels créés, analyses de données, rapports de travaux pratiques).
                    </div>
                    <div>
                      <strong style={{ color: '#1e3a8a' }}>E. Compétences & Outils :</strong> Outils informatiques, logiciels métiers (Excel, programmation, comptabilité, gestion), niveau de langues (Malagasy, Français professionnel, Anglais).
                    </div>
                  </div>
                </div>

                {/* Bonnes pratiques Do's & Don'ts */}
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ margin: '0 0 0.65rem 0', fontSize: '0.96rem', color: '#0f172a', fontWeight: 800 }}>
                    2. Règles d'Or des Recruteurs
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '0.75rem' }}>
                      <div style={{ color: '#15803d', fontWeight: 800, fontSize: '0.84rem', marginBottom: '0.35rem' }}>À FAIRE (DO)</div>
                      <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', color: '#065f46', lineHeight: 1.5 }}>
                        <li>Tenir sur <strong>1 seule page A4</strong>.</li>
                        <li>Exporter impérativement en format <strong>PDF</strong>.</li>
                        <li>Nommer le fichier proprement : <em>CV_Nom_Prenom_{filiere}.pdf</em>.</li>
                        <li>Relire à deux pour <strong>zéro faute</strong> d'orthographe.</li>
                      </ul>
                    </div>

                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem' }}>
                      <div style={{ color: '#b91c1c', fontWeight: 800, fontSize: '0.84rem', marginBottom: '0.35rem' }}>À ÉVITER (DON'T)</div>
                      <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', color: '#7f1d1d', lineHeight: 1.5 }}>
                        <li>Envoyer un fichier Word modifiable (.docx).</li>
                        <li>Mettre une photo de vacances ou non professionnelle.</li>
                        <li>Écrire de longs paragraphes narratifs non aérés.</li>
                        <li>Indiquer des informations trop intimes ou inutiles.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              GUIDE DÉTAILLÉ : ÉTAPE 2 (LETTRE & MESSAGE D'INTÉRÊT)
              ======================================================== */}
          {openedStepId === 'step_lettre' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase' }}>
                    Guide Détaillé Système • Étape 2
                  </span>
                  <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.25rem', color: '#1e3a8a', fontWeight: 800 }}>
                    Message d'Intérêt : La Méthode « Vous - Moi - Nous »
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => toggleStep('step_lettre')}
                  style={{
                    background: steps[1].checked ? '#dcfce7' : '#2563eb',
                    color: steps[1].checked ? '#15803d' : '#ffffff',
                    border: 'none',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  {steps[1].checked ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Étape Validée</span>
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                      </svg>
                      <span>Marquer comme validée</span>
                    </>
                  )}
                </button>
              </div>

              {/* Explication de la méthode */}
              <div style={{ background: '#f8fafc', padding: '1.15rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.96rem', color: '#0f172a', fontWeight: 800 }}>
                  Pourquoi un message d'email direct est plus efficace qu'une longue lettre de 2 pages ?
                </h3>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                  Les recruteurs et chefs de service reçoivent des dizaines de candidatures chaque semaine. Un message clair, concis et directement intégré dans le corps de votre email (avec votre CV en pièce jointe) capte immédiatement leur attention en 20 secondes.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid #2563eb' }}>
                    <div style={{ fontWeight: 800, color: '#1d4ed8', fontSize: '0.84rem' }}>1. VOUS (L'Entreprise)</div>
                    <div style={{ fontSize: '0.8rem', color: '#334155', marginTop: '0.2rem' }}>Mentionner ce qui vous intéresse dans leur secteur, leurs réalisations ou leurs projets.</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid #16a34a' }}>
                    <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.84rem' }}>2. MOI (Votre profil)</div>
                    <div style={{ fontSize: '0.8rem', color: '#334155', marginTop: '0.2rem' }}>Présenter votre filière actuelle, vos compétences concrètes et la durée exacte de votre stage.</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid #d97706' }}>
                    <div style={{ fontWeight: 800, color: '#b45309', fontSize: '0.84rem' }}>3. NOUS (La Collaboration)</div>
                    <div style={{ fontSize: '0.8rem', color: '#334155', marginTop: '0.2rem' }}>Proposer votre contribution opérationnelle et solliciter poliment un entretien d'échange.</div>
                  </div>
                </div>
              </div>

              {/* Générateur interactif de modèle d'email */}
              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.94rem', color: '#1e3a8a', fontWeight: 800 }}>
                    Générateur de Modèle de Candidature Prêt à l'Envoi
                  </h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <select
                      className="form-control"
                      value={modelTypeStage}
                      onChange={(e) => setModelTypeStage(e.target.value)}
                      style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                    >
                      <option value="Stage de Fin d'Études (PFE)">Stage de Fin d'Études (PFE)</option>
                      <option value="Stage d'Application (Licence 3)">Stage d'Application (Licence 3)</option>
                      <option value="Stage d'Observation (L1 / L2)">Stage d'Observation (L1/L2)</option>
                    </select>

                    <select
                      className="form-control"
                      value={modelDuree}
                      onChange={(e) => setModelDuree(e.target.value)}
                      style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
                    >
                      <option value="1 à 2 mois">1 à 2 mois</option>
                      <option value="3 mois">3 mois</option>
                      <option value="3 à 6 mois">3 à 6 mois</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '0.65rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nom de l'entreprise ou structure ciblée (ex: Société Logistique, Cabinet d'Audit...)"
                    value={modelSecteur}
                    onChange={(e) => setModelSecteur(e.target.value)}
                    style={{ width: '100%', fontSize: '0.84rem' }}
                  />
                </div>

                {/* Boîte de texte du modèle */}
                <textarea
                  rows={10}
                  readOnly
                  value={sampleEmailBody}
                  style={{
                    width: '100%',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    fontSize: '0.84rem',
                    fontFamily: 'monospace',
                    color: '#334155',
                    lineHeight: 1.5,
                    boxSizing: 'border-box',
                    resize: 'none',
                    marginBottom: '0.75rem',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleCopyModel}
                    style={{
                      background: copyFeedback ? '#16a34a' : '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.55rem 1.15rem',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>{copyFeedback ? 'Copié dans le presse-papier !' : 'Copier ce modèle d\'email'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              GUIDE DÉTAILLÉ : ÉTAPE 3 (CONVENTION TRIPARTITE)
              ======================================================== */}
          {openedStepId === 'step_convention' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase' }}>
                    Guide Détaillé Système • Étape 3
                  </span>
                  <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.25rem', color: '#1e3a8a', fontWeight: 800 }}>
                    La Convention Tripartite : Démarches & Circuit de Signature
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => toggleStep('step_convention')}
                  style={{
                    background: steps[2].checked ? '#dcfce7' : '#2563eb',
                    color: steps[2].checked ? '#15803d' : '#ffffff',
                    border: 'none',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  {steps[2].checked ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Étape Validée</span>
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                      </svg>
                      <span>Marquer comme validée</span>
                    </>
                  )}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem', color: '#334155' }}>
                <p style={{ margin: 0, lineHeight: 1.55 }}>
                  La convention tripartite est le <strong>contrat juridique officiel</strong> liant l'établissement d'enseignement supérieur, l'organisme d'accueil et le stagiaire. Sans cette convention, un stage ne peut être reconnu dans le cursus universitaire.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 800, color: '#1d4ed8', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                      Étape 1 : Retrait du document
                    </div>
                    <p style={{ margin: 0, fontSize: '0.83rem', color: '#475569', lineHeight: 1.5 }}>
                      Retirez le formulaire type de convention auprès du secrétariat pédagogique ou du bureau des stages de votre faculté ({etablissement}). Le document est généralement édité en 3 exemplaires originaux.
                    </p>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 800, color: '#1d4ed8', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                      Étape 2 : Signature de l'Entreprise
                    </div>
                    <p style={{ margin: 0, fontSize: '0.83rem', color: '#475569', lineHeight: 1.5 }}>
                      Une fois l'accord de stage obtenu, faites compléter les dates de début/fin, les missions confiées et le nom du <strong>maître de stage</strong>. L'entreprise doit apposer son cachet officiel et la signature du DRH ou gérant.
                    </p>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 800, color: '#1d4ed8', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                      Étape 3 : Visa Universitaire & Signature Stagiaire
                    </div>
                    <p style={{ margin: 0, fontSize: '0.83rem', color: '#475569', lineHeight: 1.5 }}>
                      Déposez les exemplaires signés à votre faculté pour visa et validation par le Doyen ou Chef de département. Signez votre exemplaire et remettez un exemplaire original à l'entreprise le premier jour.
                    </p>
                  </div>
                </div>

                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '1rem', color: '#065f46', fontSize: '0.85rem' }}>
                  <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Protection en cas d'accident du travail :</strong>
                  La signature de la convention tripartite garantit que l'étudiant reste couvert par l'assurance responsabilité civile scolaire/universitaire et permet la prise en charge immédiate en cas d'incident sur le lieu de stage ou lors du trajet direct domicile-travail.
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              GUIDE DÉTAILLÉ : ÉTAPE 4 (DOSSIER ADMINISTRATIF)
              ======================================================== */}
          {openedStepId === 'step_dossier' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase' }}>
                    Guide Détaillé Système • Étape 4
                  </span>
                  <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.25rem', color: '#1e3a8a', fontWeight: 800 }}>
                    Constitution du Dossier Administratif Complet
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => toggleStep('step_dossier')}
                  style={{
                    background: steps[3].checked ? '#dcfce7' : '#2563eb',
                    color: steps[3].checked ? '#15803d' : '#ffffff',
                    border: 'none',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  {steps[3].checked ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Étape Validée</span>
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                      </svg>
                      <span>Marquer comme validée</span>
                    </>
                  )}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.55 }}>
                  Avant de débuter votre stage ou lors du premier entretien avec le service des ressources humaines, vous devez impérativement disposer d'un dossier administratif à jour. Voici les 4 pièces exigées à Madagascar :
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      1. Certificat de Scolarité Récent
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                      Attestation d'inscription pour l'année universitaire en cours, certifiant votre statut d'étudiant régulier auprès de votre faculté ({etablissement}).
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      2. Relevés de Notes Académiques
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                      Copie des relevés de notes des deux derniers semestres validés. Cela démontre votre assiduité et vos forces dans les matières clés de la filière.
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      3. Copie Certifiée de la CIN
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                      Photocopie légalisée de votre Carte d'Identité Nationale (ou passeport pour les étudiants internationaux) en cours de validité.
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      4. Exemplaires de la Convention
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                      Les originaux dûment complétés et signés, prêts pour le classement au registre du personnel et auprès de l'administration universitaire.
                    </div>
                  </div>
                </div>

                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '0.85rem 1rem', fontSize: '0.84rem', color: '#1e40af' }}>
                  <strong>Conseil d'organisation :</strong> Conservez une version numérisée en format PDF propre de chacune de ces pièces sur votre smartphone ou stockage cloud. Vous pourrez ainsi les transférer instantanément si un recruteur vous les demande par email.
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              GUIDE DÉTAILLÉ : ÉTAPE 5 (PITCH ORAL 2 MIN & ENTRETIEN)
              ======================================================== */}
          {openedStepId === 'step_pitch' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase' }}>
                    Guide Détaillé Système • Étape 5
                  </span>
                  <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.25rem', color: '#1e3a8a', fontWeight: 800 }}>
                    Préparation de l'Entretien : Le Pitch de 2 Minutes Chrono
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => toggleStep('step_pitch')}
                  style={{
                    background: steps[4].checked ? '#dcfce7' : '#2563eb',
                    color: steps[4].checked ? '#15803d' : '#ffffff',
                    border: 'none',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  {steps[4].checked ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Étape Validée</span>
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                      </svg>
                      <span>Marquer comme validée</span>
                    </>
                  )}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Découpage minute par minute */}
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.96rem', color: '#0f172a', fontWeight: 800 }}>
                    La Structure Gagnante du Pitch de 2 Minutes
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <span style={{ background: '#2563eb', color: '#ffffff', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.74rem', fontWeight: 800, flexShrink: 0 }}>
                        0:00 - 0:30
                      </span>
                      <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.45 }}>
                        <strong>Qui suis-je :</strong> Présentez votre nom, votre cursus universitaire actuel ({niveau} - {filiere} à {etablissement}) et l'objectif de votre démarche de stage.
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <span style={{ background: '#2563eb', color: '#ffffff', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.74rem', fontWeight: 800, flexShrink: 0 }}>
                        0:30 - 1:15
                      </span>
                      <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.45 }}>
                        <strong>Mes Atouts & Compétences :</strong> Citez 2 projets académiques récents ou compétences clés maîtrisées (outils logiciels, rigueur d'analyse, résolution de problèmes).
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <span style={{ background: '#2563eb', color: '#ffffff', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.74rem', fontWeight: 800, flexShrink: 0 }}>
                        1:15 - 1:45
                      </span>
                      <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.45 }}>
                        <strong>Pourquoi votre entreprise :</strong> Montrez que vous connaissez les activités de l'entreprise et expliquez en quoi ses missions font écho à votre projet professionnel.
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <span style={{ background: '#2563eb', color: '#ffffff', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.74rem', fontWeight: 800, flexShrink: 0 }}>
                        1:45 - 2:00
                      </span>
                      <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.45 }}>
                        <strong>Conclusion & Ouverture :</strong> Réaffirmez votre disponibilité, votre motivation à apprendre et ouvrez vers les questions du recruteur.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Les 4 questions types posées en entretien de stage */}
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.96rem', color: '#0f172a', fontWeight: 800 }}>
                    Les 4 Questions Types Posées en Entretien de Stage
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#1e3a8a', marginBottom: '0.2rem' }}>
                        1. « Parlez-moi de vous ? »
                      </div>
                      <div style={{ fontSize: '0.79rem', color: '#475569', lineHeight: 1.45 }}>
                        Répondez avec votre pitch chronométré en mettant l'accent sur votre parcours académique et votre motivation.
                      </div>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#1e3a8a', marginBottom: '0.2rem' }}>
                        2. « Pourquoi postuler chez nous ? »
                      </div>
                      <div style={{ fontSize: '0.79rem', color: '#475569', lineHeight: 1.45 }}>
                        Mettez en avant un aspect précis de l'entreprise (notoriété, projets innovants, secteur d'activité, valeurs).
                      </div>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#1e3a8a', marginBottom: '0.2rem' }}>
                        3. « Vos points forts et à améliorer ? »
                      </div>
                      <div style={{ fontSize: '0.79rem', color: '#475569', lineHeight: 1.45 }}>
                        Soyez authentique : valorisez la rigueur ou l'adaptabilité, et présentez une marge de progression liée à votre apprentissage.
                      </div>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#1e3a8a', marginBottom: '0.2rem' }}>
                        4. « Avez-vous des questions pour nous ? »
                      </div>
                      <div style={{ fontSize: '0.79rem', color: '#475569', lineHeight: 1.45 }}>
                        Posez toujours au moins 1 question sur les équipes, le déroulement type d'une journée de stage ou les outils utilisés.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
