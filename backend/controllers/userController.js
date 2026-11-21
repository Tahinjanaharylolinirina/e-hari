const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const EdtModel = require('../models/EdtModel');
const { query } = require('../config/db');
const { evaluateTest } = require('../data/testsConstantData');

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

// Attribution automatique et vérifiée des ID de facultés, entreprises et métiers
const getAttributionIds = async ({ testType, dominantCode, reqFacId, reqEntId, reqMetId }) => {
  let fac_id = reqFacId ? parseInt(reqFacId, 10) : null;
  let ent_id = reqEntId ? parseInt(reqEntId, 10) : null;
  let met_id = reqMetId ? parseInt(reqMetId, 10) : null;

  const mappingRules = {
    'eleve_1': {
      'sciences_tech': { facKeyword: 'Polytechnique', entKeyword: 'Axian', metKeyword: 'Développeur' },
      'lettres_comm': { facKeyword: 'Droit', entKeyword: 'Intelcia', metKeyword: 'Juriste' },
      'eco_gestion': { facKeyword: 'INSCAE', entKeyword: 'BNI', metKeyword: 'Auditeur' },
      'sante_social': { facKeyword: 'Médecine', entKeyword: 'WWF', metKeyword: 'Médecin' },
      'arts_creation': { facKeyword: 'Lettres', entKeyword: 'Vivetic', metKeyword: 'Marketing' },
      'nature_agri': { facKeyword: 'Agronomie', entKeyword: 'WWF', metKeyword: 'Agronome' },
      'default': { facKeyword: 'Sciences', entKeyword: 'Intelcia', metKeyword: 'Développeur' }
    },
    'eleve_2': {
      'sciences_exactes': { facKeyword: 'Polytechnique', entKeyword: 'Bocasay', metKeyword: 'Génie Civil' },
      'sciences_vie_sante': { facKeyword: 'Médecine', entKeyword: 'WWF', metKeyword: 'Pharmacien' },
      'lettres_langues': { facKeyword: 'Droit', entKeyword: 'Intelcia', metKeyword: 'Juriste' },
      'eco_societe': { facKeyword: 'INSCAE', entKeyword: 'BNI', metKeyword: 'Analyste Crédit' },
      'technique_appliquee': { facKeyword: 'IST', entKeyword: 'Colas', metKeyword: 'Systèmes' },
      'default': { facKeyword: 'Polytechnique', entKeyword: 'Bocasay', metKeyword: 'Génie Civil' }
    },
    'etudiant_1': {
      'analytique_tech': { facKeyword: 'Sciences', entKeyword: 'Etech', metKeyword: 'Développeur' },
      'leadership_gestion': { facKeyword: 'INSCAE', entKeyword: 'BNI', metKeyword: 'Auditeur' },
      'relationnel_social': { facKeyword: 'Lettres', entKeyword: 'Intelcia', metKeyword: 'Affaires' },
      'creatif_innovant': { facKeyword: 'ISCAM', entKeyword: 'Concentrix', metKeyword: 'Marketing' },
      'investigation_recherche': { facKeyword: 'Sciences', entKeyword: 'WWF', metKeyword: 'Data Analyst' },
      'operationnel_terrain': { facKeyword: 'IST', entKeyword: 'Colas', metKeyword: 'Stocks' },
      'default': { facKeyword: 'Sciences', entKeyword: 'Etech', metKeyword: 'Développeur' }
    },
    'etudiant_2': {
      'pole_tech': { facKeyword: 'Polytechnique', entKeyword: 'Bocasay', metKeyword: 'Cloud' },
      'pole_finance': { facKeyword: 'INSCAE', entKeyword: 'BOA', metKeyword: 'Auditeur' },
      'pole_impact_vert': { facKeyword: 'Agronomie', entKeyword: 'WeLight', metKeyword: 'Solaire' },
      'pole_entrepreneuriat': { facKeyword: 'ISCAM', entKeyword: 'Robert', metKeyword: 'Affaires' },
      'pole_logistique_supply': { facKeyword: 'IST', entKeyword: 'AGL', metKeyword: 'Stocks' },
      'pole_tech_digital': { facKeyword: 'IT University', entKeyword: 'Vivetic', metKeyword: 'Marketing' },
      'default': { facKeyword: 'Polytechnique', entKeyword: 'Bocasay', metKeyword: 'Cloud' }
    },
    'emploi_1': {
      'transition_digitale': { facKeyword: 'IT University', entKeyword: 'Intelcia', metKeyword: 'BPO' },
      'stabilite_gestion': { facKeyword: 'INSCAE', entKeyword: 'BNI', metKeyword: 'Auditeur' },
      'service_relation': { facKeyword: 'Lettres', entKeyword: 'Concentrix', metKeyword: 'BPO' },
      'metiers_verts': { facKeyword: 'Agronomie', entKeyword: 'WeLight', metKeyword: 'Solaire' },
      'commerce_entrepreneuriat': { facKeyword: 'ISCAM', entKeyword: 'STAR', metKeyword: 'Affaires' },
      'logistique_terrain': { facKeyword: 'IST', entKeyword: 'AGL', metKeyword: 'Stocks' },
      'default': { facKeyword: 'IT University', entKeyword: 'Intelcia', metKeyword: 'BPO' }
    },
    'emploi_2': {
      'pole_tech': { facKeyword: 'Polytechnique', entKeyword: 'Etech', metKeyword: 'Développeur' },
      'pole_finance': { facKeyword: 'INSCAE', entKeyword: 'BOA', metKeyword: 'Analyste Crédit' },
      'pole_impact_vert': { facKeyword: 'Agronomie', entKeyword: 'WWF', metKeyword: 'ONG' },
      'pole_entrepreneuriat': { facKeyword: 'ISCAM', entKeyword: 'Robert', metKeyword: 'Affaires' },
      'pole_logistique_supply': { facKeyword: 'IST', entKeyword: 'AGL', metKeyword: 'Stocks' },
      'pole_tech_digital': { facKeyword: 'IT University', entKeyword: 'Vivetic', metKeyword: 'BPO' },
      'default': { facKeyword: 'IST', entKeyword: 'AGL', metKeyword: 'Stocks' }
    }
  };

  const rules = mappingRules[testType] || {};
  const target = rules[dominantCode] || rules['default'] || {};

  if (!fac_id && target.facKeyword) {
    const r = await query('SELECT fac_id FROM faculte WHERE fac_nom ILIKE $1 LIMIT 1', [`%${target.facKeyword}%`]);
    if (r.rows.length > 0) fac_id = r.rows[0].fac_id;
  }
  if (!fac_id) {
    const r = await query('SELECT fac_id FROM faculte ORDER BY fac_id ASC LIMIT 1');
    if (r.rows.length > 0) fac_id = r.rows[0].fac_id;
  }

  if (!ent_id && target.entKeyword) {
    const r = await query('SELECT ent_id FROM entreprise WHERE ent_nom ILIKE $1 LIMIT 1', [`%${target.entKeyword}%`]);
    if (r.rows.length > 0) ent_id = r.rows[0].ent_id;
  }
  if (!ent_id) {
    const r = await query('SELECT ent_id FROM entreprise ORDER BY ent_id ASC LIMIT 1');
    if (r.rows.length > 0) ent_id = r.rows[0].ent_id;
  }

  if (!met_id && target.metKeyword) {
    const r = await query('SELECT met_id FROM metier WHERE met_nom ILIKE $1 LIMIT 1', [`%${target.metKeyword}%`]);
    if (r.rows.length > 0) met_id = r.rows[0].met_id;
  }
  if (!met_id) {
    const r = await query('SELECT met_id FROM metier ORDER BY met_id ASC LIMIT 1');
    if (r.rows.length > 0) met_id = r.rows[0].met_id;
  }

  return { fac_id, ent_id, met_id };
};

// Expression régulière et fonction de nettoyage pour garantir 0 icône dans les données sauvegardées
const EMOJI_REGEX = /([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|[\uFE00-\uFE0F]|[\u200D]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]|\uD83E[\uDD00-\uDDFF\uDE00-\uDEFF\uDF00-\uDFFF])/gu;

const sanitizeNoIcons = (val) => {
  if (val === null || val === undefined) return val;
  if (typeof val === 'string') {
    return val.replace(EMOJI_REGEX, '').replace(/\s{2,}/g, ' ').trim();
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeNoIcons);
  }
  if (typeof val === 'object') {
    const res = {};
    for (const [k, v] of Object.entries(val)) {
      if (k === 'icon' || k === 'icon_svg' || k === 'emoji') continue;
      res[k] = sanitizeNoIcons(v);
    }
    return res;
  }
  return val;
};

const UserController = {
  // Obtenir tous les utilisateurs avec filtres et pagination (Admin)
  async getAllUsers(req, res) {
    try {
      const { role, statut, search, page = 1, limit = 20 } = req.query;
      const data = await UserModel.findAll({
        role,
        statut,
        search,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      });

      return res.json({
        success: true,
        ...data,
      });
    } catch (error) {
      console.error('Erreur getAllUsers :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs.',
        error: error.message,
      });
    }
  },

  // Obtenir un utilisateur par son ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé.',
        });
      }

      return res.json({
        success: true,
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'utilisateur.',
        error: error.message,
      });
    }
  },

  // Mettre à jour un utilisateur et son profil
  async updateUser(req, res) {
    try {
      const targetId = parseInt(req.params.id, 10);
      const currentUser = req.user;
      const curRole = currentUser.uti_rol || currentUser.util_role || currentUser.utilisateur_role || currentUser.role;
      const curId = currentUser.uti_id || currentUser.util_id || currentUser.utilisateur_id || currentUser.id;

      if (curRole !== 'admin' && curId !== targetId) {
        return res.status(403).json({
          success: false,
          message: 'Vous n\'êtes pas autorisé à modifier ce compte.',
        });
      }

      const existingUser = await UserModel.findById(targetId);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé.',
        });
      }

      const rawNom = req.body.uti_nom !== undefined ? req.body.uti_nom : (req.body.util_nom !== undefined ? req.body.util_nom : req.body.nom);
      const nom = rawNom !== undefined ? (typeof rawNom === 'string' ? rawNom.trim().toUpperCase() : rawNom) : undefined;
      const rawPrenom = req.body.uti_pre !== undefined ? req.body.uti_pre : (req.body.util_pren !== undefined ? req.body.util_pren : req.body.prenom);
      const prenom = rawPrenom !== undefined ? (typeof rawPrenom === 'string' ? formatPrenom(rawPrenom.trim()) : rawPrenom) : undefined;
      
      const rawEmail = req.body.uti_ema !== undefined ? req.body.uti_ema : (req.body.util_emai !== undefined ? req.body.util_emai : req.body.email);
      let email = undefined;
      if (rawEmail !== undefined && typeof rawEmail === 'string' && rawEmail.trim() !== '') {
        const cleanEmail = rawEmail.trim().toLowerCase();
        if (cleanEmail !== (existingUser.uti_ema || '').toLowerCase()) {
          const emailExists = await UserModel.findByEmail(cleanEmail);
          if (emailExists && (emailExists.uti_id !== targetId)) {
            return res.status(400).json({
              success: false,
              message: 'Cette adresse email est déjà utilisée par un autre compte.',
            });
          }
          email = cleanEmail;
        }
      }

      const telephone = req.body.uti_tel !== undefined ? req.body.uti_tel : (req.body.util_tele !== undefined ? req.body.util_tele : req.body.telephone);
      const adresse = req.body.uti_adr !== undefined ? req.body.uti_adr : (req.body.util_adre !== undefined ? req.body.util_adre : req.body.adresse);
      const avatar = req.body.uti_ava !== undefined ? req.body.uti_ava : (req.body.util_avat !== undefined ? req.body.util_avat : req.body.avatar);
      const statut = req.body.uti_sta !== undefined ? req.body.uti_sta : (req.body.util_stat !== undefined ? req.body.util_stat : req.body.statut);
      const mot_de_passe = req.body.uti_pas || req.body.util_pass || req.body.mot_de_passe;

      const profil = req.body.profil || {};
      const allowedStatut = curRole === 'admin' ? statut : (statut === 'inactif' ? 'inactif' : undefined);

      await UserModel.update(targetId, {
        uti_nom: nom,
        uti_pre: prenom,
        uti_ema: email,
        uti_tel: telephone,
        uti_adr: adresse,
        uti_ava: avatar,
        uti_sta: allowedStatut,
      });

      if (mot_de_passe && mot_de_passe.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mot_de_passe, salt);
        await UserModel.updatePassword(targetId, hashedPassword);
      }

      const userRole = existingUser.uti_rol || existingUser.util_role || existingUser.role;

      // Mise à jour du profil spécifique selon le rôle (uniquement les champs fournis)
      if (userRole === 'eleve') {
        const pupilData = {};
        const cla = profil.ele_cla !== undefined ? profil.ele_cla : (profil.elev_clas !== undefined ? profil.elev_clas : (req.body.ele_cla !== undefined ? req.body.ele_cla : (req.body.elev_clas !== undefined ? req.body.elev_clas : req.body.classe)));
        if (cla !== undefined && cla !== null && cla !== '') pupilData.ele_cla = cla;

        const ser = profil.ele_ser !== undefined ? profil.ele_ser : (profil.elev_seri !== undefined ? profil.elev_seri : (req.body.ele_ser !== undefined ? req.body.ele_ser : (req.body.elev_seri !== undefined ? req.body.elev_seri : req.body.serie)));
        if (ser !== undefined && ser !== null) pupilData.ele_ser = ser;

        const eta = profil.ele_eta !== undefined ? profil.ele_eta : (profil.elev_etab !== undefined ? profil.elev_etab : (req.body.ele_eta !== undefined ? req.body.ele_eta : (req.body.elev_etab !== undefined ? req.body.elev_etab : req.body.etablissement)));
        if (eta !== undefined && eta !== null && eta !== '') pupilData.ele_eta = eta;

        const mat = profil.ele_mat_pre !== undefined ? profil.ele_mat_pre : (profil.elev_mati_pref !== undefined ? profil.elev_mati_pref : (req.body.ele_mat_pre !== undefined ? req.body.ele_mat_pre : req.body.matieres_preferees));
        if (mat !== undefined && mat !== null && mat !== '') pupilData.ele_mat_pre = mat;

        const cen = profil.ele_cen_int !== undefined ? profil.ele_cen_int : (profil.elev_cent_inte !== undefined ? profil.elev_cent_inte : (req.body.ele_cen_int !== undefined ? req.body.ele_cen_int : req.body.centres_interet));
        if (cen !== undefined && cen !== null && cen !== '') pupilData.ele_cen_int = cen;

        const pro = profil.ele_pro_bac !== undefined ? profil.ele_pro_bac : (profil.elev_proj_bac !== undefined ? profil.elev_proj_bac : (req.body.ele_pro_bac !== undefined ? req.body.ele_pro_bac : req.body.projet_apres_bac));
        if (pro !== undefined && pro !== null && pro !== '') pupilData.ele_pro_bac = pro;

        const bio = profil.ele_bio !== undefined ? profil.ele_bio : (profil.elev_bio !== undefined ? profil.elev_bio : (req.body.ele_bio !== undefined ? req.body.ele_bio : req.body.bio));
        if (bio !== undefined && bio !== null && bio !== '') pupilData.ele_bio = bio;

        if (Object.keys(pupilData).length > 0) {
          await UserModel.createPupilProfile(targetId, pupilData);
        }
      } else if (userRole === 'etudiant') {
        const studentData = {};
        const eta = profil.etu_eta !== undefined ? profil.etu_eta : (profil.etud_etab !== undefined ? profil.etud_etab : (req.body.etu_eta !== undefined ? req.body.etu_eta : (req.body.etud_etab !== undefined ? req.body.etud_etab : (req.body.etablissement || req.body.universite))));
        if (eta !== undefined && eta !== null && eta !== '') studentData.etu_eta = eta;

        const fil = profil.etu_fil !== undefined ? profil.etu_fil : (profil.etud_fili !== undefined ? profil.etud_fili : (req.body.etu_fil !== undefined ? req.body.etu_fil : (req.body.etud_fili !== undefined ? req.body.etud_fili : req.body.filiere)));
        if (fil !== undefined && fil !== null && fil !== '') studentData.etu_fil = fil;

        const niv = profil.etu_niv_etu !== undefined ? profil.etu_niv_etu : (profil.etud_nive_etud !== undefined ? profil.etud_nive_etud : (req.body.etu_niv_etu !== undefined ? req.body.etu_niv_etu : (req.body.etud_nive_etud !== undefined ? req.body.etud_nive_etud : req.body.niveau_etude)));
        if (niv !== undefined && niv !== null && niv !== '') studentData.etu_niv_etu = niv;

        if (Object.keys(studentData).length > 0) {
          await UserModel.createStudentProfile(targetId, studentData);
        }
      } else if (userRole === 'reconversion' || userRole === 'emploi') {
        const emploiData = {};
        const sit = profil.emp_sit_act !== undefined ? profil.emp_sit_act : (profil.rec_sit_act !== undefined ? profil.rec_sit_act : (profil.reco_situ_actu !== undefined ? profil.reco_situ_actu : (req.body.emp_sit_act !== undefined ? req.body.emp_sit_act : (req.body.rec_sit_act !== undefined ? req.body.rec_sit_act : req.body.situation_actuelle))));
        if (sit !== undefined && sit !== null && sit !== '') emploiData.emp_sit_act = sit;

        const met = profil.emp_met_act !== undefined ? profil.emp_met_act : (profil.rec_met_act !== undefined ? profil.rec_met_act : (profil.reco_meti_actu !== undefined ? profil.reco_meti_actu : (req.body.emp_met_act !== undefined ? req.body.emp_met_act : (req.body.rec_met_act !== undefined ? req.body.rec_met_act : req.body.metier_actuel_ou_precedent))));
        if (met !== undefined && met !== null && met !== '') emploiData.emp_met_act = met;

        if (Object.keys(emploiData).length > 0) {
          await UserModel.createEmploiProfile(targetId, emploiData);
        }
      }

      const updatedUser = await UserModel.findById(targetId);

      return res.json({
        success: true,
        message: 'Utilisateur mis à jour avec succès.',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Erreur updateUser :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de l\'utilisateur.',
        error: error.message,
      });
    }
  },

  // Modifier le statut (Admin uniquement)
  async updateUserStatus(req, res) {
    try {
      const { id } = req.params;
      const statut = req.body.uti_sta || req.body.util_stat || req.body.utilisateur_statut || req.body.statut;

      if (!['actif', 'inactif', 'suspendu'].includes(statut)) {
        return res.status(400).json({
          success: false,
          message: 'Statut invalide. Choisissez parmi : actif, inactif, suspendu.',
        });
      }

      const updated = await UserModel.update(id, { uti_sta: statut });
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé.',
        });
      }

      return res.json({
        success: true,
        message: `Statut changé en '${statut}'.`,
        user: updated,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du statut.',
        error: error.message,
      });
    }
  },

  // Supprimer un utilisateur (Admin uniquement)
  async deleteUser(req, res) {
    try {
      const targetId = parseInt(req.params.id, 10);
      const curId = req.user.uti_id || req.user.util_id || req.user.utilisateur_id || req.user.id;

      if (curId === targetId) {
        return res.status(400).json({
          success: false,
          message: 'Vous ne pouvez pas supprimer votre propre compte administrateur.',
        });
      }

      const deleted = await UserModel.delete(targetId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur introuvable.',
        });
      }

      return res.json({
        success: true,
        message: 'Utilisateur supprimé avec succès.',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de l\'utilisateur.',
        error: error.message,
      });
    }
  },

  // Récupérer la liste des élèves
  async getPupils(req, res) {
    try {
      const pupils = await UserModel.findPupils();
      return res.json({
        success: true,
        count: pupils.length,
        eleves: pupils,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des élèves.',
        error: error.message,
      });
    }
  },

  // Récupérer la liste des étudiants
  async getStudents(req, res) {
    try {
      const students = await UserModel.findStudents();
      return res.json({
        success: true,
        count: students.length,
        etudiants: students,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des étudiants.',
        error: error.message,
      });
    }
  },

  // Récupérer la liste des personnes en recherche d'emploi / reconversion
  async getEmplois(req, res) {
    try {
      const emplois = await UserModel.findEmplois();
      return res.json({
        success: true,
        count: emplois.length,
        emplois,
        reconversion: emplois,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des profils emploi.',
        error: error.message,
      });
    }
  },

  // Alias pour rétrocompatibilité
  async getReconversions(req, res) {
    return UserController.getEmplois(req, res);
  },

  // Statistiques globales avec répartition par type, localisation et catégorie
  async getStats(req, res) {
    try {
      const text = `
        SELECT 
          COUNT(*) AS total_utilisateurs,
          COUNT(*) FILTER (WHERE uti_rol = 'admin') AS total_admins,
          COUNT(*) FILTER (WHERE uti_rol = 'eleve') AS total_eleves,
          COUNT(*) FILTER (WHERE uti_rol = 'etudiant') AS total_etudiants,
          COUNT(*) FILTER (WHERE uti_rol IN ('rechercher emploi', 'emploi', 'reconversion')) AS total_rechercher_emploi,
          COUNT(*) FILTER (WHERE uti_rol IN ('rechercher emploi', 'emploi', 'reconversion')) AS total_emploi,
          COUNT(*) FILTER (WHERE uti_rol IN ('rechercher emploi', 'emploi', 'reconversion')) AS total_reconversion,
          COUNT(*) FILTER (WHERE uti_sta = 'actif') AS total_actifs,
          COUNT(*) FILTER (WHERE uti_sta = 'suspendu') AS total_suspendus
        FROM utilisateur
      `;
      const result = await query(text);

      // Récupération de tous les utilisateurs avec leurs profils et résultats de tests pour l'histogramme détaillé
      const detailedUsersRes = await query(`
        SELECT 
          u.uti_id, u.uti_nom, u.uti_pre, u.uti_rol, u.uti_adr, 
          pe.ele_ser, pe.ele_cla, pe.ele_eta, 
          pet.etu_fil, pet.etu_niv_etu, pet.etu_eta, 
          pem.emp_met_act, pem.emp_sit_act,
          r1.rep_resultat AS ori_pro_1,
          r1.rep_detail AS det_1
        FROM utilisateur u 
        LEFT JOIN profil_eleve pe ON u.uti_id = pe.ele_uti_id 
        LEFT JOIN profil_etudiant pet ON u.uti_id = pet.etu_uti_id 
        LEFT JOIN profil_emploi pem ON u.uti_id = pem.emp_uti_id
        LEFT JOIN reponse r1 ON u.uti_id = r1.rep_uti_id AND r1.rep_test_num = 1
      `);

      const users = detailedUsersRes.rows || [];

      const breakdown_type = {
        eleve: 0,
        etudiant: 0,
        rechercher_emploi: 0,
        emploi: 0,
      };

      const breakdown_location = {
        'Antananarivo (Analamanga)': 0,
        'Fianarantsoa (Matsiatra)': 0,
        'Toamasina (Atsinanana)': 0,
        'Mahajanga (Boeny)': 0,
        'Toliara (Atsimo-Andrefana)': 0,
        'Antsiranana (Diana)': 0,
        'Autres Régions': 0,
      };

      // 6 Catégories d'orientation professionnelle et d'emploi basées sur le test de personnalité
      const breakdown_orientation = {
        'Numérique, Technologies & Data': 0,
        'Commerce, Vente & Entrepreneuriat': 0,
        'Organisation, Gestion & Projets': 0,
        'Impact Social & Environnement': 0,
        'Ressources Humaines & Formation': 0,
        'Opérations Terrain & Logistique': 0,
      };

      users.forEach((u) => {
        // Type
        const role = (u.uti_rol || '').toLowerCase();
        if (role === 'eleve') breakdown_type.eleve++;
        else if (role === 'etudiant') breakdown_type.etudiant++;
        else if (role === 'rechercher emploi' || role === 'emploi' || role === 'reconversion') {
          breakdown_type.rechercher_emploi++;
          breakdown_type.emploi++;
        }
        // Note: l'administrateur n'est pas intégré dans cet histogramme selon la demande de l'utilisateur

        // Localisation
        const adr = (u.uti_adr || '').toLowerCase();
        const eta = ((u.ele_eta || '') + ' ' + (u.etu_eta || '')).toLowerCase();
        if (adr.includes('ankofafa') || adr.includes('fianar') || eta.includes('jesoa')) {
          breakdown_location['Fianarantsoa (Matsiatra)']++;
        } else if (adr.includes('tamatave') || adr.includes('toamasina') || eta.includes('toamasina')) {
          breakdown_location['Toamasina (Atsinanana)']++;
        } else if (adr.includes('majunga') || adr.includes('mahajanga')) {
          breakdown_location['Mahajanga (Boeny)']++;
        } else if (adr.includes('toliara') || adr.includes('tulear')) {
          breakdown_location['Toliara (Atsimo-Andrefana)']++;
        } else if (adr.includes('antsiranana') || adr.includes('diego')) {
          breakdown_location['Antsiranana (Diana)']++;
        } else if (
          adr.includes('antananarivo') ||
          adr.includes('tana') ||
          adr.includes('itaosy') ||
          adr.includes('ankatso') ||
          adr.includes('ambonivato') ||
          adr.includes('sabotsy') ||
          adr.includes('antanimena') ||
          adr.includes('ankadilalana') ||
          eta.includes('rabearivelo') ||
          eta.includes('michel') ||
          eta.includes('ankatso')
        ) {
          breakdown_location['Antananarivo (Analamanga)']++;
        } else {
          breakdown_location['Autres Régions']++;
        }

        // Orientation issue du test de personnalité (6 catégories d'emploi / métiers)
        const signals = [
          u.ori_pro_1,
          u.det_1?.dominant,
          u.det_1?.dominantLabel,
          u.ele_ser,
          u.etu_fil,
          u.emp_met_act,
          u.uti_rol,
        ].filter(Boolean).map(s => String(s).toLowerCase()).join(' ');

        if (
          signals.includes('tech_numerique') ||
          signals.includes('tech_ingenierie') ||
          signals.includes('sciences_tech') ||
          signals.includes('numérique') ||
          signals.includes('numerique') ||
          signals.includes('bâtisseur') ||
          signals.includes('ingénieur') ||
          signals.includes('ingenieur') ||
          signals.includes('informatique') ||
          signals.includes('sciences & technologies') ||
          signals.includes('sciences exactes') ||
          signals.includes('réfléchi') ||
          signals.includes('reflechi')
        ) {
          breakdown_orientation['Numérique, Technologies & Data']++;
        } else if (
          signals.includes('entrepreneuriat') ||
          signals.includes('commerce') ||
          signals.includes('comm_marketing') ||
          signals.includes('entreprenant') ||
          signals.includes('leader') ||
          signals.includes('marketing') ||
          signals.includes('vente') ||
          signals.includes('indépendant')
        ) {
          breakdown_orientation['Commerce, Vente & Entrepreneuriat']++;
        } else if (
          signals.includes('management_conseil') ||
          signals.includes('analytique_finance') ||
          signals.includes('organisation') ||
          signals.includes('gestion de projet') ||
          signals.includes('stratège') ||
          signals.includes('finance') ||
          signals.includes('audit') ||
          signals.includes('admin')
        ) {
          breakdown_orientation['Organisation, Gestion & Projets']++;
        } else if (
          signals.includes('impact_vert_rse') ||
          signals.includes('nature_agri') ||
          signals.includes('impact_societe_durable') ||
          signals.includes('développement durable') ||
          signals.includes('developpement durable') ||
          signals.includes('écologie') ||
          signals.includes('ecologie') ||
          signals.includes('observateur') ||
          signals.includes('nature') ||
          signals.includes('environnement') ||
          signals.includes('agri') ||
          signals.includes('agro')
        ) {
          breakdown_orientation['Impact Social & Environnement']++;
        } else if (
          signals.includes('formation_rh_humain') ||
          signals.includes('management_rh') ||
          signals.includes('sante_social') ||
          signals.includes('lettres_comm') ||
          signals.includes('ressources humaines') ||
          signals.includes('rh') ||
          signals.includes('bienveillant') ||
          signals.includes('altruiste') ||
          signals.includes('protecteur') ||
          signals.includes('éloquent') ||
          signals.includes('formation') ||
          signals.includes('social') ||
          signals.includes('santé') ||
          signals.includes('sante')
        ) {
          breakdown_orientation['Ressources Humaines & Formation']++;
        } else if (
          signals.includes('expertise_terrain_qualite') ||
          signals.includes('logistique') ||
          signals.includes('opérations') ||
          signals.includes('operations') ||
          signals.includes('qualité') ||
          signals.includes('qualite') ||
          signals.includes('terrain') ||
          signals.includes('supply')
        ) {
          breakdown_orientation['Opérations Terrain & Logistique']++;
        } else {
          breakdown_orientation['Numérique, Technologies & Data']++;
        }
      });

      return res.json({
        success: true,
        stats: {
          ...result.rows[0],
          breakdown_type,
          breakdown_location,
          breakdown_orientation,
          breakdown_category: breakdown_orientation,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques.',
        error: error.message,
      });
    }
  },

  // 9. Enregistrement du Test 1 Élève : Centres d'Intérêt & Passions + Personnalité -> Trait de Caractère
  async submitEleveInterestsTest(req, res) {
    try {
      const curId = req.user.uti_id || req.user.util_id || req.user.id;
      const { centres_interet, orientation_provisoire_1, details, answers } = req.body;

      const evalRes = evaluateTest('eleve', 1, details?.answers || details || answers || {}, centres_interet);
      const finalOriPro = evalRes.resultat || orientation_provisoire_1;
      const ptsSci = evalRes.ptsSci;
      const ptsLit = evalRes.ptsLit;

      const { fac_id, ent_id, met_id } = await getAttributionIds({
        testType: 'eleve_1',
        dominantCode: evalRes.dominantCode,
        reqFacId: req.body.fac_id,
        reqEntId: req.body.ent_id,
        reqMetId: req.body.met_id,
      });

      const repDetails = sanitizeNoIcons({
        ...(details || {}),
        evaluation: evalRes.details,
      });

      await UserModel.saveEleveInterestsTest(curId, {
        ele_cen_int: centres_interet,
        ele_ori_pro_1: finalOriPro,
        ele_det_int: repDetails,
        pts_sci: ptsSci,
        pts_lit: ptsLit,
        fac_id,
        ent_id,
        met_id,
      });

      const updatedUser = await UserModel.findById(curId);

      return res.json({
        success: true,
        message: 'Test des centres d\'intérêt et de personnalité validé avec succès !',
        pts_sci: ptsSci,
        pts_lit: ptsLit,
        fac_id,
        ent_id,
        met_id,
        orientation_provisoire_1: finalOriPro,
        user: updatedUser,
      });
    } catch (error) {
      console.error('Erreur submitEleveInterestsTest :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'enregistrement du test.',
        error: error.message,
      });
    }
  },

  // 10. Enregistrement du Test 2 Élève : Questionnaire des Matières & Aptitudes -> Filière & Série Bac
  async submitEleveMatieresTest(req, res) {
    try {
      const curId = req.user.uti_id || req.user.util_id || req.user.id;
      const { matieres_preferees, orientation_provisoire_2, details, answers } = req.body;

      const evalRes = evaluateTest('eleve', 2, details || answers || {}, matieres_preferees);
      const finalOriPro = evalRes.resultat || orientation_provisoire_2;
      const ptsSci = evalRes.ptsSci;
      const ptsLit = evalRes.ptsLit;

      const { fac_id, ent_id, met_id } = await getAttributionIds({
        testType: 'eleve_2',
        dominantCode: evalRes.dominantCode,
        reqFacId: req.body.fac_id,
        reqEntId: req.body.ent_id,
        reqMetId: req.body.met_id,
      });

      const repDetails = sanitizeNoIcons({
        ...(details || {}),
        evaluation: evalRes.details,
      });

      await UserModel.saveEleveMatieresTest(curId, {
        ele_mat_pre: matieres_preferees,
        ele_ori_pro_2: finalOriPro,
        ele_det_mat: repDetails,
        pts_sci: ptsSci,
        pts_lit: ptsLit,
        fac_id,
        ent_id,
        met_id,
      });

      const updatedUser = await UserModel.findById(curId);

      return res.json({
        success: true,
        message: 'Questionnaire des matières et aptitudes validé avec succès !',
        pts_sci: ptsSci,
        pts_lit: ptsLit,
        fac_id,
        ent_id,
        met_id,
        orientation_provisoire_2: finalOriPro,
        user: updatedUser,
      });
    } catch (error) {
      console.error('Erreur submitEleveMatieresTest :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'enregistrement du questionnaire.',
        error: error.message,
      });
    }
  },

  // 11. Enregistrement du Test 1 Étudiant : Personnalité Professionnelle & Affinités
  async submitEtudiantInterestsTest(req, res) {
    try {
      const curId = req.user.uti_id || req.user.util_id || req.user.id;
      const { centres_interet, orientation_provisoire_1, details, answers } = req.body;

      const evalRes = evaluateTest('etudiant', 1, details?.answers || details || answers || {}, centres_interet);
      const finalOriPro = evalRes.resultat || orientation_provisoire_1;
      const ptsSci = evalRes.ptsSci;
      const ptsLit = evalRes.ptsLit;

      const { fac_id, ent_id, met_id } = await getAttributionIds({
        testType: 'etudiant_1',
        dominantCode: evalRes.dominantCode,
        reqFacId: req.body.fac_id,
        reqEntId: req.body.ent_id,
        reqMetId: req.body.met_id,
      });

      const repDetails = sanitizeNoIcons({
        ...(details || {}),
        evaluation: evalRes.details,
      });

      await UserModel.saveStudentInterestsTest(curId, {
        etu_cen_int: centres_interet,
        etu_ori_pro_1: finalOriPro,
        etu_det_int: repDetails,
        pts_sci: ptsSci,
        pts_lit: ptsLit,
        fac_id,
        ent_id,
        met_id,
      });

      const updatedUser = await UserModel.findById(curId);

      return res.json({
        success: true,
        message: 'Test de personnalité professionnelle et d\'affinités validé avec succès !',
        pts_sci: ptsSci,
        pts_lit: ptsLit,
        fac_id,
        ent_id,
        met_id,
        orientation_provisoire_1: finalOriPro,
        user: updatedUser,
      });
    } catch (error) {
      console.error('Erreur submitEtudiantInterestsTest :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'enregistrement du test étudiant.',
        error: error.message,
      });
    }
  },

  // 12. Enregistrement du Test 2 Étudiant : Domaines d'Excellence & Aptitudes Opérationnelles
  async submitEtudiantCompetencesTest(req, res) {
    try {
      const curId = req.user.uti_id || req.user.util_id || req.user.id;
      const competences_cles = req.body.competences_cles || req.body.competences;
      const { orientation_provisoire_2, details, answers } = req.body;

      const evalRes = evaluateTest('etudiant', 2, details || answers || {}, competences_cles);
      const finalOriPro = evalRes.resultat || orientation_provisoire_2;
      const ptsSci = evalRes.ptsSci;
      const ptsLit = evalRes.ptsLit;

      const { fac_id, ent_id, met_id } = await getAttributionIds({
        testType: 'etudiant_2',
        dominantCode: evalRes.dominantCode,
        reqFacId: req.body.fac_id,
        reqEntId: req.body.ent_id,
        reqMetId: req.body.met_id,
      });

      const repDetails = sanitizeNoIcons({
        ...(details || {}),
        evaluation: evalRes.details,
      });

      await UserModel.saveStudentSkillsTest(curId, {
        etu_com: competences_cles,
        etu_ori_pro_2: finalOriPro,
        etu_det_com: repDetails,
        pts_sci: ptsSci,
        pts_lit: ptsLit,
        fac_id,
        ent_id,
        met_id,
      });

      const updatedUser = await UserModel.findById(curId);

      return res.json({
        success: true,
        message: 'Test de spécialisation et d\'aptitudes opérationnelles validé avec succès !',
        pts_sci: ptsSci,
        pts_lit: ptsLit,
        fac_id,
        ent_id,
        met_id,
        orientation_provisoire_2: finalOriPro,
        user: updatedUser,
      });
    } catch (error) {
      console.error('Erreur submitEtudiantCompetencesTest :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'enregistrement du test de compétences.',
        error: error.message,
      });
    }
  },

  // 13. Enregistrement du Test 1 Emploi / Reconversion : Moteurs de Transition & Typologie
  async submitEmploiInterestsTest(req, res) {
    try {
      const curId = req.user.uti_id || req.user.util_id || req.user.id;
      const { 
        motivations_cles, 
        motivation_changement, 
        emp_mot_cha,
        rec_mot_cha,
        orientation_provisoire_1, 
        emp_ori_pro_1,
        rec_ori_pro_1,
        details,
        answers
      } = req.body;
      const motVal = emp_mot_cha || rec_mot_cha || motivations_cles || motivation_changement;
      const ori1Val = emp_ori_pro_1 || rec_ori_pro_1 || orientation_provisoire_1;

      const evalRes = evaluateTest('emploi', 1, details?.answers || details || answers || {}, motVal);
      const finalOriPro = evalRes.resultat || ori1Val;
      const ptsSci = evalRes.ptsSci;
      const ptsLit = evalRes.ptsLit;

      const { fac_id, ent_id, met_id } = await getAttributionIds({
        testType: 'emploi_1',
        dominantCode: evalRes.dominantCode,
        reqFacId: req.body.fac_id,
        reqEntId: req.body.ent_id,
        reqMetId: req.body.met_id,
      });

      const repDetails = sanitizeNoIcons({
        ...(details || {}),
        evaluation: evalRes.details,
      });

      await UserModel.saveEmploiInterestsTest(curId, {
        emp_mot_cha: motVal,
        emp_ori_pro_1: finalOriPro,
        emp_det_mot: repDetails,
        pts_sci: ptsSci,
        pts_lit: ptsLit,
        fac_id,
        ent_id,
        met_id,
      });

      const updatedUser = await UserModel.findById(curId);

      return res.json({
        success: true,
        message: 'Test des moteurs d\'emploi et de transition validé avec succès !',
        pts_sci: ptsSci,
        pts_lit: ptsLit,
        fac_id,
        ent_id,
        met_id,
        orientation_provisoire_1: finalOriPro,
        emp_ori_pro_1: finalOriPro,
        user: updatedUser,
      });
    } catch (error) {
      console.error('Erreur submitEmploiInterestsTest :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'enregistrement du test emploi.',
        error: error.message,
      });
    }
  },

  async submitReconversionInterestsTest(req, res) {
    return UserController.submitEmploiInterestsTest(req, res);
  },

  // 14. Enregistrement du Test 2 Emploi / Reconversion : Compétences Transférables & Pôle Cible
  async submitEmploiCompetencesTest(req, res) {
    try {
      const curId = req.user.uti_id || req.user.util_id || req.user.id;
      const { 
        secteurs_cibles, 
        competences_transferables, 
        emp_sec_cib,
        rec_sec_cib,
        orientation_provisoire_2, 
        emp_ori_pro_2,
        rec_ori_pro_2,
        details,
        answers 
      } = req.body;
      const cibVal = emp_sec_cib || rec_sec_cib || secteurs_cibles || competences_transferables;
      const ori2Val = emp_ori_pro_2 || rec_ori_pro_2 || orientation_provisoire_2;

      const evalRes = evaluateTest('emploi', 2, details || answers || {}, cibVal);
      const finalOriPro = evalRes.resultat || ori2Val;
      const ptsSci = evalRes.ptsSci;
      const ptsLit = evalRes.ptsLit;

      const { fac_id, ent_id, met_id } = await getAttributionIds({
        testType: 'emploi_2',
        dominantCode: evalRes.dominantCode,
        reqFacId: req.body.fac_id,
        reqEntId: req.body.ent_id,
        reqMetId: req.body.met_id,
      });

      const repDetails = sanitizeNoIcons({
        ...(details || {}),
        evaluation: evalRes.details,
      });

      await UserModel.saveEmploiSkillsTest(curId, {
        emp_sec_cib: cibVal,
        emp_ori_pro_2: finalOriPro,
        emp_det_tra: repDetails,
        pts_sci: ptsSci,
        pts_lit: ptsLit,
        fac_id,
        ent_id,
        met_id,
      });

      const updatedUser = await UserModel.findById(curId);

      return res.json({
        success: true,
        message: 'Test des compétences professionnelles et pôle cible validé avec succès !',
        pts_sci: ptsSci,
        pts_lit: ptsLit,
        fac_id,
        ent_id,
        met_id,
        orientation_provisoire_2: finalOriPro,
        emp_ori_pro_2: finalOriPro,
        user: updatedUser,
      });
    } catch (error) {
      console.error('Erreur submitEmploiCompetencesTest :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'enregistrement du test de compétences professionnelles.',
        error: error.message,
      });
    }
  },

  async submitReconversionCompetencesTest(req, res) {
    return UserController.submitEmploiCompetencesTest(req, res);
  },

  // 11. Enregistrement / mise à jour de l'Analyse Facebook (Pages & Reels)
  async saveEleveFacebookAnalysis(req, res) {
    try {
      const curId = req.user.uti_id || req.user.util_id || req.user.id;
      const { fbAnalysis } = req.body;

      if (!fbAnalysis) {
        return res.status(400).json({
          success: false,
          message: 'Données de l\'analyse Facebook manquantes.',
        });
      }

      await UserModel.saveEleveFacebookAnalysis(curId, fbAnalysis);
      const updatedUser = await UserModel.findById(curId);

      return res.json({
        success: true,
        message: 'Analyse Facebook enregistrée avec succès !',
        user: updatedUser,
        fbAnalysis,
      });
    } catch (error) {
      console.error('Erreur saveEleveFacebookAnalysis :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'enregistrement de l\'analyse Facebook.',
        error: error.message,
      });
    }
  },

  // 12. Enregistrement / mise à jour de l'Emploi du temps dans la table dédiée (format épuré : tâches par tranches 1..16)
  async saveEleveRevisionSchedule(req, res) {
    try {
      const curId = req.user.uti_id || req.user.util_id || req.user.id;
      const { edtData } = req.body;

      if (!edtData) {
        return res.status(400).json({
          success: false,
          message: 'Données de l\'emploi du temps manquantes.',
        });
      }

      // Extraction et normalisation des tâches épurées numérotées par tranche (1 à 16)
      const cleanTasks = {};
      let filledHours = 0;
      const SCHEDULE_DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
      const sourceData = edtData.weeklyGrid || edtData.tasks || edtData;

      SCHEDULE_DAYS.forEach((day) => {
        const daySlots = sourceData[day];
        if (daySlots && typeof daySlots === 'object') {
          const dayResult = {};
          Object.entries(daySlots).forEach(([key, val]) => {
            const task = (typeof val === 'string' ? val : '').trim();
            if (task && task.toLowerCase() !== 'libre' && task.toLowerCase() !== 'repos') {
              filledHours++;
              // Clé déjà numérique (1..16)
              if (!isNaN(parseInt(key, 10))) {
                dayResult[parseInt(key, 10).toString()] = task;
              } else {
                // Clé texte d'heure "05:00 - 06:00" -> numéro de tranche 1..16 (5h -> 1)
                const hourMatch = key.match(/^(\d{2}):/);
                if (hourMatch) {
                  const startHour = parseInt(hourMatch[1], 10);
                  const trancheNum = startHour - 4;
                  if (trancheNum >= 1 && trancheNum <= 16) {
                    dayResult[trancheNum.toString()] = task;
                  }
                }
              }
            }
          });
          if (Object.keys(dayResult).length > 0) {
            cleanTasks[day] = dayResult;
          }
        }
      });

      // Validation : minimum 5 heures de cours/tâches renseignées
      if (filledHours < 5) {
        return res.status(400).json({
          success: false,
          message: 'Vérifie l\'EDT que tu viens de soumettre car c\'est invalide',
        });
      }

      // Sauvegarde dans la table dédiée "emploi_du_temps" (liée uniquement à l'id de l'élève)
      // La BDD ne contient que les tâches par tranches numérotées (1..16)
      await EdtModel.saveUserEdt({
        edt_uti_id: curId,
        edt_don: cleanTasks,
      });

      // Synchronisation rétrocompatible dans profil_eleve.ele_edt_rev
      await UserModel.saveEleveRevisionSchedule(curId, cleanTasks);

      const updatedUser = await UserModel.findById(curId);

      return res.json({
        success: true,
        message: 'Emploi du temps enregistré avec succès dans la base de données !',
        user: updatedUser,
        edtData: cleanTasks,
      });
    } catch (error) {
      console.error('Erreur saveEleveRevisionSchedule :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'enregistrement de l\'emploi du temps.',
        error: error.message,
      });
    }
  },

  // 13. Récupérer l'emploi du temps unifié de l'élève
  async getEleveRevisionSchedule(req, res) {
    try {
      const curId = req.user.uti_id || req.user.util_id || req.user.id;
      const record = await EdtModel.getByUserId(curId);
      return res.json({
        success: true,
        edt: record ? record.edt_don : null,
        record,
      });
    } catch (error) {
      console.error('Erreur getEleveRevisionSchedule :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'emploi du temps.',
        error: error.message,
      });
    }
  },
};

module.exports = UserController;
