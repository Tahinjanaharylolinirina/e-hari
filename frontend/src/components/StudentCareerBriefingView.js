import React from 'react';
import { generateStudentCareerBriefing } from '../data/studentCareerBriefing';

export default function StudentCareerBriefingView({
  currentUser,
  onStartTest1,
  onStartTest2,
  getStudentOriPro1,
  getStudentOriPro2,
  getStudentNiveau,
  getStudentFiliere,
  getStudentEtablissement,
}) {
  const ori1 = getStudentOriPro1 ? getStudentOriPro1(currentUser) : currentUser?.profil?.etu_ori_pro_1 || '';
  const ori2 = getStudentOriPro2 ? getStudentOriPro2(currentUser) : currentUser?.profil?.etu_ori_pro_2 || '';
  const niveau = getStudentNiveau ? getStudentNiveau(currentUser) : currentUser?.profil?.etu_niv_etu || currentUser?.profil?.etud_nive_etud || 'Licence';
  const filiere = getStudentFiliere ? getStudentFiliere(currentUser) : currentUser?.profil?.etu_fil || currentUser?.profil?.etud_fili || 'Enseignement Supérieur';
  const etablissement = getStudentEtablissement ? getStudentEtablissement(currentUser) : currentUser?.profil?.etu_eta || currentUser?.profil?.etud_etab || 'Université';

  const hasTest1 = Boolean(ori1);
  const hasTest2 = Boolean(ori2);
  const isComplete = hasTest1 && hasTest2;

  const briefing = generateStudentCareerBriefing({
    personalityKeyOrLabel: ori1,
    poleKeyOrLabel: ori2,
    studentNiveau: niveau,
    studentFiliere: filiere,
    studentEtablissement: etablissement,
  });

  const personalityData = briefing?.personalityData || {};
  const poleData = briefing?.poleData || {};
  const stageConseil = briefing?.stageConseil || '';

  return (
    <div className="student-briefing-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. ÉTAT INCOMPLET : AU MOINS UN DES DEUX TESTS N'EST PAS ENCORE VALIDÉ */}
      {!isComplete && (
        <div
          className="card"
          style={{
            borderLeft: '5px solid #f59e0b',
            background: '#fffbeb',
            padding: '1.5rem',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
            <span className="account-icon" style={{ fontSize: '2rem' }}>🎯</span>
            <div>
              <h3 style={{ margin: 0, color: '#92400e', fontSize: '1.25rem', fontWeight: 800 }}>
                Votre Bilan & Conseil Carrière est en attente
              </h3>
              <p style={{ margin: '0.25rem 0 0 0', color: '#b45309', fontSize: '0.9rem' }}>
                Pour générer votre feuille de route d'insertion professionnelle personnalisée, veuillez compléter les 2 tests d'évaluation e-HARI :
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
            <div
              style={{
                background: '#ffffff',
                border: `1.5px solid ${hasTest1 ? '#86efac' : '#cbd5e1'}`,
                borderRadius: '10px',
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.95rem' }}>
                    1. Test de Personnalité Professionnelle
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '12px', background: hasTest1 ? '#dcfce7' : '#f1f5f9', color: hasTest1 ? '#166534' : '#64748b' }}>
                    {hasTest1 ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Complété</span>
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>À faire</span>
                      </span>
                    )}
                  </span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#475569', margin: '0 0 0.85rem 0', lineHeight: 1.45 }}>
                  Identifie votre style de travail, vos affinités de carrière et votre posture professionnelle idéale.
                </p>
              </div>
              {hasTest1 ? (
                <button
                  type="button"
                  className="action-icon-btn action-edit"
                  onClick={onStartTest1}
                  title="Modifier le Test 1"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={onStartTest1}
                  style={{ fontWeight: 700 }}
                >
                  Passer le Test 1 (7 questions)
                </button>
              )}
            </div>

            <div
              style={{
                background: '#ffffff',
                border: `1.5px solid ${hasTest2 ? '#86efac' : '#cbd5e1'}`,
                borderRadius: '10px',
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.95rem' }}>
                    2. Test des Domaines & Aptitudes Clés
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '12px', background: hasTest2 ? '#dcfce7' : '#f1f5f9', color: hasTest2 ? '#166534' : '#64748b' }}>
                    {hasTest2 ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Complété</span>
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>À faire</span>
                      </span>
                    )}
                  </span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#475569', margin: '0 0 0.85rem 0', lineHeight: 1.45 }}>
                  Évalue vos disciplines d'excellence et vos 6 aptitudes opérationnelles les plus recherchées par les recruteurs.
                </p>
              </div>
              {hasTest2 ? (
                <button
                  type="button"
                  className="action-icon-btn action-edit"
                  onClick={onStartTest2}
                  title="Modifier le Test 2"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={onStartTest2}
                  style={{ fontWeight: 700 }}
                >
                  Passer le Test 2 (Compétences)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. EN-TÊTE DU BILAN COMPLET */}
      {isComplete && (
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            color: '#ffffff',
            padding: '1.75rem',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.15)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ maxWidth: '650px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                <span className="role-chip etudiant" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700, fontSize: '0.8rem', padding: '0.2rem 0.65rem', borderRadius: '12px' }}>
                  {niveau} • {filiere}
                </span>
                <span style={{ fontSize: '0.8rem', opacity: 0.9, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{etablissement}</span>
                </span>
              </div>
              <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.3px', color: '#ffffff' }}>
                Feuille de Route d'Insertion Professionnelle e-HARI
              </h1>
              <p style={{ margin: 0, fontSize: '0.92rem', opacity: 0.92, lineHeight: 1.5 }}>
                Synthèse croisée de votre profil de personnalité professionnelle (<strong>{personalityData.label}</strong>) et de votre trajectoire de spécialisation (<strong>{poleData.title}</strong>).
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => window.print()}
                style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span>Imprimer mon Bilan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DOUBLE CARTES DE DIAGNOSTIC (TEST 1 & TEST 2) */}
      {isComplete && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {/* CARTE TEST 1 : PERSONNALITÉ PROFESSIONNELLE */}
          <div
            className="card"
            style={{
              borderRadius: '14px',
              border: `1.5px solid ${personalityData.borderColor}`,
              background: '#ffffff',
              padding: '1.4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '2rem' }}>{personalityData.icon}</span>
                <div>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', fontWeight: 800 }}>
                    Test 1 • Style de Travail & Posture Pro
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: personalityData.color, fontWeight: 800 }}>
                    {personalityData.label}
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, marginBottom: '1.1rem' }}>
                {personalityData.description}
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <span>Vos 4 Forces Professionnelles Majeures :</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {(personalityData.forces || []).map((f, i) => (
                    <div key={i} style={{ fontSize: '0.84rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: `${personalityData.color}18`, color: personalityData.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={onStartTest1}
                style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
              >
                Refaire le Test 1
              </button>
            </div>
          </div>

          {/* CARTE TEST 2 : TRAJECTOIRE D'EXCELLENCE & DÉBOUCHÉS */}
          <div
            className="card"
            style={{
              borderRadius: '14px',
              border: `1.5px solid ${poleData.color}40`,
              background: '#ffffff',
              padding: '1.4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '2rem' }}>{poleData.icon}</span>
                <div>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', fontWeight: 800 }}>
                    Test 2 • Spécialisation Cible & Compétences
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: poleData.color, fontWeight: 800 }}>
                    {poleData.title}
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, marginBottom: '1.1rem' }}>
                {poleData.contexteMadagascar}
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                  <span>Débouchés & Postes Clés à Madagascar :</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {(poleData.metiersPrioritaires || []).map((m, i) => (
                    <div
                      key={i}
                      style={{
                        background: '#f8fafc',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.35rem',
                      }}
                    >
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>{m.nom}</span>
                      <span style={{ fontSize: '0.72rem', background: '#dbeafe', color: '#1d4ed8', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 600 }}>
                        {m.niveau}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={onStartTest2}
                style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
              >
                Refaire le Test 2
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. RECOMMANDATIONS STRATÉGIQUES POUR L'INSERTION */}
      {isComplete && (
        <div className="card" style={{ padding: '1.5rem', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ marginBottom: '1.15rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#1e3a8a', fontWeight: 800 }}>
                Conseils Stratégiques de l'ONG HARI pour votre Insertion
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                Actions concrètes adaptées à votre niveau actuel (<strong>{niveau}</strong>) :
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.15rem' }}>
            {/* STAGE & PROJET */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1.15rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#166534', fontWeight: 800 }}>
                  Stage Recommandé ({niveau})
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#14532d', lineHeight: 1.5 }}>
                {stageConseil}
              </p>
            </div>

            {/* CERTIFICATIONS */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1.15rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e40af', fontWeight: 800 }}>
                  Certifications Prioritaires
                </h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#1e3a8a', lineHeight: 1.55 }}>
                {(poleData.certifications || poleData.certificationsRecommandees || []).slice(0, 3).map((cert, idx) => {
                  const certName = typeof cert === 'string' ? cert : cert?.nom || cert?.code || 'Certification';
                  const certImpact = typeof cert === 'object' && cert?.impact ? ` (${cert.impact})` : '';
                  return (
                    <li key={idx} style={{ marginBottom: '0.35rem' }}>
                      <strong>{certName}</strong>{certImpact}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* PLAN D'ACTION HARI EN 3 ÉTAPES */}
          <div style={{ marginTop: '1.25rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '1.15rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>Feuille de Route d'Insertion en 3 Étapes :</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {(poleData.planDaction || []).map((act, aIdx) => (
                <div key={aIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <span style={{ background: '#2563eb', color: '#ffffff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0, marginTop: '0.1rem' }}>
                    {aIdx + 1}
                  </span>
                  <span style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.5 }}>
                    {act}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. SECTION FUSIONNÉE : COMPÉTENCES PROFESSIONNELLES RECHERCHÉES */}
      <div className="card" style={{ padding: '1.5rem', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.2rem', color: '#1e3a8a', fontWeight: 800 }}>
            Compétences Professionnelles Recherchées
          </h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5 }}>
            Les compétences techniques et humaines les plus valorisées par les entreprises à Madagascar et à l'international :
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {/* HARD SKILLS */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid #2563eb', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <span style={{ color: '#2563eb', display: 'inline-flex' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </span>
              <h4 style={{ margin: 0, fontSize: '0.98rem', color: '#1d4ed8', fontWeight: 800 }}>
                Compétences Techniques (Hard Skills)
              </h4>
            </div>
            <p style={{ margin: '0 0 0.65rem 0', fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
              Savoir-faire spécialisés et outils opérationnels appliqués au marché moderne :
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.83rem', color: '#1e293b', lineHeight: 1.6 }}>
              <li><strong>Numérique & Systèmes :</strong> Développement web et mobile, modélisation de bases de données, architectures Cloud et outils d'intelligence artificielle.</li>
              <li><strong>Finance, Audit & Gestion :</strong> Modélisation avancée sur Excel, contrôle budgétaire, comptabilité analytique et logiciels de gestion ERP.</li>
              <li><strong>Pilotage Opérationnel :</strong> Méthodes Agiles (Scrum, Kanban), planification de projets et suivi d'indicateurs de performance (KPI).</li>
              <li><strong>Analyse Décisionnelle :</strong> Extraction, structuration de données et tableaux de bord décisionnels.</li>
            </ul>
          </div>

          {/* SOFT SKILLS */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid #16a34a', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <span style={{ color: '#16a34a', display: 'inline-flex' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              <h4 style={{ margin: 0, fontSize: '0.98rem', color: '#15803d', fontWeight: 800 }}>
                Compétences Humaines (Soft Skills)
              </h4>
            </div>
            <p style={{ margin: '0 0 0.65rem 0', fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
              Qualités relationnelles, posture comportementale et efficacité personnelle :
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.83rem', color: '#1e293b', lineHeight: 1.6 }}>
              <li><strong>Communication Professionnelle :</strong> Expression orale structurée, écoute active et communication bilingue soignée (Français, Malagasy, Anglais).</li>
              <li><strong>Rigueur & Éthique :</strong> Ponctualité exemplaire, respect rigoureux des délais et intégrité dans le traitement des dossiers.</li>
              <li><strong>Adaptabilité & Esprit Critique :</strong> Capacité à analyser méthodiquement des problématiques complexes et à s'adapter aux environnements changeants.</li>
              <li><strong>Collaboration & Esprit d'Équipe :</strong> Sens du collectif, partage des connaissances et résolution constructive des conflits.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

