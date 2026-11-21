const { query } = require('../config/db');
const { getCaracteristiques } = require('../data/testsConstantData');

// Expression régulière pour garantir 0 icône en base de données
const EMOJI_REGEX = /([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|[\uFE00-\uFE0F]|[\u200D]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]|\uD83E[\uDD00-\uDDFF\uDE00-\uDEFF\uDF00-\uDFFF])/gu;

function sanitizeNoIcons(val) {
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
}

// Helper pour enrichir le profil avec les tests tout en maintenant la séparation stricte en BDD
function formatUserOutput(user) {
  if (!user) return null;

  // Harmonisation de test1
  if (user.test1) {
    user.test1.orientation_provisoire_1 = user.test1.rep_resultat;
    user.test1.ele_ori_pro_1 = user.test1.rep_resultat;
    user.test1.etu_ori_pro_1 = user.test1.rep_resultat;
    user.test1.emp_ori_pro_1 = user.test1.rep_resultat;
    user.test1.rec_ori_pro_1 = user.test1.rep_resultat;
    user.test1.pts_sci = user.test1.rep_pt_sci || 0;
    user.test1.pts_lit = user.test1.rep_pt_lit || 0;
    user.test1.fac_id = user.test1.rep_fac_id;
    user.test1.ent_id = user.test1.rep_ent_id;
    user.test1.met_id = user.test1.rep_met_id;

    if (!user.test1.caracteristique) {
      const allCars = getCaracteristiques(user.uti_rol, 1);
      const found = allCars.find(c => c.nom === user.test1.rep_resultat || c.short_nom === user.test1.rep_resultat);
      user.test1.caracteristique = found || allCars[0] || null;
    }
  }

  // Harmonisation de test2
  if (user.test2) {
    user.test2.orientation_provisoire_2 = user.test2.rep_resultat;
    user.test2.ele_ori_pro_2 = user.test2.rep_resultat;
    user.test2.etu_ori_pro_2 = user.test2.rep_resultat;
    user.test2.emp_ori_pro_2 = user.test2.rep_resultat;
    user.test2.rec_ori_pro_2 = user.test2.rep_resultat;
    user.test2.pts_sci = user.test2.rep_pt_sci || 0;
    user.test2.pts_lit = user.test2.rep_pt_lit || 0;
    user.test2.fac_id = user.test2.rep_fac_id;
    user.test2.ent_id = user.test2.rep_ent_id;
    user.test2.met_id = user.test2.rep_met_id;

    if (!user.test2.caracteristique) {
      const allCars2 = getCaracteristiques(user.uti_rol, 2);
      const found2 = allCars2.find(c => c.nom === user.test2.rep_resultat || c.short_nom === user.test2.rep_resultat);
      user.test2.caracteristique = found2 || allCars2[0] || null;
    }
  }

  if (user.tests && user.profil) {
    user.profil = { ...user.tests, ...user.profil };
  }
  return user;
}

const UserModel = {
  // Trouver un utilisateur par son email
  async findByEmail(email) {
    const text = `
      SELECT u.*, 
        CASE 
          WHEN u.uti_rol = 'eleve' THEN to_jsonb(pel)
          WHEN u.uti_rol = 'etudiant' THEN to_jsonb(pet)
          WHEN u.uti_rol IN ('rechercher emploi', 'emploi', 'reconversion') THEN (
            to_jsonb(pe) || jsonb_build_object(
              'rec_id', pe.emp_id,
              'rec_uti_id', pe.emp_uti_id,
              'rec_sit_act', pe.emp_sit_act,
              'rec_met_act', pe.emp_met_act,
              'rec_dat_cre', pe.emp_dat_cre,
              'rec_dat_mod', pe.emp_dat_mod
            )
          )
          ELSE NULL 
        END AS profil,
        CASE
          WHEN r1.rep_id IS NOT NULL THEN (
            to_jsonb(r1) || jsonb_build_object(
              'rep_fac_id', rec1.rec_liste_fac_id[1],
              'rep_ent_id', rec1.rec_liste_ent_id[1],
              'rep_met_id', rec1.rec_liste_met_id[1],
              'rec_liste_fac_id', COALESCE(rec1.rec_liste_fac_id, '{}'::integer[]),
              'rec_liste_ent_id', COALESCE(rec1.rec_liste_ent_id, '{}'::integer[]),
              'rec_liste_met_id', COALESCE(rec1.rec_liste_met_id, '{}'::integer[]),
              'faculte', to_jsonb(f1),
              'entreprise', to_jsonb(e1),
              'metier', to_jsonb(m1)
            )
          )
          ELSE NULL
        END AS test1,
        CASE
          WHEN r2.rep_id IS NOT NULL THEN (
            to_jsonb(r2) || jsonb_build_object(
              'rep_fac_id', rec2.rec_liste_fac_id[1],
              'rep_ent_id', rec2.rec_liste_ent_id[1],
              'rep_met_id', rec2.rec_liste_met_id[1],
              'rec_liste_fac_id', COALESCE(rec2.rec_liste_fac_id, '{}'::integer[]),
              'rec_liste_ent_id', COALESCE(rec2.rec_liste_ent_id, '{}'::integer[]),
              'rec_liste_met_id', COALESCE(rec2.rec_liste_met_id, '{}'::integer[]),
              'faculte', to_jsonb(f2),
              'entreprise', to_jsonb(e2),
              'metier', to_jsonb(m2)
            )
          )
          ELSE NULL
        END AS test2,
        CASE
          WHEN u.uti_rol = 'eleve' THEN to_jsonb(tel)
          WHEN u.uti_rol = 'etudiant' THEN to_jsonb(tet)
          WHEN u.uti_rol IN ('rechercher emploi', 'emploi', 'reconversion') THEN to_jsonb(tem)
          ELSE NULL
        END AS tests,
        to_jsonb(pedt) AS edt
      FROM utilisateur u
      LEFT JOIN profil_eleve pel ON u.uti_id = pel.ele_uti_id AND u.uti_rol = 'eleve'
      LEFT JOIN profil_etudiant pet ON u.uti_id = pet.etu_uti_id AND u.uti_rol = 'etudiant'
      LEFT JOIN profil_emploi pe ON u.uti_id = pe.emp_uti_id AND u.uti_rol IN ('rechercher emploi', 'emploi', 'reconversion')
      LEFT JOIN reponse r1 ON u.uti_id = r1.rep_uti_id AND r1.rep_test_num = 1
      LEFT JOIN reponse r2 ON u.uti_id = r2.rep_uti_id AND r2.rep_test_num = 2
      LEFT JOIN liste_recommandation rec1 ON r1.rep_rec_id = rec1.rec_id
      LEFT JOIN liste_recommandation rec2 ON r2.rep_rec_id = rec2.rec_id
      LEFT JOIN faculte f1 ON rec1.rec_liste_fac_id[1] = f1.fac_id
      LEFT JOIN entreprise e1 ON rec1.rec_liste_ent_id[1] = e1.ent_id
      LEFT JOIN metier m1 ON rec1.rec_liste_met_id[1] = m1.met_id
      LEFT JOIN faculte f2 ON rec2.rec_liste_fac_id[1] = f2.fac_id
      LEFT JOIN entreprise e2 ON rec2.rec_liste_ent_id[1] = e2.ent_id
      LEFT JOIN metier m2 ON rec2.rec_liste_met_id[1] = m2.met_id
      LEFT JOIN tests_eleves tel ON u.uti_id = tel.tel_uti_id AND u.uti_rol = 'eleve'
      LEFT JOIN tests_etudiants tet ON u.uti_id = tet.tet_uti_id AND u.uti_rol = 'etudiant'
      LEFT JOIN tests_emploi tem ON u.uti_id = tem.tem_uti_id AND u.uti_rol IN ('rechercher emploi', 'emploi', 'reconversion')
      LEFT JOIN emploi_du_temps pedt ON u.uti_id = pedt.edt_uti_id
      WHERE LOWER(u.uti_ema) = LOWER($1)
    `;
    const res = await query(text, [email]);
    return formatUserOutput(res.rows[0]);
  },

  // Trouver un utilisateur par son ID (sans mot de passe)
  async findById(id) {
    const text = `
      SELECT 
        u.uti_id, u.uti_nom, u.uti_pre, u.uti_ema, 
        u.uti_rol, u.uti_tel, u.uti_adr, u.uti_ava, u.uti_sta,
        u.uti_dat_cre, u.uti_dat_mod,
        CASE 
          WHEN u.uti_rol = 'eleve' THEN to_jsonb(pel)
          WHEN u.uti_rol = 'etudiant' THEN to_jsonb(pet)
          WHEN u.uti_rol IN ('rechercher emploi', 'emploi', 'reconversion') THEN (
            to_jsonb(pe) || jsonb_build_object(
              'rec_id', pe.emp_id,
              'rec_uti_id', pe.emp_uti_id,
              'rec_sit_act', pe.emp_sit_act,
              'rec_met_act', pe.emp_met_act,
              'rec_dat_cre', pe.emp_dat_cre,
              'rec_dat_mod', pe.emp_dat_mod
            )
          )
          ELSE NULL 
        END AS profil,
        CASE
          WHEN r1.rep_id IS NOT NULL THEN (
            to_jsonb(r1) || jsonb_build_object(
              'rep_fac_id', rec1.rec_liste_fac_id[1],
              'rep_ent_id', rec1.rec_liste_ent_id[1],
              'rep_met_id', rec1.rec_liste_met_id[1],
              'rec_liste_fac_id', COALESCE(rec1.rec_liste_fac_id, '{}'::integer[]),
              'rec_liste_ent_id', COALESCE(rec1.rec_liste_ent_id, '{}'::integer[]),
              'rec_liste_met_id', COALESCE(rec1.rec_liste_met_id, '{}'::integer[]),
              'faculte', to_jsonb(f1),
              'entreprise', to_jsonb(e1),
              'metier', to_jsonb(m1)
            )
          )
          ELSE NULL
        END AS test1,
        CASE
          WHEN r2.rep_id IS NOT NULL THEN (
            to_jsonb(r2) || jsonb_build_object(
              'rep_fac_id', rec2.rec_liste_fac_id[1],
              'rep_ent_id', rec2.rec_liste_ent_id[1],
              'rep_met_id', rec2.rec_liste_met_id[1],
              'rec_liste_fac_id', COALESCE(rec2.rec_liste_fac_id, '{}'::integer[]),
              'rec_liste_ent_id', COALESCE(rec2.rec_liste_ent_id, '{}'::integer[]),
              'rec_liste_met_id', COALESCE(rec2.rec_liste_met_id, '{}'::integer[]),
              'faculte', to_jsonb(f2),
              'entreprise', to_jsonb(e2),
              'metier', to_jsonb(m2)
            )
          )
          ELSE NULL
        END AS test2,
        CASE
          WHEN u.uti_rol = 'eleve' THEN to_jsonb(tel)
          WHEN u.uti_rol = 'etudiant' THEN to_jsonb(tet)
          WHEN u.uti_rol IN ('rechercher emploi', 'emploi', 'reconversion') THEN to_jsonb(tem)
          ELSE NULL
        END AS tests,
        to_jsonb(pedt) AS edt
      FROM utilisateur u
      LEFT JOIN profil_eleve pel ON u.uti_id = pel.ele_uti_id AND u.uti_rol = 'eleve'
      LEFT JOIN profil_etudiant pet ON u.uti_id = pet.etu_uti_id AND u.uti_rol = 'etudiant'
      LEFT JOIN profil_emploi pe ON u.uti_id = pe.emp_uti_id AND u.uti_rol IN ('rechercher emploi', 'emploi', 'reconversion')
      LEFT JOIN reponse r1 ON u.uti_id = r1.rep_uti_id AND r1.rep_test_num = 1
      LEFT JOIN reponse r2 ON u.uti_id = r2.rep_uti_id AND r2.rep_test_num = 2
      LEFT JOIN liste_recommandation rec1 ON r1.rep_rec_id = rec1.rec_id
      LEFT JOIN liste_recommandation rec2 ON r2.rep_rec_id = rec2.rec_id
      LEFT JOIN faculte f1 ON rec1.rec_liste_fac_id[1] = f1.fac_id
      LEFT JOIN entreprise e1 ON rec1.rec_liste_ent_id[1] = e1.ent_id
      LEFT JOIN metier m1 ON rec1.rec_liste_met_id[1] = m1.met_id
      LEFT JOIN faculte f2 ON rec2.rec_liste_fac_id[1] = f2.fac_id
      LEFT JOIN entreprise e2 ON rec2.rec_liste_ent_id[1] = e2.ent_id
      LEFT JOIN metier m2 ON rec2.rec_liste_met_id[1] = m2.met_id
      LEFT JOIN tests_eleves tel ON u.uti_id = tel.tel_uti_id AND u.uti_rol = 'eleve'
      LEFT JOIN tests_etudiants tet ON u.uti_id = tet.tet_uti_id AND u.uti_rol = 'etudiant'
      LEFT JOIN tests_emploi tem ON u.uti_id = tem.tem_uti_id AND u.uti_rol IN ('rechercher emploi', 'emploi', 'reconversion')
      LEFT JOIN emploi_du_temps pedt ON u.uti_id = pedt.edt_uti_id
      WHERE u.uti_id = $1
    `;
    const res = await query(text, [id]);
    return formatUserOutput(res.rows[0]);
  },

  // Créer un utilisateur dans la table 'utilisateur'
  async create({
    uti_nom,
    uti_pre,
    uti_ema,
    uti_pas,
    uti_rol,
    uti_tel = null,
    uti_adr = null,
    uti_ava = null,
    uti_sta = 'actif',
  }) {
    const text = `
      INSERT INTO utilisateur (
        uti_nom, uti_pre, uti_ema, 
        uti_pas, uti_rol, uti_tel, uti_adr,
        uti_ava, uti_sta
      )
      VALUES (UPPER($1), $2, LOWER($3), $4, $5, $6, $7, $8, $9)
      RETURNING uti_id, uti_nom, uti_pre, uti_ema, 
                uti_rol, uti_tel, uti_adr, uti_ava, uti_sta, 
                uti_dat_cre, uti_dat_mod
    `;
    const values = [
      uti_nom,
      uti_pre,
      uti_ema,
      uti_pas,
      uti_rol,
      uti_tel,
      uti_adr,
      uti_ava,
      uti_sta,
    ];
    const res = await query(text, values);
    return res.rows[0];
  },

  // Initialiser les tests (aucun enregistrement nécessaire au préalable, table unique 'reponses')
  async initTests(userId, role) {
    return true;
  },

  // Enregistrer ou mettre à jour un résultat de test dans la table 'reponse' + 'liste_recommandation'
  async saveTestResponse({
    rep_uti_id,
    rep_rol,
    rep_test_num,
    rep_choix = null,
    rep_resultat = null,
    rep_pt_sci = 0,
    rep_pt_lit = 0,
    rep_detail = {},
    rep_fac_id = null,
    rep_ent_id = null,
    rep_met_id = null,
    rec_liste_fac_id = null,
    rec_liste_ent_id = null,
    rec_liste_met_id = null
  }) {
    const facArr = Array.isArray(rec_liste_fac_id) ? rec_liste_fac_id : (rep_fac_id ? [Number(rep_fac_id)] : null);
    const entArr = Array.isArray(rec_liste_ent_id) ? rec_liste_ent_id : (rep_ent_id ? [Number(rep_ent_id)] : null);
    const metArr = Array.isArray(rec_liste_met_id) ? rec_liste_met_id : (rep_met_id ? [Number(rep_met_id)] : null);

    const existing = await query(
      'SELECT rep_rec_id FROM reponse WHERE rep_uti_id = $1 AND rep_rol = $2 AND rep_test_num = $3',
      [rep_uti_id, rep_rol, rep_test_num]
    );

    let rep_rec_id = existing.rows[0]?.rep_rec_id || null;
    if (facArr || entArr || metArr) {
      if (rep_rec_id) {
        await query(
          `UPDATE liste_recommandation SET
             rec_liste_fac_id = COALESCE($1, rec_liste_fac_id),
             rec_liste_ent_id = COALESCE($2, rec_liste_ent_id),
             rec_liste_met_id = COALESCE($3, rec_liste_met_id)
           WHERE rec_id = $4`,
          [facArr, entArr, metArr, rep_rec_id]
        );
      } else {
        const recIns = await query(
          `INSERT INTO liste_recommandation (rec_liste_fac_id, rec_liste_ent_id, rec_liste_met_id)
           VALUES ($1, $2, $3) RETURNING rec_id`,
          [facArr || [], entArr || [], metArr || []]
        );
        rep_rec_id = recIns.rows[0].rec_id;
      }
    }

    const text = `
      INSERT INTO reponse (
        rep_uti_id, rep_rol, rep_test_num, rep_choix, rep_resultat,
        rep_pt_sci, rep_pt_lit, rep_detail, rep_rec_id, rep_dat_mod
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
      ON CONFLICT (rep_uti_id, rep_rol, rep_test_num) DO UPDATE SET
        rep_choix = COALESCE(EXCLUDED.rep_choix, reponse.rep_choix),
        rep_resultat = COALESCE(EXCLUDED.rep_resultat, reponse.rep_resultat),
        rep_pt_sci = COALESCE(EXCLUDED.rep_pt_sci, reponse.rep_pt_sci),
        rep_pt_lit = COALESCE(EXCLUDED.rep_pt_lit, reponse.rep_pt_lit),
        rep_detail = COALESCE(EXCLUDED.rep_detail, reponse.rep_detail),
        rep_rec_id = COALESCE(EXCLUDED.rep_rec_id, reponse.rep_rec_id),
        rep_dat_mod = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const res = await query(text, [
      rep_uti_id,
      rep_rol,
      rep_test_num,
      typeof rep_choix === 'object' && rep_choix !== null ? JSON.stringify(sanitizeNoIcons(rep_choix)) : (rep_choix ? String(rep_choix) : null),
      rep_resultat,
      rep_pt_sci || 0,
      rep_pt_lit || 0,
      JSON.stringify(sanitizeNoIcons(rep_detail || {})),
      rep_rec_id
    ]);
    const saved = res.rows[0];
    if (saved) {
      saved.rep_fac_id = rep_fac_id || (facArr && facArr[0]) || null;
      saved.rep_ent_id = rep_ent_id || (entArr && entArr[0]) || null;
      saved.rep_met_id = rep_met_id || (metArr && metArr[0]) || null;
    }
    return saved;
  },

  // ========================================================
  // ÉLÈVE : Profil personnel (profil_eleve) & Tests (reponses)
  // ========================================================

  // Créer ou mettre à jour le profil personnel Élève (uniquement infos scolaires & perso)
  async createPupilProfile(ele_uti_id, profileData = {}) {
    const existing = await query('SELECT * FROM profil_eleve WHERE ele_uti_id = $1', [ele_uti_id]);
    if (existing.rows.length === 0) {
      const {
        ele_cla = null,
        ele_ser = null,
        ele_eta = null,
        ele_not_ema = true,
      } = profileData;

      const text = `
        INSERT INTO profil_eleve (
          ele_uti_id, ele_cla, ele_ser, ele_eta, ele_not_ema
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const values = [
        ele_uti_id,
        ele_cla,
        ele_ser,
        ele_eta,
        ele_not_ema !== false,
      ];
      const res = await query(text, values);
      return res.rows[0];
    } else {
      const allowedKeys = ['ele_cla', 'ele_ser', 'ele_eta', 'ele_not_ema'];
      const fields = [];
      const values = [];
      for (const key of allowedKeys) {
        if (profileData[key] !== undefined && profileData[key] !== null && profileData[key] !== '') {
          values.push(profileData[key]);
          fields.push(`${key} = $${values.length}`);
        }
      }
      if (fields.length === 0) return existing.rows[0];
      values.push(ele_uti_id);
      const text = `
        UPDATE profil_eleve
        SET ${fields.join(', ')}, ele_dat_mod = CURRENT_TIMESTAMP
        WHERE ele_uti_id = $${values.length}
        RETURNING *
      `;
      const res = await query(text, values);
      return res.rows[0];
    }
  },

  // Enregistrer le test 1 Élève dans la table unique 'reponses'
  async saveEleveInterestsTest(ele_uti_id, { ele_cen_int, ele_ori_pro_1, ele_det_int, car_id = null, pts_sci = 0, pts_lit = 0, fac_id = null, ent_id = null, met_id = null }) {
    const cenIntVal = Array.isArray(ele_cen_int) ? ele_cen_int.join(', ') : ele_cen_int;
    return this.saveTestResponse({
      rep_uti_id: ele_uti_id,
      rep_rol: 'eleve',
      rep_test_num: 1,
      rep_choix: cenIntVal,
      rep_resultat: ele_ori_pro_1,
      rep_pt_sci: pts_sci,
      rep_pt_lit: pts_lit,
      rep_detail: ele_det_int,
      rep_fac_id: fac_id,
      rep_ent_id: ent_id,
      rep_met_id: met_id,
    });
  },

  // Enregistrer le test 2 Élève dans la table unique 'reponses'
  async saveEleveMatieresTest(ele_uti_id, { ele_mat_pre, ele_ori_pro_2, ele_det_mat, car_id = null, pts_sci = 0, pts_lit = 0, fac_id = null, ent_id = null, met_id = null }) {
    const matPreVal = Array.isArray(ele_mat_pre) ? ele_mat_pre.join(', ') : ele_mat_pre;
    return this.saveTestResponse({
      rep_uti_id: ele_uti_id,
      rep_rol: 'eleve',
      rep_test_num: 2,
      rep_choix: matPreVal,
      rep_resultat: ele_ori_pro_2,
      rep_pt_sci: pts_sci,
      rep_pt_lit: pts_lit,
      rep_detail: ele_det_mat,
      rep_fac_id: fac_id,
      rep_ent_id: ent_id,
      rep_met_id: met_id,
    });
  },

  // Enregistrer l'Analyse Facebook dans les détails du test 1
  async saveEleveFacebookAnalysis(ele_uti_id, fbAnalysisData) {
    const text = `
      INSERT INTO reponse (rep_uti_id, rep_rol, rep_test_num, rep_detail, rep_dat_mod)
      VALUES ($1, 'eleve', 1, jsonb_build_object('fb_ana', $2::jsonb), CURRENT_TIMESTAMP)
      ON CONFLICT (rep_uti_id, rep_rol, rep_test_num) DO UPDATE SET
        rep_detail = COALESCE(reponse.rep_detail, '{}'::jsonb) || jsonb_build_object('fb_ana', $2::jsonb),
        rep_dat_mod = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const res = await query(text, [ele_uti_id, JSON.stringify(sanitizeNoIcons(fbAnalysisData || {}))]);
    return res.rows[0];
  },

  // Enregistrer l'Emploi du temps dans emploi_du_temps
  async saveEleveRevisionSchedule(ele_uti_id, edtData) {
    const text = `
      INSERT INTO emploi_du_temps (
        edt_uti_id, edt_don, edt_dat_mod
      )
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (edt_uti_id) DO UPDATE SET
        edt_don = EXCLUDED.edt_don,
        edt_dat_mod = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const res = await query(text, [ele_uti_id, JSON.stringify(sanitizeNoIcons(edtData || {}))]);
    return res.rows[0];
  },

  // ========================================================
  // ÉTUDIANT : Profil personnel (profil_etudiant) & Tests (reponses)
  // ========================================================

  // Créer ou mettre à jour le profil personnel Étudiant (uniquement infos universitaires & perso)
  async createStudentProfile(etu_uti_id, profileData = {}) {
    const existing = await query('SELECT * FROM profil_etudiant WHERE etu_uti_id = $1', [etu_uti_id]);
    if (existing.rows.length === 0) {
      const {
        etu_eta = null,
        etu_fil = null,
        etu_niv_etu = null,
      } = profileData;

      const text = `
        INSERT INTO profil_etudiant (
          etu_uti_id, etu_eta, etu_fil, etu_niv_etu
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const values = [
        etu_uti_id,
        etu_eta,
        etu_fil,
        etu_niv_etu,
      ];
      const res = await query(text, values);
      return res.rows[0];
    } else {
      const allowedKeys = ['etu_eta', 'etu_fil', 'etu_niv_etu'];
      const fields = [];
      const values = [];
      for (const key of allowedKeys) {
        if (profileData[key] !== undefined && profileData[key] !== null && profileData[key] !== '') {
          values.push(profileData[key]);
          fields.push(`${key} = $${values.length}`);
        }
      }
      if (fields.length === 0) return existing.rows[0];
      values.push(etu_uti_id);
      const text = `
        UPDATE profil_etudiant
        SET ${fields.join(', ')}, etu_dat_mod = CURRENT_TIMESTAMP
        WHERE etu_uti_id = $${values.length}
        RETURNING *
      `;
      const res = await query(text, values);
      return res.rows[0];
    }
  },

  // Enregistrer le Test 1 Étudiant dans la table unique 'reponses'
  async saveStudentInterestsTest(etu_uti_id, { etu_cen_int, etu_ori_pro_1, etu_det_int, car_id = null, pts_sci = 0, pts_lit = 0, fac_id = null, ent_id = null, met_id = null }) {
    const cenIntVal = Array.isArray(etu_cen_int) ? etu_cen_int.join(', ') : etu_cen_int;
    return this.saveTestResponse({
      rep_uti_id: etu_uti_id,
      rep_rol: 'etudiant',
      rep_test_num: 1,
      rep_choix: cenIntVal,
      rep_resultat: etu_ori_pro_1,
      rep_pt_sci: pts_sci,
      rep_pt_lit: pts_lit,
      rep_detail: etu_det_int,
      rep_fac_id: fac_id,
      rep_ent_id: ent_id,
      rep_met_id: met_id,
    });
  },

  // Enregistrer le Test 2 Étudiant dans la table unique 'reponses'
  async saveStudentSkillsTest(etu_uti_id, { etu_com, etu_ori_pro_2, etu_det_com, car_id = null, pts_sci = 0, pts_lit = 0, fac_id = null, ent_id = null, met_id = null }) {
    const comVal = Array.isArray(etu_com) ? etu_com.join(', ') : etu_com;
    return this.saveTestResponse({
      rep_uti_id: etu_uti_id,
      rep_rol: 'etudiant',
      rep_test_num: 2,
      rep_choix: comVal,
      rep_resultat: etu_ori_pro_2,
      rep_pt_sci: pts_sci,
      rep_pt_lit: pts_lit,
      rep_detail: etu_det_com,
      rep_fac_id: fac_id,
      rep_ent_id: ent_id,
      rep_met_id: met_id,
    });
  },

  // ========================================================
  // EMPLOI & INSERTION : Profil personnel (profil_emploi) & Tests (reponses)
  // ========================================================

  // Créer ou mettre à jour le profil personnel Emploi (strictement infos situation/personnel)
  async createReconversionProfile(emp_uti_id, profileData = {}) {
    const existing = await query('SELECT * FROM profil_emploi WHERE emp_uti_id = $1', [emp_uti_id]);
    if (existing.rows.length === 0) {
      const sit = profileData.emp_sit_act || profileData.rec_sit_act || 'En recherche d\'opportunité professionnelle';
      const met = profileData.emp_met_act || profileData.rec_met_act || null;

      const text = `
        INSERT INTO profil_emploi (
          emp_uti_id, emp_sit_act, emp_met_act
        )
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const values = [emp_uti_id, sit, met];
      const res = await query(text, values);
      return res.rows[0];
    } else {
      const allowedKeys = ['emp_sit_act', 'emp_met_act'];
      const legacyMap = {
        rec_sit_act: 'emp_sit_act',
        rec_met_act: 'emp_met_act',
      };

      const normalized = { ...profileData };
      for (const [recKey, empKey] of Object.entries(legacyMap)) {
        if (normalized[recKey] !== undefined && normalized[empKey] === undefined) {
          normalized[empKey] = normalized[recKey];
        }
      }

      const fields = [];
      const values = [];
      for (const key of allowedKeys) {
        if (normalized[key] !== undefined && normalized[key] !== null && normalized[key] !== '') {
          values.push(normalized[key]);
          fields.push(`${key} = $${values.length}`);
        }
      }
      if (fields.length === 0) return existing.rows[0];
      values.push(emp_uti_id);
      const text = `
        UPDATE profil_emploi
        SET ${fields.join(', ')}, emp_dat_mod = CURRENT_TIMESTAMP
        WHERE emp_uti_id = $${values.length}
        RETURNING *
      `;
      const res = await query(text, values);
      return res.rows[0];
    }
  },

  // Alias
  async createEmploiProfile(emp_uti_id, profileData = {}) {
    return this.createReconversionProfile(emp_uti_id, profileData);
  },

  // Enregistrer le Test 1 Emploi dans la table unique 'reponses'
  async saveReconversionInterestsTest(emp_uti_id, { rec_ori_pro_1, emp_ori_pro_1, rec_det_mot, emp_det_mot, rec_mot_cha, emp_mot_cha, car_id = null, pts_sci = 0, pts_lit = 0, fac_id = null, ent_id = null, met_id = null }) {
    const oriVal = emp_ori_pro_1 || rec_ori_pro_1;
    const detVal = emp_det_mot || rec_det_mot;
    const motVal = emp_mot_cha || rec_mot_cha;
    const choixVal = Array.isArray(motVal) ? motVal.join(', ') : (motVal ? String(motVal) : null);

    return this.saveTestResponse({
      rep_uti_id: emp_uti_id,
      rep_rol: 'emploi',
      rep_test_num: 1,
      rep_choix: choixVal,
      rep_resultat: oriVal,
      rep_pt_sci: pts_sci,
      rep_pt_lit: pts_lit,
      rep_detail: detVal,
      rep_fac_id: fac_id,
      rep_ent_id: ent_id,
      rep_met_id: met_id,
    });
  },

  async saveEmploiInterestsTest(emp_uti_id, payload) {
    return this.saveReconversionInterestsTest(emp_uti_id, payload);
  },

  // Enregistrer le Test 2 Emploi dans la table unique 'reponses'
  async saveReconversionSkillsTest(emp_uti_id, { rec_ori_pro_2, emp_ori_pro_2, rec_det_tra, emp_det_tra, rec_sec_cib, emp_sec_cib, car_id = null, pts_sci = 0, pts_lit = 0, fac_id = null, ent_id = null, met_id = null }) {
    const oriVal = emp_ori_pro_2 || rec_ori_pro_2;
    const detVal = emp_det_tra || rec_det_tra;
    const cibVal = emp_sec_cib || rec_sec_cib;
    const choixVal = Array.isArray(cibVal) ? cibVal.join(', ') : (cibVal ? String(cibVal) : null);

    return this.saveTestResponse({
      rep_uti_id: emp_uti_id,
      rep_rol: 'emploi',
      rep_test_num: 2,
      rep_choix: choixVal,
      rep_resultat: oriVal,
      rep_pt_sci: pts_sci,
      rep_pt_lit: pts_lit,
      rep_detail: detVal,
      rep_fac_id: fac_id,
      rep_ent_id: ent_id,
      rep_met_id: met_id,
    });
  },

  async saveEmploiSkillsTest(emp_uti_id, payload) {
    return this.saveReconversionSkillsTest(emp_uti_id, payload);
  },

  // ========================================================
  // REQUÊTES GLOBALES & ADMIN
  // ========================================================

  // Lister tous les utilisateurs
  async findAll({ role, statut, search, page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];

    if (role) {
      if (role === 'rechercher emploi' || role === 'emploi' || role === 'reconversion') {
        conditions.push(`u.uti_rol IN ('rechercher emploi', 'emploi', 'reconversion')`);
      } else {
        values.push(role);
        conditions.push(`u.uti_rol = $${values.length}`);
      }
    }

    if (statut) {
      values.push(statut);
      conditions.push(`u.uti_sta = $${values.length}`);
    }

    if (search) {
      values.push(`%${search}%`);
      const p = `$${values.length}`;
      conditions.push(`(u.uti_nom ILIKE ${p} OR u.uti_pre ILIKE ${p} OR u.uti_ema ILIKE ${p})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM utilisateur u ${whereClause}`;
    const countRes = await query(countQuery, values);
    const total = parseInt(countRes.rows[0].count, 10);

    values.push(limit);
    const limitParam = `$${values.length}`;
    values.push(offset);
    const offsetParam = `$${values.length}`;

    const dataQuery = `
      SELECT 
        u.uti_id, u.uti_nom, u.uti_pre, u.uti_ema, 
        u.uti_rol, u.uti_tel, u.uti_adr, u.uti_ava, u.uti_sta,
        u.uti_dat_cre, u.uti_dat_mod,
        CASE 
          WHEN u.uti_rol = 'eleve' THEN to_jsonb(pel)
          WHEN u.uti_rol = 'etudiant' THEN to_jsonb(pet)
          WHEN u.uti_rol IN ('rechercher emploi', 'emploi', 'reconversion') THEN (
            to_jsonb(pe) || jsonb_build_object(
              'rec_id', pe.emp_id,
              'rec_uti_id', pe.emp_uti_id,
              'rec_sit_act', pe.emp_sit_act,
              'rec_met_act', pe.emp_met_act,
              'rec_dat_cre', pe.emp_dat_cre,
              'rec_dat_mod', pe.emp_dat_mod
            )
          )
          ELSE NULL 
        END AS profil,
        CASE
          WHEN r1.rep_id IS NOT NULL THEN (
            to_jsonb(r1) || jsonb_build_object(
              'rep_fac_id', rec1.rec_liste_fac_id[1],
              'rep_ent_id', rec1.rec_liste_ent_id[1],
              'rep_met_id', rec1.rec_liste_met_id[1],
              'rec_liste_fac_id', COALESCE(rec1.rec_liste_fac_id, '{}'::integer[]),
              'rec_liste_ent_id', COALESCE(rec1.rec_liste_ent_id, '{}'::integer[]),
              'rec_liste_met_id', COALESCE(rec1.rec_liste_met_id, '{}'::integer[]),
              'faculte', to_jsonb(f1),
              'entreprise', to_jsonb(e1),
              'metier', to_jsonb(m1)
            )
          )
          ELSE NULL
        END AS test1,
        CASE
          WHEN r2.rep_id IS NOT NULL THEN (
            to_jsonb(r2) || jsonb_build_object(
              'rep_fac_id', rec2.rec_liste_fac_id[1],
              'rep_ent_id', rec2.rec_liste_ent_id[1],
              'rep_met_id', rec2.rec_liste_met_id[1],
              'rec_liste_fac_id', COALESCE(rec2.rec_liste_fac_id, '{}'::integer[]),
              'rec_liste_ent_id', COALESCE(rec2.rec_liste_ent_id, '{}'::integer[]),
              'rec_liste_met_id', COALESCE(rec2.rec_liste_met_id, '{}'::integer[]),
              'faculte', to_jsonb(f2),
              'entreprise', to_jsonb(e2),
              'metier', to_jsonb(m2)
            )
          )
          ELSE NULL
        END AS test2,
        CASE
          WHEN u.uti_rol = 'eleve' THEN to_jsonb(tel)
          WHEN u.uti_rol = 'etudiant' THEN to_jsonb(tet)
          WHEN u.uti_rol IN ('rechercher emploi', 'emploi', 'reconversion') THEN to_jsonb(tem)
          ELSE NULL
        END AS tests
      FROM utilisateur u
      LEFT JOIN profil_eleve pel ON u.uti_id = pel.ele_uti_id AND u.uti_rol = 'eleve'
      LEFT JOIN profil_etudiant pet ON u.uti_id = pet.etu_uti_id AND u.uti_rol = 'etudiant'
      LEFT JOIN profil_emploi pe ON u.uti_id = pe.emp_uti_id AND u.uti_rol IN ('rechercher emploi', 'emploi', 'reconversion')
      LEFT JOIN reponse r1 ON u.uti_id = r1.rep_uti_id AND r1.rep_test_num = 1
      LEFT JOIN reponse r2 ON u.uti_id = r2.rep_uti_id AND r2.rep_test_num = 2
      LEFT JOIN liste_recommandation rec1 ON r1.rep_rec_id = rec1.rec_id
      LEFT JOIN liste_recommandation rec2 ON r2.rep_rec_id = rec2.rec_id
      LEFT JOIN faculte f1 ON rec1.rec_liste_fac_id[1] = f1.fac_id
      LEFT JOIN entreprise e1 ON rec1.rec_liste_ent_id[1] = e1.ent_id
      LEFT JOIN metier m1 ON rec1.rec_liste_met_id[1] = m1.met_id
      LEFT JOIN faculte f2 ON rec2.rec_liste_fac_id[1] = f2.fac_id
      LEFT JOIN entreprise e2 ON rec2.rec_liste_ent_id[1] = e2.ent_id
      LEFT JOIN metier m2 ON rec2.rec_liste_met_id[1] = m2.met_id
      LEFT JOIN tests_eleves tel ON u.uti_id = tel.tel_uti_id AND u.uti_rol = 'eleve'
      LEFT JOIN tests_etudiants tet ON u.uti_id = tet.tet_uti_id AND u.uti_rol = 'etudiant'
      LEFT JOIN tests_emploi tem ON u.uti_id = tem.tem_uti_id AND u.uti_rol IN ('rechercher emploi', 'emploi', 'reconversion')
      ${whereClause}
      ORDER BY u.uti_dat_cre DESC
      LIMIT ${limitParam} OFFSET ${offsetParam}
    `;

    const res = await query(dataQuery, values);

    return {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      users: res.rows.map(formatUserOutput),
    };
  },

  // Mettre à jour un utilisateur
  async update(id, { uti_nom, uti_pre, uti_ema, uti_tel, uti_adr, uti_ava, uti_sta }) {
    const fields = [];
    const values = [];

    if (uti_nom !== undefined) {
      values.push(typeof uti_nom === 'string' ? uti_nom.trim().toUpperCase() : uti_nom);
      fields.push(`uti_nom = $${values.length}`);
    }
    if (uti_pre !== undefined) {
      values.push(uti_pre);
      fields.push(`uti_pre = $${values.length}`);
    }
    if (uti_ema !== undefined) {
      values.push(typeof uti_ema === 'string' ? uti_ema.trim().toLowerCase() : uti_ema);
      fields.push(`uti_ema = $${values.length}`);
    }
    if (uti_tel !== undefined) {
      values.push(uti_tel);
      fields.push(`uti_tel = $${values.length}`);
    }
    if (uti_adr !== undefined) {
      values.push(uti_adr);
      fields.push(`uti_adr = $${values.length}`);
    }
    if (uti_ava !== undefined) {
      values.push(uti_ava);
      fields.push(`uti_ava = $${values.length}`);
    }
    if (uti_sta !== undefined) {
      values.push(uti_sta);
      fields.push(`uti_sta = $${values.length}`);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`uti_dat_mod = CURRENT_TIMESTAMP`);

    values.push(id);
    const text = `
      UPDATE utilisateur
      SET ${fields.join(', ')}
      WHERE uti_id = $${values.length}
      RETURNING uti_id, uti_nom, uti_pre, uti_ema, 
                uti_rol, uti_tel, uti_adr, uti_ava, uti_sta, 
                uti_dat_cre, uti_dat_mod
    `;

    const res = await query(text, values);
    return res.rows[0];
  },

  // Mettre à jour le mot de passe
  async updatePassword(id, hashedPassword) {
    const text = `UPDATE utilisateur SET uti_pas = $1 WHERE uti_id = $2`;
    await query(text, [hashedPassword, id]);
  },

  // Supprimer un utilisateur
  async delete(id) {
    const text = `DELETE FROM utilisateur WHERE uti_id = $1 RETURNING uti_id`;
    const res = await query(text, [id]);
    return res.rows[0] || null;
  },

  // Liste des élèves pour admin
  async findPupils() {
    const text = `
      SELECT 
        u.uti_id, u.uti_nom, u.uti_pre, u.uti_ema, 
        u.uti_tel, u.uti_adr, u.uti_ava,
        pel.ele_id, pel.ele_cla, pel.ele_ser, pel.ele_eta, pel.ele_not_ema,
        r1.rep_resultat AS ele_ori_pro_1, r2.rep_resultat AS ele_ori_pro_2,
        r1.rep_resultat AS te1_ori_pro_1, r2.rep_resultat AS te2_ori_pro_2,
        r1.rep_choix AS te1_cen_int, r2.rep_choix AS te2_mat_pre,
        r1.rep_pt_sci AS te1_pts_sci, r1.rep_pt_lit AS te1_pts_lit,
        r2.rep_pt_sci AS te2_pts_sci, r2.rep_pt_lit AS te2_pts_lit,
        rec1.rec_liste_fac_id[1] AS te1_fac_id, rec1.rec_liste_ent_id[1] AS te1_ent_id, rec1.rec_liste_met_id[1] AS te1_met_id,
        rec2.rec_liste_fac_id[1] AS te2_fac_id, rec2.rec_liste_ent_id[1] AS te2_ent_id, rec2.rec_liste_met_id[1] AS te2_met_id,
        CASE 
          WHEN r2.rep_resultat IS NOT NULL THEN 3 
          WHEN r1.rep_resultat IS NOT NULL THEN 2 
          ELSE 1 
        END AS tel_eta_act
      FROM utilisateur u
      JOIN profil_eleve pel ON u.uti_id = pel.ele_uti_id
      LEFT JOIN reponse r1 ON u.uti_id = r1.rep_uti_id AND r1.rep_rol = 'eleve' AND r1.rep_test_num = 1
      LEFT JOIN reponse r2 ON u.uti_id = r2.rep_uti_id AND r2.rep_rol = 'eleve' AND r2.rep_test_num = 2
      LEFT JOIN liste_recommandation rec1 ON r1.rep_rec_id = rec1.rec_id
      LEFT JOIN liste_recommandation rec2 ON r2.rep_rec_id = rec2.rec_id
      WHERE u.uti_rol = 'eleve' AND u.uti_sta = 'actif'
      ORDER BY u.uti_dat_cre DESC
    `;
    const res = await query(text);
    return res.rows;
  },

  // Liste des étudiants pour admin
  async findStudents() {
    const text = `
      SELECT 
        u.uti_id, u.uti_nom, u.uti_pre, u.uti_ema, 
        u.uti_tel, u.uti_adr, u.uti_ava,
        pet.etu_id, pet.etu_eta, pet.etu_fil, pet.etu_niv_etu,
        r1.rep_resultat AS etu_ori_pro_1, r2.rep_resultat AS etu_ori_pro_2,
        r1.rep_resultat AS tet1_ori_pro_1, r2.rep_resultat AS tet2_ori_pro_2,
        r1.rep_pt_sci AS tet1_pts_sci, r1.rep_pt_lit AS tet1_pts_lit,
        r2.rep_pt_sci AS tet2_pts_sci, r2.rep_pt_lit AS tet2_pts_lit,
        rec1.rec_liste_fac_id[1] AS tet1_fac_id, rec1.rec_liste_ent_id[1] AS tet1_ent_id, rec1.rec_liste_met_id[1] AS tet1_met_id,
        rec2.rec_liste_fac_id[1] AS tet2_fac_id, rec2.rec_liste_ent_id[1] AS tet2_ent_id, rec2.rec_liste_met_id[1] AS tet2_met_id,
        CASE 
          WHEN r2.rep_resultat IS NOT NULL THEN 3 
          WHEN r1.rep_resultat IS NOT NULL THEN 2 
          ELSE 1 
        END AS tet_eta_act,
        CASE 
          WHEN r2.rep_resultat IS NOT NULL THEN 3 
          WHEN r1.rep_resultat IS NOT NULL THEN 2 
          ELSE 1 
        END AS etu_eta_act
      FROM utilisateur u
      JOIN profil_etudiant pet ON u.uti_id = pet.etu_uti_id
      LEFT JOIN reponse r1 ON u.uti_id = r1.rep_uti_id AND r1.rep_rol = 'etudiant' AND r1.rep_test_num = 1
      LEFT JOIN reponse r2 ON u.uti_id = r2.rep_uti_id AND r2.rep_rol = 'etudiant' AND r2.rep_test_num = 2
      LEFT JOIN liste_recommandation rec1 ON r1.rep_rec_id = rec1.rec_id
      LEFT JOIN liste_recommandation rec2 ON r2.rep_rec_id = rec2.rec_id
      WHERE u.uti_rol = 'etudiant' AND u.uti_sta = 'actif'
      ORDER BY u.uti_dat_cre DESC
    `;
    const res = await query(text);
    return res.rows;
  },

  // Liste des personnes en recherche d'emploi pour admin
  async findEmplois() {
    const text = `
      SELECT 
        u.uti_id, u.uti_nom, u.uti_pre, u.uti_ema, 
        u.uti_tel, u.uti_adr, u.uti_ava,
        pe.emp_id, pe.emp_sit_act, pe.emp_met_act,
        r1.rep_resultat AS emp_ori_pro_1, r2.rep_resultat AS emp_ori_pro_2,
        r1.rep_resultat AS tem1_ori_pro_1, r2.rep_resultat AS tem2_ori_pro_2,
        r1.rep_pt_sci AS tem1_pts_sci, r1.rep_pt_lit AS tem1_pts_lit,
        r2.rep_pt_sci AS tem2_pts_sci, r2.rep_pt_lit AS tem2_pts_lit,
        rec1.rec_liste_fac_id[1] AS tem1_fac_id, rec1.rec_liste_ent_id[1] AS tem1_ent_id, rec1.rec_liste_met_id[1] AS tem1_met_id,
        rec2.rec_liste_fac_id[1] AS tem2_fac_id, rec2.rec_liste_ent_id[1] AS tem2_ent_id, rec2.rec_liste_met_id[1] AS tem2_met_id,
        CASE 
          WHEN r2.rep_resultat IS NOT NULL THEN 3 
          WHEN r1.rep_resultat IS NOT NULL THEN 2 
          ELSE 1 
        END AS tem_eta_act,
        CASE 
          WHEN r2.rep_resultat IS NOT NULL THEN 3 
          WHEN r1.rep_resultat IS NOT NULL THEN 2 
          ELSE 1 
        END AS emp_eta_act,
        pe.emp_id AS rec_id, pe.emp_sit_act AS rec_sit_act, pe.emp_met_act AS rec_met_act,
        r1.rep_resultat AS rec_ori_pro_1, r2.rep_resultat AS rec_ori_pro_2
      FROM utilisateur u
      JOIN profil_emploi pe ON u.uti_id = pe.emp_uti_id
      LEFT JOIN reponse r1 ON u.uti_id = r1.rep_uti_id AND r1.rep_rol IN ('rechercher emploi', 'emploi', 'reconversion') AND r1.rep_test_num = 1
      LEFT JOIN reponse r2 ON u.uti_id = r2.rep_uti_id AND r2.rep_rol IN ('rechercher emploi', 'emploi', 'reconversion') AND r2.rep_test_num = 2
      LEFT JOIN liste_recommandation rec1 ON r1.rep_rec_id = rec1.rec_id
      LEFT JOIN liste_recommandation rec2 ON r2.rep_rec_id = rec2.rec_id
      WHERE u.uti_rol IN ('rechercher emploi', 'emploi', 'reconversion') AND u.uti_sta = 'actif'
      ORDER BY u.uti_dat_cre DESC
    `;
    const res = await query(text);
    return res.rows;
  },

  async findReconversions() {
    return this.findEmplois();
  },
};

module.exports = UserModel;
