import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { api } from './services/api';
import { HariEmblem, OngHariOfficialLogo } from './components/HariLogo';
import PersonalityAvatar from './components/PersonalityAvatar';
import ModernTestIcon from './components/ModernTestIcon';
import OrientationBriefingView from './components/OrientationBriefingView';
import RevisionScheduleView from './components/RevisionScheduleView';
import StudentCareerBriefingView from './components/StudentCareerBriefingView';
import StudentInsertionView from './components/StudentInsertionView';
import CvLetterBuilderView from './components/CvLetterBuilderView';
import {
  TEST_INTERETS_QUESTIONS,
  computeOrientation1,
  LISTE_MATIERES_DISPONIBLES,
  LISTE_APTITUDES,
  computeOrientation2,
} from './data/orientationTests';
import {
  TEST_ETUDIANT_INTERETS_CATEGORIES,
  TEST_ETUDIANT_INTERETS_QUESTIONS,
  computeStudentOrientation1,
  LISTE_DOMAINES_EXCELLENCE_ETUDIANT,
  LISTE_APTITUDES_ETUDIANT,
  TEST_ETUDIANT_POLES_INSERTION,
  computeStudentOrientation2,
} from './data/studentOrientationTests';
import ReconversionCareerBriefingView from './components/ReconversionCareerBriefingView';
import SecteursRecrutementMadaView from './components/SecteursRecrutementMadaView';
import MessengerChatView from './components/MessengerChatView';
import UserHistogramChart from './components/UserHistogramChart';
import AdminEntreprisesView from './components/AdminEntreprisesView';
import AdminFacultesView from './components/AdminFacultesView';
import AdminMetiersView from './components/AdminMetiersView';
import {
  DashboardIcon,
  ElevesIcon,
  EtudiantsIcon,
  EmploiIcon,
  EntreprisesIcon,
  FacultesIcon,
  MetiersIcon,
  MessagesIcon,
  MonCompteIcon,
  ProfilIcon,
  PassionsIcon,
  MatieresIcon,
  GuideIcon,
  PlanningIcon,
  InsertionIcon,
  SecteursIcon,
  CvBuilderIcon,
  PhoneIcon,
  PinIcon,
  MailIcon,
  CheckIcon,
  CloseIcon,
  CameraIcon,
  TrashIcon,
  ClipboardIcon,
  AlertCircleIcon,
  SparklesIcon,
  LockIcon,
  SettingsIcon,
  BookOpenIcon,
  ScienceIcon,
  RocketIcon,
  HandshakeIcon,
} from './components/NavIcons';
import {
  TEST_RECONVERSION_INTERETS_CATEGORIES,
  TEST_RECONVERSION_INTERETS_QUESTIONS,
  computeReconversionOrientation1,
  LISTE_DOMAINES_COMPETENCES_RECONVERSION,
  LISTE_APTITUDES_RECONVERSION,
  TEST_RECONVERSION_POLES_INSERTION,
  computeReconversionOrientation2,
} from './data/reconversionOrientationTests';
import {
  MADAGASCAR_SERIES,
  isTerminaleClass,
} from './data/madagascarSeries';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('home'); // 'home' ou onglets connectés
  const [authMode, setAuthMode] = useState('login'); // 'login' ou 'register'
  const [showAuthModal, setShowAuthModal] = useState(false); // Affichage du popup modal sur la page d'accueil
  const [centerCardRole, setCenterCardRole] = useState('etudiant'); // Carte mise au centre sur la page d'accueil ('eleve' | 'etudiant' | 'emploi')
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Données globales pour l'administrateur
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [pupils, setPupils] = useState([]);
  const [students, setStudents] = useState([]);
  const [reconversions, setReconversions] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Messagerie MP
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [activeChatUserId, setActiveChatUserId] = useState(null);

  // Formulaire de connexion
  const [loginForm, setLoginForm] = useState({ email: '', mot_de_passe: '' });

  // Formulaire d'inscription : type profil, nom, prénom, email, mot de passe, téléphone, adresse + cursus scolaire ou universitaire
  const [regForm, setRegForm] = useState({
    uti_rol: 'eleve',
    uti_nom: '',
    uti_pre: '',
    uti_ema: '',
    uti_pas: '',
    uti_tel: '',
    uti_adr: '',
    ele_eta: '',
    ele_cla: '',
    ele_ser: '',
    ele_not_ema: true, // Permission de rappel de révision par e-mail demandée dès la création du compte
    etu_eta: '',
    etu_fil: '',
    etu_niv_etu: '',
    emp_sit_act: '',
    emp_met_act: '',
  });

  // État pour la modification des informations de profil de l'élève
  const [editingEleveProfile, setEditingEleveProfile] = useState(false);
  const [eleveProfileForm, setEleveProfileForm] = useState({
    uti_nom: '',
    uti_pre: '',
    uti_tel: '',
    uti_adr: '',
    ele_eta: '',
    ele_cla: '',
    ele_ser: '',
  });

  // État pour la modification des informations de profil de l'étudiant
  const [editingStudentProfile, setEditingStudentProfile] = useState(false);
  const [studentProfileForm, setStudentProfileForm] = useState({
    uti_nom: '',
    uti_pre: '',
    uti_tel: '',
    uti_adr: '',
    etu_eta: '',
    etu_fil: '',
    etu_niv_etu: '',
  });

  // État pour la modification des informations de profil de l'administrateur
  const [editingAdminProfile, setEditingAdminProfile] = useState(false);
  const [adminProfileForm, setAdminProfileForm] = useState({
    uti_nom: '',
    uti_pre: '',
    uti_ema: '',
    uti_tel: '',
    uti_adr: '',
    uti_pas: '',
    confirm_pas: '',
  });
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // État pour la modification des informations de profil de l'emploi / reconversion
  const [editingRecoProfile, setEditingRecoProfile] = useState(false);
  const [recoProfileForm, setRecoProfileForm] = useState({
    uti_nom: '',
    uti_pre: '',
    uti_tel: '',
    uti_adr: '',
    emp_sit_act: '',
    emp_met_act: '',
  });

  // États spécifiques aux tests d'orientation de l'élève
  const [qcmInteretsStep, setQcmInteretsStep] = useState(0);
  const [qcmInteretsAnswers, setQcmInteretsAnswers] = useState({});
  const [test1ResultModal, setTest1ResultModal] = useState(null);
  const [test1Alert, setTest1Alert] = useState('');
  const [isEditingTest1, setIsEditingTest1] = useState(false);

  const [qcmMatieresFavorites, setQcmMatieresFavorites] = useState([]);
  const [qcmAptitudes, setQcmAptitudes] = useState({
    apt_calcul: 2,
    apt_redaction: 2,
    apt_oral: 2,
    apt_observation: 2,
    apt_analyse_societe: 2,
    apt_technique: 2,
  });
  const [test2ResultModal, setTest2ResultModal] = useState(null);
  const [test2Alert, setTest2Alert] = useState('');
  const [isEditingTest2, setIsEditingTest2] = useState(false);
  const [submittingTest, setSubmittingTest] = useState(false);

  // États spécifiques aux tests d'orientation & insertion de l'étudiant
  const [studentQcmStep, setStudentQcmStep] = useState(0);
  const [studentQcmAnswers, setStudentQcmAnswers] = useState({});
  const [studentTest1Modal, setStudentTest1Modal] = useState(null);
  const [studentTest1Alert, setStudentTest1Alert] = useState('');
  const [isEditingStudentTest1, setIsEditingStudentTest1] = useState(false);

  const [studentSelectedDomaines, setStudentSelectedDomaines] = useState([]);
  const [studentAptitudes, setStudentAptitudes] = useState({
    apt_conception_code: 2,
    apt_analyse_chiffres: 2,
    apt_negociation_comm: 2,
    apt_leadership_orga: 2,
    apt_rigueur_juridique: 2,
    apt_recherche_methodo: 2,
  });
  const [studentTest2Modal, setStudentTest2Modal] = useState(null);
  const [studentTest2Alert, setStudentTest2Alert] = useState('');
  const [isEditingStudentTest2, setIsEditingStudentTest2] = useState(false);
  const [submittingStudentTest, setSubmittingStudentTest] = useState(false);

  // États spécifiques aux tests de reconversion & transition professionnelle
  const [recoQcmStep, setRecoQcmStep] = useState(0);
  const [recoQcmAnswers, setRecoQcmAnswers] = useState({});
  const [recoTest1Modal, setRecoTest1Modal] = useState(null);
  const [recoTest1Alert, setRecoTest1Alert] = useState('');
  const [isEditingRecoTest1, setIsEditingRecoTest1] = useState(false);

  const [recoSelectedDomaines, setRecoSelectedDomaines] = useState([]);
  const [recoAptitudes, setRecoAptitudes] = useState({
    apt_adaptabilite: 2,
    apt_autonomie: 2,
    apt_communication: 2,
    apt_technique_outils: 2,
    apt_rigueur_gestion: 2,
    apt_problem_solving: 2,
  });
  const [recoTest2Modal, setRecoTest2Modal] = useState(null);
  const [recoTest2Alert, setRecoTest2Alert] = useState('');
  const [isEditingRecoTest2, setIsEditingRecoTest2] = useState(false);
  const [submittingRecoTest, setSubmittingRecoTest] = useState(false);

  // Références et états pour l'import de photo de profil via la petite caméra
  const avatarInputRef = useRef(null);
  const accountAvatarInputRef = useRef(null);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const avatarMenuRef = useRef(null);
  const [showAccountAvatarMenu, setShowAccountAvatarMenu] = useState(false);
  const accountAvatarMenuRef = useRef(null);

  // Met en majuscule la première lettre de chaque mot/prénom (ex: "jean michel" -> "Jean Michel", "vololona" -> "Vololona")
  const formatPrenom = (str) => {
    if (!str) return '';
    return str
      .split(/(\s+|-|')/)
      .map((part) => {
        if (!part || /^(\s+|-|')$/.test(part)) return part;
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join('');
  };

  // Helpers pour accéder aux attributs (convention 3 lettres : uti_, ele_)
  const getUserId = (u) => u?.uti_id || u?.util_id || u?.utilisateur_id || u?.id;
  const getUserNom = (u) => u?.uti_nom || u?.util_nom || u?.utilisateur_nom || u?.nom || '';
  const getUserPrenom = (u) => u?.uti_pre || u?.util_pren || u?.utilisateur_prenom || u?.prenom || '';
  const getUserEmail = (u) => u?.uti_ema || u?.util_emai || u?.utilisateur_email || u?.email || '';
  const getUserRole = (u) => {
    const r = u?.uti_rol || u?.util_role || u?.utilisateur_role || u?.role || '';
    if (r === 'reconversion' || r === 'emploi' || r === 'rechercher emploi') return 'rechercher emploi';
    return r;
  };
  const getUserStatut = (u) => u?.uti_sta || u?.util_stat || u?.utilisateur_statut || u?.statut || 'actif';
  const getUserTel = (u) => u?.uti_tel || u?.util_tele || u?.utilisateur_telephone || u?.telephone;
  const getUserAdresse = (u) => u?.uti_adr || u?.util_adre || u?.utilisateur_adresse || u?.adresse || '';
  const getUserAvatar = (u) => u?.uti_ava || u?.util_avat || u?.avatar || '';
  const getUserDatCre = (u) => u?.uti_dat_cre || u?.util_dat_cre || u?.created_at || '';

  // Helpers pour le profil élève
  const getEleveClasse = (u) => u?.profil?.ele_cla || u?.profil?.elev_clas || '';
  const getEleveSerie = (u) => u?.profil?.ele_ser || u?.profil?.elev_seri || '';
  const getEleveEtablissement = (u) => u?.profil?.ele_eta || u?.profil?.elev_etab || '';
  const parseListHelper = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        return trimmed
          .slice(1, -1)
          .split(',')
          .map((s) => s.replace(/^"(.*)"$/, '$1').trim())
          .filter(Boolean);
      }
      if (trimmed.includes(',')) {
        return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
      }
      return [trimmed];
    }
    return [];
  };
  const getEleveCentresInteret = (u) => parseListHelper(u?.test1?.rep_choix || u?.tests?.tel_cen_int || u?.tests?.ele_cen_int || u?.profil?.ele_cen_int || u?.profil?.elev_cent_inte);
  const getEleveMatieres = (u) => parseListHelper(u?.test2?.rep_choix || u?.tests?.tel_mat_pre || u?.tests?.ele_mat_pre || u?.profil?.ele_mat_pre || u?.profil?.elev_mati_pref);
  const getEleveOriPro1 = (u) => u?.test1?.rep_resultat || u?.tests?.tel_ori_pro_1 || u?.tests?.ele_ori_pro_1 || u?.profil?.ele_ori_pro_1 || '';
  const getEleveOriPro2 = (u) => u?.test2?.rep_resultat || u?.tests?.tel_ori_pro_2 || u?.tests?.ele_ori_pro_2 || u?.profil?.ele_ori_pro_2 || '';
  const getEleveEtape = (u) => {
    if (u?.test2?.rep_resultat || u?.tests?.tel_ori_pro_2 || u?.profil?.ele_ori_pro_2) return 3;
    if (u?.test1?.rep_resultat || u?.tests?.tel_ori_pro_1 || u?.profil?.ele_ori_pro_1) return 2;
    const eta = u?.tests?.tel_eta_act || u?.profil?.ele_eta_act;
    if (eta !== undefined && eta !== null) return parseInt(eta, 10);
    return 1;
  };
  const getEleveDetInt = (u) => u?.test1?.rep_detail || u?.tests?.tel_det_int || u?.tests?.ele_det_int || u?.profil?.ele_det_int || null;
  const getEleveDetMat = (u) => u?.test2?.rep_detail || u?.tests?.tel_det_mat || u?.tests?.ele_det_mat || u?.profil?.ele_det_mat || null;

  // Helpers pour le profil étudiant
  const getStudentNiveau = (u) => u?.profil?.etu_niv_etu || u?.profil?.etud_nive_etud || '';
  const getStudentFiliere = (u) => u?.profil?.etu_fil || u?.profil?.etud_fili || '';
  const getStudentEtablissement = (u) => u?.profil?.etu_eta || u?.profil?.etud_etab || '';
  const getStudentOriPro1 = (u) => u?.test1?.rep_resultat || u?.tests?.tet_ori_pro_1 || u?.tests?.etu_ori_pro_1 || u?.profil?.etu_ori_pro_1 || '';
  const getStudentOriPro2 = (u) => u?.test2?.rep_resultat || u?.tests?.tet_ori_pro_2 || u?.tests?.etu_ori_pro_2 || u?.profil?.etu_ori_pro_2 || '';
  const getStudentDetInt = (u) => u?.test1?.rep_detail || u?.tests?.tet_det_int || u?.tests?.etu_det_int || u?.profil?.etu_det_int || null;
  const getStudentDetCom = (u) => u?.test2?.rep_detail || u?.tests?.tet_det_com || u?.tests?.etu_det_com || u?.profil?.etu_det_com || null;
  const getStudentEtape = (u) => {
    if (u?.test2?.rep_resultat || u?.tests?.tet_ori_pro_2 || u?.profil?.etu_ori_pro_2) return 3;
    if (u?.test1?.rep_resultat || u?.tests?.tet_ori_pro_1 || u?.profil?.etu_ori_pro_1) return 2;
    const eta = u?.tests?.tet_eta_act || u?.profil?.etu_eta_act;
    if (eta !== undefined && eta !== null) return parseInt(eta, 10);
    return 1;
  };

  // Helpers pour le profil reconversion / emploi
  const getRecoSituation = (u) => u?.profil?.emp_sit_act || u?.profil?.rec_sit_act || u?.profil?.reco_situ_actu || '';
  const getRecoMetierActuel = (u) => u?.profil?.emp_met_act || u?.profil?.rec_met_act || u?.profil?.reco_meti_actu || '';
  const getRecoOriPro1 = (u) => u?.test1?.rep_resultat || u?.tests?.tem_ori_pro_1 || u?.tests?.emp_ori_pro_1 || u?.profil?.emp_ori_pro_1 || u?.profil?.rec_ori_pro_1 || '';
  const getRecoOriPro2 = (u) => u?.test2?.rep_resultat || u?.tests?.tem_ori_pro_2 || u?.tests?.emp_ori_pro_2 || u?.profil?.emp_ori_pro_2 || u?.profil?.rec_ori_pro_2 || '';
  const getRecoDetMot = (u) => u?.test1?.rep_detail || u?.tests?.tem_det_mot || u?.tests?.emp_det_mot || u?.profil?.emp_det_mot || u?.profil?.rec_det_mot || null;
  const getRecoDetTra = (u) => u?.test2?.rep_detail || u?.tests?.tem_det_tra || u?.tests?.emp_det_tra || u?.profil?.emp_det_tra || u?.profil?.rec_det_tra || null;
  const getRecoEtape = (u) => {
    if (u?.test2?.rep_resultat || u?.tests?.tem_ori_pro_2 || u?.profil?.emp_ori_pro_2 || u?.profil?.rec_ori_pro_2) return 3;
    if (u?.test1?.rep_resultat || u?.tests?.tem_ori_pro_1 || u?.profil?.emp_ori_pro_1 || u?.profil?.rec_ori_pro_1) return 2;
    const eta = u?.tests?.tem_eta_act ?? u?.profil?.emp_eta_act ?? u?.profil?.rec_eta_act;
    if (eta !== undefined && eta !== null) return parseInt(eta, 10);
    return 1;
  };
  const formatDateFr = (dateString) => {
    if (!dateString) return 'Récemment';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Helper pour extraire les réponses de QCM sous forme { 0: 'id', 1: 'id', ... }
  const extractQcmAnswers = (details) => {
    if (!details) return {};
    const raw = details.answers || details.evaluation?.answers || details.evaluation?.details?.answers || {};
    const res = {};
    if (Array.isArray(raw)) {
      raw.forEach((val, idx) => {
        if (val !== undefined && val !== null) {
          res[idx] = val;
        }
      });
    } else if (typeof raw === 'object' && raw !== null) {
      Object.entries(raw).forEach(([k, v]) => {
        const numKey = parseInt(k, 10);
        res[isNaN(numKey) ? k : numKey] = v;
      });
    }
    return res;
  };

  // Helper pour mapper des libellés de matières vers leurs identifiants
  const mapSubjectNamesToIds = (list) => {
    if (!Array.isArray(list)) return [];
    const validIds = new Set(LISTE_MATIERES_DISPONIBLES.map((m) => m.id));
    const result = [];

    list.forEach((item) => {
      if (!item) return;
      const str = String(item).trim();
      const stripped = str.startsWith('mat_') ? str.replace(/^mat_/, '') : str;

      if (validIds.has(str)) {
        if (!result.includes(str)) result.push(str);
        return;
      }
      if (validIds.has(stripped)) {
        if (!result.includes(stripped)) result.push(stripped);
        return;
      }

      const found = LISTE_MATIERES_DISPONIBLES.find(
        (m) =>
          m.id === str ||
          m.id === stripped ||
          m.label.toLowerCase() === str.toLowerCase() ||
          str.toLowerCase().includes(m.label.toLowerCase()) ||
          m.label.toLowerCase().includes(str.toLowerCase())
      );
      if (found && !result.includes(found.id)) {
        result.push(found.id);
      }
    });

    return result.filter((id) => validIds.has(id));
  };

  // Helper pour extraire les matières sélectionnées pour Élève Test 2
  const extractEleveMatieresFavorites = (details, repChoix) => {
    if (details) {
      if (Array.isArray(details.favoriteSubjectIds) && details.favoriteSubjectIds.length > 0) {
        return mapSubjectNamesToIds(details.favoriteSubjectIds);
      }
      if (Array.isArray(details.matieres_preferees) && details.matieres_preferees.length > 0) {
        return mapSubjectNamesToIds(details.matieres_preferees);
      }
    }
    if (repChoix) {
      if (Array.isArray(repChoix)) return mapSubjectNamesToIds(repChoix);
      if (typeof repChoix === 'object' && repChoix !== null && repChoix.matieres_preferees) {
        return mapSubjectNamesToIds(parseListHelper(repChoix.matieres_preferees));
      }
      if (typeof repChoix === 'string') {
        return mapSubjectNamesToIds(parseListHelper(repChoix));
      }
    }
    return [];
  };

  // Helper pour mapper des domaines étudiants vers leurs identifiants
  const mapStudentDomainsToIds = (list) => {
    if (!Array.isArray(list)) return [];
    const validIds = new Set(LISTE_DOMAINES_EXCELLENCE_ETUDIANT.map((d) => d.id));
    const result = [];

    list.forEach((item) => {
      if (!item) return;
      const str = String(item).trim();
      if (validIds.has(str)) {
        if (!result.includes(str)) result.push(str);
        return;
      }
      const found = LISTE_DOMAINES_EXCELLENCE_ETUDIANT.find(
        (d) =>
          d.id === str ||
          d.label.toLowerCase() === str.toLowerCase() ||
          str.toLowerCase().includes(d.label.toLowerCase()) ||
          d.label.toLowerCase().includes(str.toLowerCase())
      );
      if (found && !result.includes(found.id)) {
        result.push(found.id);
      }
    });

    return result.filter((id) => validIds.has(id));
  };

  // Helper pour extraire les domaines étudiants pour Test 2
  const extractStudentDomaines = (details, repChoix) => {
    if (details) {
      if (Array.isArray(details.selectedDomaines) && details.selectedDomaines.length > 0) {
        return mapStudentDomainsToIds(details.selectedDomaines);
      }
      if (Array.isArray(details.favoriteSubjectIds) && details.favoriteSubjectIds.length > 0) {
        return mapStudentDomainsToIds(details.favoriteSubjectIds);
      }
      if (Array.isArray(details.domainesAssocies) && details.domainesAssocies.length > 0) {
        return mapStudentDomainsToIds(details.domainesAssocies);
      }
    }
    if (repChoix) {
      if (Array.isArray(repChoix)) return mapStudentDomainsToIds(repChoix);
      if (typeof repChoix === 'object' && repChoix !== null && (repChoix.competences_cles || repChoix.competences)) {
        return mapStudentDomainsToIds(parseListHelper(repChoix.competences_cles || repChoix.competences));
      }
      if (typeof repChoix === 'string') {
        return mapStudentDomainsToIds(parseListHelper(repChoix));
      }
    }
    return [];
  };

  // Helper pour mapper des domaines emploi vers leurs identifiants
  const mapRecoDomainsToIds = (list) => {
    if (!Array.isArray(list)) return [];
    const validIds = new Set(LISTE_DOMAINES_COMPETENCES_RECONVERSION.map((d) => d.id));
    const result = [];

    list.forEach((item) => {
      if (!item) return;
      const str = String(item).trim();
      if (validIds.has(str)) {
        if (!result.includes(str)) result.push(str);
        return;
      }
      const found = LISTE_DOMAINES_COMPETENCES_RECONVERSION.find(
        (d) =>
          d.id === str ||
          d.label.toLowerCase() === str.toLowerCase() ||
          str.toLowerCase().includes(d.label.toLowerCase()) ||
          d.label.toLowerCase().includes(str.toLowerCase())
      );
      if (found && !result.includes(found.id)) {
        result.push(found.id);
      }
    });

    return result.filter((id) => validIds.has(id));
  };

  // Helper pour extraire les domaines emploi pour Test 2
  const extractRecoDomaines = (details, repChoix) => {
    if (details) {
      if (Array.isArray(details.selectedDomaines) && details.selectedDomaines.length > 0) {
        return mapRecoDomainsToIds(details.selectedDomaines);
      }
      if (Array.isArray(details.favoriteSubjectIds) && details.favoriteSubjectIds.length > 0) {
        return mapRecoDomainsToIds(details.favoriteSubjectIds);
      }
      if (Array.isArray(details.domainesAssocies) && details.domainesAssocies.length > 0) {
        return mapRecoDomainsToIds(details.domainesAssocies);
      }
      if (Array.isArray(details.competencesCles) && details.competencesCles.length > 0) {
        return mapRecoDomainsToIds(details.competencesCles);
      }
    }
    if (repChoix) {
      if (Array.isArray(repChoix)) return mapRecoDomainsToIds(repChoix);
      if (typeof repChoix === 'object' && repChoix !== null && (repChoix.emp_sec_cib || repChoix.secteurs_cibles || repChoix.competences_transferables)) {
        return mapRecoDomainsToIds(parseListHelper(repChoix.emp_sec_cib || repChoix.secteurs_cibles || repChoix.competences_transferables));
      }
      if (typeof repChoix === 'string') {
        return mapRecoDomainsToIds(parseListHelper(repChoix));
      }
    }
    return [];
  };

  // Helper pour extraire les notes d'aptitudes
  const extractAptitudeRatings = (details, defaultAptitudes) => {
    if (!details) return defaultAptitudes;
    const ratings = details.aptitudeRatings || details.aptitudesRatings || details.aptitudes || {};
    if (typeof ratings === 'object' && Object.keys(ratings).length > 0) {
      return { ...defaultAptitudes, ...ratings };
    }
    return defaultAptitudes;
  };

  // Synchronisation automatique des états des tests dès que currentUser est disponible ou mis à jour
  useEffect(() => {
    if (!currentUser) return;

    // Pré-chargement Élève Test 1
    const eleveDet1 = getEleveDetInt(currentUser);
    const eleveAns1 = extractQcmAnswers(eleveDet1);
    if (Object.keys(eleveAns1).length > 0) {
      setQcmInteretsAnswers(eleveAns1);
    }

    // Pré-chargement Élève Test 2
    const eleveDet2 = getEleveDetMat(currentUser);
    const eleveMats = extractEleveMatieresFavorites(eleveDet2, currentUser?.test2?.rep_choix);
    if (eleveMats.length > 0) {
      setQcmMatieresFavorites(eleveMats);
    }
    const eleveApts = extractAptitudeRatings(eleveDet2, {
      apt_calcul: 2,
      apt_redaction: 2,
      apt_oral: 2,
      apt_observation: 2,
      apt_analyse_societe: 2,
      apt_technique: 2,
    });
    setQcmAptitudes(eleveApts);

    // Pré-chargement Étudiant Test 1
    const studDet1 = getStudentDetInt(currentUser);
    const studAns1 = extractQcmAnswers(studDet1);
    if (Object.keys(studAns1).length > 0) {
      setStudentQcmAnswers(studAns1);
    }

    // Pré-chargement Étudiant Test 2
    const studDet2 = getStudentDetCom(currentUser);
    const studDoms = extractStudentDomaines(studDet2, currentUser?.test2?.rep_choix);
    if (studDoms.length > 0) {
      setStudentSelectedDomaines(studDoms);
    }
    const studApts = extractAptitudeRatings(studDet2, {
      apt_conception_code: 2,
      apt_analyse_chiffres: 2,
      apt_negociation_comm: 2,
      apt_leadership_orga: 2,
      apt_rigueur_juridique: 2,
      apt_recherche_methodo: 2,
    });
    setStudentAptitudes(studApts);

    // Pré-chargement Emploi Test 1
    const recoDet1 = getRecoDetMot(currentUser);
    const recoAns1 = extractQcmAnswers(recoDet1);
    if (Object.keys(recoAns1).length > 0) {
      setRecoQcmAnswers(recoAns1);
    }

    // Pré-chargement Emploi Test 2
    const recoDet2 = getRecoDetTra(currentUser);
    const recoDoms = extractRecoDomaines(recoDet2, currentUser?.test2?.rep_choix);
    if (recoDoms.length > 0) {
      setRecoSelectedDomaines(recoDoms);
    }
    const recoApts = extractAptitudeRatings(recoDet2, {
      apt_adaptabilite: 2,
      apt_autonomie: 2,
      apt_communication: 2,
      apt_technique_outils: 2,
      apt_rigueur_gestion: 2,
      apt_problem_solving: 2,
    });
    setRecoAptitudes(recoApts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Initialisation session
  useEffect(() => {
    const storedUser = api.getCurrentUser();
    if (storedUser) {
      setCurrentUser(storedUser);
      setDefaultViewForRole(getUserRole(storedUser));
      api.getMe()
        .then((res) => {
          if (res.user) {
            setCurrentUser(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        })
        .catch(() => {
          api.logout();
          setCurrentUser(null);
          setView('home');
        });
    } else {
      setView('home');
    }
  }, []);

  // Comptage périodique des messages MP non lus
  const fetchUnreadCount = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await api.getUnreadMessagesCount();
      const count = res?.unreadCount ?? res?.unread_count ?? 0;
      setUnreadMessagesCount(count);
    } catch {
      // Silencieux
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 6000);
      return () => clearInterval(interval);
    } else {
      setUnreadMessagesCount(0);
    }
  }, [currentUser, fetchUnreadCount]);

  const setDefaultViewForRole = (role) => {
    if (role === 'admin') setView('admin_dashboard');
    else if (role === 'eleve') setView('eleve_profil'); // Atterrissage direct sur le profil de l'élève
    else if (role === 'etudiant') setView('etudiant_home');
    else if (role === 'reconversion' || role === 'emploi' || role === 'rechercher emploi') setView('reco_home'); // Atterrissage direct sur le profil d'accès à l'emploi
    else setView('home');
  };

  // Ouverture du modal popup sans quitter la page d'accueil avec présélection automatique du rôle
  const openAuthModal = (mode = 'login', role = 'eleve') => {
    let targetRole = role || 'eleve';
    if (targetRole === 'emploi' || targetRole === 'reconversion') targetRole = 'rechercher emploi';
    setAuthMode(mode);
    setRegForm((prev) => ({
      ...prev,
      uti_rol: targetRole,
    }));
    setMessage({ type: '', text: '' });
    setShowAuthModal(true);
  };

  // Fermeture du modal popup (clic hors-zone ou bouton fermer)
  const closeAuthModal = () => {
    setShowAuthModal(false);
    setMessage({ type: '', text: '' });
  };

  // Fermeture par la touche Échap et blocage du scroll d'arrière-plan
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showAuthModal) {
        closeAuthModal();
      }
    };
    if (showAuthModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showAuthModal]);

  // Fermeture automatique du popot de notification après 5 secondes ou au clic à l'extérieur
  useEffect(() => {
    if (!message.text) return undefined;

    const timer = setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 5000);

    const handleClickOutsideToast = (e) => {
      const toastEl = document.querySelector('.floating-toast-popup');
      if (toastEl && !toastEl.contains(e.target)) {
        setMessage({ type: '', text: '' });
      }
    };

    // Attendre la fin du clic courant avant d'écouter les clics extérieurs
    const attachTimer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutsideToast);
    }, 0);

    return () => {
      clearTimeout(timer);
      clearTimeout(attachTimer);
      document.removeEventListener('mousedown', handleClickOutsideToast);
    };
  }, [message]);

  // Fermeture des mini-menus d'avatar au clic extérieur
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target)) {
        setShowAvatarMenu(false);
      }
      if (accountAvatarMenuRef.current && !accountAvatarMenuRef.current.contains(e.target)) {
        setShowAccountAvatarMenu(false);
      }
    };
    if (showAvatarMenu || showAccountAvatarMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showAvatarMenu, showAccountAvatarMenu]);

  // Chargement des données pour l'administrateur
  useEffect(() => {
    if (currentUser && getUserRole(currentUser) === 'admin') {
      loadAdminData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, view, roleFilter, search]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [usersData, statsData, pupilsData, studentsData, recoData] = await Promise.all([
        api.getUsers({ role: roleFilter, search }),
        api.getUserStats(),
        api.getPupils(),
        api.getStudents(),
        api.getReconversions(),
      ]);
      setUsers(usersData.users || []);
      setStats(statsData.stats || null);
      setPupils(pupilsData.eleves || []);
      setStudents(studentsData.etudiants || []);
      setReconversions(recoData.emplois || recoData.reconversion || []);
    } catch (err) {
      console.warn('Erreur chargement données admin :', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      const res = await api.login(loginForm.email, loginForm.mot_de_passe);
      setCurrentUser(res.user);
      setShowAuthModal(false);
      setMessage({ type: 'success', text: `Bienvenue, ${getUserPrenom(res.user)} !` });
      setDefaultViewForRole(getUserRole(res.user));
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (email, password) => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      const res = await api.login(email, password);
      setCurrentUser(res.user);
      setShowAuthModal(false);
      setMessage({
        type: 'success',
        text: `Connecté en tant que ${getUserNom(res.user)} ${getUserPrenom(res.user)} (${getUserRole(res.user)}) !`
      });
      setDefaultViewForRole(getUserRole(res.user));
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = (mode) => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (clientId) {
      const redirectUri = encodeURIComponent(window.location.origin);
      const scope = encodeURIComponent('openid email profile');
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
      return;
    }
    setMessage({
      type: 'error',
      text:
        mode === 'login'
          ? "Connexion avec Google : ajoutez REACT_APP_GOOGLE_CLIENT_ID dans .env ou connectez-vous avec votre e-mail."
          : "Inscription avec Google : ajoutez REACT_APP_GOOGLE_CLIENT_ID dans .env ou inscrivez-vous avec le formulaire.",
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      if (regForm.uti_rol === 'eleve') {
        if (!regForm.ele_eta || !regForm.ele_eta.trim()) {
          setMessage({ type: 'error', text: 'Veuillez renseigner votre établissement scolaire.' });
          setLoading(false);
          return;
        }
        if (!regForm.ele_cla) {
          setMessage({ type: 'error', text: 'Veuillez sélectionner votre classe actuelle.' });
          setLoading(false);
          return;
        }
        if (isTerminaleClass(regForm.ele_cla) && (!regForm.ele_ser || !regForm.ele_ser.trim())) {
          setMessage({ type: 'error', text: 'Veuillez sélectionner votre série au Baccalauréat pour la classe de Terminale.' });
          setLoading(false);
          return;
        }
      } else if (regForm.uti_rol === 'etudiant') {
        if (!regForm.etu_eta || !regForm.etu_eta.trim()) {
          setMessage({ type: 'error', text: 'Veuillez renseigner votre université ou institut.' });
          setLoading(false);
          return;
        }
        if (!regForm.etu_fil || !regForm.etu_fil.trim()) {
          setMessage({ type: 'error', text: 'Veuillez renseigner votre filière ou spécialisation.' });
          setLoading(false);
          return;
        }
        if (!regForm.etu_niv_etu) {
          setMessage({ type: 'error', text: "Veuillez sélectionner votre niveau d'étude actuel." });
          setLoading(false);
          return;
        }
      }

      const isTerminale = isTerminaleClass(regForm.ele_cla);
      const payload = {
        ...regForm,
        uti_nom: (regForm.uti_nom || '').trim().toUpperCase(),
        uti_pre: formatPrenom((regForm.uti_pre || '').trim()),
        ele_eta: (regForm.ele_eta || '').trim(),
        ele_cla: regForm.ele_cla || '',
        ele_ser: isTerminale ? (regForm.ele_ser || '').trim() : '',
        etu_eta: (regForm.etu_eta || '').trim(),
        etu_fil: (regForm.etu_fil || '').trim(),
        etu_niv_etu: regForm.etu_niv_etu || '',
        emp_sit_act: (regForm.emp_sit_act || '').trim(),
        emp_met_act: (regForm.emp_met_act || '').trim(),
      };
      const res = await api.register(payload);
      setCurrentUser(res.user);
      setShowAuthModal(false);

      const role = getUserRole(res.user);
      if (role === 'eleve') {
        // Redirection immédiate sur le profil de l'élève
        setView('eleve_profil');
        setMessage({
          type: 'success',
          text: `Bienvenue sur ton profil e-hari, ${getUserPrenom(res.user)} ! Ton compte a été créé avec succès.`
        });
      } else if (role === 'etudiant') {
        // Redirection immédiate sur le profil de l'étudiant
        setView('etudiant_home');
        setMessage({
          type: 'success',
          text: `Bienvenue sur votre profil e-hari, ${getUserPrenom(res.user)} ! Votre compte a été créé avec succès.`
        });
      } else if (role === 'reconversion' || role === 'emploi' || role === 'rechercher emploi') {
        // Redirection immédiate sur le profil d'accès à l'emploi
        setView('reco_home');
        setMessage({
          type: 'success',
          text: `Bienvenue sur votre profil e-hari, ${getUserPrenom(res.user)} ! Votre compte a été créé avec succès.`
        });
      } else {
        setDefaultViewForRole(role);
        setMessage({ type: 'success', text: 'Compte créé avec succès !' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const startEditEleveProfile = () => {
    setEleveProfileForm({
      uti_nom: getUserNom(currentUser),
      uti_pre: getUserPrenom(currentUser),
      uti_tel: getUserTel(currentUser) || '',
      uti_adr: getUserAdresse(currentUser) || '',
      ele_eta: getEleveEtablissement(currentUser) || '',
      ele_cla: getEleveClasse(currentUser) || '',
      ele_ser: getEleveSerie(currentUser) || '',
    });
    setEditingEleveProfile(true);
  };

  const handleSaveEleveProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const uid = getUserId(currentUser);
      const isTerminale = isTerminaleClass(eleveProfileForm.ele_cla);
      if (isTerminale && (!eleveProfileForm.ele_ser || !eleveProfileForm.ele_ser.trim())) {
        setMessage({ type: 'error', text: 'Veuillez sélectionner votre série pour la classe de Terminale.' });
        setLoading(false);
        return;
      }

      const updateData = {
        uti_nom: (eleveProfileForm.uti_nom || '').trim().toUpperCase(),
        uti_pre: formatPrenom((eleveProfileForm.uti_pre || '').trim()),
        uti_tel: (eleveProfileForm.uti_tel || '').trim(),
        uti_adr: (eleveProfileForm.uti_adr || '').trim(),
        ele_eta: (eleveProfileForm.ele_eta || '').trim(),
        ele_cla: eleveProfileForm.ele_cla,
        ele_ser: isTerminale ? eleveProfileForm.ele_ser : null,
      };
      await api.updateUser(uid, updateData);

      const updatedUser = {
        ...currentUser,
        uti_nom: updateData.uti_nom,
        uti_pre: updateData.uti_pre,
        uti_tel: updateData.uti_tel,
        uti_adr: updateData.uti_adr,
        profil: {
          ...currentUser.profil,
          ele_eta: updateData.ele_eta,
          ele_cla: updateData.ele_cla,
          ele_ser: updateData.ele_ser,
        },
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setEditingEleveProfile(false);
      setMessage({ type: 'success', text: 'Vos informations de profil ont été mises à jour avec succès !' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const startEditStudentProfile = () => {
    setStudentProfileForm({
      uti_nom: getUserNom(currentUser),
      uti_pre: getUserPrenom(currentUser),
      uti_tel: getUserTel(currentUser) || '',
      uti_adr: getUserAdresse(currentUser) || '',
      etu_eta: getStudentEtablissement(currentUser) || '',
      etu_fil: getStudentFiliere(currentUser) || '',
      etu_niv_etu: getStudentNiveau(currentUser) || 'Licence 1',
    });
    setEditingStudentProfile(true);
  };

  const handleSaveStudentProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const uid = getUserId(currentUser);

      const updateData = {
        uti_nom: (studentProfileForm.uti_nom || '').trim().toUpperCase(),
        uti_pre: formatPrenom((studentProfileForm.uti_pre || '').trim()),
        uti_tel: (studentProfileForm.uti_tel || '').trim(),
        uti_adr: (studentProfileForm.uti_adr || '').trim(),
        etu_eta: (studentProfileForm.etu_eta || '').trim(),
        etu_fil: (studentProfileForm.etu_fil || '').trim(),
        etu_niv_etu: studentProfileForm.etu_niv_etu || '',
      };
      await api.updateUser(uid, updateData);

      const updatedUser = {
        ...currentUser,
        uti_nom: updateData.uti_nom,
        uti_pre: updateData.uti_pre,
        uti_tel: updateData.uti_tel,
        uti_adr: updateData.uti_adr,
        profil: {
          ...currentUser.profil,
          etu_eta: updateData.etu_eta,
          etu_fil: updateData.etu_fil,
          etu_niv_etu: updateData.etu_niv_etu,
        },
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setEditingStudentProfile(false);
      setMessage({ type: 'success', text: 'Vos informations de profil étudiant ont été mises à jour avec succès !' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Erreur lors de la mise à jour.' });
    } finally {
      setLoading(false);
    }
  };

  // Modification du profil Administrateur
  const startEditAdminProfile = () => {
    setAdminProfileForm({
      uti_nom: getUserNom(currentUser),
      uti_pre: getUserPrenom(currentUser),
      uti_ema: getUserEmail(currentUser),
      uti_tel: getUserTel(currentUser) || '',
      uti_adr: getUserAdresse(currentUser) || '',
      uti_pas: '',
      confirm_pas: '',
    });
    setShowAdminPassword(false);
    setEditingAdminProfile(true);
  };

  const handleSaveAdminProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const uid = getUserId(currentUser);

      if (!adminProfileForm.uti_nom || !adminProfileForm.uti_nom.trim()) {
        setMessage({ type: 'error', text: 'Veuillez renseigner votre nom.' });
        setLoading(false);
        return;
      }
      if (!adminProfileForm.uti_ema || !adminProfileForm.uti_ema.trim()) {
        setMessage({ type: 'error', text: 'Veuillez renseigner une adresse email valide.' });
        setLoading(false);
        return;
      }

      if (adminProfileForm.uti_pas && adminProfileForm.uti_pas.trim() !== '') {
        if (adminProfileForm.uti_pas.length < 6) {
          setMessage({ type: 'error', text: 'Le mot de passe doit comporter au moins 6 caractères.' });
          setLoading(false);
          return;
        }
        if (adminProfileForm.uti_pas !== adminProfileForm.confirm_pas) {
          setMessage({ type: 'error', text: 'Les deux mots de passe ne correspondent pas.' });
          setLoading(false);
          return;
        }
      }

      const updateData = {
        uti_nom: (adminProfileForm.uti_nom || '').trim().toUpperCase(),
        uti_pre: formatPrenom((adminProfileForm.uti_pre || '').trim()),
        uti_ema: (adminProfileForm.uti_ema || '').trim().toLowerCase(),
        uti_tel: (adminProfileForm.uti_tel || '').trim(),
        uti_adr: (adminProfileForm.uti_adr || '').trim(),
      };
      if (adminProfileForm.uti_pas && adminProfileForm.uti_pas.trim() !== '') {
        updateData.uti_pas = adminProfileForm.uti_pas.trim();
      }

      const res = await api.updateUser(uid, updateData);

      const updatedUser = {
        ...currentUser,
        ...(res?.user || {}),
        uti_nom: updateData.uti_nom,
        uti_pre: updateData.uti_pre,
        uti_ema: updateData.uti_ema,
        uti_tel: updateData.uti_tel,
        uti_adr: updateData.uti_adr,
      };

      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      if (users && users.length > 0) {
        setUsers(users.map(u => getUserId(u) === uid ? { ...u, ...updatedUser } : u));
      }

      setEditingAdminProfile(false);
      setMessage({ type: 'success', text: 'Votre profil administrateur a été mis à jour avec succès !' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Erreur lors de la mise à jour du profil administrateur.' });
    } finally {
      setLoading(false);
    }
  };

  // Modification du profil Emploi & Insertion
  const startEditRecoProfile = () => {
    setRecoProfileForm({
      uti_nom: getUserNom(currentUser),
      uti_pre: getUserPrenom(currentUser),
      uti_tel: getUserTel(currentUser) || '',
      uti_adr: getUserAdresse(currentUser) || '',
      emp_sit_act: getRecoSituation(currentUser) || '',
      emp_met_act: getRecoMetierActuel(currentUser) || '',
    });
    setEditingRecoProfile(true);
  };

  const handleSaveRecoProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const uid = getUserId(currentUser);

      const updateData = {
        uti_nom: (recoProfileForm.uti_nom || '').trim().toUpperCase(),
        uti_pre: formatPrenom((recoProfileForm.uti_pre || '').trim()),
        uti_tel: (recoProfileForm.uti_tel || '').trim(),
        uti_adr: (recoProfileForm.uti_adr || '').trim(),
        emp_sit_act: (recoProfileForm.emp_sit_act || '').trim(),
        emp_met_act: (recoProfileForm.emp_met_act || '').trim(),
      };
      await api.updateUser(uid, updateData);

      const updatedUser = {
        ...currentUser,
        uti_nom: updateData.uti_nom,
        uti_pre: updateData.uti_pre,
        uti_tel: updateData.uti_tel,
        uti_adr: updateData.uti_adr,
        profil: {
          ...currentUser.profil,
          emp_sit_act: updateData.emp_sit_act,
          emp_met_act: updateData.emp_met_act,
          rec_sit_act: updateData.emp_sit_act,
          rec_met_act: updateData.emp_met_act,
        },
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setEditingRecoProfile(false);
      setMessage({ type: 'success', text: 'Vos informations de profil ont été mises à jour avec succès !' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Erreur lors de la mise à jour.' });
    } finally {
      setLoading(false);
    }
  };

  // --- GESTION DE L'IMPORTATION DE PHOTO DE PROFIL ---
  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).' });
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'L\'image est trop volumineuse (maximum 8 Mo).' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Redimensionnement fluide et léger via un canvas HTML5
        const canvas = document.createElement('canvas');
        const MAX_DIM = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        saveAvatar(compressedBase64);
      };
      img.onerror = () => {
        setMessage({ type: 'error', text: 'Impossible de lire l\'image sélectionnée.' });
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setMessage({ type: 'error', text: 'Erreur lors de la lecture du fichier.' });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const saveAvatar = async (base64) => {
    try {
      setLoading(true);
      const uid = getUserId(currentUser);
      const res = await api.updateUser(uid, { uti_ava: base64 });
      const updated = res && res.user ? res.user : { ...currentUser, uti_ava: base64 };
      setCurrentUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setMessage({ type: 'success', text: 'Photo de profil mise à jour avec succès !' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Erreur lors de la mise à jour de la photo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!window.confirm('Voulez-vous supprimer votre photo de profil ?')) return;
    try {
      setLoading(true);
      const uid = getUserId(currentUser);
      const res = await api.updateUser(uid, { uti_ava: '' });
      const updated = res && res.user ? res.user : { ...currentUser, uti_ava: '' };
      setCurrentUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setMessage({ type: 'success', text: 'Photo de profil supprimée.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Erreur lors de la suppression de la photo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCameraClick = () => {
    if (!getUserAvatar(currentUser)) {
      avatarInputRef.current && avatarInputRef.current.click();
    } else {
      setShowAvatarMenu((prev) => !prev);
    }
  };

  const handleAccountCameraClick = () => {
    if (!getUserAvatar(currentUser)) {
      accountAvatarInputRef.current && accountAvatarInputRef.current.click();
    } else {
      setShowAccountAvatarMenu((prev) => !prev);
    }
  };

  // --- GESTION DU TEST 1 : CENTRES D'INTÉRÊT & PASSIONS + PERSONNALITÉ ---
  const startEditEleveTest1 = () => {
    const savedDetails = getEleveDetInt(currentUser);
    const ans = extractQcmAnswers(savedDetails);
    if (Object.keys(ans).length > 0) {
      setQcmInteretsAnswers(ans);
    }
    setIsEditingTest1(true);
    setQcmInteretsStep(0);
    setTest1Alert('');
  };

  const startTest1 = () => {
    const savedDetails = getEleveDetInt(currentUser);
    const ans = extractQcmAnswers(savedDetails);
    if (Object.keys(ans).length > 0) {
      setQcmInteretsAnswers(ans);
    }
    setQcmInteretsStep(0);
    setTest1Alert('');
    setIsEditingTest1(false);
    setView('eleve_test_interets');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTest1Option = (questionIdx, optionId) => {
    setTest1Alert('');
    setQcmInteretsAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionId,
    }));
  };

  const handleSubmitTest1 = async () => {
    const answeredCount = Object.keys(qcmInteretsAnswers).length;
    const currentOpt = qcmInteretsAnswers[qcmInteretsStep];
    if (!currentOpt || answeredCount < TEST_INTERETS_QUESTIONS.length) {
      const firstUnanswered = TEST_INTERETS_QUESTIONS.findIndex((_, idx) => !qcmInteretsAnswers[idx]);
      if (firstUnanswered !== -1) {
        setQcmInteretsStep(firstUnanswered);
      }
      setTest1Alert(`Le questionnaire est incomplet. Veuillez répondre aux ${TEST_INTERETS_QUESTIONS.length} situations pour découvrir votre profil.`);
      setMessage({
        type: 'error',
        text: `Attention : Veuillez répondre à toutes les situations demandées pour valider votre test.`,
      });
      return;
    }
    setTest1Alert('');

    try {
      setSubmittingTest(true);
      const resOrientation = computeOrientation1(qcmInteretsAnswers);

      const payload = {
        centres_interet: resOrientation.centresInteret,
        orientation_provisoire_1: resOrientation.orientationProvisoire1,
        details: {
          ...resOrientation.details,
          answers: qcmInteretsAnswers,
          dominantCat: resOrientation.dominantCat,
          secondaryCat: resOrientation.secondaryCat,
        },
      };

      const res = await api.submitEleveInterestsTest(payload);
      if (res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      } else {
        const updated = {
          ...currentUser,
          profil: {
            ...currentUser?.profil,
            ele_cen_int: resOrientation.centresInteret,
            ele_ori_pro_1: resOrientation.orientationProvisoire1,
            ele_det_int: payload.details,
            ele_eta_act: Math.max(currentUser?.profil?.ele_eta_act || 1, 2),
          },
        };
        setCurrentUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }

      setTest1ResultModal({
        oriPro: resOrientation.orientationProvisoire1,
        dominantCat: resOrientation.dominantCat,
        secondaryCat: resOrientation.secondaryCat,
        centresInteret: resOrientation.centresInteret,
      });

      // Le questionnaire disparaît et le résultat s'affiche directement dans la page
      setIsEditingTest1(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Une difficulté est survenue lors de l\'enregistrement. Merci de réessayer.' });
    } finally {
      setSubmittingTest(false);
    }
  };

  // --- GESTION DU TEST 2 : QUESTIONNAIRE DES MATIÈRES & APTITUDES ---
  const startEditEleveTest2 = () => {
    const savedDetails = getEleveDetMat(currentUser);
    const subjects = extractEleveMatieresFavorites(savedDetails, currentUser?.test2?.rep_choix);
    if (subjects.length > 0) {
      setQcmMatieresFavorites(subjects);
    }
    const apts = extractAptitudeRatings(savedDetails, {
      apt_calcul: 2,
      apt_redaction: 2,
      apt_oral: 2,
      apt_observation: 2,
      apt_analyse_societe: 2,
      apt_technique: 2,
    });
    setQcmAptitudes(apts);
    setIsEditingTest2(true);
    setTest2Alert('');
  };

  const startTest2 = () => {
    const savedDetails = getEleveDetMat(currentUser);
    const subjects = extractEleveMatieresFavorites(savedDetails, currentUser?.test2?.rep_choix);
    if (subjects.length > 0) {
      setQcmMatieresFavorites(subjects);
    }
    const apts = extractAptitudeRatings(savedDetails, {
      apt_calcul: 2,
      apt_redaction: 2,
      apt_oral: 2,
      apt_observation: 2,
      apt_analyse_societe: 2,
      apt_technique: 2,
    });
    setQcmAptitudes(apts);
    setTest2Alert('');
    setIsEditingTest2(false);
    setView('eleve_test_matieres');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavoriteSubject = (subjId) => {
    setTest2Alert('');
    setQcmMatieresFavorites((prev) => {
      const validPrev = Array.from(
        new Set(prev.filter((id) => LISTE_MATIERES_DISPONIBLES.some((m) => m.id === id)))
      );
      if (validPrev.includes(subjId)) {
        return validPrev.filter((id) => id !== subjId);
      } else {
        if (validPrev.length >= 4) {
          setMessage({
            type: 'info',
            text: 'Vous avez déjà sélectionné 4 matières favorites (recommandé : entre 2 et 4).',
          });
          return validPrev;
        }
        return [...validPrev, subjId];
      }
    });
  };

  const handleSetAptitudeRating = (aptId, rating) => {
    setTest2Alert('');
    setQcmAptitudes((prev) => ({
      ...prev,
      [aptId]: rating,
    }));
  };

  const handleSubmitTest2 = async () => {
    if (qcmMatieresFavorites.length < 2) {
      setTest2Alert('Attention : Le questionnaire est incomplet. Veuillez sélectionner au moins 2 matières scolaires favorites avant de valider.');
      setMessage({
        type: 'error',
        text: 'Attention : Veuillez sélectionner au moins 2 matières scolaires favorites avant de valider votre questionnaire.',
      });
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }
    setTest2Alert('');

    try {
      setSubmittingTest(true);
      const resOrientation = computeOrientation2(qcmMatieresFavorites, qcmAptitudes);

      const payload = {
        matieres_preferees: resOrientation.matieresPreferees,
        orientation_provisoire_2: resOrientation.orientationProvisoire2,
        details: {
          ...resOrientation.details,
          favoriteSubjectIds: qcmMatieresFavorites,
          aptitudeRatings: qcmAptitudes,
          dominantPole: resOrientation.dominantPole,
        },
      };

      const res = await api.submitEleveMatieresTest(payload);
      if (res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      } else {
        const updated = {
          ...currentUser,
          profil: {
            ...currentUser?.profil,
            ele_mat_pre: resOrientation.matieresPreferees,
            ele_ori_pro_2: resOrientation.orientationProvisoire2,
            ele_det_mat: payload.details,
            ele_eta_act: 3,
          },
        };
        setCurrentUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }

      setTest2ResultModal({
        oriPro: resOrientation.orientationProvisoire2,
        dominantPole: resOrientation.dominantPole,
        matieresPreferees: resOrientation.matieresPreferees,
      });

      // Le questionnaire disparaît et le résultat s'affiche directement dans la page
      setIsEditingTest2(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Une difficulté est survenue lors de l\'enregistrement. Merci de réessayer.' });
    } finally {
      setSubmittingTest(false);
    }
  };

  // --- GESTION DU TEST 1 ÉTUDIANT : PERSONNALITÉ PRO & STYLE DE TRAVAIL ---
  const startEditStudentTest1 = () => {
    const savedDetails = getStudentDetInt(currentUser);
    const ans = extractQcmAnswers(savedDetails);
    if (Object.keys(ans).length > 0) {
      setStudentQcmAnswers(ans);
    }
    setIsEditingStudentTest1(true);
    setStudentQcmStep(0);
    setStudentTest1Alert('');
  };

  const startStudentTest1 = () => {
    const savedDetails = getStudentDetInt(currentUser);
    const ans = extractQcmAnswers(savedDetails);
    if (Object.keys(ans).length > 0) {
      setStudentQcmAnswers(ans);
    }
    setStudentQcmStep(0);
    setStudentTest1Alert('');
    setIsEditingStudentTest1(false);
    setView('etudiant_test1');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStudentTest1Option = (questionIdx, optionId) => {
    setStudentTest1Alert('');
    setStudentQcmAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionId,
    }));
  };

  const handleSubmitStudentTest1 = async () => {
    const answeredCount = Object.keys(studentQcmAnswers).length;
    const currentOpt = studentQcmAnswers[studentQcmStep];
    if (!currentOpt || answeredCount < TEST_ETUDIANT_INTERETS_QUESTIONS.length) {
      const firstUnanswered = TEST_ETUDIANT_INTERETS_QUESTIONS.findIndex((_, idx) => !studentQcmAnswers[idx]);
      if (firstUnanswered !== -1) {
        setStudentQcmStep(firstUnanswered);
      }
      setStudentTest1Alert(`Le questionnaire est incomplet. Veuillez répondre aux ${TEST_ETUDIANT_INTERETS_QUESTIONS.length} situations pour révéler votre profil professionnel.`);
      setMessage({
        type: 'error',
        text: `Attention : Veuillez répondre à l'ensemble des 7 situations pour valider votre test.`,
      });
      return;
    }
    setStudentTest1Alert('');

    try {
      setSubmittingStudentTest(true);
      const resOrientation = computeStudentOrientation1(studentQcmAnswers);

      const payload = {
        centres_interet: resOrientation.centresInteret,
        orientation_provisoire_1: resOrientation.orientationProvisoire1,
        details: {
          ...resOrientation.details,
          answers: studentQcmAnswers,
          dominantCat: resOrientation.dominantCat,
          secondaryCat: resOrientation.secondaryCat,
        },
      };

      const res = await api.submitEtudiantInterestsTest(payload);
      if (res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      } else {
        const updated = {
          ...currentUser,
          profil: {
            ...currentUser?.profil,
            etu_cen_int: resOrientation.centresInteret,
            etu_ori_pro_1: resOrientation.orientationProvisoire1,
            etu_det_int: payload.details,
            etu_eta_act: Math.max(currentUser?.profil?.etu_eta_act || 1, 2),
          },
        };
        setCurrentUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }

      setStudentTest1Modal({
        oriPro: resOrientation.orientationProvisoire1,
        dominantCat: resOrientation.dominantCat,
        secondaryCat: resOrientation.secondaryCat,
        centresInteret: resOrientation.centresInteret,
      });

      setIsEditingStudentTest1(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || "Une difficulté est survenue lors de l'enregistrement du test. Merci de réessayer." });
    } finally {
      setSubmittingStudentTest(false);
    }
  };

  // --- GESTION DU TEST 2 ÉTUDIANT : DOMAINES D'EXCELLENCE & APTITUDES OPÉRATIONNELLES ---
  const startEditStudentTest2 = () => {
    const savedDetails = getStudentDetCom(currentUser);
    const doms = extractStudentDomaines(savedDetails, currentUser?.test2?.rep_choix);
    if (doms.length > 0) {
      setStudentSelectedDomaines(doms);
    }
    const apts = extractAptitudeRatings(savedDetails, {
      apt_conception_code: 2,
      apt_analyse_chiffres: 2,
      apt_negociation_comm: 2,
      apt_leadership_orga: 2,
      apt_rigueur_juridique: 2,
      apt_recherche_methodo: 2,
    });
    setStudentAptitudes(apts);
    setIsEditingStudentTest2(true);
    setStudentTest2Alert('');
  };

  const startStudentTest2 = () => {
    const savedDetails = getStudentDetCom(currentUser);
    const doms = extractStudentDomaines(savedDetails, currentUser?.test2?.rep_choix);
    if (doms.length > 0) {
      setStudentSelectedDomaines(doms);
    }
    const apts = extractAptitudeRatings(savedDetails, {
      apt_conception_code: 2,
      apt_analyse_chiffres: 2,
      apt_negociation_comm: 2,
      apt_leadership_orga: 2,
      apt_rigueur_juridique: 2,
      apt_recherche_methodo: 2,
    });
    setStudentAptitudes(apts);
    setStudentTest2Alert('');
    setIsEditingStudentTest2(false);
    setView('etudiant_test2');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleStudentDomaine = (domId) => {
    setStudentTest2Alert('');
    setStudentSelectedDomaines((prev) => {
      const validPrev = Array.from(
        new Set(prev.filter((id) => LISTE_DOMAINES_EXCELLENCE_ETUDIANT.some((d) => d.id === id)))
      );
      if (validPrev.includes(domId)) {
        return validPrev.filter((id) => id !== domId);
      } else {
        if (validPrev.length >= 4) {
          setMessage({
            type: 'info',
            text: 'Vous avez déjà sélectionné 4 domaines majeurs (recommandé : entre 1 et 3 domaines).',
          });
          return validPrev;
        }
        return [...validPrev, domId];
      }
    });
  };

  const handleSetStudentAptitudeRating = (aptId, rating) => {
    setStudentTest2Alert('');
    setStudentAptitudes((prev) => ({
      ...prev,
      [aptId]: rating,
    }));
  };

  const handleSubmitStudentTest2 = async () => {
    if (studentSelectedDomaines.length < 1) {
      setStudentTest2Alert("Attention : Veuillez sélectionner au moins 1 domaine d'excellence académique avant de valider.");
      setMessage({
        type: 'error',
        text: "Attention : Veuillez sélectionner au moins 1 domaine d'excellence académique avant de valider votre questionnaire.",
      });
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }
    setStudentTest2Alert('');

    try {
      setSubmittingStudentTest(true);
      const resOrientation = computeStudentOrientation2({
        selectedDomaines: studentSelectedDomaines,
        aptitudes: studentAptitudes,
      });

      const payload = {
        competences_cles: resOrientation.competencesCles.join(', '),
        competences: resOrientation.competencesCles.join(', '),
        orientation_provisoire_2: resOrientation.orientationProvisoire2,
        details: {
          ...resOrientation.details,
          dominantPole: resOrientation.dominantPole,
        },
      };

      const res = await api.submitEtudiantCompetencesTest(payload);
      if (res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      } else {
        const updated = {
          ...currentUser,
          profil: {
            ...currentUser?.profil,
            etu_com: payload.competences,
            etu_ori_pro_2: resOrientation.orientationProvisoire2,
            etu_det_com: payload.details,
            etu_eta_act: 3,
          },
        };
        setCurrentUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }

      setStudentTest2Modal({
        oriPro: resOrientation.orientationProvisoire2,
        dominantPole: resOrientation.dominantPole,
        competencesCles: resOrientation.competencesCles,
      });

      setIsEditingStudentTest2(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || "Une difficulté est survenue lors de l'enregistrement. Merci de réessayer." });
    } finally {
      setSubmittingStudentTest(false);
    }
  };

  // --- GESTION DU TEST 1 RECONVERSION : MOTEURS DE TRANSITION & TYPOLOGIE ---
  const startEditRecoTest1 = () => {
    const savedDetails = getRecoDetMot(currentUser);
    const ans = extractQcmAnswers(savedDetails);
    if (Object.keys(ans).length > 0) {
      setRecoQcmAnswers(ans);
    }
    setIsEditingRecoTest1(true);
    setRecoQcmStep(0);
    setRecoTest1Alert('');
  };

  const startRecoTest1 = () => {
    const savedDetails = getRecoDetMot(currentUser);
    const ans = extractQcmAnswers(savedDetails);
    if (Object.keys(ans).length > 0) {
      setRecoQcmAnswers(ans);
    }
    setRecoQcmStep(0);
    setRecoTest1Alert('');
    setIsEditingRecoTest1(false);
    setView('reco_test1');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRecoTest1Option = (questionIdx, optionId) => {
    setRecoTest1Alert('');
    setRecoQcmAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionId,
    }));
  };

  const handleSubmitRecoTest1 = async () => {
    const answeredCount = Object.keys(recoQcmAnswers).length;
    const currentOpt = recoQcmAnswers[recoQcmStep];
    if (!currentOpt || answeredCount < TEST_RECONVERSION_INTERETS_QUESTIONS.length) {
      const firstUnanswered = TEST_RECONVERSION_INTERETS_QUESTIONS.findIndex((_, idx) => !recoQcmAnswers[idx]);
      if (firstUnanswered !== -1) {
        setRecoQcmStep(firstUnanswered);
      }
      setRecoTest1Alert(`Le questionnaire est incomplet. Veuillez répondre aux ${TEST_RECONVERSION_INTERETS_QUESTIONS.length} situations pour révéler vos aspirations professionnelles.`);
      setMessage({
        type: 'error',
        text: `Attention : Veuillez répondre à l'ensemble des 7 situations pour valider votre test.`,
      });
      return;
    }
    setRecoTest1Alert('');

    try {
      setSubmittingRecoTest(true);
      const resOrientation = computeReconversionOrientation1(recoQcmAnswers);

      const payload = {
        motivations_cles: resOrientation.motivationsCles,
        motivation_changement: resOrientation.motivationsCles.join(', '),
        orientation_provisoire_1: resOrientation.orientationProvisoire1,
        details: {
          ...resOrientation.details,
          answers: recoQcmAnswers,
          dominantCat: resOrientation.dominantCat,
          secondaryCat: resOrientation.secondaryCat,
        },
      };

      const res = await api.submitReconversionInterestsTest(payload);
      if (res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      } else {
        const updated = {
          ...currentUser,
          profil: {
            ...currentUser?.profil,
            emp_ori_pro_1: resOrientation.orientationProvisoire1,
            emp_det_mot: payload.details,
            emp_eta_act: Math.max(currentUser?.profil?.emp_eta_act || currentUser?.profil?.rec_eta_act || 1, 2),
            rec_ori_pro_1: resOrientation.orientationProvisoire1,
            rec_det_mot: payload.details,
            rec_eta_act: Math.max(currentUser?.profil?.emp_eta_act || currentUser?.profil?.rec_eta_act || 1, 2),
          },
        };
        setCurrentUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }

      setRecoTest1Modal({
        oriPro: resOrientation.orientationProvisoire1,
        dominantCat: resOrientation.dominantCat,
        secondaryCat: resOrientation.secondaryCat,
        motivationsCles: resOrientation.motivationsCles,
      });

      setIsEditingRecoTest1(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || "Une difficulté est survenue lors de l'enregistrement de votre test. Merci de réessayer." });
    } finally {
      setSubmittingRecoTest(false);
    }
  };

  // --- GESTION DU TEST 2 RECONVERSION : COMPÉTENCES TRANSFÉRABLES & PÔLE CIBLE ---
  const startEditRecoTest2 = () => {
    const savedDetails = getRecoDetTra(currentUser);
    const doms = extractRecoDomaines(savedDetails, currentUser?.test2?.rep_choix);
    if (doms.length > 0) {
      setRecoSelectedDomaines(doms);
    }
    const apts = extractAptitudeRatings(savedDetails, {
      apt_adaptabilite: 2,
      apt_autonomie: 2,
      apt_communication: 2,
      apt_technique_outils: 2,
      apt_rigueur_gestion: 2,
      apt_problem_solving: 2,
    });
    setRecoAptitudes(apts);
    setIsEditingRecoTest2(true);
    setRecoTest2Alert('');
  };

  const startRecoTest2 = () => {
    const savedDetails = getRecoDetTra(currentUser);
    const doms = extractRecoDomaines(savedDetails, currentUser?.test2?.rep_choix);
    if (doms.length > 0) {
      setRecoSelectedDomaines(doms);
    }
    const apts = extractAptitudeRatings(savedDetails, {
      apt_adaptabilite: 2,
      apt_autonomie: 2,
      apt_communication: 2,
      apt_technique_outils: 2,
      apt_rigueur_gestion: 2,
      apt_problem_solving: 2,
    });
    setRecoAptitudes(apts);
    setRecoTest2Alert('');
    setIsEditingRecoTest2(false);
    setView('reco_test2');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleRecoDomaine = (domId) => {
    setRecoTest2Alert('');
    setRecoSelectedDomaines((prev) => {
      const validPrev = Array.from(
        new Set(prev.filter((id) => LISTE_DOMAINES_COMPETENCES_RECONVERSION.some((d) => d.id === id)))
      );
      if (validPrev.includes(domId)) {
        return validPrev.filter((id) => id !== domId);
      } else {
        if (validPrev.length >= 4) {
          setMessage({
            type: 'info',
            text: 'Vous avez déjà sélectionné 4 domaines majeurs de compétences (recommandé : entre 1 et 3 domaines).',
          });
          return validPrev;
        }
        return [...validPrev, domId];
      }
    });
  };

  const handleSetRecoAptitudeRating = (aptId, rating) => {
    setRecoTest2Alert('');
    setRecoAptitudes((prev) => ({
      ...prev,
      [aptId]: rating,
    }));
  };

  const handleSubmitRecoTest2 = async () => {
    if (recoSelectedDomaines.length < 1) {
      setRecoTest2Alert("Attention : Veuillez sélectionner au moins 1 domaine de compétences avant de valider.");
      setMessage({
        type: 'error',
        text: "Attention : Veuillez sélectionner au moins 1 domaine de compétences avant de valider votre questionnaire.",
      });
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }
    setRecoTest2Alert('');

    try {
      setSubmittingRecoTest(true);
      const resOrientation = computeReconversionOrientation2({
        selectedDomaines: recoSelectedDomaines,
        aptitudes: recoAptitudes,
      });

      const payload = {
        secteurs_cibles: resOrientation.dominantPole?.label || resOrientation.orientationProvisoire2,
        competences_transferables: resOrientation.competencesCles.join(', '),
        orientation_provisoire_2: resOrientation.orientationProvisoire2,
        details: {
          ...resOrientation.details,
          dominantPole: resOrientation.dominantPole,
        },
      };

      const res = await api.submitReconversionCompetencesTest(payload);
      if (res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      } else {
        const updated = {
          ...currentUser,
          profil: {
            ...currentUser?.profil,
            emp_ori_pro_2: resOrientation.orientationProvisoire2,
            emp_det_tra: payload.details,
            emp_eta_act: 3,
            rec_ori_pro_2: resOrientation.orientationProvisoire2,
            rec_det_tra: payload.details,
            rec_eta_act: 3,
          },
        };
        setCurrentUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }

      setRecoTest2Modal({
        oriPro: resOrientation.orientationProvisoire2,
        dominantPole: resOrientation.dominantPole,
        competencesCles: resOrientation.competencesCles,
      });

      setIsEditingRecoTest2(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || "Une difficulté est survenue lors de l'enregistrement. Merci de réessayer." });
    } finally {
      setSubmittingRecoTest(false);
    }
  };

  // --- GESTION DU PLANNING DE RÉVISION & EDT SCOLAIRE ---
  const handleSaveRevisionSchedule = async (edtData) => {
    try {
      const res = await api.saveEleveEdt(edtData);
      if (res?.success && res?.user) {
        setCurrentUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      } else {
        const updated = {
          ...currentUser,
          edt: edtData,
          profil: {
            ...(currentUser?.profil || {}),
            ele_edt_rev: edtData,
          },
        };
        setCurrentUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }
      return true;
    } catch (err) {
      console.warn('Fallback local pour revision schedule :', err);
      const updated = {
        ...currentUser,
        edt: edtData,
        profil: {
          ...(currentUser?.profil || {}),
          ele_edt_rev: edtData,
        },
      };
      setCurrentUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      return true;
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setShowAuthModal(false);
    setView('home');
    setMessage({ type: 'success', text: 'Vous êtes maintenant déconnecté.' });
  };

  const handleDeactivateAccount = async () => {
    const confirmation = window.confirm(
      "Êtes-vous sûr(e) de vouloir désactiver votre compte ?\n\nVotre compte passera en statut 'inactif' et vous ne pourrez plus vous connecter sans contacter un administrateur de l'ONG HARI."
    );
    if (!confirmation) return;

    try {
      setLoading(true);
      const uid = getUserId(currentUser);
      await api.updateUser(uid, { uti_sta: 'inactif' });
      api.logout();
      setCurrentUser(null);
      setShowAuthModal(false);
      setView('home');
      setMessage({
        type: 'success',
        text: 'Votre compte a été désactivé avec succès. Pour le réactiver, veuillez contacter l\'équipe de l\'ONG HARI.',
      });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Erreur lors de la désactivation du compte.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (userId, newStatus) => {
    try {
      await api.updateUserStatus(userId, newStatus);
      setMessage({ type: 'success', text: `Statut mis à jour : ${newStatus}` });
      loadAdminData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleDeleteUser = async (userId, userNom) => {
    if (!window.confirm(`Confirmer la suppression de ${userNom} ?`)) return;
    try {
      await api.deleteUser(userId);
      setMessage({ type: 'success', text: `Utilisateur ${userNom} supprimé.` });
      loadAdminData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'eleve': return 'Élève';
      case 'etudiant': return 'Étudiant';
      case 'rechercher emploi':
      case 'emploi':
      case 'reconversion': return "À la recherche d'un emploi";
      default: return role;
    }
  };

  // ========================================================
  // SCÉNARIO 1 : UTILISATEUR NON CONNECTÉ -> PAGE D'ACCUEIL AVEC POPUP AUTH
  // ========================================================
  if (!currentUser) {
    return (
      <div className={`landing-page ${showAuthModal ? 'modal-open' : ''}`}>
        {/* Contenu de la page d'accueil (flouté quand le modal est ouvert) */}
        <div className="landing-content-wrapper">
          {/* En-tête horizontal compact avec nom de l'appli, logo et les 2 boutons */}
          <header className="landing-navbar single-screen-navbar">
            <div className="landing-brand" onClick={() => { setView('home'); setShowAuthModal(false); }}>
              <HariEmblem size={64} />
              <div className="brand-text-block">
                <div className="brand-title">
                  <span className="brand-ehari">e-hari</span>
                </div>
                <div className="brand-tagline-acronym">
                  <span className="pillar-letter">H</span>abiletés • <span className="pillar-letter">A</span>ccompagnement • <span className="pillar-letter">R</span>éussite • <span className="pillar-letter">I</span>nsertion
                </div>
              </div>
            </div>

            <div className="landing-nav-actions">
              <button
                type="button"
                className="btn btn-outline single-nav-login"
                onClick={() => openAuthModal('login')}
              >
                Se connecter
              </button>
              <button
                type="button"
                className="btn btn-primary single-nav-register"
                onClick={() => openAuthModal('register', 'eleve')}
              >
                S'inscrire
              </button>
            </div>
          </header>

          {/* Scène unique plein écran façon maquette : texte libre au fond + 3 cartes superposées au premier plan */}
          <section className="showcase-hero-backdrop single-screen-stage">
            {/* Arrière-plan réparti librement sans conteneur encadré */}
            <div className="backdrop-top-grid open-canvas">
              <div className="backdrop-hero-left">
                <h1 className="hero-title backdrop-title">
                  Accompagnement à l'Orientation,<br />à la Réussite et à l'Insertion
                </h1>

                <p className="hero-subtitle backdrop-subtitle">
                  « Les jeunes, un puissant levier du Développement Durable ». Une plateforme bienveillante et dynamique conçue pour guider les élèves dans leurs études, propulser les étudiants vers l'emploi et accompagner toute personne vers le travail adapté à son profil.
                </p>
              </div>

              <div className="backdrop-hero-right open-right">
                <div className="backdrop-ong-head">
                  <OngHariOfficialLogo size={96} />
                  <div>
                    <h2 className="backdrop-ong-title">ONG HARI Madagascar</h2>
                    <div className="ong-hari-development">Hevitra Atambatra Rehareha Iombonana</div>
                  </div>
                </div>

                <div className="backdrop-check-list">
                  <div className="backdrop-check-row">
                    <span className="backdrop-check-icon" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </span>
                    <div>
                      <strong>10 Ans d'Histoire & d'Engagement</strong>
                      <span>Opportunités concrètes d'avenir pour les collégiens, lycéens et étudiants à Madagascar.</span>
                    </div>
                  </div>
                  <div className="backdrop-check-row">
                    <span className="backdrop-check-icon" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18h6" />
                        <path d="M10 22h4" />
                        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
                      </svg>
                    </span>
                    <div>
                      <strong>Notre Philosophie</strong>
                      <span>Mettre en commun les idées, les compétences et les énergies pour une fierté collective et durable.</span>
                    </div>
                  </div>
                  <div className="backdrop-check-row">
                    <span className="backdrop-check-icon" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                      </svg>
                    </span>
                    <div>
                      <strong>Notre Objectif</strong>
                      <span>Réduire l'inadéquation formation-emploi et encourager le leadership et l'entrepreneuriat des jeunes.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PREMIER PLAN : Les 3 cartes superposées façon maquette — clic = passe au centre */}
            <div className="foreground-carousel-stage">
              {/* Carte Élève (Rose doux) */}
              <div
                className={`feature-card eleve carousel-card ${
                  centerCardRole === 'eleve'
                    ? 'is-center'
                    : centerCardRole === 'etudiant'
                    ? 'is-left'
                    : 'is-right'
                }`}
                onClick={() => setCenterCardRole('eleve')}
              >
                <div>
                  <span className="feature-tag">Collège & Lycée</span>
                  <h3>Élèves</h3>
                  <p>
                    Orientation scolaire précoce pour identifier ses forces et choisir la série la plus adaptée à son projet de vie.
                  </p>
                  <ul className="feature-points">
                    <li>Choix des séries au lycée</li>
                    <li>Découverte des métiers d'avenir</li>
                    <li>Progression scolaire</li>
                    <li>Identification des matières favorites et talents</li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="feature-btn eleve"
                  onClick={(e) => {
                    e.stopPropagation();
                    openAuthModal('register', 'eleve');
                  }}
                >
                  S'inscrire comme Élève →
                </button>
              </div>

              {/* Carte Étudiant (Bleu / Vert) */}
              <div
                className={`feature-card etudiant carousel-card ${
                  centerCardRole === 'etudiant'
                    ? 'is-center'
                    : centerCardRole === 'emploi'
                    ? 'is-left'
                    : 'is-right'
                }`}
                onClick={() => setCenterCardRole('etudiant')}
              >
                <div>
                  <span className="feature-tag">Enseignement Supérieur</span>
                  <h3>Étudiants</h3>
                  <p>
                    Passerelle entre les études universitaires et l'insertion dans les entreprises et organisations partenaires.
                  </p>
                  <ul className="feature-points">
                    <li>Orientation de spécialisation universitaire</li>
                    <li>Valorisation des compétences techniques & soft skills</li>
                    <li>Recherche de stages professionnalisants</li>
                    <li>Aide à la rédaction de CV et lettre de motivation</li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="feature-btn etudiant"
                  onClick={(e) => {
                    e.stopPropagation();
                    openAuthModal('register', 'etudiant');
                  }}
                >
                  S'inscrire comme Étudiant →
                </button>
              </div>

              {/* Carte Emploi & Insertion Professionnelle (Vert) */}
              <div
                className={`feature-card reconversion carousel-card ${
                  centerCardRole === 'emploi'
                    ? 'is-center'
                    : centerCardRole === 'eleve'
                    ? 'is-left'
                    : 'is-right'
                }`}
                onClick={() => setCenterCardRole('emploi')}
              >
                <div>
                  <span className="feature-tag">Accès Emploi & Profil</span>
                  <h3>À la recherche d'un emploi</h3>
                  <p>
                    Boussole d'orientation pour toute personne souhaitant trouver un travail adapté à son profil (débutants, en recherche d'emploi ou en transition).
                  </p>
                  <ul className="feature-points">
                    <li>Bilan des compétences et talents clés</li>
                    <li>Identification du métier qui vous correspond</li>
                    <li>Secteurs qui recrutent à Madagascar</li>
                    <li>Feuille de route d'accès à l'emploi sur mesure</li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="feature-btn emploi"
                  onClick={(e) => {
                    e.stopPropagation();
                    openAuthModal('register', 'rechercher emploi');
                  }}
                >
                  S'inscrire comme Chercheur d'emploi →
                </button>
              </div>
            </div>
          </section>

          {/* 8. Pied de page complet officiel */}
          <footer className="landing-footer">
            <div className="footer-inner">
              <div>
                <div className="footer-brand-title"><span className="text-ehari" style={{ color: '#ffffff' }}>e-hari</span> • ONG HARI Madagascar</div>
                <p className="footer-brand-p">
                  Organisation Non Gouvernementale engagée depuis 2016 pour l'éducation, l'employabilité et le développement durable de la jeunesse à Madagascar.
                </p>
                <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#ffffff' }}>
                  « Hevitra Atambatra Rehareha Iombonana »
                </p>
              </div>

              <div className="footer-col">
                <h4>Contacts Officiels</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <li style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                    <PinIcon size={15} />
                    <span>Antananarivo, Madagascar</span>
                  </li>
                  <li style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                    <PhoneIcon size={15} />
                    <span>Téléphone : 038 11 50 206</span>
                  </li>
                  <li style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                    <MailIcon size={15} />
                    <span>Email : <a href="mailto:hari-madagascar@gmail.com">hari-madagascar@gmail.com</a></span>
                  </li>
                  <li style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <span>Facebook : <a href="https://web.facebook.com/profile.php?id=100068361723455" target="_blank" rel="noreferrer">ONG HARI Madagascar</a></span>
                  </li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Navigation Rapide</h4>
                <ul>
                  <li><a href="#login" onClick={(e) => { e.preventDefault(); openAuthModal('login'); }}>Se connecter</a></li>
                  <li><a href="#register" onClick={(e) => { e.preventDefault(); openAuthModal('register', 'eleve'); }}>Créer un compte élève</a></li>
                  <li><a href="#register" onClick={(e) => { e.preventDefault(); openAuthModal('register', 'etudiant'); }}>Créer un compte étudiant</a></li>
                  <li><a href="#register" onClick={(e) => { e.preventDefault(); openAuthModal('register', 'rechercher emploi'); }}>À la recherche d'un emploi</a></li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom-bar">
              © 2016 – 2026 ONG HARI Madagascar • Application web <strong className="text-ehari" style={{ color: '#ffffff' }}>e-hari</strong> (<span className="acronym-letter" style={{ color: '#ffffff' }}>H</span>abiletés, <span className="acronym-letter" style={{ color: '#ffffff' }}>A</span>ccompagnement, <span className="acronym-letter" style={{ color: '#ffffff' }}>R</span>éussite, <span className="acronym-letter" style={{ color: '#ffffff' }}>I</span>nsertion)
            </div>
          </footer>
        </div>

        {/* Toast popup discret sur la page d'accueil avec bouton X */}
        {!showAuthModal && message.text && (
          <div
            className={`floating-toast-popup toast-${message.type || 'info'}`}
            style={{
              position: 'fixed',
              top: '1.25rem',
              right: '1.25rem',
              zIndex: 99999,
              maxWidth: '360px',
              minWidth: '240px',
              background:
                message.type === 'success'
                  ? 'linear-gradient(135deg, #fffdf2 0%, #fef9c3 100%)'
                  : '#fef2f2',
              borderRadius: '10px',
              padding: '0.75rem 0.95rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              border: `1px solid ${
                message.type === 'success' ? '#DDB762' : '#fca5a5'
              }`,
              borderLeft: `5px solid ${
                message.type === 'success' ? '#eab308' : '#dc2626'
              }`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
              {message.type === 'success' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
            </span>
            <span
              style={{
                fontSize: '0.86rem',
                color: message.type === 'success' ? '#713f12' : '#991b1b',
                fontWeight: 600,
                flex: 1,
                lineHeight: 1.35,
              }}
            >
              {message.text}
            </span>
          </div>
        )}

        {/* MODAL POPUP D'AUTHENTIFICATION EN SURIMPRESSION AVEC FLOU D'ARRIÈRE-PLAN */}
        {showAuthModal && (
          <div
            className="auth-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeAuthModal();
              }
            }}
          >
            <div className={`auth-modal-dialog ${authMode === 'login' ? 'login-mode' : 'register-mode'}`}>
              {message.text && (
                <div className={`alert alert-${message.type}`}>
                  {message.text}
                </div>
              )}

              <div className="card auth-card modal-inner-card">
                {/* Titre distinct pour chacun */}
                <div className="auth-form-header">
                  <h2 className="auth-form-title">
                    {authMode === 'login'
                      ? 'Connexion'
                      : regForm.uti_rol === 'etudiant'
                      ? "Fiche d'Inscription — Étudiant"
                      : (regForm.uti_rol === 'rechercher emploi' || regForm.uti_rol === 'emploi' || regForm.uti_rol === 'reconversion')
                      ? "Fiche d'Inscription — À la recherche d'un emploi"
                      : "Fiche d'Inscription — Élève"}
                  </h2>
                  <p className="auth-form-subtitle">
                    {authMode === 'login'
                      ? 'Accédez à votre espace personnalisé e-hari'
                      : regForm.uti_rol === 'etudiant'
                      ? 'Enseignement supérieur, compétences et insertion professionnelle'
                      : (regForm.uti_rol === 'rechercher emploi' || regForm.uti_rol === 'emploi' || regForm.uti_rol === 'reconversion')
                      ? 'Orientation professionnelle, compétences clés et accès à l\'emploi'
                      : 'Orientation scolaire, collège et lycée'}
                  </p>
                </div>

                {/* Démo rapide en 1 clic */}
                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <span>Connexion démo rapide :</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => quickLogin('admin@hari.mg', 'Admin123!')}
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => quickLogin('eleve@hari.mg', 'Eleve123!')}
                    >
                      Élève
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => quickLogin('etudiant@hari.mg', 'Etudiant123!')}
                    >
                      Étudiant
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => quickLogin('reconversion@hari.mg', 'Reconversion123!')}
                    >
                      À la recherche d'un emploi
                    </button>
                  </div>
                </div>

                {authMode === 'login' ? (
                  <form onSubmit={handleLoginSubmit}>
                    <div className="form-group">
                      <label>Adresse Email :</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        placeholder="ex: eleve@hari.mg"
                      />
                    </div>
                    <div className="form-group">
                      <label>Mot de passe :</label>
                      <input
                        type="password"
                        className="form-control"
                        required
                        value={loginForm.mot_de_passe}
                        onChange={(e) => setLoginForm({ ...loginForm, mot_de_passe: e.target.value })}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="form-submit-wrapper">
                      <button type="submit" className="btn btn-primary btn-form-submit" disabled={loading}>
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                      </button>
                    </div>
                    <div className="auth-divider"><span>ou</span></div>
                    <button
                      type="button"
                      className="btn-google-auth"
                      onClick={() => handleGoogleAuth('login')}
                    >
                      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      </svg>
                      <span>Se connecter avec Google</span>
                    </button>
                    <div className="auth-switch-prompt">
                      Pas encore de compte ?{' '}
                      <button
                        type="button"
                        className="auth-switch-link"
                        onClick={() => { setAuthMode('register'); setMessage({ type: '', text: '' }); }}
                      >
                        S'inscrire
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterSubmit}>
                    <div className="form-group">
                      <label>Type de profil :</label>
                      <select
                        key={`select-role-${regForm.uti_rol}`}
                        className="form-control"
                        value={regForm.uti_rol || 'eleve'}
                        onChange={(e) => setRegForm({ ...regForm, uti_rol: e.target.value })}
                      >
                        <option value="eleve">Élève</option>
                        <option value="etudiant">Étudiant</option>
                        <option value="rechercher emploi">À la recherche d'un emploi</option>
                      </select>
                    </div>

                    <div className="auth-form-grid">
                      <div className="form-group">
                        <label>Nom :</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          style={{ textTransform: 'uppercase' }}
                          value={regForm.uti_nom}
                          onChange={(e) => setRegForm({ ...regForm, uti_nom: e.target.value.toUpperCase() })}
                          placeholder="ex: RAKOTO"
                        />
                      </div>
                      <div className="form-group">
                        <label>Prénom (facultatif) :</label>
                        <input
                          type="text"
                          className="form-control"
                          value={regForm.uti_pre}
                          onChange={(e) => setRegForm({ ...regForm, uti_pre: formatPrenom(e.target.value) })}
                          placeholder="ex: Jean (facultatif)"
                        />
                      </div>
                    </div>

                    <div className="auth-form-grid">
                      <div className="form-group">
                        <label>Email :</label>
                        <input
                          type="email"
                          className="form-control"
                          required
                          value={regForm.uti_ema}
                          onChange={(e) => setRegForm({ ...regForm, uti_ema: e.target.value })}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="form-group">
                        <label>Téléphone :</label>
                        <input
                          type="text"
                          className="form-control"
                          value={regForm.uti_tel}
                          onChange={(e) => setRegForm({ ...regForm, uti_tel: e.target.value })}
                          placeholder="034 XX XXX XX"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Adresse :</label>
                      <input
                        type="text"
                        className="form-control"
                        value={regForm.uti_adr}
                        onChange={(e) => setRegForm({ ...regForm, uti_adr: e.target.value })}
                        placeholder="ex: Lot II M 35 Antanimena, Antananarivo"
                      />
                    </div>

                    {/* Champs scolaires spécifiques si profil Élève */}
                    {regForm.uti_rol === 'eleve' && (
                      <>
                        <div className="auth-form-grid">
                          <div className="form-group">
                            <label>Établissement scolaire : *</label>
                            <input
                              type="text"
                              className="form-control"
                              required
                              value={regForm.ele_eta || ''}
                              onChange={(e) => setRegForm({ ...regForm, ele_eta: e.target.value })}
                              placeholder="ex: Lycée J.J. Rabearivelo"
                            />
                          </div>
                          <div className="form-group">
                            <label>Classe actuelle : *</label>
                            <select
                              className="form-control"
                              required
                              value={regForm.ele_cla || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setRegForm((prev) => ({
                                  ...prev,
                                  ele_cla: val,
                                  ele_ser: isTerminaleClass(val) ? prev.ele_ser : '',
                                }));
                              }}
                            >
                              <option value="">-- Choisir la classe --</option>
                              <option value="6ème">6ème (Collège)</option>
                              <option value="5ème">5ème (Collège)</option>
                              <option value="4ème">4ème (Collège)</option>
                              <option value="3ème">3ème (Collège)</option>
                              <option value="Seconde">Seconde (Lycée)</option>
                              <option value="Première">Première (Lycée)</option>
                              <option value="Terminale">Terminale (Lycée)</option>
                            </select>
                          </div>
                        </div>

                        {isTerminaleClass(regForm.ele_cla) && (
                          <div className="form-group">
                            <label>Série suivie au Baccalauréat : *</label>
                            <select
                              className="form-control"
                              required
                              value={regForm.ele_ser || ''}
                              onChange={(e) => setRegForm({ ...regForm, ele_ser: e.target.value })}
                            >
                              <option value="">-- Choisir la série au Baccalauréat à Madagascar --</option>
                              {MADAGASCAR_SERIES.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </>
                    )}

                    {/* Champs universitaires spécifiques si profil Étudiant */}
                    {regForm.uti_rol === 'etudiant' && (
                      <>
                        <div className="form-group">
                          <label>Université / Institut : *</label>
                          <input
                            type="text"
                            className="form-control"
                            required
                            value={regForm.etu_eta || ''}
                            onChange={(e) => setRegForm({ ...regForm, etu_eta: e.target.value })}
                            placeholder="ex: Université d'Antananarivo (Faculté des Sciences)"
                          />
                        </div>

                        <div className="auth-form-grid">
                          <div className="form-group">
                            <label>Filière / Spécialisation : *</label>
                            <input
                              type="text"
                              className="form-control"
                              required
                              value={regForm.etu_fil || ''}
                              onChange={(e) => setRegForm({ ...regForm, etu_fil: e.target.value })}
                              placeholder="ex: Informatique & Technologies Numériques"
                            />
                          </div>
                          <div className="form-group">
                            <label>Niveau d'étude actuel : *</label>
                            <select
                              className="form-control"
                              required
                              value={regForm.etu_niv_etu || ''}
                              onChange={(e) => setRegForm({ ...regForm, etu_niv_etu: e.target.value })}
                            >
                              <option value="">-- Choisir le niveau --</option>
                              <option value="Licence 1">Licence 1 (L1)</option>
                              <option value="Licence 2">Licence 2 (L2)</option>
                              <option value="Licence 3">Licence 3 (L3)</option>
                              <option value="Master 1">Master 1 (M1)</option>
                              <option value="Master 2">Master 2 (M2)</option>
                              <option value="Doctorat">Doctorat</option>
                              <option value="BTS / DUT">BTS / DUT (Bac+2)</option>
                              <option value="Autre">Autre cursus universitaire</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Champs spécifiques si profil À la recherche d'un emploi */}
                    {(regForm.uti_rol === 'rechercher emploi' || regForm.uti_rol === 'emploi' || regForm.uti_rol === 'reconversion') && (() => {
                      const isReconversion = Boolean(
                        regForm.emp_sit_act && regForm.emp_sit_act.toLowerCase().includes('reconversion')
                      );
                      const isDiplome = Boolean(
                        regForm.emp_sit_act && (
                          regForm.emp_sit_act.toLowerCase().includes('diplôm') ||
                          regForm.emp_sit_act.toLowerCase().includes('diplome')
                        )
                      );
                      const showField = isReconversion || isDiplome;

                      return (
                        <div className={showField ? "auth-form-grid" : ""}>
                          <div className="form-group">
                            <label>Situation professionnelle actuelle :</label>
                            <select
                              className="form-control"
                              value={regForm.emp_sit_act || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const isEligible = val && (
                                  val.toLowerCase().includes('diplôm') ||
                                  val.toLowerCase().includes('diplome') ||
                                  val.toLowerCase().includes('reconversion')
                                );
                                setRegForm((prev) => ({
                                  ...prev,
                                  emp_sit_act: val,
                                  emp_met_act: isEligible ? prev.emp_met_act : '',
                                }));
                              }}
                            >
                              <option value="">-- Préciser votre situation --</option>
                              <option value="En insertion professionnelle">En insertion professionnelle</option>
                              <option value="Jeune diplômé(e)">Jeune diplômé(e)</option>
                              <option value="En reconversion professionnelle">En reconversion professionnelle</option>
                            </select>
                          </div>

                          {isReconversion && (
                            <div className="form-group">
                              <label>Métier actuel :</label>
                              <input
                                type="text"
                                className="form-control"
                                value={regForm.emp_met_act || ''}
                                onChange={(e) => setRegForm({ ...regForm, emp_met_act: e.target.value })}
                                placeholder="ex: Enseignant, Vendeur, Comptable..."
                              />
                            </div>
                          )}

                          {isDiplome && (
                            <div className="form-group">
                              <label>Domaine d'étude :</label>
                              <input
                                type="text"
                                className="form-control"
                                value={regForm.emp_met_act || ''}
                                onChange={(e) => setRegForm({ ...regForm, emp_met_act: e.target.value })}
                                placeholder="ex: Informatique, Gestion, Électronique, Droit..."
                              />
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    <div className="form-group">
                      <label>Mot de passe :</label>
                      <input
                        type="password"
                        className="form-control"
                        required
                        value={regForm.uti_pas}
                        onChange={(e) => setRegForm({ ...regForm, uti_pas: e.target.value })}
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="form-submit-wrapper">
                      <button type="submit" className="btn btn-primary btn-form-submit" disabled={loading}>
                        {loading ? 'Inscription en cours...' : "S'inscrire"}
                      </button>
                    </div>
                    <div className="auth-divider"><span>ou</span></div>
                    <button
                      type="button"
                      className="btn-google-auth"
                      onClick={() => handleGoogleAuth('register')}
                    >
                      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      </svg>
                      <span>S'inscrire avec Google</span>
                    </button>
                    <div className="auth-switch-prompt">
                      Vous avez déjà un compte ?{' '}
                      <button
                        type="button"
                        className="auth-switch-link"
                        onClick={() => { setAuthMode('login'); setMessage({ type: '', text: '' }); }}
                      >
                        Se connecter
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========================================================
  // SCÉNARIO 3 : UTILISATEUR CONNECTÉ -> INTERFACES PAR RÔLE
  // (Sidebar verticale à gauche, pas de topbar minimaliste)
  // ========================================================
  const currentRole = getUserRole(currentUser);

  return (
    <div className={`app-layout ${currentRole === 'admin' ? 'admin-theme' : currentRole === 'eleve' ? 'eleve-theme' : ''}`}>
      {/* Toast popup discret en haut à droite (disparition auto ou clic extérieur) */}
      {message.text && (
        <div
          className={`floating-toast-popup toast-${message.type || 'info'}`}
          style={{
            position: 'fixed',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 99999,
            maxWidth: '360px',
            minWidth: '240px',
            background:
              message.type === 'success'
                ? 'linear-gradient(135deg, #fffdf2 0%, #fef9c3 100%)'
                : '#fef2f2',
            borderRadius: '10px',
            padding: '0.75rem 0.95rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${
              message.type === 'success' ? '#DDB762' : '#fca5a5'
            }`,
            borderLeft: `5px solid ${
              message.type === 'success' ? '#eab308' : '#dc2626'
            }`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
            {message.type === 'success' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
          </span>
          <span
            style={{
              fontSize: '0.86rem',
              color: message.type === 'success' ? '#713f12' : '#991b1b',
              fontWeight: 600,
              flex: 1,
              lineHeight: 1.35,
            }}
          >
            {message.text}
          </span>
        </div>
      )}

      {/* SIDEBAR VERTICALE GAUCHE */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <HariEmblem size={72} />
          <div>
            <div className="brand-title">
              <span className="brand-ehari">e-hari</span>
            </div>
            <div className="brand-sub">ONG HARI Madagascar</div>
          </div>
        </div>

        {/* Navigation adaptée au rôle */}
        <nav className="sidebar-nav">
          {/* Menu spécifique ADMIN */}
          {currentRole === 'admin' && (
            <>
              <button
                className={`nav-item ${view === 'admin_dashboard' ? 'active' : ''}`}
                onClick={() => setView('admin_dashboard')}
              >
                <DashboardIcon />
                <span>Tableau de Bord</span>
              </button>
              <button
                className={`nav-item ${view === 'admin_eleves' ? 'active' : ''}`}
                onClick={() => setView('admin_eleves')}
              >
                <ElevesIcon />
                <span>Élèves</span>
              </button>
              <button
                className={`nav-item ${view === 'admin_etudiants' ? 'active' : ''}`}
                onClick={() => setView('admin_etudiants')}
              >
                <EtudiantsIcon />
                <span>Étudiants</span>
              </button>
              <button
                className={`nav-item ${view === 'admin_reconversion' ? 'active' : ''}`}
                onClick={() => setView('admin_reconversion')}
              >
                <EmploiIcon />
                <span>À la recherche d'un emploi</span>
              </button>
              <button
                className={`nav-item ${view === 'admin_entreprises' ? 'active' : ''}`}
                onClick={() => setView('admin_entreprises')}
              >
                <EntreprisesIcon />
                <span>Entreprises</span>
              </button>
              <button
                className={`nav-item ${view === 'admin_facultes' ? 'active' : ''}`}
                onClick={() => setView('admin_facultes')}
              >
                <FacultesIcon />
                <span>Facultés</span>
              </button>
              <button
                className={`nav-item ${view === 'admin_metiers' ? 'active' : ''}`}
                onClick={() => setView('admin_metiers')}
              >
                <MetiersIcon />
                <span>Métiers</span>
              </button>
              <button
                className={`nav-item ${view === 'admin_messages' ? 'active' : ''}`}
                onClick={() => {
                  setView('admin_messages');
                  setActiveChatUserId(null);
                }}
              >
                <MessagesIcon />
                <span>Messages</span>
                {unreadMessagesCount > 0 && (
                  <span className="nav-item-badge badge-unread">{unreadMessagesCount}</span>
                )}
              </button>
            </>
          )}

          {/* Menu spécifique ÉLÈVE */}
          {currentRole === 'eleve' && (
            <>
              <button
                className={`nav-item ${view === 'eleve_profil' ? 'active' : ''}`}
                onClick={() => setView('eleve_profil')}
              >
                <ProfilIcon />
                <span>Mon Profil</span>
              </button>
              <button
                className={`nav-item ${view === 'eleve_test_interets' ? 'active' : ''}`}
                onClick={startTest1}
              >
                <PassionsIcon />
                <span>Mes Passions & Intérêts</span>
              </button>
              <button
                className={`nav-item ${view === 'eleve_test_matieres' ? 'active' : ''}`}
                onClick={startTest2}
              >
                <MatieresIcon />
                <span>Mes Matières Scolaires</span>
              </button>
              <button
                className={`nav-item ${view === 'eleve_guide' ? 'active' : ''}`}
                onClick={() => setView('eleve_guide')}
              >
                <GuideIcon />
                <span>Conseils & Bilan</span>
              </button>
              <button
                className={`nav-item ${view === 'eleve_planning_revision' ? 'active' : ''}`}
                onClick={() => setView('eleve_planning_revision')}
              >
                <PlanningIcon />
                <span>Planning de Révision</span>
              </button>
              <button
                className={`nav-item ${view === 'eleve_messages' ? 'active' : ''}`}
                onClick={() => setView('eleve_messages')}
              >
                <MessagesIcon />
                <span>Messages</span>
                {unreadMessagesCount > 0 && (
                  <span className="nav-item-badge badge-unread">{unreadMessagesCount}</span>
                )}
              </button>
            </>
          )}

          {/* Menu spécifique ÉTUDIANT */}
          {currentRole === 'etudiant' && (
            <>
              <button
                className={`nav-item ${view === 'etudiant_home' ? 'active' : ''}`}
                onClick={() => setView('etudiant_home')}
              >
                <ProfilIcon />
                <span>Mon Profil Étudiant</span>
              </button>
              <button
                className={`nav-item ${view === 'etudiant_test1' ? 'active' : ''}`}
                onClick={startStudentTest1}
              >
                <PassionsIcon />
                <span>1. Personnalité Professionnelle</span>
              </button>
              <button
                className={`nav-item ${view === 'etudiant_test2' ? 'active' : ''}`}
                onClick={startStudentTest2}
              >
                <DashboardIcon />
                <span>2. Domaines & Aptitudes</span>
              </button>
              <button
                className={`nav-item ${view === 'etudiant_briefing' || view === 'etudiant_skills' ? 'active' : ''}`}
                onClick={() => setView('etudiant_briefing')}
              >
                <GuideIcon />
                <span>Bilan & Compétences Clés</span>
              </button>
              <button
                className={`nav-item ${view === 'etudiant_insertion' ? 'active' : ''}`}
                onClick={() => setView('etudiant_insertion')}
              >
                <InsertionIcon />
                <span>Insertion & Stages</span>
              </button>
              <button
                className={`nav-item ${view === 'etudiant_cv' ? 'active' : ''}`}
                onClick={() => setView('etudiant_cv')}
              >
                <CvBuilderIcon />
                <span>CV & Lettre</span>
              </button>
              <button
                className={`nav-item ${view === 'etudiant_messages' ? 'active' : ''}`}
                onClick={() => setView('etudiant_messages')}
              >
                <MessagesIcon />
                <span>Messages</span>
                {unreadMessagesCount > 0 && (
                  <span className="nav-item-badge badge-unread">{unreadMessagesCount}</span>
                )}
              </button>
            </>
          )}

          {/* Menu spécifique EMPLOI & INSERTION */}
          {(currentRole === 'emploi' || currentRole === 'reconversion' || currentRole === 'rechercher emploi') && (
            <>
              <button
                className={`nav-item ${view === 'reco_home' ? 'active' : ''}`}
                onClick={() => setView('reco_home')}
              >
                <ProfilIcon />
                <span>Mon profil</span>
              </button>
              <button
                className={`nav-item ${view === 'reco_test1' ? 'active' : ''}`}
                onClick={startRecoTest1}
              >
                <PassionsIcon />
                <span>Aspirations</span>
              </button>
              <button
                className={`nav-item ${view === 'reco_test2' ? 'active' : ''}`}
                onClick={startRecoTest2}
              >
                <DashboardIcon />
                <span>Compétences</span>
              </button>
              <button
                className={`nav-item ${view === 'reco_briefing' ? 'active' : ''}`}
                onClick={() => setView('reco_briefing')}
              >
                <GuideIcon />
                <span>Bilan & Plan d'Accès Emploi</span>
              </button>
              <button
                className={`nav-item ${view === 'reco_secteurs' ? 'active' : ''}`}
                onClick={() => setView('reco_secteurs')}
              >
                <SecteursIcon />
                <span>Secteurs qui Recrutent à Mada</span>
              </button>
              <button
                className={`nav-item ${view === 'reco_cv' ? 'active' : ''}`}
                onClick={() => setView('reco_cv')}
              >
                <CvBuilderIcon />
                <span>CV & Lettre</span>
              </button>
              <button
                className={`nav-item ${view === 'reco_messages' ? 'active' : ''}`}
                onClick={() => setView('reco_messages')}
              >
                <MessagesIcon />
                <span>Messages</span>
                {unreadMessagesCount > 0 && (
                  <span className="nav-item-badge badge-unread">{unreadMessagesCount}</span>
                )}
              </button>
            </>
          )}

          {/* Onglet commun : Mon Compte */}
          <button
            className={`nav-item ${view === 'mon_profil' ? 'active' : ''}`}
            onClick={() => setView('mon_profil')}
          >
            <MonCompteIcon />
            <span>Mon Compte</span>
          </button>
        </nav>

        {/* Profil connecté en bas de sidebar */}
        <div className="sidebar-footer">
          <div className="user-snippet">
            <div className="avatar-circle" style={{ overflow: 'hidden' }}>
              {getUserAvatar(currentUser) ? (
                <img
                  src={getUserAvatar(currentUser)}
                  alt={getUserPrenom(currentUser)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                (getUserNom(currentUser)[0] || 'U') + (getUserPrenom(currentUser)[0] || '')
              )}
            </div>
            <div className="user-snippet-info">
              <div className="user-snippet-name">
                {getUserNom(currentUser)} {getUserPrenom(currentUser)}
              </div>
              <span className={`role-chip ${currentRole === 'rechercher emploi' ? 'emploi' : currentRole}`}>
                {getRoleLabel(currentRole)}
              </span>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL SANS TOPBAR MINIMALISTE */}
      <div className="main-wrapper">
        <main className="page-container">

          {/* ========================================================
              VUE 1 : INTERFACE POUR L'ADMINISTRATEUR
              ======================================================== */}
          {currentRole === 'admin' && (
            <div>
              {view === 'admin_dashboard' && (
                <>
                  <div className="role-welcome-banner admin">
                    <div>
                      <h1 className="banner-title">Panneau d'Administration <span className="text-ehari">e-hari</span></h1>
                      <p className="banner-subtitle">
                        Gestion globale des comptes, des profils accompagnés et statistiques d'impact de l'ONG HARI Madagascar.
                      </p>
                    </div>
                  </div>
                  {stats && (
                    <div className="stats-grid">
                      <div className="stat-card">
                        <span className="stat-label">Total Utilisateurs</span>
                        <span className="stat-value">{stats.total_utilisateurs}</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-label">Élèves (Collège/Lycée)</span>
                        <span className="stat-value" style={{ color: '#d97706' }}>{stats.total_eleves}</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-label">Étudiants (Supérieur)</span>
                        <span className="stat-value" style={{ color: '#2563eb' }}>{stats.total_etudiants}</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-label">À la recherche d'un emploi</span>
                        <span className="stat-value" style={{ color: '#0d9488' }}>{stats.total_emploi ?? stats.total_reconversion ?? 0}</span>
                      </div>
                      <div className="stat-card">
                        <span className="stat-label">Administrateurs</span>
                        <span className="stat-value" style={{ color: '#dc2626' }}>{stats.total_admins}</span>
                      </div>
                    </div>
                  )}

                  {/* Histogramme des utilisateurs selon le type, la localisation et les catégories (Scientifique, etc.) */}
                  <UserHistogramChart
                    stats={stats}
                    users={users}
                    pupils={pupils}
                    students={students}
                    reconversions={reconversions}
                  />

                  {/* Accès rapide à la gestion des Référentiels (Entreprises, Facultés, Métiers) */}
                  <div className="card" style={{ marginBottom: '1.5rem', background: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h3 className="card-title" style={{ margin: 0, fontSize: '1.18rem' }}>
                          Référentiels & Bases d'Orientation e-HARI
                        </h3>
                        <p className="card-desc" style={{ margin: '0.2rem 0 0 0', fontSize: '0.86rem' }}>
                          Gestion et mise à jour des catalogues d'orientation et d'insertion professionnelle
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                      <div
                        onClick={() => setView('admin_entreprises')}
                        style={{
                          background: 'var(--bg-app)',
                          border: '1px solid var(--border)',
                          borderRadius: '10px',
                          padding: '1.15rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--hari-blue)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                            Entreprises
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            Sociétés partenaires, offres d'emploi, critères d'embauche et implantation à Madagascar.
                          </div>
                        </div>
                        <div style={{ marginTop: '0.85rem', fontWeight: 700, color: 'var(--hari-blue)', fontSize: '0.85rem' }}>
                          Gérer les entreprises →
                        </div>
                      </div>

                      <div
                        onClick={() => setView('admin_facultes')}
                        style={{
                          background: 'var(--bg-app)',
                          border: '1px solid var(--border)',
                          borderRadius: '10px',
                          padding: '1.15rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--hari-green)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                            Facultés
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            Universités d'État, grandes écoles et instituts privés habilités, filières d'excellence.
                          </div>
                        </div>
                        <div style={{ marginTop: '0.85rem', fontWeight: 700, color: 'var(--hari-green)', fontSize: '0.85rem' }}>
                          Gérer les facultés →
                        </div>
                      </div>

                      <div
                        onClick={() => setView('admin_metiers')}
                        style={{
                          background: 'var(--bg-app)',
                          border: '1px solid var(--border)',
                          borderRadius: '10px',
                          padding: '1.15rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d97706'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                            Métiers
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            Fiches métiers, secteurs en croissance, niveaux d'études requis et rémunérations indicatives.
                          </div>
                        </div>
                        <div style={{ marginTop: '0.85rem', fontWeight: 700, color: '#d97706', fontSize: '0.85rem' }}>
                          Gérer les métiers →
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Rechercher par nom, prénom, email..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                          className="form-control"
                          style={{ maxWidth: '220px' }}
                          value={roleFilter}
                          onChange={(e) => setRoleFilter(e.target.value)}
                        >
                          <option value="">Tous les profils</option>
                          <option value="eleve">Élèves</option>
                          <option value="etudiant">Étudiants</option>
                          <option value="rechercher emploi">À la recherche d'un emploi</option>
                          <option value="admin">Administrateurs</option>
                        </select>
                      </div>
                    </div>

                    <h3 className="card-title">Utilisateurs enregistrés ({users.length})</h3>

                    {loading ? (
                      <p style={{ color: '#64748b' }}>Chargement en cours...</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Nom & Prénom</th>
                              <th>Email</th>
                              <th>Rôle</th>
                              <th>Statut</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map((u) => {
                              const uid = getUserId(u);
                              const uNom = getUserNom(u);
                              const uPrenom = getUserPrenom(u);
                              const uEmail = getUserEmail(u);
                              const uRole = getUserRole(u);
                              const uStatut = getUserStatut(u);

                              return (
                                <tr key={uid}>
                                  <td><strong>{uNom} {uPrenom}</strong></td>
                                  <td>{uEmail}</td>
                                  <td><span className={`role-chip ${uRole === 'rechercher emploi' ? 'emploi' : uRole}`}>{getRoleLabel(uRole)}</span></td>
                                  <td><span className={`status-badge ${uStatut}`}>{uStatut}</span></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Vues spécifiques admin pour Élèves, Étudiants, Reconversion */}
              {view === 'admin_eleves' && (
                <div className="card">
                  <h3 className="card-title">
                    <span>Gestion des Élèves inscrits ({pupils.length})</span>
                  </h3>
                  <div className="cards-list">
                    {pupils.map((p) => {
                      const uid = getUserId(p);
                      const uNom = getUserNom(p);
                      const uPrenom = getUserPrenom(p);
                      const uStatut = getUserStatut(p);
                      return (
                        <div key={uid} className="profile-card">
                          <div className="profile-card-header">
                            <div>
                              <div className="profile-name">{uNom} {uPrenom}</div>
                              <div className="profile-subtitle">{p.ele_cla || p.elev_clas} • {p.ele_ser || p.elev_seri}</div>
                            </div>
                            <span className="role-chip eleve">Élève</span>
                          </div>
                          <div className="profile-details">
                            <div><strong>Établissement :</strong> {p.ele_eta || p.elev_etab}</div>
                            {getUserTel(p) && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><PhoneIcon size={13} /> {getUserTel(p)}</div>}
                            {getUserAdresse(p) && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><PinIcon size={13} /> {getUserAdresse(p)}</div>}
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><MailIcon size={13} /> {getUserEmail(p)}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span className={`status-badge ${uStatut}`} style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}>
                              {uStatut}
                            </span>
                            {uStatut === 'actif' ? (
                              <button
                                type="button"
                                className="action-icon-btn action-suspend"
                                onClick={() => handleChangeStatus(uid, 'suspendu')}
                                title="Suspendre ce compte"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="10" y1="15" x2="10" y2="9" />
                                  <line x1="14" y1="15" x2="14" y2="9" />
                                </svg>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="action-icon-btn action-activate"
                                onClick={() => handleChangeStatus(uid, 'actif')}
                                title="Activer ce compte"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10" />
                                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                                </svg>
                              </button>
                            )}
                            <button
                              type="button"
                              className="action-icon-btn action-message"
                              onClick={() => {
                                setActiveChatUserId(uid);
                                setView('admin_messages');
                              }}
                              title="Envoyer un message à cet élève"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="action-icon-btn action-delete"
                              onClick={() => handleDeleteUser(uid, `${uPrenom} ${uNom}`)}
                              title="Supprimer ce compte"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {view === 'admin_etudiants' && (
                <div className="card">
                  <h3 className="card-title">
                    <span>Gestion des Étudiants inscrits ({students.length})</span>
                  </h3>
                  <div className="cards-list">
                    {students.map((s) => {
                      const uid = getUserId(s);
                      const uNom = getUserNom(s);
                      const uPrenom = getUserPrenom(s);
                      const uStatut = getUserStatut(s);
                      return (
                        <div key={uid} className="profile-card">
                          <div className="profile-card-header">
                            <div>
                              <div className="profile-name">{uNom} {uPrenom}</div>
                              <div className="profile-subtitle">{s.etu_fil || s.etud_fili}</div>
                            </div>
                            <span className="role-chip etudiant">Étudiant</span>
                          </div>
                          <div className="profile-details">
                            <div><strong>Niveau :</strong> {s.etu_niv_etu || s.etud_nive_etud}</div>
                            <div><strong>Université :</strong> {s.etu_eta || s.etud_etab}</div>
                            {getUserTel(s) && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><PhoneIcon size={13} /> {getUserTel(s)}</div>}
                            {getUserAdresse(s) && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><PinIcon size={13} /> {getUserAdresse(s)}</div>}
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><MailIcon size={13} /> {getUserEmail(s)}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span className={`status-badge ${uStatut}`} style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}>
                              {uStatut}
                            </span>
                            {uStatut === 'actif' ? (
                              <button
                                type="button"
                                className="action-icon-btn action-suspend"
                                onClick={() => handleChangeStatus(uid, 'suspendu')}
                                title="Suspendre ce compte"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="10" y1="15" x2="10" y2="9" />
                                  <line x1="14" y1="15" x2="14" y2="9" />
                                </svg>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="action-icon-btn action-activate"
                                onClick={() => handleChangeStatus(uid, 'actif')}
                                title="Activer ce compte"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10" />
                                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                                </svg>
                              </button>
                            )}
                            <button
                              type="button"
                              className="action-icon-btn action-message"
                              onClick={() => {
                                setActiveChatUserId(uid);
                                setView('admin_messages');
                              }}
                              title="Envoyer un message à cet étudiant"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="action-icon-btn action-delete"
                              onClick={() => handleDeleteUser(uid, `${uPrenom} ${uNom}`)}
                              title="Supprimer ce compte"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {view === 'admin_reconversion' && (
                <div className="card">
                  <h3 className="card-title">
                    <span>Gestion des Candidats - À la recherche d'un emploi ({reconversions.length})</span>
                  </h3>
                  <div className="cards-list">
                    {reconversions.map((r) => {
                      const uid = getUserId(r);
                      const uNom = getUserNom(r);
                      const uPrenom = getUserPrenom(r);
                      const uStatut = getUserStatut(r);
                      return (
                        <div key={uid} className="profile-card">
                          <div className="profile-card-header">
                            <div>
                              <div className="profile-name">{uNom} {uPrenom}</div>
                              <div className="profile-subtitle">Origine : {r.emp_met_act || r.rec_met_act || r.reco_meti_actu || 'En recherche d\'emploi'}</div>
                            </div>
                            <span className="role-chip emploi">À la recherche d'un emploi</span>
                          </div>
                          <div className="profile-details">
                            <div><strong>Situation :</strong> {r.emp_sit_act || r.rec_sit_act || r.reco_situ_actu}</div>
                            {getUserTel(r) && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><PhoneIcon size={13} /> {getUserTel(r)}</div>}
                            {getUserAdresse(r) && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><PinIcon size={13} /> {getUserAdresse(r)}</div>}
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><MailIcon size={13} /> {getUserEmail(r)}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span className={`status-badge ${uStatut}`} style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}>
                              {uStatut}
                            </span>
                            {uStatut === 'actif' ? (
                              <button
                                type="button"
                                className="action-icon-btn action-suspend"
                                onClick={() => handleChangeStatus(uid, 'suspendu')}
                                title="Suspendre ce compte"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="10" y1="15" x2="10" y2="9" />
                                  <line x1="14" y1="15" x2="14" y2="9" />
                                </svg>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="action-icon-btn action-activate"
                                onClick={() => handleChangeStatus(uid, 'actif')}
                                title="Activer ce compte"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10" />
                                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                                </svg>
                              </button>
                            )}
                            <button
                              type="button"
                              className="action-icon-btn action-message"
                              onClick={() => {
                                setActiveChatUserId(uid);
                                setView('admin_messages');
                              }}
                              title="Envoyer un message à ce candidat"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="action-icon-btn action-delete"
                              onClick={() => handleDeleteUser(uid, `${uPrenom} ${uNom}`)}
                              title="Supprimer ce compte"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MESSAGERIE MP (ADMIN) */}
              {view === 'admin_messages' && (
                <MessengerChatView
                  currentUser={currentUser}
                  initialTargetUserId={activeChatUserId}
                  onUnreadCountChange={fetchUnreadCount}
                  allUsers={users.length > 0 ? users : [...pupils, ...students, ...reconversions]}
                />
              )}

              {/* GESTION DÉDIÉE : ENTREPRISES */}
              {view === 'admin_entreprises' && <AdminEntreprisesView />}

              {/* GESTION DÉDIÉE : FACULTÉS */}
              {view === 'admin_facultes' && <AdminFacultesView />}

              {/* GESTION DÉDIÉE : MÉTIERS */}
              {view === 'admin_metiers' && <AdminMetiersView />}
            </div>
          )}

          {/* ========================================================
              VUE 2 : INTERFACE DÉDIÉE À L'ÉLÈVE
              ======================================================== */}
          {currentRole === 'eleve' && (
            <div>
              {/* VUE PROFIL ÉLÈVE (Atterrissage direct après inscription & consultation) */}
              {view === 'eleve_profil' && (
                <div className="eleve-profile-container">
                  <div
                    className="role-welcome-banner eleve"
                    style={{
                      marginBottom: '1.25rem',
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)',
                      border: '1px solid #dcfce7',
                      borderLeft: '5px solid #16a34a',
                    }}
                  >
                    <div>
                      <h1 className="banner-title" style={{ color: '#0f172a', marginBottom: '0.35rem' }}>
                        Bonjour, {getUserPrenom(currentUser)} !
                      </h1>
                      <p className="banner-subtitle" style={{ color: '#475569', margin: 0 }}>
                        Bienvenue dans ton espace d'orientation scolaire <span className="text-ehari">e-hari</span>. Construis ton avenir pas à pas.
                      </p>
                    </div>
                  </div>

                  {/* En-tête d'accueil chaleureux de l'élève */}
                  <div className="card" style={{ marginBottom: '1.25rem' }}>
                    <div className="profile-header-bar">
                      <div className="profile-identity-summary">
                        <div
                          className="profile-avatar-wrapper"
                          ref={avatarMenuRef}
                          style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}
                        >
                          <div
                            className="profile-avatar-initials"
                            onClick={handleCameraClick}
                            title={getUserAvatar(currentUser) ? "Modifier ou retirer la photo" : "Importer une photo"}
                            style={{
                              width: '64px',
                              height: '64px',
                              cursor: 'pointer',
                              overflow: 'hidden',
                              position: 'relative',
                              border: '3px solid #ffffff',
                              boxShadow: '0 4px 14px rgba(82, 87, 50, 0.25)',
                              transition: 'transform 0.2s ease',
                            }}
                          >
                            {getUserAvatar(currentUser) ? (
                              <img
                                src={getUserAvatar(currentUser)}
                                alt={getUserPrenom(currentUser)}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              (getUserNom(currentUser)[0] || 'L') + (getUserPrenom(currentUser)[0] || 'E')
                            )}
                          </div>

                          {/* Petit badge caméra sur la pdp */}
                          <button
                            type="button"
                            onClick={handleCameraClick}
                            title={getUserAvatar(currentUser) ? "Modifier ou retirer la photo" : "Importer une photo"}
                            style={{
                              position: 'absolute',
                              bottom: '-2px',
                              right: '-2px',
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              background: '#ffffff',
                              color: '#1e293b',
                              border: '1.5px solid #cbd5e1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                              padding: 0,
                              lineHeight: 1,
                              zIndex: 2,
                            }}
                          >
                            <CameraIcon size={14} />
                          </button>

                          <input
                            type="file"
                            ref={avatarInputRef}
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              setShowAvatarMenu(false);
                              handleAvatarChange(e);
                            }}
                          />

                          {/* Mini-menu d'actions contenu dans la petite caméra */}
                          {showAvatarMenu && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 6px)',
                                left: '0',
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)',
                                zIndex: 100,
                                minWidth: '160px',
                                overflow: 'hidden',
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAvatarMenu(false);
                                  avatarInputRef.current && avatarInputRef.current.click();
                                }}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  padding: '0.6rem 0.85rem',
                                  border: 'none',
                                  background: 'transparent',
                                  color: '#1e293b',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                              >
                                <CameraIcon size={14} />
                                <span>Changer la photo</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAvatarMenu(false);
                                  handleRemoveAvatar();
                                }}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  padding: '0.6rem 0.85rem',
                                  border: 'none',
                                  borderTop: '1px solid #f1f5f9',
                                  background: 'transparent',
                                  color: '#dc2626',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                              >
                                <TrashIcon size={14} />
                                <span>Retirer la photo</span>
                              </button>
                            </div>
                          )}
                        </div>

                        <div>
                          <h2 className="card-title" style={{ marginBottom: '0.25rem' }}>
                            {getUserNom(currentUser)} {getUserPrenom(currentUser)}
                          </h2>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span className="status-badge actif">Compte Actif</span>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                              {getEleveClasse(currentUser) ? `${getEleveClasse(currentUser)} • ` : ''}
                              {isTerminaleClass(getEleveClasse(currentUser)) && getEleveSerie(currentUser) ? `${getEleveSerie(currentUser)} • ` : ''}
                              {getEleveEtablissement(currentUser) || 'Élève e-hari'}
                              {getUserDatCre(currentUser) ? ` • Inscrit(e) le ${formatDateFr(getUserDatCre(currentUser))}` : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fiche d'informations scolaires et coordonnées (PLACÉE EN PREMIER) */}
                  <div className="card" style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.1rem', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ClipboardIcon size={18} />
                        <span>Mes informations scolaires & coordonnées</span>
                      </h3>
                      <button
                        type="button"
                        className="action-icon-btn action-edit"
                        onClick={startEditEleveProfile}
                        title="Modifier mes informations"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                    </div>
                    <p className="card-desc" style={{ marginBottom: '1rem' }}>
                      Ces données permettent aux conseillers de l'ONG HARI de mieux vous connaître et de vous accompagner :
                    </p>

                    <div className="form-grid profile-details-grid">
                      <div className="profile-field-item">
                        <span className="field-label">Nom de famille</span>
                        <span className="field-value font-bold">{getUserNom(currentUser)}</span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Prénom(s)</span>
                        <span className="field-value font-bold">{getUserPrenom(currentUser)}</span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Adresse email</span>
                        <span className="field-value">{getUserEmail(currentUser)}</span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Numéro de téléphone</span>
                        <span className="field-value">{getUserTel(currentUser) || <em className="text-muted">Non renseigné</em>}</span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Adresse / Localisation</span>
                        <span className="field-value">{getUserAdresse(currentUser) || <em className="text-muted">Non renseignée</em>}</span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Établissement scolaire</span>
                        <span className="field-value">{getEleveEtablissement(currentUser) || <em className="text-muted">Non renseigné</em>}</span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Classe actuelle</span>
                        <span className="field-value font-bold">{getEleveClasse(currentUser) || <em className="text-muted">Non renseignée</em>}</span>
                      </div>

                      {/* La série suivie est affichée sur le profil uniquement si l'élève est en Terminale */}
                      {isTerminaleClass(getEleveClasse(currentUser)) && (
                        <div className="profile-field-item">
                          <span className="field-label">Série suivie</span>
                          <span className="field-value font-bold" style={{ color: '#1e3a8a' }}>
                            {getEleveSerie(currentUser) || <em className="text-muted">Non renseignée</em>}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Parcours d'orientation pas à pas (PLACÉ EN BAS DE MES INFORMATIONS SCOLAIRES) */}
                  <div className="card" style={{ marginBottom: '1.25rem' }}>
                    {(() => {
                      const etape = getEleveEtape(currentUser);
                      const isNiv3 = etape >= 3;
                      const isNiv2 = etape === 2;
                      const pct = isNiv3 ? 85 : isNiv2 ? 55 : 20;

                      return (
                        <>
                          <div className="profile-evolution-header">
                            <div>
                              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <span style={{ color: 'var(--hari-green, #16a34a)', display: 'inline-flex' }}>
                                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12A10 10 0 0 1 12 2z" />
                                    <path d="m9 12 2 2 4-4" />
                                  </svg>
                                </span>
                                <span>Votre parcours d'orientation avec l'ONG HARI</span>
                              </h2>
                              <p className="card-desc">
                                {isNiv3
                                  ? "Bravo ! Vos passions et vos forces scolaires sont identifiées. Les prochaines étapes vous aideront à choisir votre série et à préparer votre avenir."
                                  : isNiv2
                                  ? "Votre profil de personnalité est enregistré ! Complétez l'étape suivante sur vos matières scolaires pour affiner votre profil."
                                  : "Votre inscription est validée. Ce parcours vous accompagne pas à pas pour découvrir vos talents, vos matières fortes et votre future orientation."}
                              </p>
                            </div>
                            <div className="profile-level-badge">
                              <span className="level-tag" style={{ background: isNiv3 ? '#f3f5ea' : isNiv2 ? '#fdf6e2' : '#f1f5f9', color: isNiv3 ? '#525732' : isNiv2 ? '#7c4a2d' : '#475569', border: isNiv3 ? '1px solid #d4d7bc' : isNiv2 ? '1px solid #DDB762' : '1px solid #e2e8f0' }}>
                                {isNiv3 ? 'Étape 3 sur 5' : isNiv2 ? 'Étape 2 sur 5' : 'Étape 1 sur 5'}
                              </span>
                              <span className="level-name">
                                {isNiv3
                                  ? 'Passions & Matières enregistrées'
                                  : isNiv2
                                  ? 'Personnalité identifiée'
                                  : 'Inscription validée'}
                              </span>
                            </div>
                          </div>

                          <div className="profile-progress-container" style={{ margin: '1rem 0 1.5rem 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                              <span>Progression de votre orientation : {pct}%</span>
                              <span style={{ color: '#525732' }}>
                                {isNiv3
                                  ? '3 étapes franchies sur 5'
                                  : isNiv2
                                  ? '2 étapes franchies sur 5'
                                  : '1ère étape franchie'}
                              </span>
                            </div>
                            <div className="progress-track" style={{ height: '8px', background: '#e8e6dd', borderRadius: '4px', overflow: 'hidden' }}>
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${pct}%`,
                                  height: '100%',
                                  background: 'linear-gradient(90deg, #525732 0%, #DDB762 100%)',
                                  borderRadius: '4px',
                                  transition: 'width 0.4s ease',
                                }}
                              />
                            </div>
                          </div>
                        </>
                      );
                    })()}

                    <div className="tasks-evolution-list">
                      {/* Étape 1 : Inscription */}
                      <div className="task-evolution-item completed">
                        <div className="task-step-icon">
                          <CheckIcon size={18} />
                        </div>
                        <div className="task-step-content">
                          <div className="task-step-title">1. Mon inscription & mes coordonnées</div>
                          <div className="task-step-desc">
                            Votre compte élève est créé et vos informations de base sont enregistrées.
                          </div>
                          <span className="task-badge-done">Complété</span>
                        </div>
                      </div>

                      {/* Étape 2 : Découverte des passions */}
                      <div className={`task-evolution-item ${Boolean(getEleveOriPro1(currentUser)) ? 'completed' : 'pending active-task'}`}>
                        <div className="task-step-icon">
                          {Boolean(getEleveOriPro1(currentUser)) ? (
                            <CheckIcon size={18} />
                          ) : (
                            <PassionsIcon size={18} />
                          )}
                        </div>
                        <div className="task-step-content">
                          <div className="task-step-title">
                            2. Découverte de vos passions et de votre personnalité
                          </div>
                          <div className="task-step-desc">
                            {Boolean(getEleveOriPro1(currentUser)) ? (
                              <span>
                                Profil de personnalité : <strong>{getEleveOriPro1(currentUser)}</strong>
                              </span>
                            ) : (
                              'Ce questionnaire explore vos traits de caractère et affinités pour définir votre profil de personnalité.'
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                            <span className={Boolean(getEleveOriPro1(currentUser)) ? 'task-badge-done' : 'task-badge-pending'}>
                              {Boolean(getEleveOriPro1(currentUser)) ? 'Complété' : 'Étape actuelle'}
                            </span>
                            {!Boolean(getEleveOriPro1(currentUser)) ? (
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={startTest1}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="5" y1="12" x2="19" y2="12" />
                                  <polyline points="12 5 19 12 12 19" />
                                </svg>
                                <span>Découvrir mes affinités (7 questions)</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="action-icon-btn action-edit"
                                onClick={() => {
                                  startEditEleveTest1();
                                  setView('eleve_test_interets');
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                title="Modifier mes réponses"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Étape 3 : Matières et atouts */}
                      <div className={`task-evolution-item ${Boolean(getEleveOriPro2(currentUser)) ? 'completed' : Boolean(getEleveOriPro1(currentUser)) ? 'pending active-task' : 'pending'}`}>
                        <div className="task-step-icon">
                          {Boolean(getEleveOriPro2(currentUser)) ? (
                            <CheckIcon size={18} />
                          ) : (
                            <MatieresIcon size={18} />
                          )}
                        </div>
                        <div className="task-step-content">
                          <div className="task-step-title">
                            3. Vos matières scolaires et vos atouts
                          </div>
                          <div className="task-step-desc">
                            {Boolean(getEleveOriPro2(currentUser)) ? (
                              <span>
                                Orientation selon vos matières : <strong>{getEleveOriPro2(currentUser)}</strong>
                              </span>
                            ) : (
                              'Indiquez vos matières favorites et vos compétences pour dégager votre orientation selon vos atouts scolaires.'
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                            <span className={Boolean(getEleveOriPro2(currentUser)) ? 'task-badge-done' : Boolean(getEleveOriPro1(currentUser)) ? 'task-badge-pending' : 'task-badge-locked'}>
                              {Boolean(getEleveOriPro2(currentUser)) ? 'Complété' : Boolean(getEleveOriPro1(currentUser)) ? 'Étape actuelle' : 'À venir'}
                            </span>
                            {!Boolean(getEleveOriPro2(currentUser)) && Boolean(getEleveOriPro1(currentUser)) && (
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={startTest2}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                                <span>Remplir le questionnaire</span>
                              </button>
                            )}
                            {Boolean(getEleveOriPro2(currentUser)) && (
                              <button
                                type="button"
                                className="action-icon-btn action-edit"
                                onClick={() => {
                                  startEditEleveTest2();
                                  setView('eleve_test_matieres');
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                title="Modifier mes choix"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Étape 4 : Choix de séries */}
                      <div className={`task-evolution-item ${Boolean(getEleveOriPro1(currentUser)) && Boolean(getEleveOriPro2(currentUser)) ? 'completed' : 'locked'}`}>
                        <div className="task-step-icon">
                          {Boolean(getEleveOriPro1(currentUser)) && Boolean(getEleveOriPro2(currentUser)) ? (
                            <CheckIcon size={18} />
                          ) : (
                            <GuideIcon size={18} />
                          )}
                        </div>
                        <div className="task-step-content">
                          <div className="task-step-title">4. Découverte des séries adaptées au lycée et débouchés</div>
                          <div className="task-step-desc">
                            Recommandation des séries adaptées à votre profil, études supérieures et métiers d'avenir à Madagascar.
                          </div>
                          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                            <span className={Boolean(getEleveOriPro1(currentUser)) && Boolean(getEleveOriPro2(currentUser)) ? 'task-badge-done' : 'task-badge-locked'}>
                              {Boolean(getEleveOriPro1(currentUser)) && Boolean(getEleveOriPro2(currentUser)) ? 'Disponible' : 'À débloquer'}
                            </span>
                            {Boolean(getEleveOriPro1(currentUser)) && Boolean(getEleveOriPro2(currentUser)) && (
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => setView('eleve_guide')}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10" />
                                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.15" />
                                </svg>
                                <span>Consulter mon bilan complet</span>
                              </button>
                            )}
                        </div>
                      </div>
                    </div>

                      {/* Étape 5 : Participation aux salons & forums d'orientation */}
                      <div className="task-evolution-item locked">
                        <div className="task-step-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </div>
                        <div className="task-step-content">
                          <div className="task-step-title">5. Forums des métiers & salons d'orientation</div>
                          <div className="task-step-desc">
                            Participez aux journées portes ouvertes et salons de l'étudiant pour rencontrer directement les universités et les professionnels.
                          </div>
                          <span className="task-badge-locked">Étape finale</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal de modification des informations d'inscription */}
                  {editingEleveProfile && (
                    <div className="auth-modal-backdrop" onClick={() => setEditingEleveProfile(false)}>
                      <div className="auth-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
                        <button
                          type="button"
                          className="modal-close-btn"
                          onClick={() => setEditingEleveProfile(false)}
                          title="Fermer"
                        >
                          <CloseIcon size={16} />
                        </button>
                        <div className="auth-card modal-inner-card">
                          <h2 className="modal-title">Modifier mes informations</h2>
                          <p className="modal-subtitle">
                            Mettez à jour vos coordonnées et votre statut d'élève :
                          </p>

                          <form onSubmit={handleSaveEleveProfile}>
                            <div className="auth-form-grid">
                              <div className="form-group">
                                <label>Nom de famille :</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  required
                                  value={eleveProfileForm.uti_nom}
                                  onChange={(e) => setEleveProfileForm({ ...eleveProfileForm, uti_nom: e.target.value.toUpperCase() })}
                                />
                              </div>
                              <div className="form-group">
                                <label>Prénom(s) (facultatif) :</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={eleveProfileForm.uti_pre}
                                  onChange={(e) => setEleveProfileForm({ ...eleveProfileForm, uti_pre: formatPrenom(e.target.value) })}
                                  placeholder="facultatif"
                                />
                              </div>
                            </div>

                            <div className="auth-form-grid">
                              <div className="form-group">
                                <label>Téléphone :</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={eleveProfileForm.uti_tel}
                                  onChange={(e) => setEleveProfileForm({ ...eleveProfileForm, uti_tel: e.target.value })}
                                  placeholder="034 XX XXX XX"
                                />
                              </div>
                              <div className="form-group">
                                <label>Adresse :</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={eleveProfileForm.uti_adr}
                                  onChange={(e) => setEleveProfileForm({ ...eleveProfileForm, uti_adr: e.target.value })}
                                  placeholder="Ville / Quartier"
                                />
                              </div>
                            </div>

                            <div className="auth-form-grid">
                              <div className="form-group">
                                <label>Établissement scolaire :</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={eleveProfileForm.ele_eta}
                                  onChange={(e) => setEleveProfileForm({ ...eleveProfileForm, ele_eta: e.target.value })}
                                  placeholder="Nom de l'établissement"
                                />
                              </div>
                              <div className="form-group">
                                <label>Classe actuelle :</label>
                                <select
                                  className="form-control"
                                  value={eleveProfileForm.ele_cla}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEleveProfileForm((prev) => ({
                                      ...prev,
                                      ele_cla: val,
                                      ele_ser: isTerminaleClass(val) ? prev.ele_ser : '',
                                    }));
                                  }}
                                >
                                  <option value="">-- Choisir la classe --</option>
                                  <option value="6ème">6ème (Collège)</option>
                                  <option value="5ème">5ème (Collège)</option>
                                  <option value="4ème">4ème (Collège)</option>
                                  <option value="3ème">3ème (Collège)</option>
                                  <option value="Seconde">Seconde (Lycée)</option>
                                  <option value="Première">Première (Lycée)</option>
                                  <option value="Terminale">Terminale (Lycée)</option>
                                </select>
                              </div>
                            </div>

                            {isTerminaleClass(eleveProfileForm.ele_cla) ? (
                              <div className="form-group">
                                <label>Série suivie au Baccalauréat : *</label>
                                <select
                                  className="form-control"
                                  required
                                  value={eleveProfileForm.ele_ser || ''}
                                  onChange={(e) => setEleveProfileForm({ ...eleveProfileForm, ele_ser: e.target.value })}
                                >
                                  <option value="">-- Choisir la série au Baccalauréat à Madagascar --</option>
                                  {MADAGASCAR_SERIES.map((s) => (
                                    <option key={s.value} value={s.value}>
                                      {s.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.84rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <PassionsIcon size={16} />
                                <em>La série officielle du Baccalauréat est renseignée pour la classe de Terminale. Pour les classes du collège et début de lycée, votre série idéale est calculée et proposée via vos tests d'orientation.</em>
                              </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                              <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => setEditingEleveProfile(false)}
                              >
                                Annuler
                              </button>
                              <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                              >
                                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VUE TEST 1 : CENTRES D'INTÉRÊT & PASSIONS + PERSONNALITÉ */}
              {view === 'eleve_test_interets' && (
                <div className="eleve-test-container">
                  <div
                    className="role-welcome-banner eleve"
                    style={{
                      marginBottom: '1.25rem',
                      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                      border: '1px solid #bfdbfe',
                      borderLeft: '5px solid #2563eb',
                    }}
                  >
                    <div>
                      <h1 className="banner-title" style={{ color: '#0f172a', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <PassionsIcon size={22} />
                        <span>Passions & Profil de Personnalité</span>
                      </h1>
                      <p className="banner-subtitle" style={{ color: '#0f172a', margin: 0 }}>
                        Explorez vos traits de caractère dominants et vos affinités pour définir votre première piste d'orientation.
                      </p>
                    </div>
                  </div>

                  {/* SI LE TEST EST DÉJÀ REMPLI ET QU'ON N'EST PAS EN MODE ÉDITION :
                      LE QUESTIONNAIRE DISPARAÎT ET C'EST LE RÉSULTAT QUI S'AFFICHE DANS LA PAGE */}
                  {Boolean(getEleveOriPro1(currentUser)) && !isEditingTest1 ? (
                    <div className="card test-card-box" style={{ borderLeft: '5px solid #525732' }}>
                      <div className="test-nav-header" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span className="test-badge-step" style={{ background: '#f5f4ec', color: '#525732', border: '1px solid #DDB762', padding: '0.3rem 0.85rem', borderRadius: '14px', fontSize: '0.82rem', fontWeight: 700 }}>
                            Résultat de votre test de personnalité
                          </span>
                          <button
                            type="button"
                            className="action-icon-btn action-edit"
                            onClick={startEditEleveTest1}
                            title="Modifier mes réponses"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div style={{ textAlign: 'center', padding: '1rem 0 1.5rem 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                          <PersonalityAvatar
                            categoryKey={getEleveDetInt(currentUser)?.dominantKey || getEleveOriPro1(currentUser) || 'sciences_tech'}
                            size={110}
                          />
                        </div>
                        <h2 style={{ fontSize: '1.45rem', color: '#3e4225', marginBottom: '0.5rem', fontWeight: 800 }}>
                          {getEleveOriPro1(currentUser)}
                        </h2>
                        <p style={{ maxWidth: '640px', margin: '0 auto 1.25rem auto', color: '#475569', fontSize: '0.96rem', lineHeight: 1.6 }}>
                          Ce résultat met en valeur vos traits de caractère dominants, votre tempérament naturel et vos qualités personnelles.
                        </p>
                      </div>

                      {getEleveCentresInteret(currentUser).length > 0 && (
                        <div style={{ background: '#faf9f5', border: '1px solid #e6e2d6', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                          <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '0.95rem', color: '#1e293b', fontWeight: 700 }}>
                            Vos qualités et traits de caractère dominants :
                          </h4>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {getEleveCentresInteret(currentUser).map((ci, idx) => (
                              <span key={idx} style={{ background: '#f3f5ea', color: '#525732', border: '1px solid #d4d7bc', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <CheckIcon size={12} />
                                <span>{ci}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={startTest2}
                          style={{ fontWeight: 700, padding: '0.65rem 1.4rem' }}
                        >
                          Passer au questionnaire des matières
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* SINON, ON AFFICHE LE QUESTIONNAIRE NORMALEMENT */
                    <div className="card test-card-box">
                      <div className="test-nav-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span className="test-badge-step" style={{ background: '#fdf8ea', color: '#7c4a2d', border: '1px solid #DDB762', padding: '0.3rem 0.85rem', borderRadius: '14px', fontSize: '0.82rem', fontWeight: 700 }}>
                          {isEditingTest1 ? "Modification du Test 1 • Vos Passions & Affinités" : "Étape 2 sur 5 • Vos Passions & Affinités"}
                        </span>
                        {isEditingTest1 && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => setIsEditingTest1(false)}
                            style={{ fontSize: '0.82rem', padding: '0.25rem 0.75rem' }}
                          >
                            Annuler la modification
                          </button>
                        )}
                      </div>

                      <div className="test-header-titles" style={{ marginBottom: '1.5rem' }}>
                        <h2 className="test-main-title" style={{ fontSize: '1.45rem', color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <PassionsIcon size={22} />
                          <span>Découvrez vos passions et vos centres d'intérêt</span>
                        </h2>
                        <p className="card-desc">
                          Prenez un instant pour répondre spontanément à ces 7 situations selon vos préférences naturelles. Cela nous permettra de définir votre première piste d'orientation.
                        </p>
                      </div>

                      {/* Message d'alerte si incomplet */}
                      {test1Alert && (
                        <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <AlertCircleIcon size={16} />
                          <span>{test1Alert}</span>
                        </div>
                      )}

                      {/* Progression du questionnaire */}
                      <div className="qcm-step-indicator" style={{ marginBottom: '1.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                          <span>Situation {qcmInteretsStep + 1} sur {TEST_INTERETS_QUESTIONS.length}</span>
                          <span style={{ color: '#525732' }}>
                            {Math.round(((qcmInteretsStep + 1) / TEST_INTERETS_QUESTIONS.length) * 100)}% complété
                          </span>
                        </div>
                        <div className="progress-track" style={{ height: '8px', background: '#e8e6dd', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                          <div
                            className="progress-fill"
                            style={{
                              width: `${((qcmInteretsStep + 1) / TEST_INTERETS_QUESTIONS.length) * 100}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #525732, #DDB762)',
                              borderRadius: '4px',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>

                        {/* Raccourcis pour naviguer directement entre les 7 situations */}
                        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', marginRight: '0.3rem' }}>Situations :</span>
                          {TEST_INTERETS_QUESTIONS.map((_, idx) => {
                            const isAnswered = Boolean(qcmInteretsAnswers[idx]);
                            const isCurrent = qcmInteretsStep === idx;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setTest1Alert('');
                                  setQcmInteretsStep(idx);
                                }}
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '50%',
                                  border: isCurrent ? '2px solid #525732' : isAnswered ? '1px solid #DDB762' : '1px solid #cbd5e1',
                                  background: isCurrent ? '#525732' : isAnswered ? '#fdf6e2' : '#f8fafc',
                                  color: isCurrent ? '#ffffff' : isAnswered ? '#713f12' : '#64748b',
                                  fontSize: '0.82rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  padding: 0,
                                  transition: 'all 0.2s ease',
                                }}
                                title={`Situation ${idx + 1}${isAnswered ? ' (Réponse enregistrée)' : ''}`}
                              >
                                {idx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Question courante */}
                      {(() => {
                        const currentQ = TEST_INTERETS_QUESTIONS[qcmInteretsStep];
                        const selectedOptId = qcmInteretsAnswers[qcmInteretsStep];

                        return (
                          <div className="qcm-question-body" key={currentQ.id}>
                            <h3 className="qcm-question-title" style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.35rem' }}>
                              {currentQ.question}
                            </h3>
                            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.25rem' }}>
                              Choisissez la situation qui résonne le plus avec vos envies :
                            </p>

                            <div className="qcm-options-grid">
                              {currentQ.options.map((opt) => {
                                const isSelected = selectedOptId === opt.id;

                                return (
                                  <div
                                    key={opt.id}
                                    className={`qcm-option-card ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleSelectTest1Option(qcmInteretsStep, opt.id)}
                                  >
                                    <div className="qcm-opt-radio">
                                      <span className={`radio-dot ${isSelected ? 'checked' : ''}`} />
                                    </div>
                                    <div className="qcm-opt-icon">
                                      <ModernTestIcon icon={opt.icon} id={opt.id} size={21} />
                                    </div>
                                    <div className="qcm-opt-text">
                                      <div className="qcm-opt-title">{opt.title}</div>
                                      <div className="qcm-opt-desc">{opt.desc}</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Navigation entre questions */}
                            <div className="qcm-nav-buttons" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                              <button
                                type="button"
                                className="btn btn-outline"
                                disabled={qcmInteretsStep === 0}
                                onClick={() => {
                                  setTest1Alert('');
                                  setQcmInteretsStep((s) => Math.max(0, s - 1));
                                }}
                                title="Question précédente"
                                style={{ fontSize: '1.2rem', padding: '0.45rem 1.1rem' }}
                              >
                                ←
                              </button>

                              {qcmInteretsStep < TEST_INTERETS_QUESTIONS.length - 1 ? (
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => {
                                    if (!selectedOptId) {
                                      setTest1Alert('Veuillez sélectionner une option pour cette situation avant de continuer.');
                                      return;
                                    }
                                    setTest1Alert('');
                                    setQcmInteretsStep((s) => s + 1);
                                  }}
                                >
                                  Suivante →
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-primary font-bold"
                                  disabled={submittingTest}
                                  onClick={handleSubmitTest1}
                                  style={{ background: '#16a34a', borderColor: '#16a34a', padding: '0.65rem 1.4rem' }}
                                >
                                  {submittingTest
                                    ? 'Enregistrement en cours...'
                                    : isEditingTest1
                                    ? 'Mettre à jour mon profil de personnalité'
                                    : 'Découvrir mon profil de personnalité'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* VUE TEST 2 : QUESTIONNAIRE DES MATIÈRES & APTITUDES */}
              {view === 'eleve_test_matieres' && (
                <div className="eleve-test-container">
                  <div
                    className="role-welcome-banner eleve"
                    style={{
                      marginBottom: '1.25rem',
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                      border: '1px solid #bbf7d0',
                      borderLeft: '5px solid #16a34a',
                    }}
                  >
                    <div>
                      <h1 className="banner-title" style={{ color: '#14532d', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <MatieresIcon size={22} />
                        <span>Matières Scolaires & Aptitudes</span>
                      </h1>
                      <p className="banner-subtitle" style={{ color: '#334155', margin: 0 }}>
                        Identifiez vos forces académiques et vos facilités en classe pour dégager votre orientation scolaire.
                      </p>
                    </div>
                  </div>

                  {/* SI LE QUESTIONNAIRE EST DÉJÀ REMPLI ET QU'ON N'EST PAS EN MODE ÉDITION :
                      LE QUESTIONNAIRE DISPARAÎT ET C'EST LE RÉSULTAT QUI S'AFFICHE DANS LA PAGE */}
                  {Boolean(getEleveOriPro2(currentUser)) && !isEditingTest2 ? (
                    <div className="card test-card-box" style={{ borderLeft: '5px solid #16a34a' }}>
                      <div className="test-nav-header" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span className="test-badge-step" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.3rem 0.85rem', borderRadius: '14px', fontSize: '0.82rem', fontWeight: 700 }}>
                            Résultat de votre orientation scolaire
                          </span>
                          <button
                            type="button"
                            className="action-icon-btn action-edit"
                            onClick={startEditEleveTest2}
                            title="Modifier mes choix"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div style={{ textAlign: 'center', padding: '1rem 0 1.5rem 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem', color: '#525732' }}>
                          <BookOpenIcon size={48} />
                        </div>
                        <h2 style={{ fontSize: '1.45rem', color: '#3e4225', marginBottom: '0.5rem', fontWeight: 800 }}>
                          {getEleveOriPro2(currentUser)}
                        </h2>
                        <p style={{ maxWidth: '640px', margin: '0 auto 1.25rem auto', color: '#475569', fontSize: '0.96rem', lineHeight: 1.6 }}>
                          Cette orientation a été calculée de manière <strong>indépendante</strong> de vos passions, sur la base de vos matières scolaires favorites et de votre auto-évaluation.
                        </p>
                      </div>

                      {getEleveMatieres(currentUser).length > 0 && (
                        <div style={{ background: '#faf9f5', border: '1px solid #e6e2d6', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                          <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '0.95rem', color: '#1e293b', fontWeight: 700 }}>
                            Vos matières scolaires favorites :
                          </h4>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {getEleveMatieres(currentUser).map((mat, idx) => (
                              <span key={idx} style={{ background: '#f3f5ea', color: '#525732', border: '1px solid #d4d7bc', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <BookOpenIcon size={14} />
                                <span>{mat}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {getEleveDetMat(currentUser)?.dominantPole?.recommandations && (
                        <div style={{ background: '#fdf9ee', border: '1px solid #DDB762', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#7c4a2d', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                            Filière suggérée au lycée
                          </div>
                          <p style={{ margin: 0, fontSize: '0.95rem', color: '#3e4225', fontWeight: 600 }}>
                            {getEleveDetMat(currentUser).dominantPole.recommandations}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* QUESTIONNAIRE NORMAL DES MATIÈRES */
                    <div className="card test-card-box">
                      <div className="test-nav-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span className="test-badge-step" style={{ background: '#fdf8ea', color: '#7c4a2d', border: '1px solid #DDB762', padding: '0.3rem 0.85rem', borderRadius: '14px', fontSize: '0.82rem', fontWeight: 700 }}>
                          {isEditingTest2 ? "Modification du Test 2 • Vos Matières Scolaires" : "Étape 3 sur 5 • Vos Matières Scolaires"}
                        </span>
                        {isEditingTest2 && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => setIsEditingTest2(false)}
                            style={{ fontSize: '0.82rem', padding: '0.25rem 0.75rem' }}
                          >
                            Annuler la modification
                          </button>
                        )}
                      </div>

                      <div className="test-header-titles" style={{ marginBottom: '1.5rem' }}>
                        <h2 className="test-main-title" style={{ fontSize: '1.45rem', color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <MatieresIcon size={22} />
                          <span>Vos matières scolaires favorites & vos atouts</span>
                        </h2>
                        <p className="card-desc">
                          Indiquez les matières où vous vous sentez le plus à l'aise et auto-évaluez vos compétences pour obtenir une 2ème piste d'orientation, calculée de manière <strong>indépendante</strong> de vos passions.
                        </p>
                      </div>

                      {/* Message d'alerte si incomplet */}
                      {test2Alert && (
                        <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <AlertCircleIcon size={16} />
                          <span>{test2Alert}</span>
                        </div>
                      )}

                      <div className="matieres-section-block">
                        <div className="section-title-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>1. Vos Matières Scolaires Favorites</h3>
                          <span className="selection-count-badge" style={{ background: qcmMatieresFavorites.length >= 2 ? '#f3f5ea' : '#fef2f2', color: qcmMatieresFavorites.length >= 2 ? '#525732' : '#991b1b', border: qcmMatieresFavorites.length >= 2 ? '1px solid #d4d7bc' : '1px solid #fca5a5', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
                            {qcmMatieresFavorites.length} sélectionnée(s) (Minimum : 2)
                          </span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1rem' }}>
                          Sélectionnez 2 à 4 matières dans lesquelles vous réussissez le mieux ou que vous prenez plaisir à étudier :
                        </p>

                        <div className="matieres-pills-grid">
                          {LISTE_MATIERES_DISPONIBLES.map((subj) => {
                            const isSelected = qcmMatieresFavorites.includes(subj.id);
                            return (
                              <div
                                key={subj.id}
                                className={`matiere-pill-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleToggleFavoriteSubject(subj.id)}
                              >
                                <span className="matiere-icon">
                                  <ModernTestIcon icon={subj.icon} id={subj.id} size={18} />
                                </span>
                                <span className="matiere-label">{subj.label}</span>
                                <span className="matiere-check">{isSelected ? <CheckIcon size={12} /> : '+'}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="matieres-section-block" style={{ marginTop: '2rem' }}>
                        <div className="section-title-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>2. Auto-évaluation de vos Aptitudes Concrètes</h3>
                          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                            Échelle de maîtrise de 1 à 4
                          </span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.25rem' }}>
                          Pour chaque compétence ci-dessous, estimez votre niveau actuel d'aisance :
                        </p>

                        <div className="aptitudes-list">
                          {LISTE_APTITUDES.map((apt) => {
                            const currentRating = qcmAptitudes[apt.id] || 2;
                            const ratingLabels = ['1. Débutant', '2. Moyen', '3. Bon', '4. Excellent'];

                            return (
                              <div key={apt.id} className="aptitude-row-item">
                                <div className="aptitude-info">
                                  <div className="aptitude-title">{apt.label}</div>
                                  <div className="aptitude-desc">{apt.desc}</div>
                                </div>
                                <div className="aptitude-rating-buttons">
                                  {[1, 2, 3, 4].map((rating) => (
                                    <button
                                      key={rating}
                                      type="button"
                                      className={`rating-btn ${currentRating === rating ? 'active' : ''}`}
                                      onClick={() => handleSetAptitudeRating(apt.id, rating)}
                                    >
                                      <span className="rating-num">{rating}</span>
                                      <span className="rating-text">{ratingLabels[rating - 1].split('. ')[1]}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-primary font-bold"
                          disabled={submittingTest}
                          onClick={handleSubmitTest2}
                          style={{ padding: '0.75rem 1.75rem' }}
                        >
                          {submittingTest
                            ? 'Enregistrement en cours...'
                            : isEditingTest2
                            ? 'Mettre à jour mon orientation scolaire'
                            : 'Découvrir mon orientation selon mes matières'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MODAL RÉSULTAT DU TEST 1 : PROFIL DE PERSONNALITÉ (POPUP) */}
              {test1ResultModal && (
                <div
                  className="auth-modal-backdrop"
                  onClick={() => setTest1ResultModal(null)}
                >
                  <div className="auth-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
                    <div className="auth-card modal-inner-card" style={{ textAlign: 'center', padding: '2rem 1.75rem' }}>
                      {/* Avatar illustré au lieu d'une icône */}
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                        <PersonalityAvatar
                          categoryKey={test1ResultModal.dominantCat?.key || 'sciences_tech'}
                          size={96}
                        />
                      </div>

                      <h2 className="modal-title" style={{ color: '#0f172a', marginBottom: '0.35rem', fontSize: '1.35rem' }}>
                        Votre profil de personnalité est révélé !
                      </h2>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                        Voici le reflet sincère de votre tempérament naturel et de vos traits de caractère dominants.
                      </p>

                      <div style={{ background: '#eff6ff', border: '2px solid #bfdbfe', borderRadius: '14px', padding: '1.25rem', marginBottom: '1rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.5px' }}>
                          Votre tempérament dominant
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e3a8a', fontSize: '1.2rem', fontWeight: 800 }}>
                          {test1ResultModal.dominantCat?.label || test1ResultModal.oriPro}
                        </h3>
                        <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.6, margin: '0 0 0.85rem 0' }}>
                          {test1ResultModal.dominantCat?.description}
                        </p>

                        {test1ResultModal.dominantCat?.qualites && test1ResultModal.dominantCat.qualites.length > 0 && (
                          <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid #bfdbfe' }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.45rem' }}>
                              Vos forces et qualités de caractère :
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                              {test1ResultModal.dominantCat.qualites.map((q, idx) => (
                                <span key={idx} style={{ background: '#dbeafe', color: '#1e40af', padding: '0.3rem 0.65rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <CheckIcon size={12} />
                                  <span>{q}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {test1ResultModal.secondaryCat && (
                          <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px dashed #bfdbfe', fontSize: '0.85rem', color: '#475569' }}>
                            <span style={{ fontWeight: 600, color: '#1e3a8a' }}>Nuance complémentaire : </span>
                            <span>{test1ResultModal.secondaryCat.label}</span>
                          </div>
                        )}
                      </div>

                      <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0.85rem 0 0 0', fontStyle: 'italic' }}>
                        Cliquez en dehors de la boîte pour fermer
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL RÉSULTAT DU TEST 2 */}
              {test2ResultModal && (
                <div className="auth-modal-backdrop" onClick={() => setTest2ResultModal(null)}>
                  <div className="auth-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
                    <div className="auth-card modal-inner-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem', color: '#16a34a' }}>
                        <BookOpenIcon size={48} />
                      </div>
                      <h2 className="modal-title" style={{ color: '#14532d', marginBottom: '0.25rem' }}>
                        Votre orientation selon vos matières est prête !
                      </h2>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                        Calculée de manière <strong>indépendante</strong> selon vos matières scolaires favorites et vos compétences.
                      </p>

                      <div style={{ background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          2ème piste d'orientation (selon vos matières scolaires)
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#14532d', fontSize: '1.25rem', fontWeight: 800 }}>
                          {test2ResultModal.oriPro}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                          {test2ResultModal.dominantPole?.description}
                        </p>
                        <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid #dcfce7', fontSize: '0.85rem' }}>
                          <strong>Filière suggérée au lycée : </strong>
                          <span>{test2ResultModal.dominantPole?.recommandations}</span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0.85rem 0 0 0', fontStyle: 'italic' }}>
                        Cliquez en dehors de la boîte pour fermer
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* VUE ESPACE SCOLAIRE */}
              {view === 'eleve_home' && (
                <>
                  <div className="card">
                    <h2 className="card-title">Bienvenue dans ton Espace Scolaire</h2>
                    <p className="card-desc">
                      Explore les outils pour construire ton orientation scolaire et réussir ton parcours :
                    </p>
                    <div className="about-grid" style={{ marginTop: '1rem' }}>
                      <div className="about-card" style={{ cursor: 'pointer' }} onClick={() => setView('eleve_profil')}>
                        <div className="about-icon green"><ProfilIcon size={24} /></div>
                        <h3>Mon Profil Élève</h3>
                        <p>Consulte tes informations scolaires et visualise l'avancement de ton parcours d'orientation.</p>
                      </div>
                      <div className="about-card" style={{ cursor: 'pointer' }} onClick={() => setView('eleve_orientation')}>
                        <div className="about-icon red"><GuideIcon size={24} /></div>
                        <h3>Choix de Séries & Bac</h3>
                        <p>Découvre les filières du lycée et les débouchés professionnels à Madagascar.</p>
                      </div>
                      <div className="about-card" style={{ cursor: 'pointer' }} onClick={() => setView('eleve_planning_revision')}>
                        <div className="about-icon blue"><PlanningIcon size={24} /></div>
                        <h3>Planning de Révision Adapté</h3>
                        <p>Importe ton emploi du temps scolaire et reçois un planning de révision sur mesure calqué sur ton temps libre.</p>
                      </div>
                      <div className="about-card" style={{ cursor: 'pointer' }} onClick={() => setView('eleve_guide')}>
                        <div className="about-icon green"><BookOpenIcon size={24} /></div>
                        <h3>Conseils d'Orientation</h3>
                        <p>Méthodes de révision, conseils d'experts et astuces pour réussir sereinement tes études.</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {view === 'eleve_orientation' && (
                <div className="card">
                  <h2 className="card-title">Guide des Séries au Lycée</h2>
                  <p className="card-desc">Découvre les débouchés de chaque filière à Madagascar :</p>
                  <div className="about-grid">
                    <div className="about-card">
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}><ScienceIcon size={18} /> Série Scientifique (S)</h3>
                      <p><strong>Pour qui ?</strong> Élèves à l'aise en Mathématiques, Physique-Chimie et SVT.</p>
                      <p><strong>Débouchés :</strong> Médecine, Ingénierie, Agronomie, Informatique, Technologies.</p>
                    </div>
                    <div className="about-card">
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}><BookOpenIcon size={18} /> Série Littéraire (L)</h3>
                      <p><strong>Pour qui ?</strong> Passionnés de langues, littérature, philosophie et communication.</p>
                      <p><strong>Débouchés :</strong> Droit, Journalisme, Traduction, Diplomatie, Sciences humaines.</p>
                    </div>
                    <div className="about-card">
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}><DashboardIcon size={18} /> Série Économique & Sociale (OSE)</h3>
                      <p><strong>Pour qui ?</strong> Élèves intéressés par le commerce, la gestion et l'actualité économique.</p>
                      <p><strong>Débouchés :</strong> Gestion, Économie, Banque, Marketing, Entrepreneuriat.</p>
                    </div>
                  </div>
                </div>
              )}

              {view === 'eleve_guide' && (
                <div>
                  <div
                    className="role-welcome-banner eleve"
                    style={{ marginBottom: '1.25rem' }}
                  >
                    <div>
                      <h1 className="banner-title" style={{ marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <HandshakeIcon size={22} />
                        <span>Conseils d'Orientation & Bilan Stratégique</span>
                      </h1>
                      <p className="banner-subtitle" style={{ margin: 0 }}>
                        Votre synthèse personnalisée : choix de séries au lycée, universités et carrières d'avenir à Madagascar.
                      </p>
                    </div>
                  </div>
                  <OrientationBriefingView
                    currentUser={currentUser}
                    onStartTest1={startTest1}
                    onStartTest2={startTest2}
                    getEleveOriPro1={getEleveOriPro1}
                    getEleveOriPro2={getEleveOriPro2}
                    getEleveDetInt={getEleveDetInt}
                    getEleveDetMat={getEleveDetMat}
                    getEleveClasse={getEleveClasse}
                    getEleveSerie={getEleveSerie}
                  />
                </div>
              )}

              {view === 'eleve_planning_revision' && (
                <RevisionScheduleView
                  currentUser={currentUser}
                  onSaveRevisionSchedule={handleSaveRevisionSchedule}
                  onGoToBilan={() => setView('eleve_guide')}
                  getEleveOriPro1={getEleveOriPro1}
                  getEleveOriPro2={getEleveOriPro2}
                  getEleveClasse={getEleveClasse}
                  getEleveSerie={getEleveSerie}
                  getUserNom={getUserNom}
                  getUserPrenom={getUserPrenom}
                />
              )}

              {/* MESSAGERIE MP ÉLÈVE AVEC L'ADMIN */}
              {view === 'eleve_messages' && (
                <MessengerChatView
                  currentUser={currentUser}
                  onUnreadCountChange={fetchUnreadCount}
                />
              )}
            </div>
          )}

          {/* ========================================================
              VUE 3 : INTERFACE DÉDIÉE À L'ÉTUDIANT
              ======================================================== */}
          {currentRole === 'etudiant' && (
            <div>
              {/* 3.1 VUE ACCUEIL & PROFIL ÉTUDIANT (Atterrissage direct après inscription & consultation) */}
              {view === 'etudiant_home' && (
                <div className="eleve-profile-container">
                  <div
                    className="role-welcome-banner etudiant"
                    style={{
                      marginBottom: '1.25rem',
                      background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)',
                      border: '1px solid #bfdbfe',
                      borderLeft: '5px solid #2563eb',
                    }}
                  >
                    <div>
                      <h1 className="banner-title" style={{ color: '#0f172a', marginBottom: '0.35rem' }}>
                        Bonjour, {getUserPrenom(currentUser)} !
                      </h1>
                      <p className="banner-subtitle" style={{ color: '#475569', margin: 0 }}>
                        Bienvenue dans ton espace universitaire et insertion professionnelle <span className="text-ehari">e-hari</span>. Construis ton profil d'excellence pour le marché de l'emploi.
                      </p>
                    </div>
                  </div>
                  {/* En-tête d'accueil chaleureux de l'étudiant */}
                  <div className="card" style={{ marginBottom: '1.25rem' }}>
                    <div className="profile-header-bar">
                      <div className="profile-identity-summary">
                        <div
                          className="profile-avatar-wrapper"
                          ref={avatarMenuRef}
                          style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}
                        >
                          <div
                            className="profile-avatar-initials"
                            onClick={handleCameraClick}
                            title={getUserAvatar(currentUser) ? "Modifier ou retirer la photo" : "Importer une photo"}
                            style={{
                              width: '64px',
                              height: '64px',
                              cursor: 'pointer',
                              overflow: 'hidden',
                              position: 'relative',
                              border: '3px solid #ffffff',
                              boxShadow: '0 4px 14px rgba(82, 87, 50, 0.25)',
                              transition: 'transform 0.2s ease',
                              color: '#ffffff',
                            }}
                          >
                            {getUserAvatar(currentUser) ? (
                              <img
                                src={getUserAvatar(currentUser)}
                                alt={getUserPrenom(currentUser)}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              (getUserNom(currentUser)[0] || 'E') + (getUserPrenom(currentUser)[0] || 'T')
                            )}
                          </div>

                          {/* Petit badge caméra sur la photo */}
                          <button
                            type="button"
                            onClick={handleCameraClick}
                            title={getUserAvatar(currentUser) ? "Modifier ou retirer la photo" : "Importer une photo"}
                            style={{
                              position: 'absolute',
                              bottom: '-2px',
                              right: '-2px',
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              background: '#ffffff',
                              color: '#1e293b',
                              border: '1.5px solid #cbd5e1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                              padding: 0,
                              lineHeight: 1,
                              zIndex: 2,
                            }}
                          >
                            <CameraIcon size={14} />
                          </button>

                          <input
                            type="file"
                            ref={avatarInputRef}
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              setShowAvatarMenu(false);
                              handleAvatarChange(e);
                            }}
                          />

                          {/* Mini-menu d'actions contenu dans la petite caméra */}
                          {showAvatarMenu && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 6px)',
                                left: '0',
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)',
                                zIndex: 100,
                                minWidth: '160px',
                                overflow: 'hidden',
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAvatarMenu(false);
                                  avatarInputRef.current && avatarInputRef.current.click();
                                }}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  padding: '0.6rem 0.85rem',
                                  border: 'none',
                                  background: 'transparent',
                                  color: '#1e293b',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                              >
                                <CameraIcon size={14} />
                                <span>Changer la photo</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAvatarMenu(false);
                                  handleRemoveAvatar();
                                }}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  padding: '0.6rem 0.85rem',
                                  border: 'none',
                                  borderTop: '1px solid #f1f5f9',
                                  background: 'transparent',
                                  color: '#dc2626',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                              >
                                <TrashIcon size={14} />
                                <span>Retirer la photo</span>
                              </button>
                            </div>
                          )}
                        </div>

                        <div>
                          <h2 className="card-title" style={{ marginBottom: '0.25rem' }}>
                            {getUserNom(currentUser)} {getUserPrenom(currentUser)}
                          </h2>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span className="status-badge actif">Compte Actif</span>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                              {getStudentFiliere(currentUser) ? `${getStudentFiliere(currentUser)} • ` : ''}
                              {getStudentNiveau(currentUser) ? `${getStudentNiveau(currentUser)} • ` : ''}
                              {getStudentEtablissement(currentUser) || 'Étudiant e-hari'}
                              {getUserDatCre(currentUser) ? ` • Inscrit(e) le ${formatDateFr(getUserDatCre(currentUser))}` : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="action-icon-btn action-edit"
                        onClick={startEditStudentProfile}
                        title="Modifier mes informations"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Fiche d'informations universitaires et coordonnées (PLACÉE EN PREMIER) */}
                  <div className="card" style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.1rem', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ClipboardIcon size={18} />
                        <span>Mes informations universitaires & coordonnées</span>
                      </h3>
                      <button
                        type="button"
                        className="action-icon-btn action-edit"
                        onClick={startEditStudentProfile}
                        title="Modifier mes informations"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                    </div>
                    <p className="card-desc" style={{ marginBottom: '1rem' }}>
                      Ces données permettent aux conseillers de l'ONG HARI de mieux vous connaître et de vous accompagner :
                    </p>

                    <div className="form-grid profile-details-grid">
                      <div className="profile-field-item">
                        <span className="field-label">Nom de famille</span>
                        <span className="field-value font-bold">{getUserNom(currentUser)}</span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Prénom(s)</span>
                        <span className="field-value font-bold">{getUserPrenom(currentUser)}</span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Adresse email</span>
                        <span className="field-value">{getUserEmail(currentUser)}</span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Numéro de téléphone</span>
                        <span className="field-value">{getUserTel(currentUser) || <em className="text-muted">Non renseigné</em>}</span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Adresse / Localisation</span>
                        <span className="field-value">{getUserAdresse(currentUser) || <em className="text-muted">Non renseignée</em>}</span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Université / Institut</span>
                        <span className="field-value">{getStudentEtablissement(currentUser) || <em className="text-muted">Non renseigné</em>}</span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Filière / Spécialisation</span>
                        <span className="field-value font-bold" style={{ color: '#1e3a8a' }}>{getStudentFiliere(currentUser) || <em className="text-muted">Non renseignée</em>}</span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Niveau d'étude actuel</span>
                        <span className="field-value font-bold" style={{ color: '#2563eb' }}>{getStudentNiveau(currentUser) || <em className="text-muted">Non renseigné</em>}</span>
                      </div>
                    </div>
                  </div>

                  {/* Parcours d'orientation pas à pas (PLACÉ EN BAS DE MES INFORMATIONS UNIVERSITAIRES) */}
                  <div className="card" style={{ marginBottom: '1.25rem' }}>
                    {(() => {
                      const etape = getStudentEtape(currentUser);
                      const isComplete = etape >= 3 || (Boolean(getStudentOriPro1(currentUser)) && Boolean(getStudentOriPro2(currentUser)));
                      const isNiv2 = etape === 2 || (Boolean(getStudentOriPro1(currentUser)) && !Boolean(getStudentOriPro2(currentUser)));
                      const pct = isComplete ? 100 : isNiv2 ? 65 : 25;

                      return (
                        <>
                          <div className="profile-evolution-header">
                            <div>
                              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <SparklesIcon size={20} />
                                <span>Votre parcours d'insertion & orientation avec l'ONG HARI</span>
                              </h2>
                              <p className="card-desc">
                                {isComplete
                                  ? "Bravo ! Votre style de travail et vos aptitudes professionnelles sont identifiés. Votre bilan stratégique et plan d'insertion sont prêts."
                                  : isNiv2
                                  ? "Votre profil de personnalité professionnelle est enregistré ! Complétez l'étape suivante sur vos compétences pour cibler votre pôle d'emploi."
                                  : "Votre inscription est validée. Ce parcours vous accompagne pas à pas pour révéler vos talents, vos compétences clés et réussir votre insertion professionnelle."}
                              </p>
                            </div>
                            <div className="profile-level-badge">
                              <span className="level-tag" style={{ background: isComplete ? '#dcfce7' : isNiv2 ? '#e0e7ff' : '#f1f5f9', color: isComplete ? '#166534' : isNiv2 ? '#3730a3' : '#475569' }}>
                                {isComplete ? 'Étape 4 sur 4 • Bilan Débloqué' : isNiv2 ? 'Étape 2 sur 4' : 'Étape 1 sur 4'}
                              </span>
                              <span className="level-name">
                                {isComplete
                                  ? 'Bilan & Insertion prêts'
                                  : isNiv2
                                  ? 'Personnalité Pro validée'
                                  : 'Inscription validée'}
                              </span>
                            </div>
                          </div>

                          <div className="profile-progress-container" style={{ margin: '1rem 0 1.5rem 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                              <span>Progression globale : {pct}%</span>
                              <span style={{ color: isComplete ? '#15803d' : '#2563eb' }}>
                                {isComplete ? '4 étapes franchies' : isNiv2 ? '2 étapes franchies sur 4' : '1ère étape franchie'}
                              </span>
                            </div>
                            <div className="progress-track" style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${pct}%`,
                                  height: '100%',
                                  background: 'linear-gradient(90deg, #2563eb 0%, #16a34a 100%)',
                                  borderRadius: '4px',
                                  transition: 'width 0.4s ease',
                                }}
                              />
                            </div>
                          </div>
                        </>
                      );
                    })()}

                    <div className="tasks-evolution-list">
                      {/* Étape 1 : Inscription */}
                      <div className="task-evolution-item completed">
                        <div className="task-step-icon">
                          <CheckIcon size={18} />
                        </div>
                        <div className="task-step-content">
                          <div className="task-step-title">1. Mon inscription & mon cursus universitaire</div>
                          <div className="task-step-desc">
                            Compte étudiant activé • {getStudentFiliere(currentUser) || 'Filière Universitaire'} • {getStudentNiveau(currentUser) || 'Enseignement Supérieur'}.
                          </div>
                          <span className="task-badge-done">Complété</span>
                        </div>
                      </div>

                      {/* Étape 2 : Test 1 Personnalité */}
                      <div className={`task-evolution-item ${Boolean(getStudentOriPro1(currentUser)) ? 'completed' : 'pending active-task'}`}>
                        <div className="task-step-icon">
                          {Boolean(getStudentOriPro1(currentUser)) ? (
                            <CheckIcon size={18} />
                          ) : (
                            <PassionsIcon size={18} />
                          )}
                        </div>
                        <div className="task-step-content">
                          <div className="task-step-title">
                            2. Découverte de votre personnalité professionnelle & affinités de carrière
                          </div>
                          <div className="task-step-desc">
                            {Boolean(getStudentOriPro1(currentUser)) ? (
                              <span>
                                Profil dominant : <strong>{getStudentOriPro1(currentUser)}</strong>
                              </span>
                            ) : (
                              '7 situations concrètes pour identifier votre style de travail, leadership et environnement professionnel idéal.'
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                            <span className={Boolean(getStudentOriPro1(currentUser)) ? 'task-badge-done' : 'task-badge-pending'}>
                              {Boolean(getStudentOriPro1(currentUser)) ? 'Complété' : 'Étape actuelle'}
                            </span>
                            {!Boolean(getStudentOriPro1(currentUser)) ? (
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={startStudentTest1}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="5" y1="12" x2="19" y2="12" />
                                  <polyline points="12 5 19 12 12 19" />
                                </svg>
                                <span>Démarrer le Test 1 (7 questions)</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="action-icon-btn action-edit"
                                onClick={() => {
                                  startEditStudentTest1();
                                  setView('etudiant_test1');
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                title="Modifier mes réponses"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Étape 3 : Domaines & Aptitudes */}
                      <div className={`task-evolution-item ${Boolean(getStudentOriPro2(currentUser)) ? 'completed' : Boolean(getStudentOriPro1(currentUser)) ? 'pending active-task' : 'pending'}`}>
                        <div className="task-step-icon">
                          {Boolean(getStudentOriPro2(currentUser)) ? (
                            <CheckIcon size={18} />
                          ) : (
                            <DashboardIcon size={18} />
                          )}
                        </div>
                        <div className="task-step-content">
                          <div className="task-step-title">
                            3. Vos domaines d'excellence & aptitudes opérationnelles
                          </div>
                          <div className="task-step-desc">
                            {Boolean(getStudentOriPro2(currentUser)) ? (
                              <span>
                                Pôle d'insertion cible : <strong>{getStudentOriPro2(currentUser)}</strong>
                              </span>
                            ) : (
                              'Sélectionnez vos domaines majeurs et auto-évaluez 6 compétences clés recherchées par les entreprises.'
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                            <span className={Boolean(getStudentOriPro2(currentUser)) ? 'task-badge-done' : Boolean(getStudentOriPro1(currentUser)) ? 'task-badge-pending' : 'task-badge-locked'}>
                              {Boolean(getStudentOriPro2(currentUser)) ? 'Complété' : Boolean(getStudentOriPro1(currentUser)) ? 'Étape actuelle' : 'À venir'}
                            </span>
                            {!Boolean(getStudentOriPro2(currentUser)) && Boolean(getStudentOriPro1(currentUser)) ? (
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={startStudentTest2}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 20V10" />
                                  <path d="M18 20V4" />
                                  <path d="M6 20v-4" />
                                </svg>
                                <span>Évaluer mes aptitudes</span>
                              </button>
                            ) : Boolean(getStudentOriPro2(currentUser)) ? (
                              <button
                                type="button"
                                className="action-icon-btn action-edit"
                                onClick={() => {
                                  startEditStudentTest2();
                                  setView('etudiant_test2');
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                title="Modifier mes choix"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {/* Étape 4 : Bilan Stratégique & Conseils d'Insertion */}
                      <div className={`task-evolution-item ${Boolean(getStudentOriPro1(currentUser)) && Boolean(getStudentOriPro2(currentUser)) ? 'completed' : 'locked'}`}>
                        <div className="task-step-icon">
                          {Boolean(getStudentOriPro1(currentUser)) && Boolean(getStudentOriPro2(currentUser)) ? (
                            <CheckIcon size={18} />
                          ) : (
                            <GuideIcon size={18} />
                          )}
                        </div>
                        <div className="task-step-content">
                          <div className="task-step-title">
                            4. Bilan stratégique & feuille de route d'insertion vers l'emploi
                          </div>
                          <div className="task-step-desc">
                            Synthèse complète e-HARI : conseils de stages selon votre niveau ({getStudentNiveau(currentUser) || 'Licence'}), certifications prioritaires et opportunités professionnelles à Madagascar.
                          </div>
                          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                            <span className={Boolean(getStudentOriPro1(currentUser)) && Boolean(getStudentOriPro2(currentUser)) ? 'task-badge-done' : 'task-badge-locked'}>
                              {Boolean(getStudentOriPro1(currentUser)) && Boolean(getStudentOriPro2(currentUser)) ? 'Disponible' : 'À débloquer'}
                            </span>
                            {Boolean(getStudentOriPro1(currentUser)) && Boolean(getStudentOriPro2(currentUser)) && (
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => setView('etudiant_briefing')}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10" />
                                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.15" />
                                </svg>
                                <span>Consulter mon bilan complet</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Accès rapide aux modules */}
                  <div className="about-grid">
                    <div className="about-card" style={{ cursor: 'pointer' }} onClick={startStudentTest1}>
                      <div className="about-icon blue"><PassionsIcon size={24} /></div>
                      <h3>1. Test Personnalité Professionnelle</h3>
                      <p>
                        Identifiez votre profil dominant parmi 6 archétypes professionnels et découvrez vos forces d'action.
                      </p>
                    </div>

                    <div className="about-card" style={{ cursor: 'pointer' }} onClick={startStudentTest2}>
                      <div className="about-icon green"><DashboardIcon size={24} /></div>
                      <h3>2. Domaines & Aptitudes Opérationnelles</h3>
                      <p>
                        Auto-évaluez vos compétences clés et alignez vos forces avec les besoins réels des recruteurs.
                      </p>
                    </div>

                    <div className="about-card" style={{ cursor: 'pointer' }} onClick={() => setView('etudiant_briefing')}>
                      <div className="about-icon teal"><GuideIcon size={24} /></div>
                      <h3>Bilan & Conseils Carrière</h3>
                      <p>
                        Consultez votre diagnostic croisé, vos opportunités de stages et certifications à Madagascar.
                      </p>
                    </div>

                    <div className="about-card" style={{ cursor: 'pointer' }} onClick={() => setView('etudiant_insertion')}>
                      <div className="about-icon purple"><RocketIcon size={24} /></div>
                      <h3>Préparation Stages & Insertion</h3>
                      <p>
                        Conseils méthodologiques pour votre CV, vos entretiens et le réseau de mentorat ONG HARI.
                      </p>
                    </div>

                    <div className="about-card" style={{ cursor: 'pointer' }} onClick={() => setView('etudiant_cv')}>
                      <div className="about-icon blue"><CvBuilderIcon size={24} /></div>
                      <h3>Aide au CV & Lettre</h3>
                      <p>
                        Créez, personnalisez et téléchargez votre CV moderne adapté aux recruteurs et votre lettre de motivation.
                      </p>
                    </div>
                  </div>

                  {/* Modal de modification des informations d'inscription de l'étudiant */}
                  {editingStudentProfile && (
                    <div className="auth-modal-backdrop" onClick={() => setEditingStudentProfile(false)}>
                      <div className="auth-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
                        <button
                          type="button"
                          className="modal-close-btn"
                          onClick={() => setEditingStudentProfile(false)}
                          title="Fermer"
                        >
                          <CloseIcon size={16} />
                        </button>
                        <div className="auth-card modal-inner-card">
                          <h2 className="modal-title">Modifier mes informations</h2>
                          <p className="modal-subtitle">
                            Mettez à jour vos coordonnées et votre cursus universitaire :
                          </p>

                          <form onSubmit={handleSaveStudentProfile}>
                            <div className="auth-form-grid">
                              <div className="form-group">
                                <label>Nom de famille :</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  required
                                  value={studentProfileForm.uti_nom}
                                  onChange={(e) => setStudentProfileForm({ ...studentProfileForm, uti_nom: e.target.value.toUpperCase() })}
                                />
                              </div>
                              <div className="form-group">
                                <label>Prénom(s) (facultatif) :</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={studentProfileForm.uti_pre}
                                  onChange={(e) => setStudentProfileForm({ ...studentProfileForm, uti_pre: formatPrenom(e.target.value) })}
                                  placeholder="facultatif"
                                />
                              </div>
                            </div>

                            <div className="auth-form-grid">
                              <div className="form-group">
                                <label>Téléphone :</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={studentProfileForm.uti_tel}
                                  onChange={(e) => setStudentProfileForm({ ...studentProfileForm, uti_tel: e.target.value })}
                                  placeholder="034 XX XXX XX"
                                />
                              </div>
                              <div className="form-group">
                                <label>Adresse / Localisation :</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={studentProfileForm.uti_adr}
                                  onChange={(e) => setStudentProfileForm({ ...studentProfileForm, uti_adr: e.target.value })}
                                  placeholder="Ville / Quartier"
                                />
                              </div>
                            </div>

                            <div className="auth-form-grid">
                              <div className="form-group">
                                <label>Université / Institut :</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={studentProfileForm.etu_eta}
                                  onChange={(e) => setStudentProfileForm({ ...studentProfileForm, etu_eta: e.target.value })}
                                  placeholder="Nom de l'université ou institut"
                                />
                              </div>
                              <div className="form-group">
                                <label>Filière / Spécialisation :</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={studentProfileForm.etu_fil}
                                  onChange={(e) => setStudentProfileForm({ ...studentProfileForm, etu_fil: e.target.value })}
                                  placeholder="ex: Informatique, Droit, Économie..."
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label>Niveau d'étude actuel :</label>
                              <select
                                className="form-control"
                                value={studentProfileForm.etu_niv_etu}
                                onChange={(e) => setStudentProfileForm({ ...studentProfileForm, etu_niv_etu: e.target.value })}
                              >
                                <option value="">-- Choisir le niveau --</option>
                                <option value="Licence 1">Licence 1 (L1)</option>
                                <option value="Licence 2">Licence 2 (L2)</option>
                                <option value="Licence 3">Licence 3 (L3)</option>
                                <option value="Master 1">Master 1 (M1)</option>
                                <option value="Master 2">Master 2 (M2)</option>
                                <option value="Doctorat">Doctorat</option>
                                <option value="BTS / DUT">BTS / DUT (Bac+2)</option>
                                <option value="Autre">Autre cursus universitaire</option>
                              </select>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                              <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => setEditingStudentProfile(false)}
                              >
                                Annuler
                              </button>
                              <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                              >
                                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3.2 VUE DU TEST 1 : PERSONNALITÉ PRO & AFFINITÉS */}
              {view === 'etudiant_test1' && (
                <div className="eleve-test-container">
                  <div
                    className="role-welcome-banner etudiant"
                    style={{
                      marginBottom: '1.25rem',
                      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                      border: '1px solid #bfdbfe',
                      borderLeft: '5px solid #2563eb',
                    }}
                  >
                    <div>
                      <h1 className="banner-title" style={{ color: '#1e3a8a', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <PassionsIcon size={22} />
                        <span>Test 1 : Personnalité Professionnelle & Affinités de Carrière</span>
                      </h1>
                      <p className="banner-subtitle" style={{ color: '#334155', margin: 0 }}>
                        7 mises en situation pour analyser votre tempérament naturel, vos moteurs de motivation et votre dynamique de travail.
                      </p>
                    </div>
                  </div>

                  {Boolean(getStudentOriPro1(currentUser)) && !isEditingStudentTest1 ? (
                    <div className="card test-card-box" style={{ borderLeft: '5px solid #2563eb' }}>
                      <div className="test-nav-header" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span className="test-badge-step" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '0.3rem 0.85rem', borderRadius: '14px', fontSize: '0.82rem', fontWeight: 700 }}>
                            Résultat validé de votre personnalité professionnelle
                          </span>
                          <button
                            type="button"
                            className="action-icon-btn action-edit"
                            onClick={startEditStudentTest1}
                            title="Modifier mes réponses"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {(() => {
                        const savedDet = getStudentDetInt(currentUser);
                        const domKey = savedDet?.dominantKey;
                        const catInfo = (domKey && TEST_ETUDIANT_INTERETS_CATEGORIES[domKey]) || null;
                        const title = catInfo?.label || getStudentOriPro1(currentUser);
                        const desc = catInfo?.description || 'Profil orienté vers la réussite professionnelle et l\'excellence opérationnelle.';
                        const forces = catInfo?.forces || ['Rigueur d\'analyse', 'Engagement professionnel'];
                        const debouches = catInfo?.debouches || [];

                        return (
                          <>
                            <div style={{ textAlign: 'center', padding: '1rem 0 1.5rem 0' }}>
                              <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                                {catInfo?.icon || '💡'}
                              </div>
                              <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '0.25rem 0.85rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                {catInfo?.badge || 'Profil Révélé'}
                              </div>
                              <h2 style={{ fontSize: '1.5rem', color: '#1e3a8a', marginBottom: '0.5rem', fontWeight: 800 }}>
                                {title}
                              </h2>
                              <p style={{ maxWidth: '680px', margin: '0 auto 1.25rem auto', color: '#475569', fontSize: '0.98rem', lineHeight: 1.6 }}>
                                {desc}
                              </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                                <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '0.95rem', color: '#1e293b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <SparklesIcon size={16} />
                                  <span>Vos forces professionnelles dominantes :</span>
                                </h4>
                                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#334155', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                  {forces.map((f, idx) => (
                                    <li key={idx}><strong>{f}</strong></li>
                                  ))}
                                </ul>
                              </div>

                              {debouches.length > 0 && (
                                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1.25rem' }}>
                                  <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '0.95rem', color: '#1e40af', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <GuideIcon size={16} />
                                    <span>Métiers & débouchés alignés :</span>
                                  </h4>
                                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#1e3a8a', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                    {debouches.map((d, idx) => (
                                      <li key={idx}>{d}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={startStudentTest2}
                                style={{ background: '#16a34a', borderColor: '#16a34a', fontWeight: 700, padding: '0.65rem 1.4rem' }}
                              >
                                Passer au Test 2 : Domaines & Aptitudes →
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => setView('etudiant_briefing')}
                                style={{ fontWeight: 600, padding: '0.65rem 1.4rem' }}
                              >
                                Consulter mon Bilan Carrière
                              </button>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    /* FORMULAIRE QCM DES 7 SITUATIONS */
                    <div className="card test-card-box">
                      <div className="test-nav-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span className="test-badge-step" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '0.3rem 0.85rem', borderRadius: '14px', fontSize: '0.82rem', fontWeight: 700 }}>
                          {isEditingStudentTest1 ? "Modification du Test 1 • Personnalité Professionnelle" : "Étape 2 sur 4 • Personnalité Professionnelle"}
                        </span>
                        {isEditingStudentTest1 && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => setIsEditingStudentTest1(false)}
                            style={{ fontSize: '0.82rem', padding: '0.25rem 0.75rem' }}
                          >
                            Annuler la modification
                          </button>
                        )}
                      </div>

                      <div className="test-header-titles" style={{ marginBottom: '1.5rem' }}>
                        <h2 className="test-main-title" style={{ fontSize: '1.45rem', color: '#1e3a8a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <PassionsIcon size={22} />
                          <span>Découvrez votre profil professionnel & vos affinités de carrière</span>
                        </h2>
                        <p className="card-desc">
                          Prenez un instant pour répondre spontanément à ces 7 situations selon vos préférences naturelles. Cela révélera votre façon de travailler, de communiquer et de décider.
                        </p>
                      </div>

                      {studentTest1Alert && (
                        <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <AlertCircleIcon size={16} />
                          <span>{studentTest1Alert}</span>
                        </div>
                      )}

                      <div className="qcm-step-indicator" style={{ marginBottom: '1.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                          <span>Situation {studentQcmStep + 1} sur {TEST_ETUDIANT_INTERETS_QUESTIONS.length}</span>
                          <span style={{ color: '#2563eb' }}>
                            {Math.round(((studentQcmStep + 1) / TEST_ETUDIANT_INTERETS_QUESTIONS.length) * 100)}% complété
                          </span>
                        </div>
                        <div className="progress-track" style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                          <div
                            className="progress-fill"
                            style={{
                              width: `${((studentQcmStep + 1) / TEST_ETUDIANT_INTERETS_QUESTIONS.length) * 100}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #2563eb, #16a34a)',
                              borderRadius: '4px',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>

                        {/* Raccourcis pour naviguer directement entre les 7 situations */}
                        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', marginRight: '0.3rem' }}>Situations :</span>
                          {TEST_ETUDIANT_INTERETS_QUESTIONS.map((_, idx) => {
                            const isAnswered = Boolean(studentQcmAnswers[idx]);
                            const isCurrent = studentQcmStep === idx;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setStudentTest1Alert('');
                                  setStudentQcmStep(idx);
                                }}
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '50%',
                                  border: isCurrent ? '2px solid #2563eb' : isAnswered ? '1px solid #93c5fd' : '1px solid #cbd5e1',
                                  background: isCurrent ? '#2563eb' : isAnswered ? '#dbeafe' : '#f8fafc',
                                  color: isCurrent ? '#ffffff' : isAnswered ? '#1e40af' : '#64748b',
                                  fontSize: '0.82rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  padding: 0,
                                  transition: 'all 0.2s ease',
                                }}
                                title={`Situation ${idx + 1}${isAnswered ? ' (Réponse enregistrée)' : ''}`}
                              >
                                {idx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {(() => {
                        const currentQ = TEST_ETUDIANT_INTERETS_QUESTIONS[studentQcmStep];
                        const selectedOptId = studentQcmAnswers[studentQcmStep];

                        return (
                          <div className="qcm-question-body" key={currentQ.id}>
                            <h3 className="qcm-question-title" style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.35rem' }}>
                              {currentQ.question}
                            </h3>
                            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.25rem' }}>
                              Choisissez l'option qui correspond le mieux à votre tempérament naturel :
                            </p>

                            <div className="qcm-options-grid">
                              {currentQ.options.map((opt) => {
                                const isSelected = selectedOptId === opt.id;

                                return (
                                  <div
                                    key={opt.id}
                                    className={`qcm-option-card ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleSelectStudentTest1Option(studentQcmStep, opt.id)}
                                  >
                                    <div className="qcm-opt-radio">
                                      <span className={`radio-dot ${isSelected ? 'checked' : ''}`} />
                                    </div>
                                    <div className="qcm-opt-icon">
                                      <ModernTestIcon icon={opt.icon} id={opt.id} size={21} />
                                    </div>
                                    <div className="qcm-opt-text">
                                      <div className="qcm-opt-title">{opt.title}</div>
                                      {opt.desc && <div className="qcm-opt-desc">{opt.desc}</div>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="qcm-nav-buttons" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                              <button
                                type="button"
                                className="btn btn-outline"
                                disabled={studentQcmStep === 0}
                                onClick={() => {
                                  setStudentTest1Alert('');
                                  setStudentQcmStep((s) => Math.max(0, s - 1));
                                }}
                                title="Situation précédente"
                                style={{ fontSize: '1.2rem', padding: '0.45rem 1.1rem' }}
                              >
                                ←
                              </button>

                              {studentQcmStep < TEST_ETUDIANT_INTERETS_QUESTIONS.length - 1 ? (
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => {
                                    if (!selectedOptId) {
                                      setStudentTest1Alert('Veuillez sélectionner une option pour cette situation avant de continuer.');
                                      return;
                                    }
                                    setStudentTest1Alert('');
                                    setStudentQcmStep((s) => s + 1);
                                  }}
                                >
                                  Suivante →
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-primary font-bold"
                                  disabled={submittingStudentTest}
                                  onClick={handleSubmitStudentTest1}
                                  style={{ background: '#16a34a', borderColor: '#16a34a', padding: '0.65rem 1.4rem' }}
                                >
                                  {submittingStudentTest
                                    ? 'Enregistrement en cours...'
                                    : isEditingStudentTest1
                                    ? 'Mettre à jour mon profil professionnel'
                                    : 'Découvrir mon profil professionnel'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* 3.3 VUE DU TEST 2 : DOMAINES D'EXCELLENCE & APTITUDES */}
              {view === 'etudiant_test2' && (
                <div className="eleve-test-container">
                  <div
                    className="role-welcome-banner etudiant"
                    style={{
                      marginBottom: '1.25rem',
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                      border: '1px solid #bbf7d0',
                      borderLeft: '5px solid #16a34a',
                    }}
                  >
                    <div>
                      <h1 className="banner-title" style={{ color: '#14532d', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <DashboardIcon size={22} />
                        <span>Test 2 : Domaines d'Excellence & Aptitudes Opérationnelles</span>
                      </h1>
                      <p className="banner-subtitle" style={{ color: '#334155', margin: 0 }}>
                        Auto-évaluez vos compétences concrètes et identifiez votre pôle d'insertion cible de façon indépendante.
                      </p>
                    </div>
                  </div>

                  {Boolean(getStudentOriPro2(currentUser)) && !isEditingStudentTest2 ? (
                    <div className="card test-card-box" style={{ borderLeft: '5px solid #16a34a' }}>
                      <div className="test-nav-header" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span className="test-badge-step" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.3rem 0.85rem', borderRadius: '14px', fontSize: '0.82rem', fontWeight: 700 }}>
                            Résultat de votre pôle d'insertion
                          </span>
                          <button
                            type="button"
                            className="action-icon-btn action-edit"
                            onClick={startEditStudentTest2}
                            title="Modifier mes choix"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {(() => {
                        const savedDet = getStudentDetCom(currentUser);
                        const domPoleKey = savedDet?.dominantPoleKey;
                        const poleInfo = (domPoleKey && TEST_ETUDIANT_POLES_INSERTION[domPoleKey]) || savedDet?.dominantPole || null;
                        const title = poleInfo?.oriPro || getStudentOriPro2(currentUser);
                        const desc = poleInfo?.description || 'Pôle d\'excellence ciblé pour votre intégration professionnelle.';
                        const debouches = poleInfo?.metiersCibles || [];

                        return (
                          <>
                            <div style={{ textAlign: 'center', padding: '1rem 0 1.5rem 0' }}>
                              <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                                {poleInfo?.icon || '📊'}
                              </div>
                              <h2 style={{ fontSize: '1.5rem', color: '#14532d', marginBottom: '0.5rem', fontWeight: 800 }}>
                                {title}
                              </h2>
                              <p style={{ maxWidth: '680px', margin: '0 auto 1.25rem auto', color: '#475569', fontSize: '0.98rem', lineHeight: 1.6 }}>
                                {desc}
                              </p>
                            </div>

                            {/* Domaines choisis */}
                            {savedDet?.selectedDomaines && savedDet.selectedDomaines.length > 0 && (
                              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                                <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '0.95rem', color: '#1e293b', fontWeight: 700 }}>
                                  Vos domaines majeurs d'études sélectionnés :
                                </h4>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                  {savedDet.selectedDomaines.map((domId) => {
                                    const dom = LISTE_DOMAINES_EXCELLENCE_ETUDIANT.find((d) => d.id === domId);
                                    if (!dom) return null;
                                    return (
                                      <span key={domId} style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <span>{dom.icon}</span>
                                        <span>{dom.label}</span>
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {debouches.length > 0 && (
                              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                                  Métiers et spécialités cibles à Madagascar
                                </div>
                                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                                  {debouches.map((m, idx) => (
                                    <span key={idx} style={{ background: '#ffffff', color: '#047857', border: '1px solid #a7f3d0', padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                                      • {m}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setView('etudiant_briefing')}
                                style={{ background: '#0d9488', borderColor: '#0d9488', fontWeight: 700, padding: '0.65rem 1.4rem' }}
                              >
                                Consulter mon Bilan & Conseils Carrière Complets →
                              </button>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    /* FORMULAIRE D'AUTO-ÉVALUATION DES DOMAINES ET APTITUDES */
                    <div className="card test-card-box">
                      <div className="test-nav-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span className="test-badge-step" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.3rem 0.85rem', borderRadius: '14px', fontSize: '0.82rem', fontWeight: 700 }}>
                          {isEditingStudentTest2 ? "Modification du Test 2 • Domaines & Aptitudes" : "Étape 3 sur 4 • Domaines & Aptitudes"}
                        </span>
                        {isEditingStudentTest2 && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => setIsEditingStudentTest2(false)}
                            style={{ fontSize: '0.82rem', padding: '0.25rem 0.75rem' }}
                          >
                            Annuler la modification
                          </button>
                        )}
                      </div>

                      <div className="test-header-titles" style={{ marginBottom: '1.5rem' }}>
                        <h2 className="test-main-title" style={{ fontSize: '1.45rem', color: '#14532d', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <DashboardIcon size={22} />
                          <span>Vos domaines d'excellence & vos atouts opérationnels</span>
                        </h2>
                        <p className="card-desc">
                          Indiquez vos domaines d'études majeurs et auto-évaluez vos compétences pour obtenir une 2ème recommandation d'insertion, calculée de manière <strong>indépendante</strong> de votre personnalité.
                        </p>
                      </div>

                      {studentTest2Alert && (
                        <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <AlertCircleIcon size={16} />
                          <span>{studentTest2Alert}</span>
                        </div>
                      )}

                      {/* SECTION 1 : DOMAINES D'EXCELLENCE ACADÉMIQUE */}
                      <div className="matieres-section-block">
                        <div className="section-title-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>1. Vos Domaines d'Excellence Académique</h3>
                          <span className="selection-count-badge" style={{ background: studentSelectedDomaines.length >= 1 ? '#dcfce7' : '#fee2e2', color: studentSelectedDomaines.length >= 1 ? '#166534' : '#991b1b', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
                            {studentSelectedDomaines.length} sélectionné(s) (1 à 4 recommandés)
                          </span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1rem' }}>
                          Sélectionnez vos disciplines de prédilection ou vos matières d'études majeures :
                        </p>

                        <div className="matieres-pills-grid">
                          {LISTE_DOMAINES_EXCELLENCE_ETUDIANT.map((dom) => {
                            const isSelected = studentSelectedDomaines.includes(dom.id);
                            return (
                              <div
                                key={dom.id}
                                className={`matiere-pill-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleToggleStudentDomaine(dom.id)}
                              >
                                <span className="matiere-icon">{dom.icon}</span>
                                <span className="matiere-label">{dom.label}</span>
                                <span className="matiere-check">{isSelected ? <CheckIcon size={12} /> : '+'}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* SECTION 2 : AUTO-ÉVALUATION DES 6 APTITUDES */}
                      <div className="matieres-section-block" style={{ marginTop: '2rem' }}>
                        <div className="section-title-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>2. Auto-évaluation de vos Aptitudes Opérationnelles</h3>
                          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                            Niveau d'aisance de 1 à 3
                          </span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.25rem' }}>
                          Estimez honnêtement votre niveau actuel sur chacune de ces compétences clés :
                        </p>

                        <div className="aptitudes-list">
                          {LISTE_APTITUDES_ETUDIANT.map((apt) => {
                            const currentRating = studentAptitudes[apt.id] || 2;
                            const ratingLabels = ['1. En apprentissage', '2. Bon niveau', '3. Maîtrise avancée'];

                            return (
                              <div key={apt.id} className="aptitude-row-item">
                                <div className="aptitude-info">
                                  <div className="aptitude-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span>{apt.icon}</span>
                                    <span>{apt.label}</span>
                                  </div>
                                  <div className="aptitude-desc">{apt.desc}</div>
                                </div>
                                <div className="aptitude-rating-buttons">
                                  {[1, 2, 3].map((rating) => (
                                    <button
                                      key={rating}
                                      type="button"
                                      className={`rating-btn ${currentRating === rating ? 'active' : ''}`}
                                      onClick={() => handleSetStudentAptitudeRating(apt.id, rating)}
                                    >
                                      <span className="rating-num">{rating}</span>
                                      <span className="rating-text">{ratingLabels[rating - 1].split('. ')[1]}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-primary font-bold"
                          disabled={submittingStudentTest}
                          onClick={handleSubmitStudentTest2}
                          style={{ background: '#15803d', borderColor: '#15803d', padding: '0.75rem 1.75rem' }}
                        >
                          {submittingStudentTest
                            ? 'Enregistrement en cours...'
                            : isEditingStudentTest2
                            ? 'Mettre à jour mes domaines & aptitudes'
                            : 'Découvrir mon pôle d\'insertion'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3.4 VUE DU BILAN, CONSEILS CARRIÈRE & COMPÉTENCES CLÉS (FUSIONNÉES) */}
              {(view === 'etudiant_briefing' || view === 'etudiant_skills') && (
                <div className="student-briefing-page-container">
                  <div
                    className="role-welcome-banner etudiant"
                    style={{
                      marginBottom: '1.25rem',
                      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                      border: '1px solid #99f6e4',
                      borderLeft: '5px solid #0d9488',
                    }}
                  >
                    <div>
                      <h1 className="banner-title" style={{ color: '#134e4a', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <GuideIcon size={22} />
                        <span>Bilan Stratégique & Compétences Clés</span>
                      </h1>
                      <p className="banner-subtitle" style={{ color: '#334155', margin: 0 }}>
                        Feuille de route d'insertion, compétences techniques (Hard Skills), humaines (Soft Skills) et débouchés professionnels.
                      </p>
                    </div>
                  </div>

                  <StudentCareerBriefingView
                    currentUser={currentUser}
                    onStartTest1={startStudentTest1}
                    onStartTest2={startStudentTest2}
                    getStudentOriPro1={getStudentOriPro1}
                    getStudentOriPro2={getStudentOriPro2}
                    getStudentNiveau={getStudentNiveau}
                    getStudentFiliere={getStudentFiliere}
                    getStudentEtablissement={getStudentEtablissement}
                  />
                </div>
              )}

              {/* 3.6 VUE INSERTION & STAGES */}
              {view === 'etudiant_insertion' && (
                <StudentInsertionView
                  currentUser={currentUser}
                />
              )}

              {/* 3.7 VUE ATELIER CV & LETTRE (ÉTUDIANT) */}
              {view === 'etudiant_cv' && (
                <div className="student-cv-page-container">
                  <div
                    className="role-welcome-banner etudiant no-print"
                    style={{
                      marginBottom: '1.25rem',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
                      border: '1px solid #dbeafe',
                      borderLeft: '5px solid #1d4ed8',
                    }}
                  >
                    <div>
                      <h1 className="banner-title" style={{ color: '#1e3a8a', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <CvBuilderIcon size={24} />
                        <span>Atelier : CV & Lettre de Motivation</span>
                      </h1>
                      <p className="banner-subtitle" style={{ color: '#334155', margin: 0 }}>
                        Concevez votre CV et votre lettre d'intérêt sur-mesure grâce à notre atelier interactif. Personnalisez les modèles, modifiez en direct et téléchargez au format PDF A4.
                      </p>
                    </div>
                  </div>

                  <CvLetterBuilderView currentUser={currentUser} currentRole="etudiant" />
                </div>
              )}

              {/* MODAL RÉSULTAT DU TEST 1 ÉTUDIANT */}
              {studentTest1Modal && (
                <div className="auth-modal-backdrop" onClick={() => setStudentTest1Modal(null)}>
                  <div className="auth-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
                    <div className="auth-card modal-inner-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                      <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                        {studentTest1Modal.dominantCat?.icon || '💡'}
                      </div>
                      <h2 className="modal-title" style={{ color: '#1e3a8a', marginBottom: '0.35rem', fontSize: '1.35rem' }}>
                        Votre profil professionnel est révélé !
                      </h2>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                        Voici le reflet de votre tempérament de travail et de votre mode opératoire naturel.
                      </p>

                      <div style={{ background: '#eff6ff', border: '2px solid #bfdbfe', borderRadius: '14px', padding: '1.25rem', marginBottom: '1rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                          Profil Dominant
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e3a8a', fontSize: '1.2rem', fontWeight: 800 }}>
                          {studentTest1Modal.dominantCat?.label || studentTest1Modal.oriPro}
                        </h3>
                        <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.6, margin: '0 0 0.85rem 0' }}>
                          {studentTest1Modal.dominantCat?.description}
                        </p>

                        {studentTest1Modal.dominantCat?.forces && studentTest1Modal.dominantCat.forces.length > 0 && (
                          <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid #bfdbfe' }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.45rem' }}>
                              Vos forces professionnelles :
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                              {studentTest1Modal.dominantCat.forces.map((f, idx) => (
                                <span key={idx} style={{ background: '#dbeafe', color: '#1e40af', padding: '0.3rem 0.65rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <CheckIcon size={12} />
                                  <span>{f}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            setStudentTest1Modal(null);
                            startStudentTest2();
                          }}
                          style={{ background: '#16a34a', borderColor: '#16a34a', fontWeight: 700 }}
                        >
                          Passer au Test 2 (Domaines & Aptitudes) →
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => setStudentTest1Modal(null)}
                        >
                          Fermer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL RÉSULTAT DU TEST 2 ÉTUDIANT */}
              {studentTest2Modal && (
                <div className="auth-modal-backdrop" onClick={() => setStudentTest2Modal(null)}>
                  <div className="auth-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
                    <div className="auth-card modal-inner-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                      <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                        {studentTest2Modal.dominantPole?.icon || '📊'}
                      </div>
                      <h2 className="modal-title" style={{ color: '#14532d', marginBottom: '0.25rem', fontSize: '1.35rem' }}>
                        Votre pôle d'insertion est validé !
                      </h2>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                        Calculé de manière <strong>indépendante</strong> selon vos domaines académiques et compétences.
                      </p>

                      <div style={{ background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          Pôle d'insertion cible
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#14532d', fontSize: '1.25rem', fontWeight: 800 }}>
                          {studentTest2Modal.oriPro}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                          {studentTest2Modal.dominantPole?.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            setStudentTest2Modal(null);
                            setView('etudiant_briefing');
                          }}
                          style={{ background: '#0d9488', borderColor: '#0d9488', fontWeight: 700 }}
                        >
                          Consulter mon Bilan Carrière Complet →
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => setStudentTest2Modal(null)}
                        >
                          Fermer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MESSAGERIE MP ÉTUDIANT AVEC L'ADMIN */}
              {view === 'etudiant_messages' && (
                <MessengerChatView
                  currentUser={currentUser}
                  onUnreadCountChange={fetchUnreadCount}
                />
              )}
            </div>
          )}

          {/* ========================================================
              VUE 4 : INTERFACE DÉDIÉE À L'ACCÈS À L'EMPLOI & INSERTION
              ======================================================== */}
          {(currentRole === 'emploi' || currentRole === 'reconversion' || currentRole === 'rechercher emploi') && (
            <div>
              {/* 4.1 VUE ACCUEIL & PROJET PROFESSIONNEL */}
              {view === 'reco_home' && (
                <div className="reconversion-profile-container">
                  <div
                    className="role-welcome-banner reconversion"
                    style={{
                      marginBottom: '1.25rem',
                      background: 'linear-gradient(135deg, #f0fdfa 0%, #f8fafc 100%)',
                      border: '1px solid #ccfbf1',
                      borderLeft: '5px solid #0d9488',
                    }}
                  >
                    <div>
                      <h1 className="banner-title" style={{ color: '#0f766e', marginBottom: '0.35rem' }}>
                        Bonjour, {getUserPrenom(currentUser)} !
                      </h1>
                      <p className="banner-subtitle" style={{ color: '#334155', margin: 0 }}>
                        Bienvenue dans votre espace d'accès à l'emploi et d'orientation professionnelle <span className="text-ehari">e-hari</span>. Découvrez le travail qui correspond à vos talents et construisez votre plan d'accès à l'emploi.
                      </p>
                    </div>
                  </div>

                  {/* En-tête d'accueil chaleureux du profil candidat / recherche d'emploi */}
                  <div className="card" style={{ marginBottom: '1.25rem' }}>
                    <div className="profile-header-bar">
                      <div className="profile-identity-summary">
                        <div
                          className="profile-avatar-wrapper"
                          ref={avatarMenuRef}
                          style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}
                        >
                          <div
                            className="profile-avatar-initials"
                            onClick={handleCameraClick}
                            title={getUserAvatar(currentUser) ? "Modifier ou retirer la photo" : "Importer une photo"}
                            style={{
                              width: '64px',
                              height: '64px',
                              borderRadius: '50%',
                              color: '#ffffff',
                              fontSize: '1.5rem',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              overflow: 'hidden',
                              boxShadow: '0 4px 14px rgba(82, 87, 50, 0.25)',
                              border: '2px solid #ffffff',
                            }}
                          >
                            {getUserAvatar(currentUser) ? (
                              <img
                                src={getUserAvatar(currentUser)}
                                alt="Avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              `${(getUserNom(currentUser) || '').charAt(0)}${(getUserPrenom(currentUser) || '').charAt(0)}`
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={handleCameraClick}
                            title="Modifier la photo"
                            style={{
                              position: 'absolute',
                              bottom: '-2px',
                              right: '-2px',
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              background: '#ffffff',
                              color: '#1e293b',
                              border: '1.5px solid #cbd5e1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                              padding: 0,
                              lineHeight: 1,
                              zIndex: 2,
                            }}
                          >
                            <CameraIcon size={14} />
                          </button>

                          <input
                            type="file"
                            ref={avatarInputRef}
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              setShowAvatarMenu(false);
                              handleAvatarChange(e);
                            }}
                          />

                          {/* Mini-menu d'actions contenu dans la petite caméra */}
                          {showAvatarMenu && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 6px)',
                                left: '0',
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)',
                                zIndex: 100,
                                minWidth: '160px',
                                overflow: 'hidden',
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAvatarMenu(false);
                                  avatarInputRef.current && avatarInputRef.current.click();
                                }}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  padding: '0.6rem 0.85rem',
                                  border: 'none',
                                  background: 'transparent',
                                  color: '#1e293b',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                              >
                                <CameraIcon size={14} />
                                <span>Changer la photo</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAvatarMenu(false);
                                  handleRemoveAvatar();
                                }}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  padding: '0.6rem 0.85rem',
                                  border: 'none',
                                  borderTop: '1px solid #f1f5f9',
                                  background: 'transparent',
                                  color: '#dc2626',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                              >
                                <TrashIcon size={14} />
                                <span>Retirer la photo</span>
                              </button>
                            </div>
                          )}
                        </div>

                        <div>
                          <h2 className="card-title" style={{ marginBottom: '0.25rem' }}>
                            {getUserNom(currentUser)} {getUserPrenom(currentUser)}
                          </h2>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span className="status-badge actif">Compte Actif</span>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                              {getRecoSituation(currentUser) ? `${getRecoSituation(currentUser)} • ` : ''}
                              {getRecoMetierActuel(currentUser) ? `${getRecoMetierActuel(currentUser)} • ` : ''}
                              {getUserDatCre(currentUser) ? `Inscrit(e) le ${formatDateFr(getUserDatCre(currentUser))}` : 'Candidat e-hari'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="action-icon-btn action-edit"
                        onClick={startEditRecoProfile}
                        title="Modifier mes informations"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Fiche d'informations professionnelles et coordonnées */}
                  <div className="card" style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.1rem', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ClipboardIcon size={18} />
                        <span>Mes informations professionnelles & coordonnées</span>
                      </h3>
                      <button
                        type="button"
                        className="action-icon-btn action-edit"
                        onClick={startEditRecoProfile}
                        title="Modifier mes informations"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                    </div>
                    <p className="card-desc" style={{ marginBottom: '1rem' }}>
                      Vos informations pour identifier le travail qui correspond à vos compétences et talents :
                    </p>

                    <div className="form-grid profile-details-grid">
                      <div className="profile-field-item">
                        <span className="field-label">Nom et Prénom(s)</span>
                        <span className="field-value font-bold">{getUserNom(currentUser)} {getUserPrenom(currentUser)}</span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Adresse email</span>
                        <span className="field-value">{getUserEmail(currentUser)}</span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Téléphone</span>
                        <span className="field-value">{getUserTel(currentUser) || <em className="text-muted">Non renseigné</em>}</span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Situation actuelle</span>
                        <span className="field-value font-bold" style={{ color: '#0d9488' }}>
                          {getRecoSituation(currentUser) || 'En recherche d\'opportunité'}
                        </span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Métier ou domaine d'activité</span>
                        <span className="field-value font-bold" style={{ color: '#1e3a8a' }}>
                          {getRecoMetierActuel(currentUser) || 'Profil Polyvalent'}
                        </span>
                      </div>
                      <div className="profile-field-item">
                        <span className="field-label">Localisation</span>
                        <span className="field-value">{getUserAdresse(currentUser) || 'Madagascar'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stepper d'accès pas à pas à l'emploi */}
                  <div className="card" style={{ marginBottom: '1.25rem' }}>
                    {(() => {
                      const etape = getRecoEtape(currentUser);
                      const isComplete = etape >= 3 || (Boolean(getRecoOriPro1(currentUser)) && Boolean(getRecoOriPro2(currentUser)));
                      const isNiv2 = etape === 2 || (Boolean(getRecoOriPro1(currentUser)) && !Boolean(getRecoOriPro2(currentUser)));
                      const pct = isComplete ? 100 : isNiv2 ? 65 : 30;

                      return (
                        <>
                          <div className="profile-evolution-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <SparklesIcon size={20} />
                                <span>Votre parcours pour trouver le travail fait pour vous</span>
                              </h2>
                              <p className="card-desc" style={{ margin: 0 }}>
                                {isComplete
                                  ? 'Félicitations ! Vos aspirations et vos compétences sont validées. Votre plan d\'accès à l\'emploi est prêt.'
                                  : isNiv2
                                  ? 'Vos aspirations professionnelles sont identifiées ! Évaluez maintenant vos compétences pour déterminer votre pôle d\'emploi cible.'
                                  : 'Votre inscription est validée. Complétez les 2 tests e-HARI pour révéler le travail qui correspond à votre profil.'}
                              </p>
                            </div>
                            <div className="profile-level-badge">
                              <span className="level-tag" style={{ background: isComplete ? '#dcfce7' : isNiv2 ? '#fef3c7' : '#f1f5f9', color: isComplete ? '#166534' : isNiv2 ? '#92400e' : '#475569', padding: '0.3rem 0.85rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem' }}>
                                {isComplete ? 'Étape 4 sur 4 • Bilan Débloqué' : isNiv2 ? 'Étape 2 sur 4 franchie' : 'Étape 1 sur 4'}
                              </span>
                            </div>
                          </div>

                          <div className="profile-progress-container" style={{ margin: '1rem 0 1.5rem 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                              <span>Progression du parcours : {pct}%</span>
                              <span style={{ color: isComplete ? '#15803d' : '#d97706' }}>
                                {isComplete ? '4 étapes complétées' : isNiv2 ? '2 étapes validées' : '1ère étape validée'}
                              </span>
                            </div>
                            <div className="progress-track" style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${pct}%`,
                                  height: '100%',
                                  background: 'linear-gradient(90deg, #d97706 0%, #16a34a 100%)',
                                  borderRadius: '4px',
                                  transition: 'width 0.4s ease',
                                }}
                              />
                            </div>
                          </div>
                        </>
                      );
                    })()}

                    <div className="tasks-evolution-list">
                      {/* Étape 1 : Inscription & Profil Actuel */}
                      <div className="task-evolution-item completed">
                        <div className="task-step-icon"><CheckIcon size={18} /></div>
                        <div className="task-step-content">
                          <div className="task-step-title">1. Diagnostic initial & profil actuel</div>
                          <div className="task-step-desc">
                            Compte activé • Situation : {getRecoSituation(currentUser) || 'En recherche d\'opportunité'} • Domaine : {getRecoMetierActuel(currentUser) || 'Polyvalent'}.
                          </div>
                          <span className="task-badge-done">Complété</span>
                        </div>
                      </div>

                      {/* Étape 2 : Test 1 Aspirations & Métier Idéal */}
                      <div className={`task-evolution-item ${Boolean(getRecoOriPro1(currentUser)) ? 'completed' : 'pending active-task'}`}>
                        <div className="task-step-icon">{Boolean(getRecoOriPro1(currentUser)) ? <CheckIcon size={18} /> : <PassionsIcon size={18} />}</div>
                        <div className="task-step-content">
                          <div className="task-step-title">
                            2. Test Aspirations & Métier Idéal
                          </div>
                          <div className="task-step-desc">
                            {Boolean(getRecoOriPro1(currentUser)) ? (
                              <span>
                                Profil dominant : <strong>{getRecoOriPro1(currentUser)}</strong>
                              </span>
                            ) : (
                              '7 situations concrètes pour clarifier vos motivations profondes et le travail adapté à votre personnalité.'
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                            <span className={Boolean(getRecoOriPro1(currentUser)) ? 'task-badge-done' : 'task-badge-pending'}>
                              {Boolean(getRecoOriPro1(currentUser)) ? 'Aspirations Identifiées' : 'À réaliser'}
                            </span>
                            {Boolean(getRecoOriPro1(currentUser)) ? (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  onClick={() => {
                                    setIsEditingRecoTest1(false);
                                    setView('reco_test1');
                                  }}
                                  style={{ fontSize: '0.8rem', padding: '0.2rem 0.65rem' }}
                                >
                                  Consulter mon profil
                                </button>
                                <button
                                  type="button"
                                  className="action-icon-btn action-edit"
                                  onClick={() => {
                                    startEditRecoTest1();
                                    setView('reco_test1');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  title="Modifier mes réponses"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                  </svg>
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={startRecoTest1}
                                style={{ fontSize: '0.82rem', padding: '0.3rem 0.85rem', background: '#d97706', borderColor: '#d97706' }}
                              >
                                Démarrer le Test 1 →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Étape 3 : Test 2 Compétences & Pôle Cible */}
                      <div className={`task-evolution-item ${Boolean(getRecoOriPro2(currentUser)) ? 'completed' : 'pending active-task'}`}>
                        <div className="task-step-icon">{Boolean(getRecoOriPro2(currentUser)) ? <CheckIcon size={18} /> : <DashboardIcon size={18} />}</div>
                        <div className="task-step-content">
                          <div className="task-step-title">
                            3. Compétences Clés & Pôle d'Emploi Cible
                          </div>
                          <div className="task-step-desc">
                            {Boolean(getRecoOriPro2(currentUser)) ? (
                              <span>
                                Pôle cible : <strong>{getRecoOriPro2(currentUser)}</strong>
                              </span>
                            ) : (
                              'Sélectionnez vos domaines de compétences et auto-évaluez vos 6 aptitudes professionnelles.'
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                            <span className={Boolean(getRecoOriPro2(currentUser)) ? 'task-badge-done' : 'task-badge-pending'}>
                              {Boolean(getRecoOriPro2(currentUser)) ? 'Pôle Cible Validé' : 'À réaliser'}
                            </span>
                            {Boolean(getRecoOriPro2(currentUser)) ? (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  onClick={() => {
                                    setIsEditingRecoTest2(false);
                                    setView('reco_test2');
                                  }}
                                  style={{ fontSize: '0.8rem', padding: '0.2rem 0.65rem' }}
                                >
                                  Consulter mes compétences
                                </button>
                                <button
                                  type="button"
                                  className="action-icon-btn action-edit"
                                  onClick={() => {
                                    startEditRecoTest2();
                                    setView('reco_test2');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  title="Modifier mes choix"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                  </svg>
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={startRecoTest2}
                                style={{ fontSize: '0.82rem', padding: '0.3rem 0.85rem', background: '#16a34a', borderColor: '#16a34a' }}
                              >
                                Démarrer le Test 2 →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Étape 4 : Bilan & Plan d'Accès Emploi */}
                      <div className={`task-evolution-item ${Boolean(getRecoOriPro1(currentUser)) && Boolean(getRecoOriPro2(currentUser)) ? 'completed' : 'pending'}`}>
                        <div className="task-step-icon">{Boolean(getRecoOriPro1(currentUser)) && Boolean(getRecoOriPro2(currentUser)) ? <CheckIcon size={18} /> : <GuideIcon size={18} />}</div>
                        <div className="task-step-content">
                          <div className="task-step-title">
                            4. Bilan Stratégique & Plan d'Accès à l'Emploi
                          </div>
                          <div className="task-step-desc">
                            Synthèse complète e-HARI : métiers qui recrutent, formations valorisantes et plan d'action d'insertion en 4 étapes.
                          </div>
                          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => setView('reco_briefing')}
                              style={{
                                fontSize: '0.82rem',
                                padding: '0.35rem 0.95rem',
                                background: Boolean(getRecoOriPro1(currentUser)) && Boolean(getRecoOriPro2(currentUser)) ? '#0d9488' : '#64748b',
                                borderColor: Boolean(getRecoOriPro1(currentUser)) && Boolean(getRecoOriPro2(currentUser)) ? '#0d9488' : '#64748b',
                              }}
                            >
                              Accéder au Bilan d'Emploi →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Accès rapide aux modules */}
                  <div className="about-grid">
                    <div className="about-card" style={{ cursor: 'pointer' }} onClick={startRecoTest1}>
                      <div className="about-icon orange"><PassionsIcon size={24} /></div>
                      <h3>1. Aspirations & Métier Idéal</h3>
                      <p>
                        Découvrez votre profil professionnel dominant et clarifiez le travail qui correspond le mieux à votre tempérament.
                      </p>
                    </div>

                    <div className="about-card" style={{ cursor: 'pointer' }} onClick={startRecoTest2}>
                      <div className="about-icon green"><DashboardIcon size={24} /></div>
                      <h3>2. Compétences & Pôle d'Emploi Cible</h3>
                      <p>
                        Identifiez vos compétences clés et découvrez les secteurs qui recrutent les plus adaptés à votre profil.
                      </p>
                    </div>

                    <div className="about-card" style={{ cursor: 'pointer' }} onClick={() => setView('reco_briefing')}>
                      <div className="about-icon teal"><GuideIcon size={24} /></div>
                      <h3>Bilan & Plan d'Accès à l'Emploi</h3>
                      <p>
                        Consultez votre diagnostic complet, les métiers recommandés et votre plan d'action personnalisé d'insertion.
                      </p>
                    </div>

                    <div className="about-card" style={{ cursor: 'pointer' }} onClick={() => setView('reco_secteurs')}>
                      <div className="about-icon blue"><SecteursIcon size={24} /></div>
                      <h3>Secteurs qui Recrutent à Madagascar</h3>
                      <p>
                        Explorez les opportunités concrètes dans le numérique, le commerce, l'agro-business, les services et la logistique.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 4.2 VUE DU TEST 1 : ASPIRATIONS & MÉTIER IDÉAL */}
              {view === 'reco_test1' && (
                <div className="eleve-test-container">
                  <div
                    className="role-welcome-banner reconversion"
                    style={{
                      marginBottom: '1.25rem',
                      background: 'linear-gradient(135deg, #fefce8 0%, #fffbeb 100%)',
                      border: '1px solid #fef08a',
                      borderLeft: '5px solid #d97706',
                    }}
                  >
                    <div>
                      <h1 className="banner-title" style={{ color: '#78350f', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <PassionsIcon size={22} />
                        <span>Test 1 : Aspirations & Métier Idéal</span>
                      </h1>
                      <p className="banner-subtitle" style={{ color: '#451a03', margin: 0 }}>
                        7 situations concrètes pour identifier le type de travail et l'environnement professionnel qui correspondent le mieux à votre profil.
                      </p>
                    </div>
                  </div>

                  {Boolean(getRecoOriPro1(currentUser)) && !isEditingRecoTest1 ? (
                    <div className="card test-card-box" style={{ borderLeft: '5px solid #d97706' }}>
                      <div className="test-nav-header" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span className="test-badge-step" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '0.3rem 0.85rem', borderRadius: '14px', fontSize: '0.82rem', fontWeight: 700 }}>
                            Résultat validé de vos aspirations professionnelles
                          </span>
                          <button
                            type="button"
                            className="action-icon-btn action-edit"
                            onClick={startEditRecoTest1}
                            title="Modifier mes réponses"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {(() => {
                        const savedDet = getRecoDetMot(currentUser);
                        const domKey = savedDet?.dominantKey;
                        const catInfo = (domKey && TEST_RECONVERSION_INTERETS_CATEGORIES[domKey]) || null;
                        const title = catInfo?.label || getRecoOriPro1(currentUser);
                        const desc = catInfo?.description || 'Profil orienté vers une nouvelle dynamique professionnelle à forte valeur ajoutée.';
                        const forces = catInfo?.forces || ['Capacité d\'adaptation', 'Volonté d\'évolution'];
                        const debouches = catInfo?.debouches || [];

                        return (
                          <>
                            <div style={{ textAlign: 'center', padding: '1rem 0 1.5rem 0' }}>
                              <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                                {catInfo?.icon || '💡'}
                              </div>
                              <div style={{ display: 'inline-block', background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '0.25rem 0.85rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                {catInfo?.badge || 'Profil Validé'}
                              </div>
                              <h2 style={{ fontSize: '1.5rem', color: '#78350f', marginBottom: '0.5rem', fontWeight: 800 }}>
                                {title}
                              </h2>
                              <p style={{ maxWidth: '680px', margin: '0 auto 1.25rem auto', color: '#475569', fontSize: '0.98rem', lineHeight: 1.6 }}>
                                {desc}
                              </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                                <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '0.95rem', color: '#1e293b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <SparklesIcon size={16} />
                                  <span>Vos 4 atouts majeurs pour ce métier :</span>
                                </h4>
                                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#334155', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                  {forces.map((f, idx) => (
                                    <li key={idx}><strong>{f}</strong></li>
                                  ))}
                                </ul>
                              </div>

                              {debouches.length > 0 && (
                                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '1.25rem' }}>
                                  <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '0.95rem', color: '#92400e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <GuideIcon size={16} />
                                    <span>Métiers & activités cibles :</span>
                                  </h4>
                                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#78350f', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                    {debouches.map((d, idx) => (
                                      <li key={idx}>{d}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={startRecoTest2}
                                style={{ background: '#16a34a', borderColor: '#16a34a', fontWeight: 700, padding: '0.65rem 1.4rem' }}
                              >
                                Passer au Test 2 : Compétences & Pôle Cible →
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => setView('reco_briefing')}
                                style={{ fontWeight: 600, padding: '0.65rem 1.4rem' }}
                              >
                                Consulter mon Bilan d'Emploi
                              </button>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    /* FORMULAIRE DES 7 SITUATIONS PROFESSIONNELLES */
                    <div className="card test-card-box">
                      <div className="test-nav-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span className="test-badge-step" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '0.3rem 0.85rem', borderRadius: '14px', fontSize: '0.82rem', fontWeight: 700 }}>
                          {isEditingRecoTest1 ? "Modification du Test 1 • Aspirations & Métier Idéal" : "Étape 2 sur 4 • Aspirations & Métier Idéal"}
                        </span>
                        {isEditingRecoTest1 && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => setIsEditingRecoTest1(false)}
                            style={{ fontSize: '0.82rem', padding: '0.25rem 0.75rem' }}
                          >
                            Annuler la modification
                          </button>
                        )}
                      </div>

                      <div className="test-header-titles" style={{ marginBottom: '1.5rem' }}>
                        <h2 className="test-main-title" style={{ fontSize: '1.45rem', color: '#78350f', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <PassionsIcon size={22} />
                          <span>Clarifiez vos motivations profondes & le travail qui vous correspond</span>
                        </h2>
                        <p className="card-desc">
                          Prenez un instant pour répondre en toute sincérité à ces 7 situations selon vos préférences. Cela permettra d'identifier le travail adapté à votre profil.
                        </p>
                      </div>

                      {recoTest1Alert && (
                        <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <AlertCircleIcon size={16} />
                          <span>{recoTest1Alert}</span>
                        </div>
                      )}

                      <div className="qcm-step-indicator" style={{ marginBottom: '1.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                          <span>Situation {recoQcmStep + 1} sur {TEST_RECONVERSION_INTERETS_QUESTIONS.length}</span>
                          <span style={{ color: '#d97706' }}>
                            {Math.round(((recoQcmStep + 1) / TEST_RECONVERSION_INTERETS_QUESTIONS.length) * 100)}% complété
                          </span>
                        </div>
                        <div className="progress-track" style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                          <div
                            className="progress-fill"
                            style={{
                              width: `${((recoQcmStep + 1) / TEST_RECONVERSION_INTERETS_QUESTIONS.length) * 100}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #d97706, #16a34a)',
                              borderRadius: '4px',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>

                        {/* Raccourcis pour naviguer directement entre les 7 situations */}
                        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', marginRight: '0.3rem' }}>Situations :</span>
                          {TEST_RECONVERSION_INTERETS_QUESTIONS.map((_, idx) => {
                            const isAnswered = Boolean(recoQcmAnswers[idx]);
                            const isCurrent = recoQcmStep === idx;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setRecoTest1Alert('');
                                  setRecoQcmStep(idx);
                                }}
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '50%',
                                  border: isCurrent ? '2px solid #d97706' : isAnswered ? '1px solid #fcd34d' : '1px solid #cbd5e1',
                                  background: isCurrent ? '#d97706' : isAnswered ? '#fef3c7' : '#f8fafc',
                                  color: isCurrent ? '#ffffff' : isAnswered ? '#92400e' : '#64748b',
                                  fontSize: '0.82rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  padding: 0,
                                  transition: 'all 0.2s ease',
                                }}
                                title={`Situation ${idx + 1}${isAnswered ? ' (Réponse enregistrée)' : ''}`}
                              >
                                {idx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {(() => {
                        const currentQ = TEST_RECONVERSION_INTERETS_QUESTIONS[recoQcmStep];
                        const selectedOptId = recoQcmAnswers[recoQcmStep];

                        return (
                          <div className="qcm-question-body" key={currentQ.id}>
                            <h3 className="qcm-question-title" style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.35rem' }}>
                              {currentQ.question}
                            </h3>
                            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.25rem' }}>
                              Choisissez l'option qui correspond le mieux à votre état d'esprit actuel :
                            </p>

                            <div className="qcm-options-grid">
                              {currentQ.options.map((opt) => {
                                const isSelected = selectedOptId === opt.id;

                                return (
                                  <div
                                    key={opt.id}
                                    className={`qcm-option-card ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleSelectRecoTest1Option(recoQcmStep, opt.id)}
                                  >
                                    <div className="qcm-opt-radio">
                                      <span className={`radio-dot ${isSelected ? 'checked' : ''}`} />
                                    </div>
                                    <div className="qcm-opt-icon">
                                      <ModernTestIcon icon={opt.icon} id={opt.id} size={21} />
                                    </div>
                                    <div className="qcm-opt-text">
                                      <div className="qcm-opt-title">{opt.title}</div>
                                      {opt.desc && <div className="qcm-opt-desc">{opt.desc}</div>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="qcm-nav-buttons" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                              <button
                                type="button"
                                className="btn btn-outline"
                                disabled={recoQcmStep === 0}
                                onClick={() => {
                                  setRecoTest1Alert('');
                                  setRecoQcmStep((s) => Math.max(0, s - 1));
                                }}
                                title="Situation précédente"
                                style={{ fontSize: '1.2rem', padding: '0.45rem 1.1rem' }}
                              >
                                ←
                              </button>

                              {recoQcmStep < TEST_RECONVERSION_INTERETS_QUESTIONS.length - 1 ? (
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => {
                                    if (!selectedOptId) {
                                      setRecoTest1Alert('Veuillez sélectionner une option pour cette situation avant de continuer.');
                                      return;
                                    }
                                    setRecoTest1Alert('');
                                    setRecoQcmStep((s) => s + 1);
                                  }}
                                  style={{ background: '#d97706', borderColor: '#d97706' }}
                                >
                                  Suivante →
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-primary font-bold"
                                  disabled={submittingRecoTest}
                                  onClick={handleSubmitRecoTest1}
                                  style={{ background: '#16a34a', borderColor: '#16a34a', padding: '0.65rem 1.4rem' }}
                                >
                                  {submittingRecoTest
                                    ? 'Enregistrement en cours...'
                                    : isEditingRecoTest1
                                    ? 'Mettre à jour mes aspirations professionnelles'
                                    : 'Découvrir le travail qui me correspond'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* 4.3 VUE DU TEST 2 : COMPÉTENCES & PÔLE D'EMPLOI CIBLE */}
              {view === 'reco_test2' && (
                <div className="eleve-test-container">
                  <div
                    className="role-welcome-banner reconversion"
                    style={{
                      marginBottom: '1.25rem',
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                      border: '1px solid #bbf7d0',
                      borderLeft: '5px solid #16a34a',
                    }}
                  >
                    <div>
                      <h1 className="banner-title" style={{ color: '#14532d', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <DashboardIcon size={22} />
                        <span>Test 2 : Compétences & Pôle d'Emploi Cible</span>
                      </h1>
                      <p className="banner-subtitle" style={{ color: '#334155', margin: 0 }}>
                        Auto-évaluez vos compétences clés et aptitudes professionnelles pour déterminer les métiers qui recrutent faits pour vous.
                      </p>
                    </div>
                  </div>

                  {Boolean(getRecoOriPro2(currentUser)) && !isEditingRecoTest2 ? (
                    <div className="card test-card-box" style={{ borderLeft: '5px solid #16a34a' }}>
                      <div className="test-nav-header" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span className="test-badge-step" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.3rem 0.85rem', borderRadius: '14px', fontSize: '0.82rem', fontWeight: 700 }}>
                            Résultat de votre pôle d'emploi cible
                          </span>
                          <button
                            type="button"
                            className="action-icon-btn action-edit"
                            onClick={startEditRecoTest2}
                            title="Modifier mes choix"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {(() => {
                        const savedDet = getRecoDetTra(currentUser);
                        const domPoleKey = savedDet?.dominantPoleKey;
                        const poleInfo = (domPoleKey && TEST_RECONVERSION_POLES_INSERTION[domPoleKey]) || savedDet?.dominantPole || null;
                        const title = poleInfo?.oriPro || getRecoOriPro2(currentUser);
                        const desc = poleInfo?.description || 'Pôle d\'activité recommandé selon vos compétences transférables.';
                        const debouches = poleInfo?.metiersCibles || [];

                        return (
                          <>
                            <div style={{ textAlign: 'center', padding: '1rem 0 1.5rem 0' }}>
                              <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                                {poleInfo?.icon || '📊'}
                              </div>
                              <h2 style={{ fontSize: '1.5rem', color: '#14532d', marginBottom: '0.5rem', fontWeight: 800 }}>
                                {title}
                              </h2>
                              <p style={{ maxWidth: '680px', margin: '0 auto 1.25rem auto', color: '#475569', fontSize: '0.98rem', lineHeight: 1.6 }}>
                                {desc}
                              </p>
                            </div>

                            {/* Domaines choisis */}
                            {savedDet?.selectedDomaines && savedDet.selectedDomaines.length > 0 && (
                              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                                <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '0.95rem', color: '#1e293b', fontWeight: 700 }}>
                                  Vos compétences clés sélectionnées :
                                </h4>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                  {savedDet.selectedDomaines.map((domId) => {
                                    const dom = LISTE_DOMAINES_COMPETENCES_RECONVERSION.find((d) => d.id === domId);
                                    if (!dom) return null;
                                    return (
                                      <span key={domId} style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <span>{dom.icon}</span>
                                        <span>{dom.label}</span>
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {debouches.length > 0 && (
                              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                                  Métiers qui recrutent dans ce pôle à Madagascar
                                </div>
                                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                                  {debouches.map((m, idx) => (
                                    <span key={idx} style={{ background: '#ffffff', color: '#047857', border: '1px solid #a7f3d0', padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                                      • {m}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setView('reco_briefing')}
                                style={{ background: '#0d9488', borderColor: '#0d9488', fontWeight: 700, padding: '0.65rem 1.4rem' }}
                              >
                                Accéder à mon Bilan & Plan d'Accès à l'Emploi →
                              </button>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    /* FORMULAIRE D'AUTO-ÉVALUATION DES COMPÉTENCES */
                    <div className="card test-card-box">
                      <div className="test-nav-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span className="test-badge-step" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.3rem 0.85rem', borderRadius: '14px', fontSize: '0.82rem', fontWeight: 700 }}>
                          {isEditingRecoTest2 ? "Modification du Test 2 • Compétences & Pôle Cible" : "Étape 3 sur 4 • Compétences & Pôle d'Emploi Cible"}
                        </span>
                        {isEditingRecoTest2 && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => setIsEditingRecoTest2(false)}
                            style={{ fontSize: '0.82rem', padding: '0.25rem 0.75rem' }}
                          >
                            Annuler la modification
                          </button>
                        )}
                      </div>

                      <div className="test-header-titles" style={{ marginBottom: '1.5rem' }}>
                        <h2 className="test-main-title" style={{ fontSize: '1.45rem', color: '#14532d', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <DashboardIcon size={22} />
                          <span>Identifiez vos compétences et évaluez vos aptitudes professionnelles</span>
                        </h2>
                        <p className="card-desc">
                          Sélectionnez ci-dessous les domaines où vous vous sentez le plus à l'aise, puis auto-évaluez vos 6 aptitudes professionnelles pour déterminer les métiers faits pour vous.
                        </p>
                      </div>

                      {recoTest2Alert && (
                        <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <AlertCircleIcon size={16} />
                          <span>{recoTest2Alert}</span>
                        </div>
                      )}

                      {/* SECTION 1 : DOMAINES DE COMPÉTENCES TRANSFÉRABLES */}
                      <div className="matieres-section-block">
                        <div className="section-title-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>1. Vos Domaines de Compétences Clés</h3>
                          <span className="selection-count-badge" style={{ background: recoSelectedDomaines.length >= 1 ? '#dcfce7' : '#fee2e2', color: recoSelectedDomaines.length >= 1 ? '#166534' : '#991b1b', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
                            {recoSelectedDomaines.length} sélectionné(s) (1 à 4 recommandés)
                          </span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1rem' }}>
                          Sélectionnez les compétences ou domaines d'intérêt dans lesquels vous vous sentez le plus à l'aise :
                        </p>

                        <div className="matieres-pills-grid">
                          {LISTE_DOMAINES_COMPETENCES_RECONVERSION.map((dom) => {
                            const isSelected = recoSelectedDomaines.includes(dom.id);
                            return (
                              <div
                                key={dom.id}
                                className={`matiere-pill-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleToggleRecoDomaine(dom.id)}
                              >
                                <span className="matiere-icon">{dom.icon}</span>
                                <span className="matiere-label">{dom.label}</span>
                                <span className="matiere-check">{isSelected ? <CheckIcon size={12} /> : '+'}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* SECTION 2 : AUTO-ÉVALUATION DES 6 APTITUDES PROFESSIONNELLES */}
                      <div className="matieres-section-block" style={{ marginTop: '2rem' }}>
                        <div className="section-title-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>2. Auto-évaluation de vos Aptitudes Professionnelles</h3>
                          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                            Niveau de maîtrise de 1 à 3
                          </span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.25rem' }}>
                          Estimez honnêtement votre niveau d'aisance actuel sur chacune de ces aptitudes clés :
                        </p>

                        <div className="aptitudes-list">
                          {LISTE_APTITUDES_RECONVERSION.map((apt) => {
                            const currentRating = recoAptitudes[apt.id] || 2;
                            const ratingLabels = ['1. À développer', '2. Opérationnel', '3. Force majeure'];

                            return (
                              <div key={apt.id} className="aptitude-row-item">
                                <div className="aptitude-info">
                                  <div className="aptitude-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span>{apt.icon}</span>
                                    <span>{apt.label}</span>
                                  </div>
                                  <div className="aptitude-desc">{apt.desc}</div>
                                </div>
                                <div className="aptitude-rating-buttons">
                                  {[1, 2, 3].map((rating) => (
                                    <button
                                      key={rating}
                                      type="button"
                                      className={`rating-btn ${currentRating === rating ? 'active' : ''}`}
                                      onClick={() => handleSetRecoAptitudeRating(apt.id, rating)}
                                    >
                                      <span className="rating-num">{rating}</span>
                                      <span className="rating-text">{ratingLabels[rating - 1].split('. ')[1]}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-primary font-bold"
                          disabled={submittingRecoTest}
                          onClick={handleSubmitRecoTest2}
                          style={{ background: '#15803d', borderColor: '#15803d', padding: '0.75rem 1.75rem' }}
                        >
                          {submittingRecoTest
                            ? 'Enregistrement en cours...'
                            : isEditingRecoTest2
                            ? 'Mettre à jour mes compétences & pôle cible'
                            : 'Déterminer mon pôle d\'emploi cible'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4.4 VUE DU BILAN & PLAN D'ACCÈS À L'EMPLOI */}
              {view === 'reco_briefing' && (
                <div className="reconversion-briefing-page-container">
                  <div
                    className="role-welcome-banner reconversion"
                    style={{
                      marginBottom: '1.25rem',
                      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                      border: '1px solid #99f6e4',
                      borderLeft: '5px solid #0d9488',
                    }}
                  >
                    <div>
                      <h1 className="banner-title" style={{ color: '#134e4a', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <GuideIcon size={22} />
                        <span>Bilan & Plan d'Accès à l'Emploi</span>
                      </h1>
                      <p className="banner-subtitle" style={{ color: '#334155', margin: 0 }}>
                        Diagnostic croisé de vos aspirations et compétences, métiers qui recrutent à Madagascar et feuille de route d'insertion.
                      </p>
                    </div>
                  </div>

                  <ReconversionCareerBriefingView
                    currentUser={currentUser}
                    onStartTest1={startRecoTest1}
                    onStartTest2={startRecoTest2}
                    getRecoOriPro1={getRecoOriPro1}
                    getRecoOriPro2={getRecoOriPro2}
                    getRecoSituation={getRecoSituation}
                    getRecoMetierActuel={getRecoMetierActuel}
                    onViewSecteurs={() => setView('reco_secteurs')}
                  />
                </div>
              )}

              {/* 4.5 VUE SECTEURS QUI RECRUTENT À MADAGASCAR */}
              {view === 'reco_secteurs' && (
                <SecteursRecrutementMadaView
                  currentUser={currentUser}
                  getRecoOriPro1={getRecoOriPro1}
                  getRecoOriPro2={getRecoOriPro2}
                  getRecoDetMot={getRecoDetMot}
                  getRecoDetTra={getRecoDetTra}
                  onStartTest1={startRecoTest1}
                  onStartTest2={startRecoTest2}
                  onGoToBriefing={() => setView('reco_briefing')}
                />
              )}

              {/* 4.6 VUE ATELIER CV & LETTRE (À LA RECHERCHE D'UN EMPLOI) */}
              {view === 'reco_cv' && (
                <div className="reco-cv-page-container">
                  <div
                    className="role-welcome-banner emploi no-print"
                    style={{
                      marginBottom: '1.25rem',
                      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                      border: '1px solid #99f6e4',
                      borderLeft: '5px solid #0d9488',
                    }}
                  >
                    <div>
                      <h1 className="banner-title" style={{ color: '#0f766e', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <CvBuilderIcon size={24} />
                        <span>Atelier : CV & Lettre de Motivation</span>
                      </h1>
                      <p className="banner-subtitle" style={{ color: '#334155', margin: 0 }}>
                        Concevez votre CV et votre lettre d'intérêt sur-mesure grâce à notre atelier interactif. Personnalisez les modèles, modifiez en direct et téléchargez au format PDF A4.
                      </p>
                    </div>
                  </div>

                  <CvLetterBuilderView currentUser={currentUser} currentRole="emploi" />
                </div>
              )}

              {/* MODAL RÉSULTAT DU TEST 1 RECONVERSION */}
              {recoTest1Modal && (
                <div className="auth-modal-backdrop" onClick={() => setRecoTest1Modal(null)}>
                  <div className="auth-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
                    <div className="auth-card modal-inner-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                      <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                        {recoTest1Modal.dominantCat?.icon || '💡'}
                      </div>
                      <h2 className="modal-title" style={{ color: '#78350f', marginBottom: '0.35rem', fontSize: '1.35rem' }}>
                        Vos aspirations professionnelles sont clarifiées !
                      </h2>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                        Voici le profil professionnel qui correspond le mieux à votre tempérament et à vos motivations.
                      </p>

                      <div style={{ background: '#fffbeb', border: '2px solid #fde68a', borderRadius: '14px', padding: '1.25rem', marginBottom: '1rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                          Profil Professionnel Dominant
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#78350f', fontSize: '1.2rem', fontWeight: 800 }}>
                          {recoTest1Modal.dominantCat?.label || recoTest1Modal.oriPro}
                        </h3>
                        <p style={{ fontSize: '0.92rem', color: '#451a03', lineHeight: 1.6, margin: '0 0 0.85rem 0' }}>
                          {recoTest1Modal.dominantCat?.description}
                        </p>

                        {recoTest1Modal.dominantCat?.forces && recoTest1Modal.dominantCat.forces.length > 0 && (
                          <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid #fde68a' }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#78350f', marginBottom: '0.45rem' }}>
                              Vos atouts majeurs pour réussir :
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                              {recoTest1Modal.dominantCat.forces.map((f, idx) => (
                                <span key={idx} style={{ background: '#fef3c7', color: '#92400e', padding: '0.3rem 0.65rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <CheckIcon size={12} />
                                  <span>{f}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            setRecoTest1Modal(null);
                            startRecoTest2();
                          }}
                          style={{ background: '#16a34a', borderColor: '#16a34a', fontWeight: 700 }}
                        >
                          Passer au Test 2 (Compétences & Pôle Cible) →
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => setRecoTest1Modal(null)}
                        >
                          Fermer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL RÉSULTAT DU TEST 2 */}
              {recoTest2Modal && (
                <div className="auth-modal-backdrop" onClick={() => setRecoTest2Modal(null)}>
                  <div className="auth-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
                    <div className="auth-card modal-inner-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                      <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                        {recoTest2Modal.dominantPole?.icon || '📊'}
                      </div>
                      <h2 className="modal-title" style={{ color: '#14532d', marginBottom: '0.25rem', fontSize: '1.35rem' }}>
                        Votre pôle d'emploi cible est déterminé !
                      </h2>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                        Calculé selon vos compétences clés et vos aptitudes professionnelles.
                      </p>

                      <div style={{ background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          Pôle d'Emploi & Métiers Cibles
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#14532d', fontSize: '1.25rem', fontWeight: 800 }}>
                          {recoTest2Modal.oriPro}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                          {recoTest2Modal.dominantPole?.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            setRecoTest2Modal(null);
                            setView('reco_briefing');
                          }}
                          style={{ background: '#0d9488', borderColor: '#0d9488', fontWeight: 700 }}
                        >
                          Consulter mon Bilan & Plan d'Accès à l'Emploi →
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => setRecoTest2Modal(null)}
                        >
                          Fermer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MESSAGERIE MP EMPLOI / INSERTION AVEC L'ADMIN */}
              {view === 'reco_messages' && (
                <MessengerChatView
                  currentUser={currentUser}
                  onUnreadCountChange={fetchUnreadCount}
                />
              )}
            </div>
          )}

          {/* ========================================================
              VUE COMMUNE : MON COMPTE / PROFIL
              ======================================================== */}
          {view === 'mon_profil' && (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div
                  ref={accountAvatarMenuRef}
                  style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}
                >
                  <div
                    onClick={handleAccountCameraClick}
                    title={getUserAvatar(currentUser) ? "Modifier ou retirer la photo" : "Importer une photo"}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #15803d 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      overflow: 'hidden',
                      border: '3px solid #ffffff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                    }}
                  >
                    {getUserAvatar(currentUser) ? (
                      <img
                        src={getUserAvatar(currentUser)}
                        alt={getUserPrenom(currentUser)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      (getUserNom(currentUser)[0] || 'U') + (getUserPrenom(currentUser)[0] || '')
                    )}
                  </div>

                  {/* Petit badge caméra sur la pdp */}
                  <button
                    type="button"
                    onClick={handleAccountCameraClick}
                    title={getUserAvatar(currentUser) ? "Modifier ou retirer la photo" : "Importer une photo"}
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      color: '#1e293b',
                      border: '1.5px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                      padding: 0,
                      lineHeight: 1,
                      zIndex: 2,
                    }}
                  >
                    <CameraIcon size={14} />
                  </button>

                  <input
                    type="file"
                    ref={accountAvatarInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      setShowAccountAvatarMenu(false);
                      handleAvatarChange(e);
                    }}
                  />

                  {/* Mini-menu d'actions contenu dans la petite caméra */}
                  {showAccountAvatarMenu && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: '0',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)',
                        zIndex: 100,
                        minWidth: '160px',
                        overflow: 'hidden',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountAvatarMenu(false);
                          accountAvatarInputRef.current && accountAvatarInputRef.current.click();
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.6rem 0.85rem',
                          border: 'none',
                          background: 'transparent',
                          color: '#1e293b',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <CameraIcon size={14} />
                        <span>Changer la photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountAvatarMenu(false);
                          handleRemoveAvatar();
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.6rem 0.85rem',
                          border: 'none',
                          borderTop: '1px solid #f1f5f9',
                          background: 'transparent',
                          color: '#dc2626',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <TrashIcon size={14} />
                        <span>Retirer la photo</span>
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h2 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="account-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><SettingsIcon size={20} /></span>
                      <span>Mon Compte ({getRoleLabel(currentRole)})</span>
                    </h2>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                      Gestion de vos coordonnées personnelles et identifiants sécurisés.
                    </p>
                  </div>

                  {currentRole === 'admin' ? (
                    <button
                      type="button"
                      className="action-icon-btn action-edit"
                      onClick={startEditAdminProfile}
                      title="Modifier mon profil"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  ) : currentRole === 'eleve' ? (
                    <button
                      type="button"
                      className="action-icon-btn action-edit"
                      onClick={startEditEleveProfile}
                      title="Modifier mes informations"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  ) : currentRole === 'etudiant' ? (
                    <button
                      type="button"
                      className="action-icon-btn action-edit"
                      onClick={startEditStudentProfile}
                      title="Modifier mes informations"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="action-icon-btn action-edit"
                      onClick={startEditRecoProfile}
                      title="Modifier mes informations"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
                <div><strong>Nom :</strong> {getUserNom(currentUser)}</div>
                <div><strong>Prénom :</strong> {getUserPrenom(currentUser)}</div>
                <div><strong>Email :</strong> {getUserEmail(currentUser)}</div>
                <div><strong>Téléphone :</strong> {getUserTel(currentUser) || 'Non renseigné'}</div>
                <div><strong>Adresse :</strong> {getUserAdresse(currentUser) || 'Non renseignée'}</div>
                <div><strong>Statut :</strong> <span className={`status-badge ${getUserStatut(currentUser)}`}>{getUserStatut(currentUser)}</span></div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {currentRole === 'admin' ? (
                  <button
                    type="button"
                    className="action-icon-btn action-edit"
                    onClick={startEditAdminProfile}
                    title="Modifier mon profil"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                ) : currentRole === 'eleve' ? (
                  <button
                    type="button"
                    className="action-icon-btn action-edit"
                    onClick={startEditEleveProfile}
                    title="Modifier mes informations"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                ) : currentRole === 'etudiant' ? (
                  <button
                    type="button"
                    className="action-icon-btn action-edit"
                    onClick={startEditStudentProfile}
                    title="Modifier mes informations"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="action-icon-btn action-edit"
                    onClick={startEditRecoProfile}
                    title="Modifier mes informations"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                )}

                <button
                  type="button"
                  className="action-icon-btn action-delete"
                  onClick={handleDeactivateAccount}
                  title="Désactiver mon compte"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Modal de modification du profil Administrateur */}
          {editingAdminProfile && (
            <div className="auth-modal-backdrop" onClick={() => setEditingAdminProfile(false)}>
              <div className="auth-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setEditingAdminProfile(false)}
                  title="Fermer"
                >
                  <CloseIcon size={16} />
                </button>
                <div className="auth-card modal-inner-card">
                  <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>Modifier le profil Administrateur</span>
                  </h2>
                  <p className="modal-subtitle">
                    Mettez à jour vos informations personnelles et identifiants de connexion :
                  </p>

                  <form onSubmit={handleSaveAdminProfile}>
                    <div className="auth-form-grid">
                      <div className="form-group">
                        <label>Nom de famille : *</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={adminProfileForm.uti_nom}
                          onChange={(e) => setAdminProfileForm({ ...adminProfileForm, uti_nom: e.target.value.toUpperCase() })}
                          placeholder="ex: RAVELO"
                        />
                      </div>
                      <div className="form-group">
                        <label>Prénom(s) (facultatif) :</label>
                        <input
                          type="text"
                          className="form-control"
                          value={adminProfileForm.uti_pre}
                          onChange={(e) => setAdminProfileForm({ ...adminProfileForm, uti_pre: formatPrenom(e.target.value) })}
                          placeholder="ex: Hary (facultatif)"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Adresse email officielle : *</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        value={adminProfileForm.uti_ema}
                        onChange={(e) => setAdminProfileForm({ ...adminProfileForm, uti_ema: e.target.value })}
                        placeholder="admin@hari.mg"
                      />
                      <small style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                        Utilisée pour vous connecter à la plateforme e-HARI.
                      </small>
                    </div>

                    <div className="auth-form-grid">
                      <div className="form-group">
                        <label>Téléphone :</label>
                        <input
                          type="text"
                          className="form-control"
                          value={adminProfileForm.uti_tel}
                          onChange={(e) => setAdminProfileForm({ ...adminProfileForm, uti_tel: e.target.value })}
                          placeholder="034 XX XXX XX"
                        />
                      </div>
                      <div className="form-group">
                        <label>Adresse / Bureau :</label>
                        <input
                          type="text"
                          className="form-control"
                          value={adminProfileForm.uti_adr}
                          onChange={(e) => setAdminProfileForm({ ...adminProfileForm, uti_adr: e.target.value })}
                          placeholder="Antananarivo, Madagascar"
                        />
                      </div>
                    </div>

                    {/* Section optionnelle de mise à jour du mot de passe */}
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span className="account-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><LockIcon size={16} /></span> Modifier le mot de passe <span style={{ fontWeight: 400, color: '#64748b', fontSize: '0.8rem' }}>(optionnel)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowAdminPassword(!showAdminPassword)}
                          style={{ background: 'none', border: 'none', color: '#1d4ed8', fontSize: '0.8rem', cursor: 'pointer', padding: 0, fontWeight: 600 }}
                        >
                          {showAdminPassword ? 'Masquer' : 'Afficher'}
                        </button>
                      </div>
                      <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: '#64748b' }}>
                        Laissez ces deux champs vides si vous souhaitez conserver votre mot de passe actuel.
                      </p>
                      <div className="auth-form-grid">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: '0.82rem' }}>Nouveau mot de passe :</label>
                          <input
                            type={showAdminPassword ? "text" : "password"}
                            className="form-control"
                            value={adminProfileForm.uti_pas}
                            onChange={(e) => setAdminProfileForm({ ...adminProfileForm, uti_pas: e.target.value })}
                            placeholder="Minimum 6 caractères"
                            autoComplete="new-password"
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: '0.82rem' }}>Confirmer le mot de passe :</label>
                          <input
                            type={showAdminPassword ? "text" : "password"}
                            className="form-control"
                            value={adminProfileForm.confirm_pas}
                            onChange={(e) => setAdminProfileForm({ ...adminProfileForm, confirm_pas: e.target.value })}
                            placeholder="Répétez le mot de passe"
                            autoComplete="new-password"
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setEditingAdminProfile(false)}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Modal de modification du profil Emploi & Insertion */}
          {editingRecoProfile && (
            <div className="auth-modal-backdrop" onClick={() => setEditingRecoProfile(false)}>
              <div className="auth-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setEditingRecoProfile(false)}
                  title="Fermer"
                >
                  <CloseIcon size={16} />
                </button>
                <div className="auth-card modal-inner-card">
                  <h2 className="modal-title">
                    <span>Modifier mon profil - À la recherche d'un emploi</span>
                  </h2>
                  <p className="modal-subtitle">
                    Mettez à jour vos coordonnées et votre situation professionnelle actuelle :
                  </p>

                  <form onSubmit={handleSaveRecoProfile}>
                    <div className="auth-form-grid">
                      <div className="form-group">
                        <label>Nom de famille : *</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={recoProfileForm.uti_nom}
                          onChange={(e) => setRecoProfileForm({ ...recoProfileForm, uti_nom: e.target.value.toUpperCase() })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Prénom(s) (facultatif) :</label>
                        <input
                          type="text"
                          className="form-control"
                          value={recoProfileForm.uti_pre}
                          onChange={(e) => setRecoProfileForm({ ...recoProfileForm, uti_pre: formatPrenom(e.target.value) })}
                          placeholder="facultatif"
                        />
                      </div>
                    </div>

                    <div className="auth-form-grid">
                      <div className="form-group">
                        <label>Téléphone :</label>
                        <input
                          type="text"
                          className="form-control"
                          value={recoProfileForm.uti_tel}
                          onChange={(e) => setRecoProfileForm({ ...recoProfileForm, uti_tel: e.target.value })}
                          placeholder="034 XX XXX XX"
                        />
                      </div>
                      <div className="form-group">
                        <label>Adresse / Localisation :</label>
                        <input
                          type="text"
                          className="form-control"
                          value={recoProfileForm.uti_adr}
                          onChange={(e) => setRecoProfileForm({ ...recoProfileForm, uti_adr: e.target.value })}
                          placeholder="Ville / Région"
                        />
                      </div>
                    </div>

                    <div className="auth-form-grid">
                      <div className="form-group">
                        <label>Situation actuelle :</label>
                        <select
                          className="form-control"
                          value={recoProfileForm.emp_sit_act}
                          onChange={(e) => setRecoProfileForm({ ...recoProfileForm, emp_sit_act: e.target.value })}
                        >
                          <option value="">-- Choisir la situation --</option>
                          <option value="En insertion professionnelle">En insertion professionnelle</option>
                          <option value="Jeune diplômé(e)">Jeune diplômé(e)</option>
                          <option value="En reconversion professionnelle">En reconversion professionnelle</option>
                          {recoProfileForm.emp_sit_act && !['En insertion professionnelle', 'Insertion professionnelle', 'Jeune diplômé(e)', 'En reconversion professionnelle'].includes(recoProfileForm.emp_sit_act) && (
                            <option value={recoProfileForm.emp_sit_act}>{recoProfileForm.emp_sit_act}</option>
                          )}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>
                          {recoProfileForm.emp_sit_act?.toLowerCase().includes('dipl')
                            ? "Domaine d'étude :"
                            : recoProfileForm.emp_sit_act?.toLowerCase().includes('reconversion')
                            ? "Métier actuel :"
                            : "Métier actuel ou domaine d'origine :"}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={recoProfileForm.emp_met_act}
                          onChange={(e) => setRecoProfileForm({ ...recoProfileForm, emp_met_act: e.target.value })}
                          placeholder={
                            recoProfileForm.emp_sit_act?.toLowerCase().includes('dipl')
                              ? "ex: Informatique, Gestion, Électronique, Droit..."
                              : "ex: Enseignant, Vendeur, Comptable..."
                          }
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setEditingRecoProfile(false)}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="minimal-footer">
          © 2016 – 2026 <strong>ONG HARI Madagascar</strong> • Application <strong className="text-ehari">e-hari</strong> (<span className="acronym-letter">H</span>abiletés, <span className="acronym-letter">A</span>ccompagnement, <span className="acronym-letter">R</span>éussite, <span className="acronym-letter">I</span>nsertion)
        </footer>
      </div>
    </div>
  );
}

export default App;
