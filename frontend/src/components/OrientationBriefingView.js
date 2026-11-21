import React, { useState } from 'react';
import { generateOrientationBriefing } from '../data/orientationBriefing';
import { isTerminaleClass } from '../data/madagascarSeries';
import PersonalityAvatar from './PersonalityAvatar';
import ModernTestIcon from './ModernTestIcon';

const TargetBadgeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const AlertTriangleIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CalendarActionIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const AwardIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

const CompassUsersIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function OrientationBriefingView({
  currentUser,
  onStartTest1,
  onStartTest2,
  getEleveOriPro1,
  getEleveOriPro2,
  getEleveDetInt,
  getEleveDetMat,
  getEleveClasse,
  getEleveSerie,
}) {
  const [activeTrackTab, setActiveTrackTab] = useState('both');

  const ori1 = getEleveOriPro1(currentUser);
  const ori2 = getEleveOriPro2(currentUser);
  const detInt = getEleveDetInt(currentUser);
  const detMat = getEleveDetMat(currentUser);
  const eleveClasse = getEleveClasse(currentUser);
  const isTerminale = isTerminaleClass(eleveClasse);
  const eleveSerie =
    (getEleveSerie && currentUser ? getEleveSerie(currentUser) : '') ||
    currentUser?.profil?.ele_ser ||
    currentUser?.profil?.elev_seri ||
    '';

  const personalityKey = detInt?.dominantKey || ori1;
  const poleKey = detMat?.dominantPoleKey || detMat?.dominantPole?.key || ori2;

  const briefing = generateOrientationBriefing({
    personalityKeyOrLabel: personalityKey,
    poleKeyOrLabel: poleKey,
    userGrade: eleveClasse,
    userSerie: eleveSerie,
  });

  const {
    hasPersonalityTest,
    hasMatieresTest,
    isComplete,
    personalityInfo,
    poleInfo,
    poleBriefing,
    synergyInfo,
    classeConseil,
    terminaleCoherence,
    divergentTracks,
  } = briefing;

  return (
    <div className="orientation-briefing-wrapper">
      {/* 1. ÉTAT INCOMPLET : AU MOINS UN DES DEUX TESTS N'EST PAS FAIT */}
      {!isComplete && (
        <div
          className="card"
          style={{
            marginBottom: '1.5rem',
            borderLeft: '5px solid #DDB762',
            background: 'linear-gradient(135deg, #ffffff 0%, #fdf9ee 100%)',
            borderColor: '#e6dec8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
            <span
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#fdf6e2',
                border: '1px solid #DDB762',
                color: '#7c4a2d',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <TargetBadgeIcon size={22} />
            </span>
            <div>
              <h3 style={{ margin: 0, color: '#3e4225', fontSize: '1.25rem', fontWeight: 800 }}>
                Votre Bilan d'Orientation Stratégique est en attente
              </h3>
              <p style={{ margin: '0.25rem 0 0 0', color: '#5c5749', fontSize: '0.92rem' }}>
                Pour générer un briefing d'orientation sur mesure (choix de votre série au lycée, universités à Madagascar et débouchés professionnels), nous combinons les enseignements de vos <strong>deux tests complémentaires</strong>.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
            {/* Statut Test 1 */}
            <div
              style={{
                background: hasPersonalityTest ? '#f6f7f0' : '#ffffff',
                border: `1px solid ${hasPersonalityTest ? '#cbd0b2' : '#e6dec8'}`,
                borderRadius: '10px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: hasPersonalityTest ? '#525732' : '#7c4a2d' }}>
                  1. Test des Passions & Personnalité
                </span>
                <span
                  style={{
                    fontSize: '0.78rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    background: hasPersonalityTest ? '#525732' : '#fdf6e2',
                    color: hasPersonalityTest ? '#ffffff' : '#7c4a2d',
                    border: hasPersonalityTest ? 'none' : '1px solid #DDB762',
                    fontWeight: 700,
                  }}
                >
                  {hasPersonalityTest ? 'Complété' : 'À effectuer'}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.75rem' }}>
                {hasPersonalityTest ? `Profil identifié : ${ori1}` : '7 situations simples pour identifier vos qualités et votre tempérament naturel.'}
              </p>
              {!hasPersonalityTest && (
                <button type="button" className="btn btn-primary btn-sm" onClick={onStartTest1} style={{ width: '100%' }}>
                  Passer le test de personnalité
                </button>
              )}
            </div>

            {/* Statut Test 2 */}
            <div
              style={{
                background: hasMatieresTest ? '#f6f7f0' : '#ffffff',
                border: `1px solid ${hasMatieresTest ? '#cbd0b2' : '#e6dec8'}`,
                borderRadius: '10px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: hasMatieresTest ? '#525732' : '#7c4a2d' }}>
                  2. Questionnaire des Matières Scolaires
                </span>
                <span
                  style={{
                    fontSize: '0.78rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    background: hasMatieresTest ? '#525732' : '#fdf6e2',
                    color: hasMatieresTest ? '#ffffff' : '#7c4a2d',
                    border: hasMatieresTest ? 'none' : '1px solid #DDB762',
                    fontWeight: 700,
                  }}
                >
                  {hasMatieresTest ? 'Complété' : 'À effectuer'}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.75rem' }}>
                {hasMatieresTest ? `Pôle scolaire : ${ori2}` : 'Sélection de vos matières favorites et auto-évaluation de vos aptitudes concrètes.'}
              </p>
              {!hasMatieresTest && (
                <button type="button" className="btn btn-primary btn-sm" onClick={onStartTest2} style={{ width: '100%' }}>
                  Remplir mes matières scolaires
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. SI LES DEUX TESTS SONT EFFECTUÉS : TOUT UNIFIÉ DANS UN SEUL BLOC MODERNE */}
      {isComplete && poleBriefing && (
        <div
          className="card briefing-unified-card"
          style={{
            padding: 0,
            overflow: 'hidden',
            borderRadius: '16px',
            border: '1px solid #e4dfd3',
            borderTop: '4px solid #525732',
            boxShadow: '0 14px 34px -12px rgba(82, 87, 50, 0.14)',
            background: '#ffffff',
          }}
        >
          {/* EN-TÊTE SYNTHÈSE DU DOUBLE ÉCLAIRAGE */}
          <div
            style={{
              padding: '1.6rem 1.85rem',
              background: 'linear-gradient(135deg, #fbf9f3 0%, #f4f2e6 100%)',
              borderBottom: '1px solid #e6e1d3',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', flexWrap: 'wrap' }}>
              <PersonalityAvatar categoryKey={personalityInfo?.key || 'sciences_tech'} size={70} />
              <div style={{ flex: 1, minWidth: '240px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#525732',
                    background: '#e9ecda',
                    padding: '0.22rem 0.7rem',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.4rem',
                  }}
                >
                  Double éclairage de votre profil d'orientation
                </span>
                <h2 style={{ margin: '0.15rem 0 0.3rem 0', color: '#1e293b', fontSize: '1.38rem', fontWeight: 800 }}>
                  {personalityInfo?.shortLabel || ori1} • {poleInfo?.label || ori2}
                </h2>
                <p style={{ margin: 0, fontSize: '0.92rem', color: '#475569' }}>
                  Vos qualités humaines naturelles et vos matières de prédilection sont désormais combinées pour guider votre avenir.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 1 : SÉRIE AU LYCÉE / DIAGNOSTIC DE COHÉRENCE */}
          <div style={{ padding: '1.65rem 1.85rem', borderBottom: '1px solid #ece8dd' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
                  {isTerminale
                    ? '1. Votre Série au Baccalauréat & Diagnostic de Cohérence'
                    : '1. Proposition de Série à suivre au Lycée'}
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {isTerminale
                    ? "Analyse croisée entre votre série inscrite au Bac et vos résultats aux tests d'orientation"
                    : 'Série conseillée selon vos forces scolaires actuelles et vos affinités personnelles'}
                </span>
              </div>

              {isTerminale && terminaleCoherence && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {terminaleCoherence.isAligned ? (
                    <>
                      <span style={{ background: '#e5e9d4', color: '#3e4225', fontSize: '0.76rem', fontWeight: 800, padding: '0.28rem 0.7rem', borderRadius: '999px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <TargetBadgeIcon size={14} />
                        <span>Alignement Parfait Confirmé</span>
                      </span>
                      <span style={{ background: '#525732', color: '#ffffff', padding: '0.26rem 0.85rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700 }}>
                        {terminaleCoherence.currentSerie}
                      </span>
                    </>
                  ) : (
                    <>
                      <span style={{ background: '#f5ebd1', color: '#7c4a2d', fontSize: '0.76rem', fontWeight: 800, padding: '0.28rem 0.7rem', borderRadius: '999px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <AlertTriangleIcon size={14} />
                        <span>Divergence Constructive</span>
                      </span>
                      <span style={{ background: '#ebe7dc', color: '#3f3b32', padding: '0.24rem 0.7rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700 }}>
                        Actuelle : {terminaleCoherence.currentSerie}
                      </span>
                      <span style={{ background: '#525732', color: '#ffffff', padding: '0.24rem 0.7rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700 }}>
                        Tests : {terminaleCoherence.recommendedSerieName}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {isTerminale && terminaleCoherence ? (
              !terminaleCoherence.isAligned ? (
                <div style={{ paddingLeft: '1rem', borderLeft: '3px solid #DDB762', marginBottom: '1.15rem' }}>
                  <h4 style={{ margin: '0 0 0.45rem 0', color: '#7c4a2d', fontSize: '1.08rem', fontWeight: 800 }}>
                    Vos tests suggèrent la {terminaleCoherence.recommendedSerieName}, mais vous préparez le Bac en {terminaleCoherence.currentSerie}
                  </h4>
                  <p style={{ margin: '0 0 0.85rem 0', color: '#334155', fontSize: '0.93rem', lineHeight: 1.6 }}>
                    {terminaleCoherence.diagnostic}
                  </p>
                  <p style={{ margin: '0 0 0.75rem 0', color: '#7c4a2d', fontWeight: 700, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ModernTestIcon icon="🚀" size={16} />
                    <span>{terminaleCoherence.poursuiteConseil}</span>
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.1rem', marginBottom: '0.85rem' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#7c4a2d', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                        <ModernTestIcon icon="📖" size={15} />
                        <span>Matières à travailler d'arrache-pied :</span>
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '1.15rem', fontSize: '0.87rem', color: '#1e293b', lineHeight: 1.6 }}>
                        {terminaleCoherence.matieresAEffort.map((mat, idx) => (
                          <li key={idx} style={{ marginBottom: '0.3rem' }}>{mat}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#525732', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                        <ModernTestIcon icon="⚡" size={15} />
                        <span>Méthodes de travail à adopter :</span>
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '1.15rem', fontSize: '0.87rem', color: '#1e293b', lineHeight: 1.6 }}>
                        {terminaleCoherence.comportementsAAdopter.map((comp, idx) => (
                          <li key={idx} style={{ marginBottom: '0.3rem' }}>{comp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {terminaleCoherence.perspectivePostBac && (
                    <p style={{ margin: 0, fontSize: '0.89rem', color: '#3e4225', lineHeight: 1.6 }}>
                      <strong>Votre tremplin d'avenir : </strong>
                      {terminaleCoherence.perspectivePostBac}
                    </p>
                  )}
                </div>
              ) : (
                <div style={{ paddingLeft: '1rem', borderLeft: '3px solid #525732', marginBottom: '1.15rem' }}>
                  <h4 style={{ margin: '0 0 0.45rem 0', color: '#2b2e19', fontSize: '1.08rem', fontWeight: 800 }}>
                    Excellente cohérence : Votre filière ({terminaleCoherence.currentSerie}) est en pleine adéquation avec vos tests
                  </h4>
                  <p style={{ margin: '0 0 0.85rem 0', color: '#334155', fontSize: '0.93rem', lineHeight: 1.6 }}>
                    {terminaleCoherence.diagnostic}
                  </p>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#525732', display: 'block', marginBottom: '0.35rem' }}>
                    Conseils méthodologiques pour viser la mention au Baccalauréat :
                  </span>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', color: '#1e293b', lineHeight: 1.6 }}>
                    {terminaleCoherence.matieresAEffort.concat(terminaleCoherence.comportementsAAdopter).map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '0.3rem' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              )
            ) : (
              <div style={{ paddingLeft: '1rem', borderLeft: '3px solid #525732', marginBottom: '1.15rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#525732', textTransform: 'uppercase' }}>
                    Série Principale Conseillée
                  </span>
                  <span style={{ background: '#525732', color: '#ffffff', padding: '0.18rem 0.7rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700 }}>
                    {poleBriefing.lycee.serieCode}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 0.4rem 0', color: '#1e293b', fontSize: '1.08rem', fontWeight: 800 }}>
                  {poleBriefing.lycee.seriePrincipale}
                </h4>
                <p style={{ margin: '0 0 0.8rem 0', color: '#334155', fontSize: '0.93rem', lineHeight: 1.6 }}>
                  {poleBriefing.lycee.pourquoi}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.65rem' }}>
                  {poleBriefing.lycee.matieresCles.map((mat, idx) => (
                    <span key={idx} style={{ background: '#fdf6e2', color: '#713f12', border: '1px solid #DDB762', padding: '0.22rem 0.65rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                      {mat}
                    </span>
                  ))}
                </div>
                {poleBriefing.lycee.serieAlternative && (
                  <p style={{ margin: 0, fontSize: '0.87rem', color: '#475569' }}>
                    <strong>Alternative envisageable : </strong>{poleBriefing.lycee.serieAlternative}
                  </p>
                )}
              </div>
            )}

            <div style={{ paddingTop: '0.65rem', borderTop: '1px dashed #e2ddd0', fontSize: '0.88rem', color: '#3f3b32', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#7c4a2d', display: 'inline-flex', flexShrink: 0 }}>
                <ModernTestIcon icon="💡" size={17} />
              </span>
              <div>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Conseil clé d'orientation : </span>
                <span>{poleBriefing.lycee.conseilSerie}</span>
              </div>
            </div>
          </div>

          {/* SECTION 2 & 3 : ÉTUDES SUPÉRIEURES ET CARRIÈRES */}
          {divergentTracks && divergentTracks.isDivergent ? (
            <div style={{ padding: '1.65rem 1.85rem', borderBottom: '1px solid #ece8dd' }}>
              <div style={{ background: '#faf8f2', border: '1px solid #e6dec8', borderRadius: '12px', padding: '1.15rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fdf6e2', border: '1px solid #DDB762', color: '#7c4a2d', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ModernTestIcon icon="⚖️" size={20} />
                    </span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.18rem', color: '#0f172a', fontWeight: 800 }}>
                        2 & 3. Études Supérieures et Carrières Séparées
                      </h3>
                      <p style={{ margin: '0.2rem 0 0 0', color: '#475569', fontSize: '0.88rem' }}>
                        Vos tests s'orientent vers la <strong>{divergentTracks.recommendedSerieName}</strong> alors que vous préparez la <strong>{divergentTracks.currentSerie}</strong>. Deux voies d'avenir s'offrent à vous :
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'inline-flex', background: '#ece8dc', borderRadius: '10px', padding: '0.25rem', gap: '0.25rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setActiveTrackTab('both')}
                      style={{
                        border: 'none',
                        background: activeTrackTab === 'both' ? '#ffffff' : 'transparent',
                        color: activeTrackTab === 'both' ? '#0f172a' : '#475569',
                        fontWeight: activeTrackTab === 'both' ? 800 : 600,
                        padding: '0.4rem 0.85rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <ModernTestIcon icon="📋" size={14} />
                      <span>Les 2 voies séparées</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTrackTab('serie')}
                      style={{
                        border: 'none',
                        background: activeTrackTab === 'serie' ? '#525732' : 'transparent',
                        color: activeTrackTab === 'serie' ? '#ffffff' : '#475569',
                        fontWeight: activeTrackTab === 'serie' ? 800 : 600,
                        padding: '0.4rem 0.85rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                      }}
                    >
                      Voie {divergentTracks.currentSerie}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTrackTab('test')}
                      style={{
                        border: 'none',
                        background: activeTrackTab === 'test' ? '#7c4a2d' : 'transparent',
                        color: activeTrackTab === 'test' ? '#ffffff' : '#475569',
                        fontWeight: activeTrackTab === 'test' ? 800 : 600,
                        padding: '0.4rem 0.85rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <ModernTestIcon icon="💡" size={14} />
                      <span>Voie Tests ({divergentTracks.recommendedSerieName})</span>
                    </button>
                  </div>
                </div>
              </div>

              {(activeTrackTab === 'both' || activeTrackTab === 'serie') && (
                <div style={{ marginBottom: '1.25rem', borderLeft: '4px solid #525732', background: '#f6f7f2', borderRadius: '12px', padding: '1.25rem', border: '1px solid #dce0ca' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #e2e4d6', paddingBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#525732', textTransform: 'uppercase' }}>
                        Option A • Poursuite académique naturelle
                      </span>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#1e293b', fontWeight: 800 }}>
                        Voie 1 : Selon votre Série actuelle au Baccalauréat ({divergentTracks.currentSerie})
                      </h3>
                    </div>
                    <span style={{ background: '#525732', color: '#ffffff', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 700 }}>
                      Bac {divergentTracks.currentSerie}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '0.85rem' }}>
                    <div style={{ background: '#ffffff', border: '1px solid #dfe2d2', borderRadius: '10px', padding: '1rem' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#525732', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.45rem' }}>
                        <ModernTestIcon icon="📖" size={16} />
                        <span>Filières universitaires adaptées :</span>
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', color: '#1e293b', lineHeight: 1.6 }}>
                        {divergentTracks.serieTrack.etudesSuperieures.filieres.map((fil, idx) => (
                          <li key={idx} style={{ marginBottom: '0.35rem' }}>{fil}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #dfe2d2', borderRadius: '10px', padding: '1rem' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.45rem' }}>
                        Établissements & Facultés à Madagascar :
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', color: '#334155', lineHeight: 1.6 }}>
                        {divergentTracks.serieTrack.etudesSuperieures.etablissementsMada.map((etab, idx) => (
                          <li key={idx} style={{ marginBottom: '0.35rem' }}>{etab}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div style={{ background: '#eef0e4', borderRadius: '8px', padding: '0.65rem 0.95rem', fontSize: '0.86rem', color: '#3e4225', border: '1px solid #d2d6be', marginBottom: '1rem' }}>
                    <strong>Parcours types : </strong> {divergentTracks.serieTrack.etudesSuperieures.parcoursTypes}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.85rem' }}>
                    {divergentTracks.serieTrack.carrieres.secteursPorteurs.map((sec, idx) => (
                      <span key={idx} style={{ background: '#fdf6e2', color: '#713f12', border: '1px solid #DDB762', padding: '0.3rem 0.65rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <ModernTestIcon icon="🚀" size={14} />
                        <span>{sec}</span>
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
                    {divergentTracks.serieTrack.carrieres.metiers.map((m, idx) => (
                      <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                        <h5 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontSize: '0.92rem', fontWeight: 700 }}>{m.titre}</h5>
                        <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b', lineHeight: 1.45 }}>{m.description}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #d4d7c4', borderRadius: '10px', padding: '0.95rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>
                    <span style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem', color: '#525732' }}>
                      <ModernTestIcon icon="💡" size={16} />
                      <span>Conseil stratégique pour réussir dans la voie du Bac {divergentTracks.currentSerie} :</span>
                    </span>
                    {divergentTracks.serieTrack.conseil}
                  </div>
                </div>
              )}

              {(activeTrackTab === 'both' || activeTrackTab === 'test') && (
                <div style={{ borderLeft: '4px solid #7c4a2d', background: '#faf5ef', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e6d5c3' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #eadbcc', paddingBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c4a2d', textTransform: 'uppercase' }}>
                        Option B • Poursuite selon vos affinités et forces testées
                      </span>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#3f2718', fontWeight: 800 }}>
                        Voie 2 : Selon les résultats de vos Tests ({divergentTracks.recommendedSerieName})
                      </h3>
                    </div>
                    <span style={{ background: '#7c4a2d', color: '#ffffff', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 700 }}>
                      Filière Tests : {divergentTracks.recommendedSerieName}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '0.85rem' }}>
                    <div style={{ background: '#ffffff', border: '1px solid #e6d5c3', borderRadius: '10px', padding: '1rem' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#7c4a2d', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.45rem' }}>
                        <ModernTestIcon icon="📖" size={16} />
                        <span>Filières universitaires adaptées :</span>
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', color: '#1e293b', lineHeight: 1.6 }}>
                        {divergentTracks.testTrack.etudesSuperieures.filieres.map((fil, idx) => (
                          <li key={idx} style={{ marginBottom: '0.35rem' }}>{fil}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #e6d5c3', borderRadius: '10px', padding: '1rem' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.45rem' }}>
                        Établissements & Facultés à Madagascar :
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', color: '#334155', lineHeight: 1.6 }}>
                        {divergentTracks.testTrack.etudesSuperieures.etablissementsMada.map((etab, idx) => (
                          <li key={idx} style={{ marginBottom: '0.35rem' }}>{etab}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div style={{ background: '#f2e6d8', borderRadius: '8px', padding: '0.65rem 0.95rem', fontSize: '0.86rem', color: '#5c3620', border: '1px solid #dfc5ab', marginBottom: '1rem' }}>
                    <strong>Parcours types : </strong> {divergentTracks.testTrack.etudesSuperieures.parcoursTypes}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.85rem' }}>
                    {divergentTracks.testTrack.carrieres.secteursPorteurs.map((sec, idx) => (
                      <span key={idx} style={{ background: '#fdf6e2', color: '#713f12', border: '1px solid #DDB762', padding: '0.3rem 0.65rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <ModernTestIcon icon="🚀" size={14} />
                        <span>{sec}</span>
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
                    {divergentTracks.testTrack.carrieres.metiers.map((m, idx) => (
                      <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
                        <h5 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontSize: '0.92rem', fontWeight: 700 }}>{m.titre}</h5>
                        <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b', lineHeight: 1.45 }}>{m.description}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #dfc5ab', borderRadius: '10px', padding: '0.95rem', fontSize: '0.9rem', color: '#4a2c18', lineHeight: 1.6 }}>
                    <span style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem', color: '#7c4a2d' }}>
                      <ModernTestIcon icon="🚀" size={16} />
                      <span>Passerelle Post-Bac : Comment rejoindre cette voie avec votre Bac {divergentTracks.currentSerie} ?</span>
                    </span>
                    {divergentTracks.testTrack.conseil}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* SECTION 2 : ÉTUDES SUPÉRIEURES (MISE EN PAGE ÉPURÉE SANS SOUS-BOÎTES) */}
              <div style={{ padding: '1.65rem 1.85rem', borderBottom: '1px solid #ece8dd' }}>
                <div style={{ marginBottom: '0.9rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
                    2. Les Études Supérieures à Envisager après le Bac
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Filières universitaires, grandes écoles et facultés reconnues à Madagascar
                  </span>
                </div>

                <p style={{ fontSize: '0.92rem', color: '#475569', marginBottom: '1rem' }}>
                  Voici les parcours académiques majeurs qui prolongent de façon naturelle vos points forts :
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ paddingLeft: '0.95rem', borderLeft: '3px solid #7c4a2d' }}>
                    <h4 style={{ margin: '0 0 0.55rem 0', color: '#7c4a2d', fontSize: '0.98rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <ModernTestIcon icon="📖" size={17} />
                      <span>Filières universitaires adaptées</span>
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', color: '#1e293b', lineHeight: 1.65 }}>
                      {poleBriefing.etudesSuperieures.filieres.map((fil, idx) => (
                        <li key={idx} style={{ marginBottom: '0.3rem' }}>{fil}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ paddingLeft: '0.95rem', borderLeft: '3px solid #525732' }}>
                    <h4 style={{ margin: '0 0 0.55rem 0', color: '#525732', fontSize: '0.98rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <ModernTestIcon icon="🏢" size={17} />
                      <span>Établissements & Facultés à Madagascar</span>
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', color: '#334155', lineHeight: 1.65 }}>
                      {poleBriefing.etudesSuperieures.etablissementsMada.map((etab, idx) => (
                        <li key={idx} style={{ marginBottom: '0.3rem' }}>{etab}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p style={{ margin: 0, paddingTop: '0.65rem', borderTop: '1px dashed #e2ddd0', fontSize: '0.88rem', color: '#3e4225' }}>
                  <strong>Parcours types : </strong> {poleBriefing.etudesSuperieures.parcoursTypes}
                </p>
              </div>

              {/* SECTION 3 : CARRIÈRES & MÉTIERS D'AVENIR (MISE EN PAGE ÉPURÉE SANS SOUS-BOÎTES) */}
              <div style={{ padding: '1.65rem 1.85rem', borderBottom: '1px solid #ece8dd' }}>
                <div style={{ marginBottom: '0.9rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
                    3. Carrières & Métiers d'Avenir à Madagascar
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Professions concrètes et secteurs à fort potentiel d'embauche
                  </span>
                </div>

                <div style={{ marginBottom: '1.15rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#5c5749', display: 'block', marginBottom: '0.5rem' }}>
                    Secteurs porteurs pour votre profil :
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {poleBriefing.carrieres.secteursPorteurs.map((sec, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: '#fdf6e2',
                          color: '#713f12',
                          border: '1px solid #DDB762',
                          padding: '0.32rem 0.78rem',
                          borderRadius: '999px',
                          fontSize: '0.83rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.38rem',
                        }}
                      >
                        <ModernTestIcon icon="🚀" size={14} />
                        <span>{sec}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem 1.5rem' }}>
                  {poleBriefing.carrieres.metiers.map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        paddingLeft: '0.9rem',
                        borderLeft: idx % 2 === 0 ? '3px solid #525732' : '3px solid #a67c52',
                      }}
                    >
                      <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontSize: '0.96rem', fontWeight: 700 }}>
                        {m.titre}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5 }}>
                        {m.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* SECTION 4 & 5 : ATOUT DISTINCTIF + CONSEIL NIVEAU ACTUEL */}
          {(synergyInfo || classeConseil) && (
            <div style={{ padding: '1.65rem 1.85rem', borderBottom: '1px solid #ece8dd', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem' }}>
              {synergyInfo && (
                <div style={{ paddingLeft: '1rem', borderLeft: '3px solid #7c4a2d' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.45rem' }}>
                    <span style={{ color: '#7c4a2d', display: 'inline-flex', flexShrink: 0 }}>
                      <AwardIcon size={18} />
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.03rem', color: '#4a2c18', fontWeight: 800 }}>
                      Votre atout distinctif : L'alliance de votre tempérament et de vos matières
                    </h3>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                    {synergyInfo.bonusText}
                  </p>
                </div>
              )}

              {classeConseil && (
                <div style={{ paddingLeft: '1rem', borderLeft: '3px solid #525732' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.45rem' }}>
                    <span style={{ color: '#525732', display: 'inline-flex', flexShrink: 0 }}>
                      <CalendarActionIcon size={18} />
                    </span>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#525732', textTransform: 'uppercase' }}>
                        Conseil d'action pour votre niveau actuel ({classeConseil.classe})
                      </div>
                      <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1rem', fontWeight: 800 }}>
                        {classeConseil.action}
                      </h4>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                    {classeConseil.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SECTION 6 : FORUMS ET SALONS D'ORIENTATION */}
          <div
            style={{
              background: 'linear-gradient(135deg, #fbf9f3 0%, #f4f1e4 100%)',
              textAlign: 'center',
              padding: '1.75rem 1.85rem',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 0.75rem auto',
                borderRadius: '14px',
                background: '#525732',
                color: '#DDB762',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CompassUsersIcon size={24} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.2rem', fontWeight: 800 }}>
              Participez aux Forums et Salons d'Orientation Scolaire & Universitaire
            </h3>
            <p style={{ maxWidth: '660px', margin: '0 auto 1.25rem auto', color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Pour aller encore plus loin et concrétiser votre choix, rien ne remplace le contact direct avec le terrain ! Nous vous conseillons vivement de visiter les forums des métiers, salons de l'étudiant et journées portes ouvertes des lycées et universités à Madagascar. Vous pourrez y dialoguer avec des étudiants, des enseignants et des professionnels pour poser vos questions et découvrir concrètement les filières.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#fdf6e2',
                border: '1px solid #DDB762',
                padding: '0.55rem 1.2rem',
                borderRadius: '999px',
                color: '#713f12',
                fontSize: '0.88rem',
                fontWeight: 600,
              }}
            >
              <ModernTestIcon icon="💡" size={16} />
              <span>Bon réflexe : Préparez vos questions à l'avance et apportez vos bulletins pour échanger directement sur les stands d'information.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
