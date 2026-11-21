import React from 'react';
import { generateReconversionCareerBriefing } from '../data/reconversionCareerBriefing';

export default function ReconversionCareerBriefingView({
  currentUser,
  onStartTest1,
  onStartTest2,
  getRecoOriPro1,
  getRecoOriPro2,
  getRecoSituation,
  getRecoMetierActuel,
  onViewSecteurs,
}) {
  const ori1 = getRecoOriPro1 ? getRecoOriPro1(currentUser) : currentUser?.profil?.emp_ori_pro_1 || currentUser?.profil?.rec_ori_pro_1 || '';
  const ori2 = getRecoOriPro2 ? getRecoOriPro2(currentUser) : currentUser?.profil?.emp_ori_pro_2 || currentUser?.profil?.rec_ori_pro_2 || '';
  const situation = getRecoSituation ? getRecoSituation(currentUser) : currentUser?.profil?.emp_sit_act || currentUser?.profil?.rec_sit_act || currentUser?.profil?.reco_situ_actu || 'En recherche d\'opportunité';
  const metier = getRecoMetierActuel ? getRecoMetierActuel(currentUser) : currentUser?.profil?.emp_met_act || currentUser?.profil?.rec_met_act || currentUser?.profil?.reco_meti_actu || 'Profil Polyvalent';
  const anneesExp = 0;
  const secteur = '';

  const hasTest1 = Boolean(ori1);
  const hasTest2 = Boolean(ori2);
  const isComplete = hasTest1 && hasTest2;

  const briefing = generateReconversionCareerBriefing({
    personalityKeyOrLabel: ori1,
    poleKeyOrLabel: ori2,
    situationActuelle: situation,
    metierActuel: metier,
    anneesExp: anneesExp,
    secteurActuel: secteur,
  });

  const personalityData = briefing?.personalityData || {};
  const poleData = briefing?.poleData || {};
  const transitionConseil = briefing?.transitionConseil || '';

  return (
    <div className="reconversion-briefing-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. ÉTAT INCOMPLET : TESTS EN ATTENTE */}
      {!isComplete && (
        <div
          className="card"
          style={{
            borderLeft: '5px solid #d97706',
            background: '#fffbeb',
            padding: '1.5rem',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
            <span className="account-icon" style={{ fontSize: '2rem' }}>🎯</span>
            <div>
              <h3 style={{ margin: 0, color: '#92400e', fontSize: '1.25rem', fontWeight: 800 }}>
                Votre Bilan & Plan d'Accès à l'Emploi est en attente
              </h3>
              <p style={{ margin: '0.25rem 0 0 0', color: '#b45309', fontSize: '0.9rem' }}>
                Pour révéler les métiers faits pour vous et générer votre feuille de route personnalisée d'accès à l'emploi, complétez les 2 tests d'orientation e-HARI :
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
            {/* CARTE TEST 1 */}
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
                    1. Aspirations & Métier Idéal
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
                  Clarifie vos motivations profondes (numérique, entrepreneuriat, organisation, impact social, humain ou opérations de terrain) et votre tempérament de travail.
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
                  Passer le Test 1 (7 situations)
                </button>
              )}
            </div>

            {/* CARTE TEST 2 */}
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
                    2. Compétences & Pôle d'Emploi Cible
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
                  Identifie vos compétences clés et évalue vos aptitudes pour déterminer le secteur qui recrute le plus adapté à votre profil à Madagascar.
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
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            padding: '1.75rem',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                <span className="role-chip reconversion" style={{ background: 'rgba(255,255,255,0.18)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700, fontSize: '0.8rem', padding: '0.2rem 0.65rem', borderRadius: '12px' }}>
                  {situation}
                </span>
                <span style={{ fontSize: '0.82rem', opacity: 0.9, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                  <span>Profil : <strong>{metier}</strong></span>
                </span>
              </div>
              <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.3px', color: '#ffffff' }}>
                Feuille de Route d'Accès à l'Emploi & Orientation Professionnelle e-HARI
              </h1>
              <p style={{ margin: 0, fontSize: '0.92rem', opacity: 0.92, lineHeight: 1.5 }}>
                Synthèse croisée de vos aspirations dominantes (<strong>{personalityData.label}</strong>) et de votre pôle d'emploi cible (<strong>{poleData.title}</strong>).
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

      {/* 3. DOUBLE CARTES DE DIAGNOSTIC */}
      {isComplete && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {/* CARTE TEST 1 : ASPIRATIONS & MÉTIER IDÉAL */}
          <div
            className="card"
            style={{
              borderRadius: '14px',
              border: `1.5px solid ${personalityData.borderColor || '#cbd5e1'}`,
              background: '#ffffff',
              padding: '1.4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '2rem' }}>{personalityData.icon || '💡'}</span>
                <div>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', fontWeight: 800 }}>
                    Test 1 • Aspirations & Métier Idéal
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: personalityData.color || '#1e3a8a', fontWeight: 800 }}>
                    {personalityData.label}
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, marginBottom: '1.1rem' }}>
                {personalityData.description}
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <span>Vos 4 Atouts Majeurs pour Réussir dans ce Métier :</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {(personalityData.forces || []).map((f, i) => (
                    <div key={i} style={{ fontSize: '0.84rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: `${personalityData.color || '#0d9488'}18`, color: personalityData.color || '#0d9488', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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

          {/* CARTE TEST 2 : PÔLE D'EMPLOI CIBLE & MÉTIERS QUI RECRUTENT */}
          <div
            className="card"
            style={{
              borderRadius: '14px',
              border: `1.5px solid ${poleData.color || '#059669'}40`,
              background: '#ffffff',
              padding: '1.4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '2rem' }}>{poleData.icon || '🎯'}</span>
                <div>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', fontWeight: 800 }}>
                    Test 2 • Pôle d'Emploi Cible & Métiers Recommandés
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: poleData.color || '#059669', fontWeight: 800 }}>
                    {poleData.title}
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, marginBottom: '1.1rem' }}>
                {poleData.contexteMadagascar}
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                  <span>Métiers qui Recrutent à Madagascar :</span>
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
                      <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 600 }}>
                        {m.secteur || m.profilType}
                      </span>
                    </div>
                  ))}
                </div>

                {onViewSecteurs && (
                  <button
                    type="button"
                    onClick={onViewSecteurs}
                    style={{
                      marginTop: '0.85rem',
                      width: '100%',
                      background: '#ecfdf5',
                      color: '#065f46',
                      border: '1.5px solid #a7f3d0',
                      borderRadius: '8px',
                      padding: '0.55rem 0.85rem',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <span>Voir les entreprises concrètes qui recrutent pour ce pôle à Mada →</span>
                  </button>
                )}
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

      {/* 4. RECOMMANDATIONS STRATÉGIQUES POUR L'INSERTION ET L'ACCÈS À L'EMPLOI */}
      {isComplete && (
        <div className="card" style={{ padding: '1.5rem', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.15rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d9488' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>
                Conseils Stratégiques de l'ONG HARI pour Réussir votre Insertion Professionnelle
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                Recommandations adaptées à votre profil et votre situation actuelle (<strong>{situation}</strong>) :
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.15rem' }}>
            {/* CONSEIL SITUATION */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.15rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b', fontWeight: 800 }}>
                  Modalité d'Accès à l'Emploi Recommandée
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                {transitionConseil}
              </p>
            </div>

            {/* CERTIFICATIONS COURTES VALORISANTES */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1.15rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e40af', fontWeight: 800 }}>
                  Formations Courtes & Certifications Valorisantes
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

          {/* PLAN D'ACTION EN 4 ÉTAPES */}
          <div style={{ marginTop: '1.25rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '1.15rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
              <span>Plan d'Action Méthodologique en 4 Étapes pour Décrocher l'Emploi :</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {(poleData.planDaction || []).map((act, aIdx) => (
                <div key={aIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <span style={{ background: '#059669', color: '#ffffff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0, marginTop: '0.1rem' }}>
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

      {/* 5. ACTION CONCRÈTE : ENTREPRISES QUI RECRUTENT ET VOIES D'ACCÈS */}
      {isComplete && onViewSecteurs && (
        <div
          className="card"
          style={{
            padding: '1.5rem',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            border: '1.5px solid #86efac',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '1.6rem' }}>🏢</span>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#14532d', fontWeight: 800 }}>
                Passez à l'Action : Postulez aux Entreprises Réelles de Madagascar
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#166534', lineHeight: 1.5 }}>
              L'ONG HARI a sélectionné les entreprises en activité dans la Grande Île qui recrutent votre profil (<strong>{poleData.title}</strong>), leurs contacts RH directs et la feuille de route étape par étape pour y être embauché.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onViewSecteurs}
            style={{
              background: '#166534',
              borderColor: '#166534',
              fontWeight: 800,
              padding: '0.65rem 1.35rem',
              fontSize: '0.92rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(22, 101, 52, 0.25)',
              cursor: 'pointer',
            }}
          >
            <span>Consulter mes Entreprises Cibles & Voies d'Accès</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
}
