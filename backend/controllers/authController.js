const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'super_secret_cle_jwt_hari_2026_orientation_pro';
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  const uid = user.uti_id || user.util_id || user.utilisateur_id || user.id;
  const uemail = user.uti_ema || user.util_emai || user.utilisateur_email || user.email;
  const urole = user.uti_rol || user.util_role || user.utilisateur_role || user.role;

  return jwt.sign(
    {
      uti_id: uid,
      uti_ema: uemail,
      uti_rol: urole,
      // Alias rétrocompatibles
      util_id: uid,
      util_emai: uemail,
      util_role: urole,
      utilisateur_id: uid,
      id: uid,
    },
    secret,
    { expiresIn }
  );
};

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

const AuthController = {
  // Inscription d'un nouvel utilisateur (Élève, Étudiant ou Emploi)
  async register(req, res) {
    try {
      const rawNom = req.body.uti_nom || req.body.util_nom || req.body.utilisateur_nom || req.body.nom;
      const nom = rawNom ? rawNom.trim().toUpperCase() : '';
      const rawPrenom = req.body.uti_pre || req.body.util_pren || req.body.utilisateur_prenom || req.body.prenom;
      const prenom = rawPrenom ? formatPrenom(rawPrenom.trim()) : '';
      const email = req.body.uti_ema || req.body.util_emai || req.body.utilisateur_email || req.body.email;
      const mot_de_passe = req.body.uti_pas || req.body.util_pass || req.body.utilisateur_mot_de_passe || req.body.mot_de_passe;
      const role = req.body.uti_rol || req.body.util_role || req.body.utilisateur_role || req.body.role;
      const telephone = req.body.uti_tel || req.body.util_tele || req.body.utilisateur_telephone || req.body.telephone || null;
      const adresse = req.body.uti_adr || req.body.util_adre || req.body.utilisateur_adresse || req.body.adresse || null;
      const avatar = req.body.uti_ava || req.body.util_avat || req.body.utilisateur_avatar || req.body.avatar || null;

      const profil = req.body.profil || {};

      // Le prénom est facultatif (certaines personnes à Madagascar n'ont pas de prénom)
      if (!nom || !email || !mot_de_passe || !role) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez renseigner tous les champs obligatoires (nom, email, mot de passe, type de profil).',
        });
      }

      if (role === 'admin') {
        return res.status(403).json({
          success: false,
          message: "L'administrateur unique est déjà configuré dans le système. L'inscription est réservée aux élèves, étudiants et profils en recherche d'emploi.",
        });
      }

      const validRoles = ['eleve', 'etudiant', 'rechercher emploi', 'emploi', 'reconversion'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: `Le type de profil doit être l'un des suivants : eleve, etudiant, rechercher emploi.`,
        });
      }

      // Normaliser en 'rechercher emploi' pour la BDD et le backend
      const normalizedRole = (role === 'reconversion' || role === 'emploi' || role === 'rechercher emploi') ? 'rechercher emploi' : role;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Cette adresse email est déjà utilisée.',
        });
      }

      if (role === 'eleve') {
        const rawCla = profil.ele_cla || profil.elev_clas || req.body.ele_cla || req.body.elev_clas || req.body.classe || '';
        const rawEta = profil.ele_eta || profil.elev_etab || req.body.ele_eta || req.body.elev_etab || req.body.etablissement || '';
        const rawSer = profil.ele_ser || profil.elev_seri || req.body.ele_ser || req.body.elev_seri || req.body.serie || '';

        const cleanCla = typeof rawCla === 'string' ? rawCla.trim() : '';
        const cleanEta = typeof rawEta === 'string' ? rawEta.trim() : '';
        const cleanSer = typeof rawSer === 'string' ? rawSer.trim() : '';

        if (!cleanEta) {
          return res.status(400).json({
            success: false,
            message: 'Veuillez renseigner votre établissement scolaire.',
          });
        }
        if (!cleanCla) {
          return res.status(400).json({
            success: false,
            message: 'Veuillez sélectionner votre classe actuelle.',
          });
        }

        const isTerminale = cleanCla.toLowerCase().includes('terminale');
        if (isTerminale && !cleanSer) {
          return res.status(400).json({
            success: false,
            message: 'Veuillez sélectionner votre série pour la classe de Terminale.',
          });
        }
      } else if (role === 'etudiant') {
        const rawEta = profil.etu_eta || req.body.etu_eta || req.body.etablissement || req.body.universite || '';
        const rawFil = profil.etu_fil || req.body.etu_fil || req.body.filiere || '';
        const rawNiv = profil.etu_niv_etu || req.body.etu_niv_etu || req.body.niveau_etude || '';

        const cleanEta = typeof rawEta === 'string' ? rawEta.trim() : '';
        const cleanFil = typeof rawFil === 'string' ? rawFil.trim() : '';
        const cleanNiv = typeof rawNiv === 'string' ? rawNiv.trim() : '';

        if (!cleanEta) {
          return res.status(400).json({
            success: false,
            message: 'Veuillez renseigner votre université ou institut.',
          });
        }
        if (!cleanFil) {
          return res.status(400).json({
            success: false,
            message: 'Veuillez renseigner votre filière ou spécialisation.',
          });
        }
        if (!cleanNiv) {
          return res.status(400).json({
            success: false,
            message: 'Veuillez sélectionner votre niveau d\'étude actuel.',
          });
        }
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

      const newUser = await UserModel.create({
        uti_nom: nom,
        uti_pre: prenom,
        uti_ema: email,
        uti_pas: hashedPassword,
        uti_rol: normalizedRole,
        uti_tel: telephone,
        uti_adr: adresse,
        uti_ava: avatar,
      });

      let createdProfile = null;

      if (normalizedRole === 'eleve') {
        const rawCla = profil.ele_cla || profil.elev_clas || req.body.ele_cla || req.body.elev_clas || req.body.classe || '';
        const rawSer = profil.ele_ser || profil.elev_seri || req.body.ele_ser || req.body.elev_seri || req.body.serie || '';
        const rawEta = profil.ele_eta || profil.elev_etab || req.body.ele_eta || req.body.elev_etab || req.body.etablissement || '';
        const isTerminale = typeof rawCla === 'string' && rawCla.trim().toLowerCase().includes('terminale');
        const pupilData = {
          ele_cla: typeof rawCla === 'string' ? rawCla.trim() || null : rawCla,
          ele_ser: isTerminale ? (typeof rawSer === 'string' ? rawSer.trim() || null : rawSer) : null,
          ele_eta: typeof rawEta === 'string' ? rawEta.trim() || null : rawEta,
          ele_not_ema: profil.ele_not_ema !== undefined ? profil.ele_not_ema : (req.body.ele_not_ema !== undefined ? req.body.ele_not_ema : true),
        };
        createdProfile = await UserModel.createPupilProfile(newUser.uti_id, pupilData);
        await UserModel.initTests(newUser.uti_id, 'eleve');
      } else if (normalizedRole === 'etudiant') {
        const rawEta = profil.etu_eta || req.body.etu_eta || req.body.etablissement || req.body.universite || '';
        const rawFil = profil.etu_fil || req.body.etu_fil || req.body.filiere || '';
        const rawNiv = profil.etu_niv_etu || req.body.etu_niv_etu || req.body.niveau_etude || '';
        const studentData = {
          etu_eta: typeof rawEta === 'string' ? rawEta.trim() || null : rawEta,
          etu_fil: typeof rawFil === 'string' ? rawFil.trim() || null : rawFil,
          etu_niv_etu: typeof rawNiv === 'string' ? rawNiv.trim() || null : rawNiv,
        };
        createdProfile = await UserModel.createStudentProfile(newUser.uti_id, studentData);
        await UserModel.initTests(newUser.uti_id, 'etudiant');
      } else if (normalizedRole === 'emploi') {
        const emploiData = {
          emp_sit_act: profil.emp_sit_act || profil.rec_sit_act || profil.reco_situ_actu || req.body.emp_sit_act || req.body.rec_sit_act || req.body.situation_actuelle || 'En recherche d\'opportunité professionnelle',
          emp_met_act: profil.emp_met_act || profil.rec_met_act || profil.reco_meti_actu || req.body.emp_met_act || req.body.rec_met_act || req.body.metier_actuel_ou_precedent || null,
        };
        createdProfile = await UserModel.createEmploiProfile(newUser.uti_id, emploiData);
        await UserModel.initTests(newUser.uti_id, 'emploi');
      }

      const fullUser = await UserModel.findById(newUser.uti_id);
      const token = generateToken(fullUser || newUser);

      return res.status(201).json({
        success: true,
        message: 'Compte créé avec succès !',
        token,
        user: fullUser || {
          ...newUser,
          profil: createdProfile,
        },
      });
    } catch (error) {
      console.error('Erreur inscription :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la création du compte.',
        error: error.message,
      });
    }
  },

  // Connexion
  async login(req, res) {
    try {
      const email = req.body.uti_ema || req.body.util_emai || req.body.utilisateur_email || req.body.email;
      const mot_de_passe = req.body.uti_pas || req.body.util_pass || req.body.utilisateur_mot_de_passe || req.body.mot_de_passe;

      if (!email || !mot_de_passe) {
        return res.status(400).json({
          success: false,
          message: 'Veuillez saisir votre email et votre mot de passe.',
        });
      }

      let user = await UserModel.findByEmail(email);
      // Alias pour le raccourci admin : si admin@hari.mg n'existe pas directement, chercher le compte administrateur principal
      if (!user && email && email.trim().toLowerCase() === 'admin@hari.mg') {
        const adminRes = await UserModel.findAll({ role: 'admin', limit: 1 });
        if (adminRes && adminRes.users && adminRes.users.length > 0) {
          user = await UserModel.findByEmail(adminRes.users[0].uti_ema);
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Identifiants invalides (email ou mot de passe incorrect).',
        });
      }

      const statut = user.uti_sta || user.util_stat || user.utilisateur_statut || user.statut;
      if (statut !== 'actif') {
        return res.status(403).json({
          success: false,
          message: `Votre compte est actuellement ${statut}. Contactez l'administrateur.`,
        });
      }

      const isMatch = await bcrypt.compare(mot_de_passe, user.uti_pas || user.util_pass);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Identifiants invalides (email ou mot de passe incorrect).',
        });
      }

      delete user.uti_pas;
      delete user.util_pass;

      const token = generateToken(user);

      return res.json({
        success: true,
        message: 'Connexion réussie !',
        token,
        user,
      });
    } catch (error) {
      console.error('Erreur connexion :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la tentative de connexion.',
        error: error.message,
      });
    }
  },

  // Profil courant (Me)
  async getMe(req, res) {
    try {
      return res.json({
        success: true,
        user: req.user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil.',
        error: error.message,
      });
    }
  },
};

module.exports = AuthController;
