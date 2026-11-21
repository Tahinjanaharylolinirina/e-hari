import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import {
  SCHEDULE_HOURS,
  SCHEDULE_DAYS,
  getInitialWeeklyGrid,
  getDefaultLycéeWeeklyGrid,
  convertWeeklyGridToNumberedTasks,
  loadWeeklyGridFromSavedData,
  analyzeAndGenerateFromWeeklyGrid,
  detectStudentContradictionOrDivergence,
} from '../data/revisionScheduleEngine';
import { generateOrientationBriefing } from '../data/orientationBriefing';

const JoyfulScheduleHeaderIcon = ({ size = 34 }) => (
  <span
    style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #fbbf24 0%, #DDB762 55%, #b45309 100%)',
      color: '#7f1d1d',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(180, 83, 9, 0.24)',
      flexShrink: 0,
    }}
  >
    <svg width={Math.round(size * 0.56)} height={Math.round(size * 0.56)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="m12 14 1.1 2.2 2.4.35-1.75 1.7.41 2.4L12 19.5l-2.16 1.15.41-2.4-1.75-1.7 2.4-.35L12 14Z" fill="currentColor" stroke="none" />
    </svg>
  </span>
);

const LightbulbModernIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

const SparklePlayIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
    <path d="M19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16z" />
  </svg>
);

const BellModernIcon = ({ size = 22 }) => (
  <span
    style={{
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      background: '#fdf6e2',
      border: '1px solid #DDB762',
      color: '#881337',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  </span>
);

export default function RevisionScheduleView({
  currentUser,
  onSaveRevisionSchedule,
  onGoToBilan,
  getEleveOriPro1,
  getEleveOriPro2,
  getEleveClasse,
  getEleveSerie,
}) {
  const eleveClasse = (getEleveClasse && currentUser ? getEleveClasse(currentUser) : '') || currentUser?.profil?.ele_cla || '';
  const eleveSerie = (getEleveSerie && currentUser ? getEleveSerie(currentUser) : '') || currentUser?.profil?.ele_ser || '';
  const ori1 = (getEleveOriPro1 && currentUser ? getEleveOriPro1(currentUser) : '') || currentUser?.profil?.ele_ori_pro_1 || '';
  const ori2 = (getEleveOriPro2 && currentUser ? getEleveOriPro2(currentUser) : '') || currentUser?.profil?.ele_ori_pro_2 || '';

  const briefing = generateOrientationBriefing({
    personalityKeyOrLabel: ori1,
    poleKeyOrLabel: ori2,
    userGrade: eleveClasse,
    userSerie: eleveSerie,
  });

  const contradictionInfo = detectStudentContradictionOrDivergence({ currentUser, briefing });

  // Récupération des données sauvegardées
  const savedData = currentUser?.edt?.edt_don || currentUser?.profil?.ele_edt_rev || null;

  // États locaux
  const [chosenTrack, setChosenTrack] = useState(() => {
    if (savedData?.chosenTrack) return savedData.chosenTrack;
    if (contradictionInfo.hasContradiction) {
      return null;
    }
    return contradictionInfo.trackC || null;
  });

  // Grille hebdomadaire tranchée par 1h (5h à 21h, Lundi à Dimanche)
  const [weeklyGrid, setWeeklyGrid] = useState(() => {
    return loadWeeklyGridFromSavedData(savedData, eleveClasse, eleveSerie);
  });

  // Boîte de saisie active pour le jour et l'heure précis : { day, hour, text }
  const [editingCell, setEditingCell] = useState(null);

  // Tableau unifié fusionné généré dynamiquement côté front après analyse
  const [unifiedSchedule, setUnifiedSchedule] = useState(() => {
    const grid = loadWeeklyGridFromSavedData(savedData, eleveClasse, eleveSerie);
    const track = chosenTrack || (contradictionInfo.hasContradiction ? null : contradictionInfo.trackC);
    return analyzeAndGenerateFromWeeklyGrid({
      weeklyGrid: grid,
      chosenTrack: track,
      briefing,
      currentUser,
    });
  });

  // Filtre de type de créneau : 'tous' | 'revision' | 'cours'
  const [slotTypeFilter, setSlotTypeFilter] = useState('tous');

  // Popup du tableau 5h-21h
  const [showImportModal, setShowImportModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [notification, setNotification] = useState(null);
  const [gridError, setGridError] = useState('');

  // États pour le système de signalement direct des révisions par Email
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [reminderResult, setReminderResult] = useState(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [emailPermission, setEmailPermission] = useState(
    currentUser?.profil?.ele_not_ema !== false
  );
  const [isUpdatingPermission, setIsUpdatingPermission] = useState(false);

  // Basculer la permission d'accès accordée pour les rappels de révision
  const handleTogglePermission = async () => {
    setIsUpdatingPermission(true);
    try {
      const nextVal = !emailPermission;
      await api.updateNotificationPermission(nextVal);
      setEmailPermission(nextVal);
      setNotification({
        type: 'success',
        text: nextVal
          ? 'Permission accordée : e-HARI vous alertera par e-mail lors de vos heures de travail personnel !'
          : 'Rappels par e-mail suspendus.',
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (e) {
      setNotification({ type: 'error', text: e.message });
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setIsUpdatingPermission(false);
    }
  };

  // Déclencher l'envoi d'un signalement direct par Email (aucun enregistrement BDD)
  const handleTriggerReminder = async (slotData = null) => {
    setIsSendingReminder(true);
    try {
      let targetMatiere = slotData?.matiere;
      let targetObjectif = slotData?.objectif;
      let targetCreneau = slotData?.debut ? `${slotData.debut} - ${slotData.fin}` : null;
      let targetJour = slotData?.jour;

      if (!targetMatiere && unifiedSchedule?.jours) {
        for (const j of unifiedSchedule.jours) {
          const rev = (j.creneaux || []).find((c) => c.categorie === 'revision');
          if (rev) {
            targetMatiere = rev.matiere;
            targetObjectif = rev.objectif;
            targetCreneau = `${rev.debut} - ${rev.fin}`;
            targetJour = j.nom;
            break;
          }
        }
      }

      const res = await api.testRevisionReminder({
        matiere: targetMatiere || 'Mathématiques',
        objectif: targetObjectif || 'Annales du Bac & fiches de synthèse ciblées',
        creneau: targetCreneau || '18:00 - 19:00',
        jour: targetJour || 'Aujourd\'hui',
      });

      if (res?.success) {
        setReminderResult(res.data);
        setShowReminderModal(true);
        setNotification({
          type: 'success',
          text: `Signalement envoyé avec succès par Email (${res.data.student.email}) !`,
        });
        setTimeout(() => setNotification(null), 6000);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        text: 'Erreur lors de l\'envoi du signalement : ' + err.message,
      });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setIsSendingReminder(false);
    }
  };

  const cellInputRef = useRef(null);

  // Calcul du nombre d'heures renseignées
  const countFilledHours = (grid) => {
    let count = 0;
    SCHEDULE_DAYS.forEach((day) => {
      SCHEDULE_HOURS.forEach((h) => {
        const val = (grid?.[day]?.[h] || '').trim().toLowerCase();
        if (val && val !== 'libre' && val !== 'repos') {
          count++;
        }
      });
    });
    return count;
  };

  // Focus automatique immédiat lorsque la boîte de saisie s'ouvre
  useEffect(() => {
    if (editingCell) {
      const timer = setTimeout(() => {
        if (cellInputRef.current) {
          cellInputRef.current.focus();
          cellInputRef.current.select();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [editingCell]);

  // Si aucune donnée n'est encore configurée et qu'il n'y a pas de contradiction non résolue, on invite à ouvrir la grille
  useEffect(() => {
    if (!unifiedSchedule && !contradictionInfo.hasContradiction) {
      setShowImportModal(true);
    }
  }, [unifiedSchedule, contradictionInfo.hasContradiction]);

  // Gestion du choix de stratégie pour les profils divergents
  const handleSelectTrack = (track) => {
    setChosenTrack(track);
    if (unifiedSchedule) {
      const generatedUnified = analyzeAndGenerateFromWeeklyGrid({
        weeklyGrid,
        chosenTrack: track,
        briefing,
        currentUser,
      });
      setUnifiedSchedule(generatedUnified);
      saveAllData(weeklyGrid);
      setNotification({
        type: 'success',
        text: `Stratégie "${track.badge || track.label}" activée ! Votre planning a été recalculé et sauvegardé.`,
      });
      setTimeout(() => setNotification(null), 4000);
    } else {
      setShowImportModal(true);
    }
  };

  // Sauvegarde globale dans la table dédiée 'emplois_du_temps'
  // La BDD ne contient que les tâches à faire par tranches numérotées (1..16)
  const saveAllData = async (grid) => {
    const bddTasks = convertWeeklyGridToNumberedTasks(grid);

    if (onSaveRevisionSchedule) {
      await onSaveRevisionSchedule(bddTasks);
    }
  };

  // Enregistrement d'une tâche dans la cellule courante
  const handleSaveCurrentCell = (newText = null) => {
    if (!editingCell) return;
    const valueToSet = newText !== null ? newText : editingCell.text;
    setWeeklyGrid((prev) => ({
      ...prev,
      [editingCell.day]: {
        ...(prev[editingCell.day] || {}),
        [editingCell.hour]: valueToSet.trim(),
      },
    }));
    setEditingCell(null);
    setGridError('');
  };

  // Réinitialisation de la cellule (rendre libre)
  const handleClearCurrentCell = () => {
    if (!editingCell) return;
    handleSaveCurrentCell('');
  };

  // Analyse et validation finale de l'EDT par l'élève
  const handleConfirmWeeklyGrid = () => {
    const filledCount = countFilledHours(weeklyGrid);
    if (filledCount < 5) {
      const errorMsg = "Vérifie l'EDT que tu viens de soumettre car c'est invalide";
      setGridError(errorMsg);
      setNotification({
        type: 'error',
        text: errorMsg,
      });
      return;
    }

    setGridError('');
    setIsScanning(true);
    setScanProgress(25);

    const stepInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(stepInterval);
          return 90;
        }
        return prev + 25;
      });
    }, 250);

    setTimeout(() => {
      clearInterval(stepInterval);
      setScanProgress(100);

      const track = chosenTrack || contradictionInfo.trackC;
      const generatedUnified = analyzeAndGenerateFromWeeklyGrid({
        weeklyGrid,
        chosenTrack: track,
        briefing,
        currentUser,
      });

      setUnifiedSchedule(generatedUnified);
      setIsScanning(false);
      setShowImportModal(false);
      setEditingCell(null);

      // Sauvegarde dans la base de données (format épuré : tâches par tranches numérotées)
      saveAllData(weeklyGrid);

      setNotification({
        type: 'success',
        text: 'Votre emploi du temps a été analysé avec succès ! Vos révisions adaptées ont été placées sur votre temps libre.',
      });
      setTimeout(() => setNotification(null), 5000);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  // Suggestions rapides pour remplir les cases en 1 clic
  const quickSuggestions = [
    'Mathématiques',
    'Physique-Chimie',
    'SVT',
    'Français',
    'Philosophie',
    'Anglais',
    'Histoire-Géo',
    'Malagasy',
    'Sciences Économiques & Sociales (SES)',
    'Éducation Physique & Sportive (EPS)',
    'Pause déjeuner',
    'Devoir Surveillé (DS)',
  ];

  return (
    <div className="revision-schedule-container" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* 1. NOTIFICATION */}
      {notification && (
        <div className={`alert-toast ${notification.type}`} style={{ marginBottom: '1.25rem' }}>
          <span>{notification.text}</span>
        </div>
      )}

      {/* 2. EN-TÊTE PRINCIPAL */}
      <div
        className="role-welcome-banner eleve"
        style={{
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #fffdf7 0%, #fdf6e2 100%)',
          border: '1px solid #e8d8ab',
          borderLeft: '5px solid #881337',
          borderRadius: '12px',
          padding: '1.4rem 1.6rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <JoyfulScheduleHeaderIcon size={42} />
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#881337', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.2rem' }}>
                Organisation Scolaire & Révisions e-hari
              </span>
              <h1 className="banner-title" style={{ color: '#0f172a', margin: 0, fontSize: '1.55rem' }}>
                Emploi du Temps Hebdomadaire Unifié
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {unifiedSchedule ? (
              <button
                type="button"
                className="action-icon-btn action-edit"
                onClick={() => setShowImportModal(true)}
                title="Modifier mon EDT (5h - 21h)"
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
                onClick={() => setShowImportModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, background: 'linear-gradient(135deg, #9f1239 0%, #7f1d1d 100%)', border: 'none' }}
              >
                <SparklePlayIcon size={15} />
                <span>Établir mon EDT (5h - 21h)</span>
              </button>
            )}
            {unifiedSchedule && (
              <button
                type="button"
                className="action-icon-btn action-print"
                onClick={handlePrint}
                title="Imprimer mon emploi du temps"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2.B. BANDEAU DE SIGNALEMENT & RAPPELS PAR EMAIL */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          background: '#ffffff',
          border: '1.5px solid #e6d8b5',
          borderLeft: '5px solid #881337',
          padding: '1.15rem 1.35rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(136, 19, 55, 0.05)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <BellModernIcon size={20} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
                  Signalement des Révisions (Rappels par Email)
                </h3>
                <span style={{ background: '#fdf6e2', color: '#713f12', border: '1px solid #DDB762', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.55rem', borderRadius: '12px' }}>
                  ● Surveillance Active
                </span>
              </div>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.84rem', color: '#64748b', lineHeight: 1.45 }}>
                Le système signale automatiquement l'élève à ses heures de révision par <strong>Email</strong> ({currentUser?.uti_ema || 'Non configuré'}).
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: emailPermission ? '#881337' : '#b45309', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>{emailPermission ? 'Permission accordée' : 'Rappels en pause'}</span>
                </span>
                <span style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>•</span>
                <button
                  type="button"
                  onClick={handleTogglePermission}
                  disabled={isUpdatingPermission}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  {isUpdatingPermission ? 'Mise à jour...' : emailPermission ? 'Désactiver les rappels' : 'Activer les rappels'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={isSendingReminder}
              onClick={() => handleTriggerReminder()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, padding: '0.5rem 1.1rem' }}
            >
              <span className="account-icon">✉️</span>
              <span>{isSendingReminder ? 'Envoi en cours...' : 'Tester le signalement (Email)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. AIGUILLAGE STRATÉGIQUE PRÉALABLE EN CAS DE DIVERGENCE */}
      {contradictionInfo.hasContradiction && (
        <div
          className="card"
          style={{
            marginBottom: '1.5rem',
            borderLeft: '5px solid #f59e0b',
            background: chosenTrack ? '#fffdf7' : '#fffbeb',
            border: '1.5px solid #fcd34d',
            padding: '1.35rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="account-icon" style={{ fontSize: '1.7rem' }}>🧭</span>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Aiguillage Stratégique Avant Révision
                </span>
                <h3 style={{ margin: '0.15rem 0', color: '#92400e', fontSize: '1.2rem', fontWeight: 800 }}>
                  {contradictionInfo.reasonTitle}
                </h3>
              </div>
            </div>
            {chosenTrack && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setChosenTrack(null)}
                style={{ fontSize: '0.82rem', padding: '0.3rem 0.65rem', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <span className="account-icon">✏️</span>
                <span>Changer ma priorité ({chosenTrack.badge})</span>
              </button>
            )}
          </div>

          <p style={{ margin: '0 0 1.15rem 0', color: '#78350f', fontSize: '0.92rem', lineHeight: 1.55 }}>
            {contradictionInfo.reasonDescription}
            <br />
            <strong>Sélectionnez le cap que votre tableau de révision doit prioriser :</strong>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.9rem' }}>
            {contradictionInfo.trackA && (
              <div
                onClick={() => handleSelectTrack(contradictionInfo.trackA)}
                style={{
                  background: chosenTrack?.id === contradictionInfo.trackA.id ? '#fef3c7' : '#ffffff',
                  border: `2px solid ${chosenTrack?.id === contradictionInfo.trackA.id ? '#f59e0b' : '#fed7aa'}`,
                  borderRadius: '10px',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: chosenTrack?.id === contradictionInfo.trackA.id ? '0 4px 12px rgba(245, 158, 11, 0.2)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#9a3412' }}>
                    1. {contradictionInfo.trackA.badge}
                  </span>
                  <span className="account-icon" style={{ fontSize: '1.15rem' }}>
                    {chosenTrack?.id === contradictionInfo.trackA.id ? '✅' : '⚪'}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#7c2d12', fontSize: '1rem', fontWeight: 800 }}>
                  {contradictionInfo.trackA.title}
                </h4>
                <p style={{ margin: '0 0 0.6rem 0', color: '#57534e', fontSize: '0.84rem', lineHeight: 1.45 }}>
                  {contradictionInfo.trackA.description}
                </p>
                <div style={{ fontSize: '0.78rem', color: '#9a3412', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="account-icon">📚</span>
                  <span>Matières cibles : {contradictionInfo.trackA.keySubjects.join(', ')}</span>
                </div>
              </div>
            )}

            {contradictionInfo.trackB && (
              <div
                onClick={() => handleSelectTrack(contradictionInfo.trackB)}
                style={{
                  background: chosenTrack?.id === contradictionInfo.trackB.id ? '#fef3c7' : '#ffffff',
                  border: `2px solid ${chosenTrack?.id === contradictionInfo.trackB.id ? '#f59e0b' : '#fed7aa'}`,
                  borderRadius: '10px',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: chosenTrack?.id === contradictionInfo.trackB.id ? '0 4px 12px rgba(245, 158, 11, 0.2)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#9a3412' }}>
                    2. {contradictionInfo.trackB.badge}
                  </span>
                  <span className="account-icon" style={{ fontSize: '1.15rem' }}>
                    {chosenTrack?.id === contradictionInfo.trackB.id ? '✅' : '⚪'}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#7c2d12', fontSize: '1rem', fontWeight: 800 }}>
                  {contradictionInfo.trackB.title}
                </h4>
                <p style={{ margin: '0 0 0.6rem 0', color: '#57534e', fontSize: '0.84rem', lineHeight: 1.45 }}>
                  {contradictionInfo.trackB.description}
                </p>
                <div style={{ fontSize: '0.78rem', color: '#9a3412', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="account-icon">🚀</span>
                  <span>Compétences cibles : {contradictionInfo.trackB.keySubjects.join(', ')}</span>
                </div>
              </div>
            )}

            {contradictionInfo.trackC && (
              <div
                onClick={() => handleSelectTrack(contradictionInfo.trackC)}
                style={{
                  background: chosenTrack?.id === contradictionInfo.trackC.id ? '#fef3c7' : '#ffffff',
                  border: `2px solid ${chosenTrack?.id === contradictionInfo.trackC.id ? '#f59e0b' : '#fed7aa'}`,
                  borderRadius: '10px',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: chosenTrack?.id === contradictionInfo.trackC.id ? '0 4px 12px rgba(245, 158, 11, 0.2)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#b45309', background: '#fef08a', padding: '0.15rem 0.45rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span className="account-icon">⭐</span>
                    <span>{contradictionInfo.trackC.badge}</span>
                  </span>
                  <span className="account-icon" style={{ fontSize: '1.15rem' }}>
                    {chosenTrack?.id === contradictionInfo.trackC.id ? '✅' : '⚪'}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#7c2d12', fontSize: '1rem', fontWeight: 800 }}>
                  {contradictionInfo.trackC.title}
                </h4>
                <p style={{ margin: '0 0 0.6rem 0', color: '#57534e', fontSize: '0.84rem', lineHeight: 1.45 }}>
                  {contradictionInfo.trackC.description}
                </p>
                <div style={{ fontSize: '0.78rem', color: '#9a3412', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="account-icon">⚖️</span>
                  <span>Double équilibre : {contradictionInfo.trackC.keySubjects.slice(0, 4).join(', ')}...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. ÉTAT D'ATTENTE OU SÉLECTION DE CHEMIN */}
      {contradictionInfo.hasContradiction && !chosenTrack ? (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', background: '#f8fafc' }}>
          <div className="account-icon" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👉</div>
          <h3 style={{ color: '#1e293b', marginBottom: '0.4rem' }}>
            Veuillez sélectionner votre stratégie de révision ci-dessus
          </h3>
          <p style={{ color: '#64748b', maxWidth: '580px', margin: '0 auto', fontSize: '0.92rem' }}>
            Choisissez votre cap prioritaire pour que le tableau unifié configure les matières et les créneaux adaptés à votre réussite.
          </p>
        </div>
      ) : !unifiedSchedule ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#ffffff', border: '2px dashed #cbd5e1', borderRadius: '14px' }}>
          <div className="account-icon" style={{ fontSize: '3rem', marginBottom: '0.65rem' }}>🗓️</div>
          <h3 style={{ color: '#0f172a', marginBottom: '0.4rem', fontSize: '1.3rem' }}>
            Établissez votre emploi du temps scolaire (5h à 21h)
          </h3>
          <p style={{ color: '#475569', maxWidth: '620px', margin: '0 auto 1.5rem auto', fontSize: '0.94rem', lineHeight: 1.6 }}>
            Renseignez vos cours et activités du lundi au dimanche en cliquant sur les cases d'une heure. Le système examinera votre temps libre pour y intégrer automatiquement vos créneaux de révision ciblés.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowImportModal(true)}
            style={{ padding: '0.8rem 1.8rem', fontSize: '1rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <span className="account-icon">🗓️</span>
            <span>Ouvrir le tableau (5h - 21h)</span>
          </button>
        </div>
      ) : (
        /* 5. TABLEAU UNIQUE, FUSIONNÉ ET ÉPURÉ */
        <>
          {/* BARRE D'OUTILS ET FILTRES RAPIDES DU TABLEAU */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '1rem',
              background: '#f8fafc',
              padding: '0.65rem 1rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
            }}
          >
            {/* Filtre de type de créneau */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginRight: '0.2rem' }}>
                Afficher :
              </span>
              <button
                type="button"
                onClick={() => setSlotTypeFilter('tous')}
                style={{
                  border: slotTypeFilter === 'tous' ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                  background: slotTypeFilter === 'tous' ? '#eff6ff' : '#ffffff',
                  color: slotTypeFilter === 'tous' ? '#1e40af' : '#64748b',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Tout voir
              </button>
              <button
                type="button"
                onClick={() => setSlotTypeFilter('cours')}
                style={{
                  border: slotTypeFilter === 'cours' ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
                  background: slotTypeFilter === 'cours' ? '#f0fdf4' : '#ffffff',
                  color: slotTypeFilter === 'cours' ? '#15803d' : '#64748b',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <span>Cours uniquement</span>
              </button>
              <button
                type="button"
                onClick={() => setSlotTypeFilter('revision')}
                style={{
                  border: slotTypeFilter === 'revision' ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
                  background: slotTypeFilter === 'revision' ? '#f5f3ff' : '#ffffff',
                  color: slotTypeFilter === 'revision' ? '#6d28d9' : '#64748b',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span className="account-icon">🎯</span>
                <span>Révisions uniquement</span>
              </button>
            </div>
          </div>

          {/* LE TABLEAU UNIQUE ET ÉPURÉ (GRILLE PAR JOUR) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {unifiedSchedule?.jours?.map((jour, jIdx) => {
                const filteredSlots = (jour.creneaux || []).filter((c) => {
                  if (slotTypeFilter === 'cours') return c.categorie === 'cours';
                  if (slotTypeFilter === 'revision') return c.categorie === 'revision';
                  return true;
                });

                return (
                  <div
                    key={jIdx}
                    className="card"
                    style={{
                      padding: 0,
                      overflow: 'hidden',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      background: '#ffffff',
                    }}
                  >
                    {/* EN-TÊTE DU JOUR */}
                    <div
                      style={{
                        padding: '0.85rem 1.25rem',
                        background: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                          {jour.nom}
                        </span>
                        <span
                          style={{
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            color: '#475569',
                            background: '#e2e8f0',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                          }}
                        >
                          {jour.statut}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {filteredSlots.filter((c) => c.categorie === 'cours').length} cours scolaires •{' '}
                        {filteredSlots.filter((c) => c.categorie === 'revision').length} sessions de révision
                      </div>
                    </div>

                    {/* LIGNES CHRONOLOGIQUES DU TABLEAU UNIQUE */}
                    <div style={{ padding: '0.75rem 1.25rem' }}>
                      {filteredSlots.length === 0 ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', fontSize: '0.88rem' }}>
                          Aucun créneau correspondant au filtre actif pour ce jour.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                          {filteredSlots.map((slot, sIdx) => {
                            const isRevision = slot.categorie === 'revision';
                            const isBreak = slot.categorie === 'pause' || slot.type === 'pause' || slot.categorie === 'libre';
                            const isSleep = slot.categorie === 'repos';

                            // Styles visuels épurés selon le type
                            let bgColor = '#ffffff';
                            let borderColor = '#e2e8f0';
                            let accentColor = '#2563eb';
                            let badgeBg = '#eff6ff';
                            let badgeColor = '#1e40af';
                            let badgeIcon = '';
                            let badgeLabel = 'Cours scolaire';

                            if (isRevision) {
                              bgColor = '#fcfdfe';
                              borderColor = '#c7d2fe';
                              accentColor = '#6366f1';
                              badgeBg = '#e0e7ff';
                              badgeColor = '#4338ca';
                              badgeIcon = '🎯';
                              badgeLabel = 'Révision e-hari';
                            } else if (isSleep) {
                              bgColor = '#f8fafc';
                              borderColor = '#e2e8f0';
                              accentColor = '#64748b';
                              badgeBg = '#f1f5f9';
                              badgeColor = '#475569';
                              badgeIcon = '🌙';
                              badgeLabel = 'Repos & Sommeil';
                            } else if (isBreak) {
                              bgColor = '#fafafa';
                              borderColor = '#f1f5f9';
                              accentColor = '#10b981';
                              badgeBg = '#ecfdf5';
                              badgeColor = '#047857';
                              badgeIcon = '🥪';
                              badgeLabel = 'Pause';
                            }

                            // Au clic sur une case du tableau principal, permet d'ouvrir l'éditeur sur ce créneau
                            const matchingHour = SCHEDULE_HOURS.find((h) => h.startsWith(slot.debut)) || `${slot.debut} - ${slot.fin}`;

                            return (
                              <div
                                key={sIdx}
                                onClick={() => {
                                  setEditingCell({
                                    day: jour.nom,
                                    hour: matchingHour,
                                    text: slot.matiere,
                                  });
                                  setShowImportModal(true);
                                }}
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: '120px auto',
                                  alignItems: 'center',
                                  background: bgColor,
                                  border: `1px solid ${borderColor}`,
                                  borderLeft: `5px solid ${accentColor}`,
                                  borderRadius: '8px',
                                  padding: '0.65rem 0.95rem',
                                  gap: '1rem',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                }}
                                title="Cliquer pour modifier ce créneau dans l'emploi du temps"
                              >
                                {/* CRÉNEAU HORAIRE */}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                                    {slot.debut} - {slot.fin}
                                  </span>
                                  {!isRevision && badgeLabel && (
                                    <span
                                      style={{
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        background: badgeBg,
                                        color: badgeColor,
                                        padding: '0.15rem 0.45rem',
                                        borderRadius: '4px',
                                        marginTop: '0.2rem',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.25rem',
                                      }}
                                    >
                                      <span className="account-icon" style={{ fontSize: '0.75rem' }}>{badgeIcon}</span>
                                      <span>{badgeLabel}</span>
                                    </span>
                                  )}
                                </div>

                                {/* CONTENU DU CRÉNEAU */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <strong style={{ fontSize: '0.96rem', color: isRevision ? '#312e81' : '#0f172a' }}>
                                        {slot.matiere}
                                      </strong>
                                      <span className="account-icon" style={{ fontSize: '0.72rem', color: '#94a3b8' }}>✏️</span>
                                    </div>

                                    {/* OBJECTIF PRÉCIS POUR LES RÉVISIONS */}
                                    {isRevision && slot.objectif && (
                                      <div style={{ fontSize: '0.85rem', color: '#3730a3', marginTop: '0.3rem', lineHeight: 1.45, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <span
                                          className="slot-objective-target-icon"
                                          style={{
                                            fontSize: '1.05rem',
                                            filter: 'none',
                                            WebkitFilter: 'none',
                                            opacity: 1,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            lineHeight: 1,
                                          }}
                                          title="Objectif de révision"
                                        >
                                          🎯
                                        </span>
                                        <span>
                                          <strong style={{ color: '#312e81', fontWeight: 700 }}>Objectif : </strong>
                                          <span style={{ color: '#4338ca', fontWeight: 600 }}>{slot.objectif}</span>
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* ACTION DE SIGNALEMENT POUR CE CRÉNEAU */}
                                  {isRevision && (
                                    <button
                                      type="button"
                                      className="action-icon-btn action-message"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTriggerReminder({
                                          matiere: slot.matiere,
                                          objectif: slot.objectif,
                                          debut: slot.debut,
                                          fin: slot.fin,
                                          jour: jour.nom,
                                        });
                                      }}
                                      style={{
                                        fontSize: '0.76rem',
                                        padding: '0.3rem 0.7rem',
                                        background: '#ffffff',
                                        borderColor: '#bfdbfe',
                                        color: '#1d4ed8',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        fontWeight: 600,
                                        borderRadius: '6px',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                      }}
                                      title="Signaler l'élève par Email pour cette séance"
                                    >
                                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>

                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* RÈGLES D'OR DE LA MÉTHODOLOGIE E-HARI */}
          <div className="card" style={{ marginTop: '1.5rem', background: '#f8fafc', borderLeft: '5px solid #2563eb', padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.85rem 0', color: '#1e3a8a', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span className="color-emoji" style={{ fontSize: '1.25rem', filter: 'none', WebkitFilter: 'none', opacity: 1, display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>🧠</span>
              <span>Les 3 Clés d'Excellence Méthodologique de l'ONG HARI</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '1rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="account-icon">🌙</span>
                  <strong>Sommeil Réparateur (8h)</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                  Un cerveau reposé mémorise 40% plus vite. Évitez les écrans après 21h30 et dormez avant 22h.
                </p>
              </div>
              <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '1rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="account-icon">⏱️</span>
                  <strong>Méthode Pomodoro</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                  45 minutes de travail intense sans interruption téléphonique, suivies de 10 minutes d'aération.
                </p>
              </div>
              <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '1rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="account-icon">📈</span>
                  <strong>Répétition Espacée</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                  Relisez les synthèses le soir même (J0), puis à J+2 et J+7 pour ancrer durablement la mémoire.
                </p>
              </div>
            </div>
          </div>

          {/* LIEN RAPIDE VERS LE BILAN STRATÉGIQUE */}
          <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onGoToBilan}
              style={{ padding: '0.65rem 1.6rem', fontSize: '0.94rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <span className="account-icon">🤝</span>
              <span>Revenir à mon Bilan d'Orientation Complet</span>
            </button>
          </div>
        </>
      )}

      {/* ========================================================
          MODAL DU TABLEAU DE SAISIE PAR TRANCHE D'UNE HEURE (5h à 21h)
          Fermeture au clic hors-zone, saisie interactive par case
          ======================================================== */}
      {showImportModal && (
        <div
          className="auth-modal-backdrop"
          style={{ zIndex: 9999 }}
          onClick={() => {
            if (!isScanning) setShowImportModal(false);
          }}
        >
          <div
            className="auth-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '1050px', width: '96vw', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
          >
            <div
              className="auth-card modal-inner-card"
              style={{
                padding: '1.25rem 1.4rem',
                position: 'relative',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '90vh',
                overflow: 'hidden',
              }}
            >
              {/* EN-TÊTE DU MODAL */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <JoyfulScheduleHeaderIcon size={38} />
                  <div>
                    <h2
                      style={{
                        margin: '0 0 0.2rem 0',
                        color: '#7f1d1d',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                      }}
                    >
                      Mon Emploi du Temps Scolaire (5h à 21h)
                    </h2>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.82rem', lineHeight: 1.4 }}>
                      Cliquez sur n'importe quelle case pour entrer votre cours ou activité. Le système examinera votre temps libre pour y intégrer vos révisions.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="action-icon-btn action-delete"
                    onClick={() => {
                      setWeeklyGrid(getInitialWeeklyGrid());
                      setGridError('');
                    }}
                    title="Tout effacer (Vierge)"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="action-icon-btn action-activate"
                    onClick={() => {
                      setWeeklyGrid(getDefaultLycéeWeeklyGrid(eleveClasse, eleveSerie));
                      setGridError('');
                    }}
                    title="Appliquer le modèle type lycée"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* MESSAGE D'ERREUR SI EDT VIDE OU INVALIDE */}
              {gridError && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1.5px solid #f87171',
                    color: '#991b1b',
                    borderRadius: '8px',
                    padding: '0.65rem 1rem',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    marginBottom: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.12)',
                  }}
                >
                  <span className="account-icon" style={{ fontSize: '1.25rem' }}>⚠️</span>
                  <span>{gridError}</span>
                </div>
              )}

              {/* CONTENU : ANIMATION OU TABLEAU PAR TRANCHE DE 1H */}
              {isScanning ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      margin: '0 auto 1rem auto',
                      borderRadius: '50%',
                      border: '3px solid #f5e5b8',
                      borderTopColor: '#881337',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  <h4 style={{ color: '#7f1d1d', margin: '0 0 0.35rem 0', fontSize: '1.15rem', fontWeight: 800 }}>
                    Examen de votre emploi du temps et calcul des temps libres...
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.84rem', margin: '0 0 0.85rem 0' }}>
                    Détection des cours • Optimisation des créneaux de révision ciblés • Sauvegarde
                  </p>
                  <div style={{ width: '80%', maxWidth: '400px', margin: '0 auto', background: '#f5ebd1', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${scanProgress}%`,
                        background: 'linear-gradient(90deg, #881337, #DDB762)',
                        height: '100%',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#881337', fontWeight: 700, marginTop: '0.45rem', display: 'inline-block' }}>
                    {scanProgress}% effectué
                  </span>
                </div>
              ) : (
                <>
                  {/* TABLEAU INTERACTIF DÉCOUPÉ PAR TRANCHE DE 1H */}
                  <div
                    style={{
                      flex: 1,
                      overflowX: 'auto',
                      overflowY: 'auto',
                      border: '1px solid #e2cfa0',
                      borderRadius: '10px',
                      background: '#ffffff',
                      marginBottom: '0.85rem',
                      maxHeight: '56vh',
                    }}
                  >
                    <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                      <thead style={{ position: 'sticky', top: 0, background: '#fdf6e2', zIndex: 2 }}>
                        <tr>
                          <th style={{ padding: '0.55rem 0.75rem', borderBottom: '2px solid #DDB762', borderRight: '1px solid #e6d6aa', color: '#7f1d1d', fontWeight: 800, width: '105px' }}>
                            Heure
                          </th>
                          {SCHEDULE_DAYS.map((day) => (
                            <th key={day} style={{ padding: '0.55rem 0.65rem', borderBottom: '2px solid #DDB762', borderRight: '1px solid #ede1be', color: '#7f1d1d', fontWeight: 800, textAlign: 'center' }}>
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {SCHEDULE_HOURS.map((h, hIdx) => (
                          <tr key={h} style={{ background: hIdx % 2 === 0 ? '#ffffff' : '#fffdf8', borderBottom: '1px solid #efe7d1' }}>
                            {/* Colonne heure */}
                            <td style={{ padding: '0.4rem 0.6rem', borderRight: '1px solid #e6d6aa', fontWeight: 700, color: '#7f1d1d', background: '#faf6eb', whiteSpace: 'nowrap' }}>
                              {h.replace(':00', 'h').replace(':00', 'h')}
                            </td>

                            {/* Colonnes des jours */}
                            {SCHEDULE_DAYS.map((day) => {
                              const cellValue = (weeklyGrid[day]?.[h] || '').trim();
                              const isFilled = Boolean(cellValue);
                              const isPause = cellValue.toLowerCase().includes('pause') || cellValue.toLowerCase().includes('repas') || cellValue.toLowerCase().includes('déjeuner');

                              return (
                                <td
                                  key={day}
                                  onClick={() => {
                                    setEditingCell({
                                      day,
                                      hour: h,
                                      text: cellValue,
                                    });
                                  }}
                                  style={{
                                    padding: '0.35rem 0.45rem',
                                    borderRight: '1px solid #efe7d1',
                                    cursor: 'pointer',
                                    verticalAlign: 'middle',
                                    transition: 'background 0.15s ease',
                                    background: isFilled ? (isPause ? '#fdf2f4' : '#fdf6e2') : 'transparent',
                                    minHeight: '36px',
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isFilled) e.currentTarget.style.background = '#faf5e4';
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isFilled) e.currentTarget.style.background = 'transparent';
                                  }}
                                  title={`Cliquer pour modifier : ${day} (${h})`}
                                >
                                  {isFilled ? (
                                    <div
                                      style={{
                                        background: isPause ? '#fce7eb' : '#f6e6ba',
                                        color: isPause ? '#881337' : '#7f1d1d',
                                        padding: '0.2rem 0.45rem',
                                        borderRadius: '5px',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        lineHeight: 1.25,
                                        border: `1px solid ${isPause ? '#f3c4cf' : '#DDB762'}`,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        pointerEvents: 'none',
                                      }}
                                    >
                                      {cellValue}
                                    </div>
                                  ) : (
                                    <div style={{ color: '#94a3b8', textAlign: 'center', fontSize: '0.75rem', pointerEvents: 'none' }}>
                                      <span style={{ background: '#fffdf8', border: '1px dashed #d6c596', color: '#8c6d2c', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>+</span>
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* BOUTON DE SOUMISSION / VALIDATION GLOBALE */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          background: countFilledHours(weeklyGrid) >= 5 ? '#fdf6e2' : '#fef2f2',
                          color: countFilledHours(weeklyGrid) >= 5 ? '#713f12' : '#991b1b',
                          border: `1px solid ${countFilledHours(weeklyGrid) >= 5 ? '#DDB762' : '#fca5a5'}`,
                        }}
                      >
                        {countFilledHours(weeklyGrid)} heure(s) renseignée(s) (Minimum requis : 5h)
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ color: '#b45309', display: 'inline-flex' }}><LightbulbModernIcon size={15} /></span>
                        <em>Les cases vides seront analysées comme temps libre pour vos révisions.</em>
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleConfirmWeeklyGrid}
                      style={{
                        padding: '0.7rem 1.6rem',
                        fontSize: '0.94rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        background: 'linear-gradient(135deg, #9f1239 0%, #7f1d1d 100%)',
                        border: 'none',
                        color: '#ffffff',
                        boxShadow: '0 6px 16px -4px rgba(127, 29, 29, 0.35)',
                      }}
                    >
                      <SparklePlayIcon size={16} />
                      <span>Valider mon EDT & Générer mes révisions adaptées</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          BOÎTE DE SAISIE POUR LE JOUR ET L'HEURE PRÉCIS
          S'affiche au premier plan (z-index 30000) dès qu'on clique sur une case
          ======================================================== */}
      {editingCell && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.65)',
            zIndex: 30000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setEditingCell(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
              border: '2px solid #881337',
              position: 'relative',
              animation: 'modalPopupScaleIn 0.18s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#881337', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Édition du créneau
                </span>
                <h3 style={{ margin: '0.2rem 0 0 0', color: '#0f172a', fontSize: '1.25rem', fontWeight: 800 }}>
                  {editingCell.day} • {editingCell.hour.replace(':00', 'h').replace(':00', 'h')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCell(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 700,
                  color: '#64748b',
                }}
              >
                ✕
              </button>
            </div>

            {/* CHAMP TEXTE D'ÉDITION */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Que faites-vous durant cette période ?
              </label>
              <input
                type="text"
                ref={cellInputRef}
                className="form-control"
                value={editingCell.text}
                onChange={(e) => setEditingCell({ ...editingCell, text: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSaveCurrentCell();
                  }
                  if (e.key === 'Escape') {
                    setEditingCell(null);
                  }
                }}
                placeholder="Ex: Mathématiques, Français, EPS, Devoir, etc."
                style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.98rem', borderRadius: '8px', border: '2px solid #cbd5e1' }}
              />
            </div>

            {/* SUGGESTIONS RAPIDES EN 1 CLIC */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '0.45rem' }}>
                Suggestions rapides en 1 clic :
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxHeight: '120px', overflowY: 'auto' }}>
                {quickSuggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleSaveCurrentCell(sug)}
                    style={{
                      background: editingCell.text === sug ? '#dbeafe' : '#f8fafc',
                      border: `1px solid ${editingCell.text === sug ? '#3b82f6' : '#cbd5e1'}`,
                      borderRadius: '6px',
                      padding: '0.25rem 0.6rem',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: editingCell.text === sug ? '#1e40af' : '#334155',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* BOUTONS D'ACTION */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.65rem' }}>
              <button
                type="button"
                className="action-icon-btn action-delete"
                onClick={handleClearCurrentCell}
                title="Rendre ce créneau libre (Effacer)"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setEditingCell(null)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleSaveCurrentCell()}
                  style={{ fontWeight: 800, padding: '0.45rem 1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Valider la tâche</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL DE CONFIRMATION DE SIGNALEMENT PAR EMAIL
          ======================================================== */}
      {showReminderModal && reminderResult && (
        <div
          className="auth-modal-backdrop"
          style={{ zIndex: 32000 }}
          onClick={() => setShowReminderModal(false)}
        >
          <div
            className="auth-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px', width: '95vw' }}
          >
            <div
              className="auth-card modal-inner-card"
              style={{
                padding: '1.5rem',
                borderRadius: '16px',
                background: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="account-icon" style={{ fontSize: '1.4rem' }}>✉️</span>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e3a8a', fontWeight: 800 }}>
                    Signalement de Révision Envoyé par Email !
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReminderModal(false)}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    color: '#64748b',
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '1.3rem' }}>✅</span>
                <div style={{ fontSize: '0.88rem', color: '#166534', fontWeight: 600 }}>
                  L'élève <strong>{reminderResult.student.name}</strong> a été alerté par email ({reminderResult.student.email}) pour son heure de révision.
                </div>
              </div>

              {/* APERÇU EMAIL TRANSMIS */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span className="account-icon">✉️</span>
                    <span>Courrier officiel transmis à l'adresse de l'élève :</span>
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#1d4ed8', background: '#dbeafe', padding: '0.2rem 0.6rem', borderRadius: '10px', fontWeight: 700 }}>
                    ✓ Email Délivré
                  </span>
                </div>
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '1rem 1.15rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '0.45rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div><strong>Expéditeur (Admin) : </strong><span style={{ color: '#166534', fontWeight: 600 }}>{reminderResult.admin?.name || 'Administrateur e-HARI'} &lt;{reminderResult.admin?.email}&gt;</span></div>
                    <div><strong>Destinataire (Élève) : </strong><span style={{ color: '#2563eb', fontWeight: 600 }}>{reminderResult.student?.name} &lt;{reminderResult.student?.email}&gt;</span></div>
                  </div>
                  <div style={{ fontSize: '0.92rem', color: '#1e3a8a', fontWeight: 800, marginBottom: '0.6rem' }}>
                    {reminderResult.content.emailSubject}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.55, background: '#ffffff', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', whiteSpace: 'pre-line' }}>
                    {reminderResult.content.emailText}
                  </div>
                </div>
              </div>

              {/* LIEN DIRECT POUR CONSULTER LE MAIL REÇU EN LIGNE (ZÉRO CONFIGURATION REQUISE) */}
              {reminderResult.previewUrl && (
                <div style={{ background: '#f8fafc', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.82rem', color: '#1e3a8a', marginBottom: '0.45rem', fontWeight: 600 }}>
                    Boîte de test active : Vous pouvez visualiser le message exactement tel qu'il a été transmis.
                  </div>
                  <a
                    href={reminderResult.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.45rem 1.15rem',
                      color: '#1d4ed8',
                      borderColor: '#93c5fd',
                      background: '#ffffff',
                      fontWeight: 700,
                      textDecoration: 'none',
                      borderRadius: '8px',
                    }}
                  >
                    <span>🔗 Ouvrir & Lire l'e-mail dans le Webmail</span>
                  </a>
                </div>
              )}

              <div style={{ textAlign: 'right', paddingTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowReminderModal(false)}
                  style={{ padding: '0.5rem 1.4rem', fontWeight: 700 }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
