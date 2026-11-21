import React, { useState, useMemo } from 'react';
import { getRecommendedSecteursForUser } from '../data/secteursRecrutementMadaData';

export default function SecteursRecrutementMadaView({
  currentUser,
  getRecoOriPro1,
  getRecoOriPro2,
  getRecoDetMot,
  getRecoDetTra,
  onStartTest1,
  onStartTest2,
}) {
  const ori1 = getRecoOriPro1 ? getRecoOriPro1(currentUser) : currentUser?.profil?.emp_ori_pro_1 || currentUser?.profil?.rec_ori_pro_1 || '';
  const ori2 = getRecoOriPro2 ? getRecoOriPro2(currentUser) : currentUser?.profil?.emp_ori_pro_2 || currentUser?.profil?.rec_ori_pro_2 || '';
  const detMot = getRecoDetMot ? getRecoDetMot(currentUser) : currentUser?.profil?.emp_det_mot || currentUser?.profil?.rec_det_mot || null;
  const detTra = getRecoDetTra ? getRecoDetTra(currentUser) : currentUser?.profil?.emp_det_tra || currentUser?.profil?.rec_det_tra || null;

  // Calcul dynamique des recommandations basé strictement sur les tests d'orientation
  const recoMatch = useMemo(() => {
    return getRecommendedSecteursForUser({
      oriPro1: ori1,
      oriPro2: ori2,
      detMot,
      detTra,
    });
  }, [ori1, ori2, detMot, detTra]);

  const {
    hasTests,
    hasTest1,
    hasTest2,
    userArchetypeLabel,
    userPoleLabel,
    topSecteurId,
    recommendedSecteurs,
  } = recoMatch;

  const [activeRoadmapSecteur, setActiveRoadmapSecteur] = useState(() => topSecteurId || null);

  // Secteurs cibles issus des tests
  const targetSecteurs = hasTests ? recommendedSecteurs : [];

  return (
    <div className="secteurs-mada-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Notification discrète si tests incomplets */}
      {hasTest1 && !hasTest2 ? (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '0.85rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.88rem',
            color: '#92400e',
          }}
        >
          <div>
            Aspirations : <strong>{userArchetypeLabel}</strong>. Complétez le Test 2 (Compétences & Pôle Cible) pour affiner la sélection des entreprises.
          </div>
          {onStartTest2 && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onStartTest2}
              style={{ background: '#d97706', borderColor: '#d97706', fontWeight: 600, padding: '0.35rem 0.85rem' }}
            >
              Passer le Test 2
            </button>
          )}
        </div>
      ) : !hasTest1 && hasTest2 ? (
        <div
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '0.85rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.88rem',
            color: '#1e40af',
          }}
        >
          <div>
            Pôle cible : <strong>{userPoleLabel}</strong>. Complétez le Test 1 (Aspirations) pour un diagnostic complet.
          </div>
          {onStartTest1 && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onStartTest1}
              style={{ background: '#2563eb', borderColor: '#2563eb', fontWeight: 600, padding: '0.35rem 0.85rem' }}
            >
              Passer le Test 1
            </button>
          )}
        </div>
      ) : !hasTests ? (
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '1.5rem',
            textAlign: 'center',
          }}
        >
          <h3 style={{ color: '#0f172a', margin: '0 0 0.4rem 0', fontSize: '1.15rem', fontWeight: 700 }}>
            Tests d'orientation requis
          </h3>
          <p style={{ color: '#475569', margin: '0 auto 1.25rem auto', maxWidth: '600px', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Pour afficher le secteur et les entreprises correspondant à votre profil, veuillez compléter les 2 tests d'orientation :
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {onStartTest1 && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onStartTest1}
                style={{ background: '#d97706', borderColor: '#d97706', fontWeight: 600 }}
              >
                1. Test Aspirations
              </button>
            )}
            {onStartTest2 && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onStartTest2}
                style={{ background: '#16a34a', borderColor: '#16a34a', fontWeight: 600 }}
              >
                2. Test Compétences
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* Secteur cible & Entreprises */}
      {targetSecteurs.map((secteur) => {
          const isRoadmapOpen = activeRoadmapSecteur === secteur.id;

          return (
            <div
              key={secteur.id}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.15rem',
              }}
            >
              {/* En-tête du secteur */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 700 }}>
                    {secteur.title}
                  </h2>
                  <span
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                    }}
                  >
                    {secteur.badge}
                  </span>
                </div>

                {Array.isArray(secteur.matchReasons) && secteur.matchReasons.length > 0 && (
                  <div style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 600, marginBottom: '0.35rem' }}>
                    {secteur.matchReasons.join(' • ')}
                  </div>
                )}

                <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                  {secteur.description}
                </p>
              </div>

              {/* Feuille de route */}
              <div
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveRoadmapSecteur(isRoadmapOpen ? null : secteur.id)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: isRoadmapOpen ? '#f8fafc' : '#ffffff',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 700 }}>
                    La voie à suivre pour ce secteur (prérequis, formations et étapes)
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                    {isRoadmapOpen ? 'Masquer ▴' : 'Afficher ▾'}
                  </span>
                </button>

                {isRoadmapOpen && (
                  <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                      {/* Prérequis */}
                      <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                          Prérequis indispensables :
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                          {secteur.voieASuivre.preRequis.map((pr, idx) => (
                            <li key={idx} style={{ marginBottom: '0.25rem' }}>{pr}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Formations recommandées */}
                      <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                          Formations recommandées :
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                          {secteur.voieASuivre.formationsRecommandees.map((fc, idx) => (
                            <li key={idx} style={{ marginBottom: '0.25rem' }}>{fc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Étapes */}
                    <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.45rem', textTransform: 'uppercase' }}>
                        Étapes concrètes de candidature :
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {secteur.voieASuivre.etapesConseillees.map((et, idx) => (
                          <div key={idx} style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>
                            {et}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Entreprises */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '0.98rem', color: '#0f172a', fontWeight: 700 }}>
                    Entreprises du secteur ({secteur.entreprises.length})
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  {secteur.entreprises.map((entreprise) => (
                    <div
                      key={entreprise.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '1.1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        {/* En-tête de l'entreprise */}
                        <div style={{ marginBottom: '0.5rem' }}>
                          <h4 style={{ margin: '0 0 0.15rem 0', fontSize: '1.02rem', color: '#0f172a', fontWeight: 700 }}>
                            {entreprise.nom}
                          </h4>
                          <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                            {entreprise.secteurDetail}
                          </div>
                        </div>

                        {/* Implantation */}
                        <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.65rem' }}>
                          <strong>Localisation :</strong> {entreprise.implantation}
                        </div>

                        {/* Postes */}
                        <div style={{ marginBottom: '0.65rem' }}>
                          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                            Postes ciblés :
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                            {entreprise.postesRecrutes.map((poste, pIdx) => (
                              <span
                                key={pIdx}
                                style={{
                                  background: '#f1f5f9',
                                  color: '#1e293b',
                                  fontSize: '0.74rem',
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '4px',
                                  fontWeight: 500,
                                }}
                              >
                                {poste}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Profil & Conseil */}
                        <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
                          <div style={{ marginBottom: '0.25rem' }}>
                            <strong>Accès :</strong> {entreprise.accessibilite}
                          </div>
                          {entreprise.conseilPostulation && (
                            <div style={{ color: '#0f172a', background: '#f8fafc', padding: '0.45rem 0.6rem', borderRadius: '4px', borderLeft: '3px solid #cbd5e1' }}>
                              <strong>Conseil :</strong> {entreprise.conseilPostulation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
