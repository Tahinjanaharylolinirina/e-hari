import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../services/api';

/**
 * Composant de Messagerie style Facebook Messenger
 * Permet l'échange en direct entre les utilisateurs (Élève, Étudiant, Emploi) et l'Admin,
 * ainsi que la diffusion groupée d'offres (stage, emploi, forum des métiers...) par type et mot-clé.
 */
export default function MessengerChatView({
  currentUser,
  initialTargetUserId = null,
  onUnreadCountChange = null,
  allUsers = [],
}) {
  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null); // { name, type, size, url }
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // 'all', 'eleve', 'etudiant', 'emploi'
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState('');
  const [previewImageModal, setPreviewImageModal] = useState(null); // url for modal zoom

  // États pour le clic droit et gestion des messages (Modifier / Supprimer)
  const [contextMenu, setContextMenu] = useState(null); // { x, y, message }
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingMessage, setDeletingMessage] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);
  const [actionSuccessToast, setActionSuccessToast] = useState('');

  // États pour la diffusion groupée d'annonces / offres (Admin)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastRole, setBroadcastRole] = useState('etudiant'); // 'all', 'eleve', 'etudiant', 'emploi'
  const [broadcastKeyword, setBroadcastKeyword] = useState(''); // ex: 'informatique'
  const [broadcastMessageText, setBroadcastMessageText] = useState('');
  const [broadcastAttachedFile, setBroadcastAttachedFile] = useState(null);
  const [selectedRecipientIds, setSelectedRecipientIds] = useState([]);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastSuccessMsg, setBroadcastSuccessMsg] = useState('');

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const chatInputRef = useRef(null);

  const broadcastFileInputRef = useRef(null);
  const broadcastImageInputRef = useRef(null);

  const isAdmin = currentUser?.uti_rol === 'admin';
  const currentUserId = currentUser?.uti_id || currentUser?.id;

  // Helper pour obtenir le nom complet
  const getFullName = (u) => {
    if (!u) return 'Utilisateur e-HARI';
    const nom = u.uti_nom || u.nom || '';
    const pre = u.uti_pre || u.prenom || '';
    return `${nom} ${pre}`.trim() || u.uti_ema || 'Utilisateur';
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'eleve':
        return 'Élève';
      case 'etudiant':
        return 'Étudiant';
      case 'rechercher emploi':
      case 'emploi':
      case 'reconversion':
        return "À la recherche d'un emploi";
      default:
        return 'Membre';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'role-chip admin';
      case 'eleve':
        return 'role-chip eleve';
      case 'etudiant':
        return 'role-chip etudiant';
      case 'rechercher emploi':
      case 'emploi':
      case 'reconversion':
        return 'role-chip emploi';
      default:
        return 'role-chip';
    }
  };

  // Helper d'analyse du caractère / profil d'orientation de l'utilisateur
  const getUserCharacterDetails = (user) => {
    if (!user) return { label: '', keywords: '' };
    const prof = user.profil || {};
    const role = (user.uti_rol || user.role || '').toLowerCase();

    if (role === 'eleve') {
      const ser = (user.ele_ser || prof.ele_ser || prof.elev_seri || '').toUpperCase();
      const cla = user.ele_cla || prof.ele_cla || prof.elev_clas || '';
      if (ser.includes('A') || ser.includes('L')) {
        return {
          label: 'Profil Littéraire (Série A)',
          keywords: 'littéraire litteraire lettres langues philosophie sciences humaines série a serie a',
        };
      }
      if (ser.includes('C') || ser.includes('D') || ser.includes('S')) {
        return {
          label: 'Profil Scientifique (Série S / C / D)',
          keywords: 'scientifique sciences mathématiques maths physique chimie série s série c série d',
        };
      }
      if (ser.includes('OSE')) {
        return {
          label: 'Profil Économique & Social (Série OSE)',
          keywords: 'économique economique social société gestion ose',
        };
      }
      if (ser.includes('TECH') || ser.includes('GÉNIE') || ser.includes('GENIE')) {
        return {
          label: 'Profil Technologique & Ingénierie',
          keywords: 'technique technologique ingénierie génie civil mécanique électronique',
        };
      }
      return {
        label: cla ? `Élève ${cla}` : 'Élève Secondaire',
        keywords: 'élève eleve secondaire orientation',
      };
    }

    if (role === 'etudiant') {
      const fil = (user.etu_fil || prof.etu_fil || prof.etud_fili || '').toLowerCase();
      const niv = user.etu_niv_etu || prof.etu_niv_etu || prof.etud_nive_etud || '';
      if (fil.includes('info') || fil.includes('code') || fil.includes('tech') || fil.includes('web') || fil.includes('numér') || fil.includes('numer')) {
        return {
          label: 'Profil Informatique & Tech',
          keywords: 'informatique tech développeur code web numérique logiciel ingénieur technologie système réseau',
        };
      }
      if (fil.includes('gest') || fil.includes('commer') || fil.includes('manag') || fil.includes('finan') || fil.includes('compta')) {
        return {
          label: 'Profil Gestion & Affaires',
          keywords: 'gestion gestionnaire commerce affaires finance comptabilité management audit',
        };
      }
      if (fil.includes('droit') || fil.includes('jurid')) {
        return {
          label: 'Profil Juridique & Sciences Politiques',
          keywords: 'juridique droit avocat juriste sciences politiques littéraire',
        };
      }
      if (fil.includes('lettr') || fil.includes('lang') || fil.includes('comm')) {
        return {
          label: 'Profil Littéraire & Communication',
          keywords: 'littéraire litteraire lettres langues communication médias journalisme',
        };
      }
      if (fil.includes('sant') || fil.includes('med') || fil.includes('bio') || fil.includes('agron')) {
        return {
          label: 'Profil Sciences & Santé',
          keywords: 'scientifique santé médecine biologie agronomie vivant docteur infirmier',
        };
      }
      return {
        label: niv ? `${niv} • ${user.etu_fil || prof.etu_fil || 'Étudiant'}` : 'Étudiant Supérieur',
        keywords: 'étudiant etudiant université supérieur',
      };
    }

    if (role === 'emploi' || role === 'reconversion') {
      const met = user.emp_met_act || prof.emp_met_act || prof.rec_met_act || '';
      return {
        label: met ? `Candidat : ${met}` : 'Insertion & Emploi',
        keywords: 'emploi insertion reconversion métier travail professionnel candidat',
      };
    }

    return { label: '', keywords: '' };
  };

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '';
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const formatDateHeader = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      const today = new Date();
      if (d.toDateString() === today.toDateString()) return "Aujourd'hui";
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      if (d.toDateString() === yesterday.toDateString()) return "Hier";
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const renderFileIcon = (fileType, fileName = '') => {
    const ext = fileName.split('.').pop().toLowerCase();
    const type = (fileType || '').toLowerCase();
    let color = '#2563eb';
    let label = 'DOC';
    if (type.includes('pdf') || ext === 'pdf') { color = '#dc2626'; label = 'PDF'; }
    else if (type.includes('word') || ['doc', 'docx'].includes(ext)) { color = '#2563eb'; label = 'DOC'; }
    else if (type.includes('excel') || type.includes('spreadsheet') || ['xls', 'xlsx', 'csv'].includes(ext)) { color = '#16a34a'; label = 'XLS'; }
    else if (type.includes('presentation') || ['ppt', 'pptx'].includes(ext)) { color = '#ea580c'; label = 'PPT'; }
    else if (type.includes('zip') || type.includes('rar') || ['zip', 'rar', '7z'].includes(ext)) { color = '#7c3aed'; label = 'ZIP'; }

    return (
      <div style={{ width: '32px', height: '36px', borderRadius: '5px', background: `${color}15`, border: `1.5px solid ${color}40`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span style={{ fontSize: '0.52rem', fontWeight: 800, color: color, marginTop: '1px' }}>{label}</span>
      </div>
    );
  };

  // Défilement automatique vers le dernier message
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  };

  // Chargement des conversations pour l'Admin
  const fetchAdminConversations = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await api.getAdminConversations();
      const list = res?.conversations || res?.data || [];
      setConversations(list);
    } catch (err) {
      console.error('Erreur chargement conversations admin:', err);
    }
  }, [isAdmin]);

  // Chargement d'une conversation active
  const fetchActiveThread = useCallback(async (targetId = null, isInitial = false) => {
    const idToFetch = targetId || (activePartner ? activePartner.uti_id : null);
    if (!isAdmin && !idToFetch) {
      // Pour les élèves/étudiants/emploi, targetId peut être null (l'API sélectionne automatiquement l'admin)
    } else if (isAdmin && !idToFetch) {
      return;
    }

    if (isInitial) setLoadingThread(true);
    try {
      const res = await api.getConversation(idToFetch);
      const msgList = res?.messages || res?.data || [];
      setMessages(msgList);
      if (res?.partner && (!activePartner || activePartner.uti_id !== res.partner.uti_id)) {
        setActivePartner(res.partner);
      }

      // Marquer comme lu si nous avons un interlocuteur
      if (idToFetch) {
        api.markConversationAsRead(idToFetch).then(() => {
          if (onUnreadCountChange) onUnreadCountChange();
        }).catch(() => {});
      } else if (res?.partner?.uti_id) {
        api.markConversationAsRead(res.partner.uti_id).then(() => {
          if (onUnreadCountChange) onUnreadCountChange();
        }).catch(() => {});
      }
    } catch (err) {
      console.error('Erreur chargement fil de discussion:', err);
    } finally {
      if (isInitial) setLoadingThread(false);
    }
  }, [isAdmin, activePartner, onUnreadCountChange]);

  // Initialisation au montage
  useEffect(() => {
    if (isAdmin) {
      fetchAdminConversations();
      if (initialTargetUserId) {
        fetchActiveThread(initialTargetUserId, true);
      }
    } else {
      fetchActiveThread(null, true);
    }
  }, [isAdmin, initialTargetUserId, fetchAdminConversations, fetchActiveThread]);

  // Si on est admin et qu'aucune conversation n'est active mais qu'on a des conversations dans la liste
  useEffect(() => {
    if (isAdmin && !activePartner && !initialTargetUserId && conversations.length > 0) {
      const firstPartner = {
        uti_id: conversations[0].uti_id,
        uti_nom: conversations[0].uti_nom,
        uti_pre: conversations[0].uti_pre,
        uti_ema: conversations[0].uti_ema,
        uti_rol: conversations[0].uti_rol,
        uti_ava: conversations[0].uti_ava,
      };
      setActivePartner(firstPartner);
      fetchActiveThread(firstPartner.uti_id, true);
    }
  }, [isAdmin, activePartner, initialTargetUserId, conversations, fetchActiveThread]);

  // Polling silencieux toutes les 3.5 secondes pour afficher les nouveaux messages en direct
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAdmin) {
        fetchAdminConversations();
      }
      if (activePartner?.uti_id || (!isAdmin && currentUser)) {
        fetchActiveThread(activePartner?.uti_id || null, false);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isAdmin, activePartner, currentUser, fetchAdminConversations, fetchActiveThread]);

  // Défiler en bas quand les messages changent
  useEffect(() => {
    scrollToBottom(false);
  }, [messages.length]);

  // Fermer le menu contextuel lors d'un clic extérieur, défilement ou touche Échap
  useEffect(() => {
    const handleCloseMenu = () => {
      if (contextMenu) setContextMenu(null);
    };
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        if (contextMenu) setContextMenu(null);
        if (editingMessageId) {
          setEditingMessageId(null);
          setEditingText('');
        }
        if (deletingMessage && !deletingLoading) {
          setDeletingMessage(null);
        }
      }
    };

    window.addEventListener('click', handleCloseMenu);
    window.addEventListener('scroll', handleCloseMenu, true);
    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('click', handleCloseMenu);
      window.removeEventListener('scroll', handleCloseMenu, true);
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [contextMenu, editingMessageId, deletingMessage, deletingLoading]);

  // Gestionnaire du clic droit sur un message (Context Menu)
  const handleContextMenu = (e, m) => {
    e.preventDefault();
    e.stopPropagation();

    const menuWidth = 190;
    const menuHeight = 150;
    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 12;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 12;
    }

    setContextMenu({
      x,
      y,
      message: m,
    });
  };

  // Démarrer la modification
  const handleStartEdit = (m) => {
    setContextMenu(null);
    setEditingMessageId(m.mes_id);
    const isAttachmentPlaceholder = m.mes_con === `[Pièce jointe : ${m.mes_fic_nom}]`;
    setEditingText(isAttachmentPlaceholder ? '' : (m.mes_con || ''));
  };

  // Enregistrer la modification
  const handleSaveEdit = async (messageId) => {
    if (savingEdit) return;
    const cleanText = editingText.trim();
    if (!cleanText) {
      alert("Le message ne peut pas être vide.");
      return;
    }

    setSavingEdit(true);
    try {
      const res = await api.updateMessage(messageId, { mes_con: cleanText });
      const updated = res.data;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.mes_id === messageId
            ? {
                ...msg,
                mes_con: updated?.mes_con || cleanText,
                mes_modifie: true,
                mes_dat_mod: updated?.mes_dat_mod || new Date().toISOString(),
              }
            : msg
        )
      );
      setEditingMessageId(null);
      setEditingText('');
      setActionSuccessToast('Message modifié avec succès');
      setTimeout(() => setActionSuccessToast(''), 3000);
      if (isAdmin) fetchAdminConversations();
    } catch (err) {
      console.error("Erreur mise à jour message :", err);
      alert(err.message || "Erreur lors de la mise à jour du message");
    } finally {
      setSavingEdit(false);
    }
  };

  // Annuler la modification
  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText('');
  };

  // Démarrer la suppression
  const handleStartDelete = (m) => {
    setContextMenu(null);
    setDeletingMessage(m);
  };

  // Confirmer la suppression
  const handleConfirmDelete = async () => {
    if (!deletingMessage || deletingLoading) return;
    setDeletingLoading(true);
    try {
      await api.deleteMessage(deletingMessage.mes_id);
      setMessages((prev) => prev.filter((m) => m.mes_id !== deletingMessage.mes_id));
      setDeletingMessage(null);
      setActionSuccessToast('Message supprimé');
      setTimeout(() => setActionSuccessToast(''), 3000);
      if (isAdmin) fetchAdminConversations();
    } catch (err) {
      console.error("Erreur suppression message :", err);
      alert(err.message || "Erreur lors de la suppression du message");
    } finally {
      setDeletingLoading(false);
    }
  };

  // Copier le texte
  const handleCopyText = (m) => {
    setContextMenu(null);
    if (!m?.mes_con) return;
    navigator.clipboard.writeText(m.mes_con).then(() => {
      setActionSuccessToast('Texte copié dans le presse-papier');
      setTimeout(() => setActionSuccessToast(''), 3000);
    }).catch(() => {});
  };

  // Gestion de la sélection de fichier pour le chat normal
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert("Le fichier sélectionné est trop lourd. La limite maximale est de 20 Mo.");
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedFile({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        url: event.target.result,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
  };

  // Gestion de la sélection de fichier pour la diffusion groupée
  const handleBroadcastFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert("Le fichier sélectionné est trop lourd. La limite maximale est de 20 Mo.");
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setBroadcastAttachedFile({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        url: event.target.result,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Envoi de message individuel
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const cleanText = messageText.trim();
    if (!cleanText && !attachedFile) return;

    const targetId = activePartner?.uti_id || initialTargetUserId || null;
    if (isAdmin && !targetId) {
      alert("Veuillez sélectionner un destinataire dans la liste.");
      return;
    }

    setSending(true);
    try {
      const payload = {
        targetUserId: targetId,
        mes_con: cleanText || (attachedFile ? `[Pièce jointe : ${attachedFile.name}]` : ''),
        mes_fic_nom: attachedFile?.name || null,
        mes_fic_typ: attachedFile?.type || null,
        mes_fic_tai: attachedFile?.size || null,
        mes_fic_url: attachedFile?.url || null,
      };

      const res = await api.sendMessage(payload);
      if (res?.data) {
        setMessages((prev) => [...prev, res.data]);
        setMessageText('');
        setAttachedFile(null);
        setTimeout(() => scrollToBottom(true), 50);

        if (isAdmin) {
          fetchAdminConversations();
        }
        if (onUnreadCountChange) {
          onUnreadCountChange();
        }
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
      alert(err.message || "Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
      if (chatInputRef.current) {
        chatInputRef.current.focus();
      }
    }
  };

  // Gérer l'appui sur Entrée (sauf avec Maj)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Sélection d'un partenaire de conversation (Admin)
  const handleSelectPartner = (conv) => {
    const partner = {
      uti_id: conv.uti_id,
      uti_nom: conv.uti_nom,
      uti_pre: conv.uti_pre,
      uti_ema: conv.uti_ema,
      uti_rol: conv.uti_rol,
      uti_ava: conv.uti_ava,
    };
    setActivePartner(partner);
    fetchActiveThread(partner.uti_id, true);
  };

  // Démarrer une nouvelle discussion avec un utilisateur de la base
  const handleStartNewChatWithUser = (user) => {
    const partner = {
      uti_id: user.uti_id || user.id,
      uti_nom: user.uti_nom || user.nom,
      uti_pre: user.uti_pre || user.prenom,
      uti_ema: user.uti_ema || user.email,
      uti_rol: user.uti_rol || user.role,
      uti_ava: user.uti_ava || user.avatar,
    };
    setActivePartner(partner);
    setShowNewChatModal(false);
    fetchActiveThread(partner.uti_id, true);
  };

  // Calcul dynamique des destinataires correspondant au ciblage (type + mot-clé)
  const getBroadcastMatchingUsers = useCallback(() => {
    return allUsers
      .filter((u) => (u.uti_rol || u.role) !== 'admin')
      .filter((u) => {
        const uRole = (u.uti_rol || u.role || '').toLowerCase();
        // 1. Filtre catégorie / rôle
        if (broadcastRole !== 'all') {
          if (broadcastRole === 'emploi' || broadcastRole === 'rechercher emploi') {
            if (uRole !== 'emploi' && uRole !== 'reconversion' && uRole !== 'rechercher emploi') return false;
          } else if (uRole !== broadcastRole.toLowerCase()) {
            return false;
          }
        }

        // 2. Filtre mot-clé
        if (broadcastKeyword && broadcastKeyword.trim()) {
          const kw = broadcastKeyword.trim().toLowerCase();
          const charInfo = getUserCharacterDetails(u);
          const searchable = [
            getFullName(u),
            u.uti_ema || u.email,
            uRole,
            u.ele_cla || u.profil?.ele_cla || u.profil?.elev_clas,
            u.ele_ser || u.profil?.ele_ser || u.profil?.elev_seri,
            u.ele_eta || u.profil?.ele_eta || u.profil?.elev_etab,
            u.etu_fil || u.profil?.etu_fil || u.profil?.etud_fili,
            u.etu_niv_etu || u.profil?.etu_niv_etu || u.profil?.etud_nive_etud,
            u.etu_eta || u.profil?.etu_eta || u.profil?.etud_etab,
            u.emp_sit_act || u.profil?.emp_sit_act || u.profil?.rec_sit_act,
            u.emp_met_act || u.profil?.emp_met_act || u.profil?.rec_met_act,
            charInfo.keywords,
            charInfo.label,
          ].filter(Boolean).join(' ').toLowerCase();

          return searchable.includes(kw);
        }

        return true;
      });
  }, [allUsers, broadcastRole, broadcastKeyword]);

  // Synchroniser la sélection des destinataires quand le type ou le mot-clé change
  useEffect(() => {
    const matching = getBroadcastMatchingUsers();
    setSelectedRecipientIds(matching.map((u) => u.uti_id || u.id));
  }, [broadcastRole, broadcastKeyword, getBroadcastMatchingUsers]);

  // Basculer la sélection d'un destinataire individuel
  const toggleRecipient = (id) => {
    setSelectedRecipientIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Modèles d'annonces prédéfinis en 1 clic
  const applyTemplate = (templateType) => {
    switch (templateType) {
      case 'stage':
        setBroadcastRole('etudiant');
        if (!broadcastKeyword) setBroadcastKeyword('informatique');
        setBroadcastMessageText(
          "📢 OPPORTUNITÉ DE STAGE e-HARI\n\nBonjour,\nNous avons le plaisir de vous transmettre une opportunité de stage correspondant à votre parcours universitaire. Veuillez consulter la fiche descriptive ci-jointe pour postuler dès maintenant."
        );
        break;
      case 'emploi':
        setBroadcastRole('emploi');
        if (!broadcastKeyword) setBroadcastKeyword('comptabilité');
        setBroadcastMessageText(
          "📢 OFFRE D'EMPLOI & RECRUTEMENT\n\nBonjour,\nUne opportunité d'embauche correspondant à votre profil et compétences vient d'être publiée par l'un de nos partenaires. Retrouvez la fiche de poste ci-jointe pour candidater."
        );
        break;
      case 'forum':
        setBroadcastRole('all');
        setBroadcastKeyword('');
        setBroadcastMessageText(
          "📢 INVITATION : FORUM DES MÉTIERS ET FORMATIONS e-HARI\n\nChers membres,\nL'ONG HARI vous invite à la prochaine édition du Forum des Métiers et de l'Orientation. Des professionnels et recruteurs d'entreprises seront présents pour vous conseiller. Venez nombreux !"
        );
        break;
      case 'annonce':
        setBroadcastRole('eleve');
        if (!broadcastKeyword) setBroadcastKeyword('terminale');
        setBroadcastMessageText(
          "📢 ANNONCE SPÉCIALE : SESSIONS DE RÉVISION BAC 2026\n\nChers élèves,\nDes sessions intensives de révision et de méthodologie débutent cette semaine pour préparer sereinement les épreuves. Consultez le calendrier ci-joint."
        );
        break;
      default:
        break;
    }
  };

  // Envoi de la diffusion groupée
  const handleSendBroadcast = async (e) => {
    if (e) e.preventDefault();
    if (selectedRecipientIds.length === 0) {
      alert("Aucun destinataire sélectionné. Ajustez votre mot-clé ou catégorie.");
      return;
    }
    if (!broadcastMessageText.trim() && !broadcastAttachedFile) {
      alert("Veuillez saisir un message ou joindre un fichier (offre de stage, fiche de poste, document...).");
      return;
    }

    setBroadcasting(true);
    try {
      const payload = {
        targetRole: broadcastRole,
        keyword: broadcastKeyword.trim(),
        targetUserIds: selectedRecipientIds,
        mes_con: broadcastMessageText.trim(),
        mes_fic_nom: broadcastAttachedFile?.name || null,
        mes_fic_typ: broadcastAttachedFile?.type || null,
        mes_fic_tai: broadcastAttachedFile?.size || null,
        mes_fic_url: broadcastAttachedFile?.url || null,
      };

      const res = await api.broadcastMessage(payload);
      setBroadcastSuccessMsg(
        res.message || `Message envoyé avec succès à ${selectedRecipientIds.length} utilisateur(s) !`
      );

      fetchAdminConversations();
      if (onUnreadCountChange) onUnreadCountChange();

      setTimeout(() => {
        setShowBroadcastModal(false);
        setBroadcastSuccessMsg('');
        setBroadcastMessageText('');
        setBroadcastAttachedFile(null);
        setBroadcastKeyword('');
      }, 1500);
    } catch (err) {
      console.error("Erreur lors de la diffusion :", err);
      alert(err.message || "Erreur lors de la diffusion groupée");
    } finally {
      setBroadcasting(false);
    }
  };

  // Filtrage des conversations
  const filteredConversations = conversations.filter((c) => {
    const charInfo = getUserCharacterDetails(c);
    const searchLow = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm.trim() ||
      getFullName(c).toLowerCase().includes(searchLow) ||
      (c.uti_ema && c.uti_ema.toLowerCase().includes(searchLow)) ||
      (c.der_message && c.der_message.toLowerCase().includes(searchLow)) ||
      (charInfo.keywords && charInfo.keywords.toLowerCase().includes(searchLow));

    if (!matchesSearch) return false;
    if (filterRole === 'all') return true;
    if (filterRole === 'eleve') return c.uti_rol === 'eleve';
    if (filterRole === 'etudiant') return c.uti_rol === 'etudiant';
    if (filterRole === 'emploi' || filterRole === 'rechercher emploi') return c.uti_rol === 'rechercher emploi' || c.uti_rol === 'emploi' || c.uti_rol === 'reconversion';
    return true;
  });

  // Filtrage des utilisateurs pour le modal "Nouveau message direct"
  const filteredNewChatUsers = allUsers
    .filter((u) => (u.uti_rol || u.role) !== 'admin')
    .filter((u) => {
      if (!newChatSearch.trim()) return true;
      const searchLow = newChatSearch.toLowerCase();
      const charInfo = getUserCharacterDetails(u);
      return (
        getFullName(u).toLowerCase().includes(searchLow) ||
        (u.uti_ema && u.uti_ema.toLowerCase().includes(searchLow)) ||
        ((u.uti_rol || u.role) && (u.uti_rol || u.role).toLowerCase().includes(searchLow)) ||
        (charInfo.keywords && charInfo.keywords.toLowerCase().includes(searchLow)) ||
        (charInfo.label && charInfo.label.toLowerCase().includes(searchLow))
      );
    });

  const matchingBroadcastUsers = getBroadcastMatchingUsers();
  const partnerChar = getUserCharacterDetails(activePartner);

  return (
    <div className="messenger-root-container">
      {/* ========================================================
          PANEL GAUCHE : LISTE DES CONVERSATIONS (ADMIN SEULEMENT)
          ======================================================== */}
      {isAdmin && (
        <aside className="messenger-sidebar">
          {/* Entête de la liste */}
          <div className="messenger-sidebar-header">
            <div className="messenger-sidebar-title">
              <span className="messenger-icon" style={{ display: 'flex', alignItems: 'center', color: '#2563eb' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <h3>Messages</h3>
            </div>
            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
              <button
                type="button"
                className="action-icon-btn"
                onClick={() => setShowBroadcastModal(true)}
                title="Diffuser une offre de stage, emploi ou annonce par catégorie et mot-clé"
                style={{ color: '#0d9488' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              </button>
              <button
                type="button"
                className="action-icon-btn action-message"
                onClick={() => {
                  setNewChatSearch('');
                  setShowNewChatModal(true);
                }}
                title="Démarrer une nouvelle discussion directe"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <line x1="12" y1="8" x2="12" y2="14" />
                  <line x1="9" y1="11" x2="15" y2="11" />
                </svg>
              </button>
            </div>
          </div>

          {/* Barre de recherche multi-critères et caractère */}
          <div className="messenger-search-bar">
            <span className="messenger-search-icon" style={{ display: 'flex', alignItems: 'center', color: '#94a3b8' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Rechercher (nom, littéraire, scientifique...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="messenger-clear-search" onClick={() => setSearchTerm('')} title="Effacer la recherche">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Filtres par rôle */}
          <div className="messenger-role-pills">
            <button
              className={`pill-btn ${filterRole === 'all' ? 'active' : ''}`}
              onClick={() => setFilterRole('all')}
            >
              Tous
            </button>
            <button
              className={`pill-btn ${filterRole === 'eleve' ? 'active' : ''}`}
              onClick={() => setFilterRole('eleve')}
            >
              Élèves
            </button>
            <button
              className={`pill-btn ${filterRole === 'etudiant' ? 'active' : ''}`}
              onClick={() => setFilterRole('etudiant')}
            >
              Étudiants
            </button>
            <button
              className={`pill-btn ${filterRole === 'emploi' ? 'active' : ''}`}
              onClick={() => setFilterRole('emploi')}
            >
              Emploi
            </button>
          </div>

          {/* Liste des discussions */}
          <div className="messenger-conv-list">
            {filteredConversations.length === 0 ? (
              <div className="messenger-conv-empty">
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <p>Aucune conversation trouvée.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.65rem' }}>
                  <button
                    type="button"
                    className="action-icon-btn"
                    onClick={() => setShowBroadcastModal(true)}
                    title="Diffuser une offre de stage, emploi ou annonce"
                    style={{ color: '#0d9488' }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="action-icon-btn action-message"
                    onClick={() => setShowNewChatModal(true)}
                    title="Démarrer une discussion directe"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      <line x1="12" y1="8" x2="12" y2="14" />
                      <line x1="9" y1="11" x2="15" y2="11" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activePartner?.uti_id === conv.uti_id;
                const unreadCount = conv.non_lus ?? conv.unread_count ?? 0;
                const hasUnread = unreadCount > 0;
                const dateVal = conv.der_date || conv.last_message_date;
                const lastSnippet = (conv.der_fichier || conv.last_file_name) ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                    <span>{conv.der_fichier || conv.last_file_name}</span>
                  </span>
                ) : (conv.der_message || conv.last_message || 'Nouvelle conversation');
                const convChar = getUserCharacterDetails(conv);

                return (
                  <div
                    key={conv.uti_id}
                    className={`messenger-conv-item ${isSelected ? 'active' : ''} ${hasUnread ? 'has-unread' : ''}`}
                    onClick={() => handleSelectPartner(conv)}
                  >
                    <div className="conv-avatar-wrap">
                      {conv.uti_ava ? (
                        <img src={conv.uti_ava} alt={conv.uti_nom} className="conv-avatar" />
                      ) : (
                        <div className="conv-avatar-placeholder">
                          {(conv.uti_nom?.[0] || 'U') + (conv.uti_pre?.[0] || '')}
                        </div>
                      )}
                    </div>

                    <div className="conv-info">
                      <div className="conv-row-top">
                        <span className="conv-name">{getFullName(conv)}</span>
                        <span className="conv-date">{formatTime(dateVal)}</span>
                      </div>
                      <div className="conv-row-bottom">
                        <span className="conv-snippet">
                          {lastSnippet}
                        </span>
                        {hasUnread && <span className="conv-badge-unread">{unreadCount}</span>}
                      </div>
                      <div style={{ marginTop: '0.2rem', display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span
                          className={getRoleBadgeClass(conv.uti_rol)}
                          style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem', border: 'none', outline: 'none' }}
                        >
                          {getRoleLabel(conv.uti_rol)}
                        </span>
                        {convChar.label && (
                          <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                            {convChar.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      )}

      {/* ========================================================
          PANEL DROIT (OU PLEIN ÉCRAN POUR LES ÉLÈVES) : ZONE DE CHAT
          ======================================================== */}
      <section className="messenger-chat-area">
        {/* En-tête de la discussion active */}
        <header className="messenger-chat-header">
          <div className="chat-partner-profile">
            <div className="chat-partner-avatar-wrap">
              {activePartner?.uti_ava ? (
                <img src={activePartner.uti_ava} alt="Avatar" className="chat-partner-avatar" />
              ) : (
                <div className="chat-partner-avatar-placeholder">
                  {(activePartner?.uti_nom?.[0] || 'U') + (activePartner?.uti_pre?.[0] || '')}
                </div>
              )}
            </div>

            <div className="chat-partner-meta">
              <h4 className="chat-partner-name">
                {isAdmin
                  ? getFullName(activePartner)
                  : `${getFullName(activePartner)} (Administrateur)`}
              </h4>
              <div className="chat-partner-sub">
                <span
                  className={getRoleBadgeClass(activePartner?.uti_rol)}
                  style={{ border: 'none', outline: 'none' }}
                >
                  {getRoleLabel(activePartner?.uti_rol)}
                </span>
                {isAdmin && (
                  <>
                    <span className="chat-sub-email">{activePartner?.uti_ema}</span>
                    {partnerChar.label && (
                      <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>
                        • {partnerChar.label}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Corps des messages avec défilement */}
        <div className="messenger-messages-body">
          {/* Message de bienvenue personnalisé */}
          <div className="messenger-welcome-card">
            <div className="welcome-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--hari-blue, #2563eb)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h5>
              {isAdmin
                ? `Discussion avec ${getFullName(activePartner)}`
                : `Discussion avec ${getFullName(activePartner)}`}
            </h5>
            <p>
              {isAdmin
                ? "Vous pouvez échanger avec cet utilisateur, répondre à ses questions et lui envoyer des documents pédagogiques ou fiches d'orientation."
                : "Posez vos questions sur votre parcours, vos cours et vos choix de filières. Vous pouvez également joindre des documents (bulletins scolaires, CV, devoirs, etc.)."}
            </p>
          </div>

          {loadingThread ? (
            <div className="chat-loading-spinner">
              <div className="spinner-dot" />
              <span>Chargement des messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="chat-empty-thread">
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <line x1="8" y1="10" x2="16" y2="10" />
                  <line x1="8" y1="14" x2="12" y2="14" />
                </svg>
              </div>
              <p>Aucun message pour le moment.</p>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Envoyez un message ou joignez un document pour démarrer la discussion !
              </span>
            </div>
          ) : (
            messages.map((m, idx) => {
              const isMe = m.mes_exp_id === currentUserId;
              const prevMsg = idx > 0 ? messages[idx - 1] : null;
              const showDateHeader =
                !prevMsg ||
                new Date(m.mes_dat_cre).toDateString() !== new Date(prevMsg.mes_dat_cre).toDateString();

              const isImage = m.mes_fic_typ && m.mes_fic_typ.startsWith('image/');
              const isDocument = m.mes_fic_url && !isImage;

              return (
                <React.Fragment key={m.mes_id || idx}>
                  {showDateHeader && (
                    <div className="chat-date-separator">
                      <span>{formatDateHeader(m.mes_dat_cre)}</span>
                    </div>
                  )}

                  <div className={`chat-bubble-row ${isMe ? 'row-outgoing' : 'row-incoming'}`}>
                    {!isMe && (
                      <div className="bubble-partner-avatar">
                        {m.exp_ava ? (
                          <img src={m.exp_ava} alt="Exp" />
                        ) : (
                          <span>{(m.exp_nom?.[0] || 'U') + (m.exp_pre?.[0] || '')}</span>
                        )}
                      </div>
                    )}

                    <div className="bubble-content-wrap">
                      <div
                        className={`chat-bubble ${isMe ? 'bubble-me' : 'bubble-other'}`}
                        onContextMenu={(e) => handleContextMenu(e, m)}
                      >
                        {/* Bouton d'options au survol */}
                        {(isMe || isAdmin || m.mes_con) && (
                          <button
                            type="button"
                            className="bubble-action-trigger"
                            title="Options du message (clic droit ou cliquer)"
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              setContextMenu({
                                x: rect.left,
                                y: rect.bottom + 6,
                                message: m,
                              });
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="1.5" />
                              <circle cx="12" cy="5" r="1.5" />
                              <circle cx="12" cy="19" r="1.5" />
                            </svg>
                          </button>
                        )}

                        {/* Édition en ligne OU Affichage normal */}
                        {editingMessageId === m.mes_id ? (
                          <div className="inline-message-editor" onClick={(e) => e.stopPropagation()}>
                            <textarea
                              className="inline-edit-textarea"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSaveEdit(m.mes_id);
                                } else if (e.key === 'Escape') {
                                  handleCancelEdit();
                                }
                              }}
                              rows={Math.min(6, Math.max(2, editingText.split('\n').length))}
                              autoFocus
                            />
                            <div className="inline-edit-actions">
                              <span className="inline-edit-hint">Échap : annuler • Entrée : valider</span>
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <button
                                  type="button"
                                  className="inline-edit-btn cancel"
                                  onClick={handleCancelEdit}
                                  disabled={savingEdit}
                                >
                                  Annuler
                                </button>
                                <button
                                  type="button"
                                  className="inline-edit-btn save"
                                  onClick={() => handleSaveEdit(m.mes_id)}
                                  disabled={savingEdit || !editingText.trim()}
                                >
                                  {savingEdit ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Contenu textuel */}
                            {m.mes_con && m.mes_con !== `[Pièce jointe : ${m.mes_fic_nom}]` && (
                              <div className="bubble-text">{m.mes_con}</div>
                            )}

                            {/* Pièce jointe image */}
                            {isImage && m.mes_fic_url && (
                              <div
                                className="bubble-image-preview"
                                onClick={() => setPreviewImageModal(m.mes_fic_url)}
                                title="Cliquer pour agrandir l'image"
                              >
                                <img src={m.mes_fic_url} alt={m.mes_fic_nom || 'Image envoyée'} />
                                <div className="image-zoom-overlay" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    <line x1="11" y1="8" x2="11" y2="14" />
                                    <line x1="8" y1="11" x2="14" y2="11" />
                                  </svg>
                                  <span>Agrandir</span>
                                </div>
                              </div>
                            )}

                            {/* Pièce jointe document (PDF, Word, Excel, etc.) */}
                            {isDocument && (
                              <div className="bubble-document-card">
                                <span className="document-icon">
                                  {renderFileIcon(m.mes_fic_typ, m.mes_fic_nom)}
                                </span>
                                <div className="document-details">
                                  <span className="document-name" title={m.mes_fic_nom}>
                                    {m.mes_fic_nom || 'Document joint'}
                                  </span>
                                  <span className="document-size">
                                    {formatFileSize(m.mes_fic_tai)}
                                  </span>
                                </div>
                                <a
                                  href={m.mes_fic_url}
                                  download={m.mes_fic_nom || 'document'}
                                  className="action-icon-btn action-download"
                                  title={`Télécharger : ${m.mes_fic_nom || 'ce document'}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                  </svg>
                                </a>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Métadonnées en bas de la bulle avec coches modernes */}
                      <div className={`bubble-meta ${isMe ? 'meta-me' : 'meta-other'}`}>
                        <span>{formatTime(m.mes_dat_cre)}</span>
                        {(m.mes_modifie || m.mes_dat_mod) && (
                          <span className="bubble-edited-badge" title="Ce message a été modifié">
                            (modifié)
                          </span>
                        )}
                        {isMe && (
                          <span className="bubble-status" title={m.mes_lu ? 'Lu par le destinataire' : 'Envoyé'} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            {m.mes_lu ? (
                              <>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="18 6 9 17 4 12" />
                                  <polyline points="22 10 13 21 11 19" />
                                </svg>
                                <span style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 700 }}>Lu</span>
                              </>
                            ) : (
                              <>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>Envoyé</span>
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ========================================================
            BARRE D'ENVOI INDIVIDUELLE (INPUT & ATTACHMENTS)
            ======================================================== */}
        <footer className="messenger-input-bar">
          {/* Aperçu du fichier joint avant envoi */}
          {attachedFile && (
            <div className="messenger-attachment-chip">
              <div className="attachment-chip-preview">
                {attachedFile.type.startsWith('image/') ? (
                  <img src={attachedFile.url} alt="Aperçu" className="attachment-thumb" />
                ) : (
                  <span className="attachment-chip-icon">
                    {renderFileIcon(attachedFile.type, attachedFile.name)}
                  </span>
                )}
                <div className="attachment-chip-info">
                  <span className="attachment-chip-name">{attachedFile.name}</span>
                  <span className="attachment-chip-size">{formatFileSize(attachedFile.size)}</span>
                </div>
              </div>
              <button
                type="button"
                className="attachment-remove-btn"
                onClick={removeAttachedFile}
                title="Supprimer la pièce jointe"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          <form className="messenger-form" onSubmit={handleSendMessage}>
            {/* Input caché pour tous documents */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,image/*"
            />

            {/* Input caché pour images */}
            <input
              type="file"
              ref={imageInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept="image/*"
            />

            {/* Boutons d'actions fichiers : gris fade par défaut, foncé à l'appui ou actif */}
            <div className="messenger-quick-tools">
              <button
                type="button"
                className={`messenger-tool-btn ${attachedFile && !attachedFile.type.startsWith('image/') ? 'active' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                title="Joindre un fichier (PDF, Word, Excel, etc.)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <button
                type="button"
                className={`messenger-tool-btn ${attachedFile && attachedFile.type.startsWith('image/') ? 'active' : ''}`}
                onClick={() => imageInputRef.current?.click()}
                title="Envoyer une photo / capture d'écran"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
            </div>

            {/* Champ de saisie du message */}
            <textarea
              ref={chatInputRef}
              className="messenger-textarea"
              placeholder="Écrivez un message (Entrée pour envoyer, Maj+Entrée pour nouvelle ligne)..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />

            {/* Bouton d'envoi */}
            <button
              type="submit"
              className="messenger-send-btn"
              disabled={(!messageText.trim() && !attachedFile) || sending}
              title="Envoyer le message"
            >
              {sending ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" />
                </svg>
              )}
            </button>
          </form>
        </footer>
      </section>

      {/* ========================================================
          MODAL 1 : DIFFUSION GROUPÉE D'OFFRES & ANNONCES CIBLÉES
          ======================================================== */}
      {showBroadcastModal && (
        <div className="messenger-modal-backdrop" onClick={() => setShowBroadcastModal(false)}>
          <div className="messenger-modal messenger-modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="messenger-modal-header" style={{ background: '#0f172a', color: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.05rem' }}>
                    Diffuser une Offre ou Annonce Ciblée
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Envoi simultané dans la boîte privée des utilisateurs correspondants
                  </span>
                </div>
              </div>
              <button
                className="messenger-modal-close"
                onClick={() => setShowBroadcastModal(false)}
                style={{ color: '#cbd5e1' }}
                title="Fermer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="messenger-modal-body" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
              {broadcastSuccessMsg && (
                <div className="broadcast-success-banner" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>{broadcastSuccessMsg}</span>
                </div>
              )}

              {/* ÉTAPE 1 : CIBLAGE (CATÉGORIE & MOT-CLÉ) */}
              <div className="broadcast-step-card">
                <div className="broadcast-step-title">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                    <span>1. Public Cible & Spécialité</span>
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                    Filtrage automatique
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                      Type d'utilisateur :
                    </label>
                    <select
                      className="form-control"
                      value={broadcastRole}
                      onChange={(e) => setBroadcastRole(e.target.value)}
                      style={{ fontSize: '0.85rem' }}
                    >
                      <option value="etudiant">Étudiants (Supérieur)</option>
                      <option value="rechercher emploi">À la recherche d'un emploi</option>
                      <option value="eleve">Élèves (Secondaire)</option>
                      <option value="all">Tous les utilisateurs</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                      Mot-clé / Domaine / Filière :
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ex: informatique, stage, gestion..."
                      value={broadcastKeyword}
                      onChange={(e) => setBroadcastKeyword(e.target.value)}
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* Suggestions rapides de mots-clés cliquables */}
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.25rem' }}>
                  Suggestions rapides :
                </div>
                <div className="broadcast-quick-suggestions">
                  {['informatique', 'gestion', 'stage', 'droit', 'scientifique', 'littéraire', 'terminale s', 'comptabilité', 'santé'].map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      className={`suggestion-chip ${broadcastKeyword.toLowerCase() === kw ? 'active' : ''}`}
                      onClick={() => setBroadcastKeyword(kw)}
                    >
                      {kw}
                    </button>
                  ))}
                  {broadcastKeyword && (
                    <button
                      type="button"
                      className="suggestion-chip"
                      onClick={() => setBroadcastKeyword('')}
                      style={{ color: '#dc2626', borderColor: '#fca5a5', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      <span>Réinitialiser le mot-clé</span>
                    </button>
                  )}
                </div>

                {/* Aperçu dynamique des destinataires */}
                <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: selectedRecipientIds.length > 0 ? '#166534' : '#dc2626', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span>{selectedRecipientIds.length} destinataire(s) sélectionné(s) sur {matchingBroadcastUsers.length} correspondant(s)</span>
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => {
                        if (selectedRecipientIds.length === matchingBroadcastUsers.length) {
                          setSelectedRecipientIds([]);
                        } else {
                          setSelectedRecipientIds(matchingBroadcastUsers.map((u) => u.uti_id || u.id));
                        }
                      }}
                      style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}
                    >
                      {selectedRecipientIds.length === matchingBroadcastUsers.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                    </button>
                  </div>

                  {matchingBroadcastUsers.length === 0 ? (
                    <div style={{ fontSize: '0.78rem', color: '#dc2626', background: '#fef2f2', padding: '0.45rem 0.75rem', borderRadius: '6px' }}>
                      ⚠️ Aucun utilisateur ne correspond au filtre <strong>{getRoleLabel(broadcastRole)}</strong> avec le mot-clé <strong>"{broadcastKeyword}"</strong>. Essayez un autre mot-clé ou laissez vide pour tous les {getRoleLabel(broadcastRole).toLowerCase()}s.
                    </div>
                  ) : (
                    <div className="broadcast-recipients-preview">
                      {matchingBroadcastUsers.map((u) => {
                        const uId = u.uti_id || u.id;
                        const isChecked = selectedRecipientIds.includes(uId);
                        const char = getUserCharacterDetails(u);
                        return (
                          <div
                            key={uId}
                            className="recipient-pill"
                            onClick={() => toggleRecipient(uId)}
                            style={{
                              cursor: 'pointer',
                              opacity: isChecked ? 1 : 0.45,
                              background: isChecked ? '#eff6ff' : '#f1f5f9',
                              borderColor: isChecked ? '#93c5fd' : '#cbd5e1',
                              color: isChecked ? '#1d4ed8' : '#64748b',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                            }}
                            title="Cliquer pour inclure ou exclure ce destinataire"
                          >
                            <span
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '4px',
                                background: isChecked ? '#2563eb' : '#94a3b8',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {isChecked ? (
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              ) : (
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              )}
                            </span>
                            <strong>{getFullName(u)}</strong>
                            {char.label && <span style={{ fontSize: '0.65rem', opacity: 0.85 }}>({char.label})</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* ÉTAPE 2 : MODÈLES D'ANNONCES EN 1 CLIC */}
              <div style={{ marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                  Modèles d'annonces en 1 clic :
                </span>
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="template-btn"
                    onClick={() => applyTemplate('stage')}
                  >
                    <span>Offre de Stage (ex: Informatique)</span>
                  </button>
                  <button
                    type="button"
                    className="template-btn"
                    onClick={() => applyTemplate('emploi')}
                  >
                    <span>Offre d'Emploi (ex: Comptabilité)</span>
                  </button>
                  <button
                    type="button"
                    className="template-btn"
                    onClick={() => applyTemplate('forum')}
                  >
                    <span>Forum des Métiers (Tous)</span>
                  </button>
                  <button
                    type="button"
                    className="template-btn"
                    onClick={() => applyTemplate('annonce')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                    <span>Révision / Bac (Élèves)</span>
                  </button>
                </div>
              </div>

              {/* ÉTAPE 3 : CONTENU DU MESSAGE */}
              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>
                  Contenu du message d'annonce / opportunité :
                </label>
                <textarea
                  className="form-control"
                  rows={5}
                  placeholder="Rédigez ici votre message ou annonce (présentation du stage, prérequis, mission, date limite, consignes de candidature...)..."
                  value={broadcastMessageText}
                  onChange={(e) => setBroadcastMessageText(e.target.value)}
                  style={{ fontSize: '0.88rem', lineHeight: 1.45 }}
                />
              </div>

              {/* ÉTAPE 4 : PIÈCE JOINTE (OFFRE PDF, FICHE DE POSTE, AFFICHE...) */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '0.35rem' }}>
                  Pièce jointe (Offre de stage PDF, fiche de poste Word, affiche du forum...) :
                </label>

                {/* Inputs cachés pour le broadcast */}
                <input
                  type="file"
                  ref={broadcastFileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleBroadcastFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,image/*"
                />
                <input
                  type="file"
                  ref={broadcastImageInputRef}
                  style={{ display: 'none' }}
                  onChange={handleBroadcastFileChange}
                  accept="image/*"
                />

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => broadcastFileInputRef.current?.click()}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                    <span>Joindre un Document (PDF, Word, etc.)</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => broadcastImageInputRef.current?.click()}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    <span>Joindre une Affiche / Photo</span>
                  </button>
                </div>

                {broadcastAttachedFile && (
                  <div className="messenger-attachment-chip" style={{ marginTop: '0.5rem' }}>
                    <div className="attachment-chip-preview">
                      <span className="attachment-chip-icon">
                        {renderFileIcon(broadcastAttachedFile.type, broadcastAttachedFile.name)}
                      </span>
                      <div className="attachment-chip-info">
                        <span className="attachment-chip-name">{broadcastAttachedFile.name}</span>
                        <span className="attachment-chip-size">{formatFileSize(broadcastAttachedFile.size)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="attachment-remove-btn"
                      onClick={() => setBroadcastAttachedFile(null)}
                      title="Supprimer ce document"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* ACTIONS ENVOI */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowBroadcastModal(false)}
                  disabled={broadcasting}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSendBroadcast}
                  disabled={selectedRecipientIds.length === 0 || (!broadcastMessageText.trim() && !broadcastAttachedFile) || broadcasting}
                  style={{
                    background: '#0d9488',
                    borderColor: '#0d9488',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  {broadcasting ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      <span>Diffusion en cours...</span>
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" />
                      </svg>
                      <span>Diffuser à {selectedRecipientIds.length} destinataire(s)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL LIGHTBOX : ZOOM IMAGE
          ======================================================== */}
      {previewImageModal && (
        <div className="messenger-lightbox" onClick={() => setPreviewImageModal(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={previewImageModal} alt="Zoom" className="lightbox-image" />
            <div className="lightbox-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', justifyContent: 'center' }}>
              <a
                href={previewImageModal}
                download="image_ehari.png"
                className="action-icon-btn action-download"
                title="Télécharger l'image"
                target="_blank"
                rel="noreferrer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
              <button
                type="button"
                className="action-icon-btn action-delete"
                onClick={() => setPreviewImageModal(null)}
                title="Fermer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL ADMIN : NOUVELLE CONVERSATION DIRECTE (1-À-1)
          ======================================================== */}
      {showNewChatModal && (
        <div className="messenger-modal-backdrop" onClick={() => setShowNewChatModal(false)}>
          <div className="messenger-modal" onClick={(e) => e.stopPropagation()}>
            <div className="messenger-modal-header">
              <h3>Démarrer une discussion directe</h3>
              <button className="messenger-modal-close" onClick={() => setShowNewChatModal(false)} title="Fermer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="messenger-modal-body">
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher par nom, rôle ou caractère (ex: littéraire, scientifique...)"
                  value={newChatSearch}
                  onChange={(e) => setNewChatSearch(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="messenger-user-selection-list">
                {filteredNewChatUsers.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.88rem', padding: '1rem 0' }}>
                    Aucun utilisateur ne correspond à cette recherche.
                  </p>
                ) : (
                  filteredNewChatUsers.map((u) => {
                    const uId = u.uti_id || u.id;
                    const charInfo = getUserCharacterDetails(u);
                    return (
                      <div
                        key={uId}
                        className="messenger-user-pick-item"
                        onClick={() => handleStartNewChatWithUser(u)}
                      >
                        {u.uti_ava ? (
                          <img src={u.uti_ava} alt={u.uti_nom} className="conv-avatar" />
                        ) : (
                          <div className="conv-avatar-placeholder">
                            {(u.uti_nom?.[0] || u.nom?.[0] || 'U') + (u.uti_pre?.[0] || u.prenom?.[0] || '')}
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{getFullName(u)}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {u.uti_ema || u.email}
                          </div>
                          {charInfo.label && (
                            <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600, marginTop: '0.15rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              <span>{charInfo.label}</span>
                            </div>
                          )}
                        </div>
                        <span
                          className={getRoleBadgeClass(u.uti_rol || u.role)}
                          style={{ border: 'none', outline: 'none' }}
                        >
                          {getRoleLabel(u.uti_rol || u.role)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MENU CONTEXTUEL (CLIC DROIT SUR UN MESSAGE)
          ======================================================== */}
      {contextMenu && (
        <div
          className="messenger-context-menu"
          style={{
            position: 'fixed',
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            zIndex: 99999,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.message?.mes_con && contextMenu.message.mes_con !== `[Pièce jointe : ${contextMenu.message.mes_fic_nom}]` && (
            <button
              type="button"
              className="context-menu-item"
              onClick={() => handleCopyText(contextMenu.message)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copier le texte</span>
            </button>
          )}

          {(contextMenu.message?.mes_exp_id === currentUserId || isAdmin) && (
            <>
              <button
                type="button"
                className="context-menu-item"
                onClick={() => handleStartEdit(contextMenu.message)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span>Modifier</span>
              </button>

              <div className="context-menu-divider" />

              <button
                type="button"
                className="context-menu-item item-danger"
                onClick={() => handleStartDelete(contextMenu.message)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                <span>Supprimer</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* ========================================================
          MODAL DE CONFIRMATION DE SUPPRESSION DE MESSAGE
          ======================================================== */}
      {deletingMessage && (
        <div className="messenger-modal-backdrop" onClick={() => !deletingLoading && setDeletingMessage(null)}>
          <div className="messenger-modal" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="messenger-modal-header" style={{ borderBottom: '1px solid #fee2e2' }}>
              <h3 style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                Supprimer le message
              </h3>
              <button
                className="messenger-modal-close"
                onClick={() => !deletingLoading && setDeletingMessage(null)}
                title="Fermer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="messenger-modal-body" style={{ padding: '1.25rem 1.5rem' }}>
              <p style={{ color: '#334155', fontSize: '0.92rem', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                Êtes-vous sûr de vouloir supprimer définitivement ce message ? Cette action est irréversible.
              </p>
              {deletingMessage.mes_con && (
                <div style={{
                  background: '#f8fafc',
                  borderLeft: '3px solid #dc2626',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: '#475569',
                  marginBottom: '1.25rem',
                  maxHeight: '90px',
                  overflowY: 'auto',
                  fontStyle: 'italic',
                }}>
                  « {deletingMessage.mes_con} »
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setDeletingMessage(null)}
                  disabled={deletingLoading}
                  style={{ borderRadius: '8px', padding: '0.5rem 1rem' }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                  disabled={deletingLoading}
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1.15rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)',
                  }}
                >
                  {deletingLoading ? (
                    'Suppression...'
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Supprimer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TOAST DE CONFIRMATION D'ACTION
          ======================================================== */}
      {actionSuccessToast && (
        <div className="messenger-toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{actionSuccessToast}</span>
        </div>
      )}
    </div>
  );
}
