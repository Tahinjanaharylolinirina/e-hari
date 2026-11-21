const { query } = require('../config/db');

// Nettoyer strictement toute icône ou émoji (0 icône en BDD)
function cleanString(str) {
  if (typeof str !== 'string') return str || '';
  return str
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{200D}\u{FE0F}]/gu, '')
    .trim();
}

const ReferentielController = {
  // ==========================================================
  // 1. GESTION DES ENTREPRISES (CRUD)
  // ==========================================================
  async getAllEntreprises(req, res) {
    try {
      const { search, pole } = req.query;
      let sql = 'SELECT * FROM entreprise WHERE 1=1';
      const params = [];

      if (pole) {
        params.push(pole);
        sql += ` AND ent_pole = $${params.length}`;
      }

      if (search && search.trim()) {
        params.push(`%${search.trim()}%`);
        const idx = params.length;
        sql += ` AND (ent_nom ILIKE $${idx} OR ent_secteur ILIKE $${idx} OR ent_ville ILIKE $${idx} OR ent_description ILIKE $${idx} OR ent_poste_recrute ILIKE $${idx})`;
      }

      sql += ' ORDER BY ent_nom ASC';
      const result = await query(sql, params);

      return res.json({
        success: true,
        count: result.rows.length,
        entreprises: result.rows,
      });
    } catch (error) {
      console.error('Erreur getAllEntreprises :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors du chargement des entreprises.',
        error: error.message,
      });
    }
  },

  async getEntrepriseById(req, res) {
    try {
      const { id } = req.params;
      const result = await query('SELECT * FROM entreprise WHERE ent_id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Entreprise introuvable.',
        });
      }
      return res.json({
        success: true,
        entreprise: result.rows[0],
      });
    } catch (error) {
      console.error('Erreur getEntrepriseById :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'entreprise.',
        error: error.message,
      });
    }
  },

  async createEntreprise(req, res) {
    try {
      const {
        ent_nom,
        ent_secteur,
        ent_secteur_detail,
        ent_ville,
        ent_implantation,
        ent_description,
        ent_poste_recrute,
        ent_profil_recherche,
        ent_accessibilite,
        ent_email_contact,
        ent_site_web,
        ent_pole,
      } = req.body;

      if (!ent_nom || !cleanString(ent_nom)) {
        return res.status(400).json({
          success: false,
          message: 'Le nom de l\'entreprise est obligatoire.',
        });
      }
      if (!ent_secteur || !cleanString(ent_secteur)) {
        return res.status(400).json({
          success: false,
          message: 'Le secteur d\'activité est obligatoire.',
        });
      }
      if (!ent_pole || !cleanString(ent_pole)) {
        return res.status(400).json({
          success: false,
          message: 'Le pôle d\'orientation est obligatoire.',
        });
      }

      const sql = `
        INSERT INTO entreprise (
          ent_nom,
          ent_secteur,
          ent_secteur_detail,
          ent_ville,
          ent_implantation,
          ent_description,
          ent_poste_recrute,
          ent_profil_recherche,
          ent_accessibilite,
          ent_email_contact,
          ent_site_web,
          ent_pole
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;
      `;

      const values = [
        cleanString(ent_nom),
        cleanString(ent_secteur),
        cleanString(ent_secteur_detail),
        cleanString(ent_ville) || 'Antananarivo',
        cleanString(ent_implantation),
        cleanString(ent_description),
        cleanString(ent_poste_recrute),
        cleanString(ent_profil_recherche),
        cleanString(ent_accessibilite),
        cleanString(ent_email_contact),
        cleanString(ent_site_web),
        cleanString(ent_pole),
      ];

      const result = await query(sql, values);

      return res.status(201).json({
        success: true,
        message: 'Entreprise créée avec succès.',
        entreprise: result.rows[0],
      });
    } catch (error) {
      console.error('Erreur createEntreprise :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de l\'entreprise.',
        error: error.message,
      });
    }
  },

  async updateEntreprise(req, res) {
    try {
      const { id } = req.params;
      const {
        ent_nom,
        ent_secteur,
        ent_secteur_detail,
        ent_ville,
        ent_implantation,
        ent_description,
        ent_poste_recrute,
        ent_profil_recherche,
        ent_accessibilite,
        ent_email_contact,
        ent_site_web,
        ent_pole,
      } = req.body;

      if (!ent_nom || !cleanString(ent_nom)) {
        return res.status(400).json({
          success: false,
          message: 'Le nom de l\'entreprise est obligatoire.',
        });
      }
      if (!ent_secteur || !cleanString(ent_secteur)) {
        return res.status(400).json({
          success: false,
          message: 'Le secteur d\'activité est obligatoire.',
        });
      }
      if (!ent_pole || !cleanString(ent_pole)) {
        return res.status(400).json({
          success: false,
          message: 'Le pôle d\'orientation est obligatoire.',
        });
      }

      const sql = `
        UPDATE entreprise
        SET
          ent_nom = $1,
          ent_secteur = $2,
          ent_secteur_detail = $3,
          ent_ville = $4,
          ent_implantation = $5,
          ent_description = $6,
          ent_poste_recrute = $7,
          ent_profil_recherche = $8,
          ent_accessibilite = $9,
          ent_email_contact = $10,
          ent_site_web = $11,
          ent_pole = $12
        WHERE ent_id = $13
        RETURNING *;
      `;

      const values = [
        cleanString(ent_nom),
        cleanString(ent_secteur),
        cleanString(ent_secteur_detail),
        cleanString(ent_ville) || 'Antananarivo',
        cleanString(ent_implantation),
        cleanString(ent_description),
        cleanString(ent_poste_recrute),
        cleanString(ent_profil_recherche),
        cleanString(ent_accessibilite),
        cleanString(ent_email_contact),
        cleanString(ent_site_web),
        cleanString(ent_pole),
        id,
      ];

      const result = await query(sql, values);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Entreprise introuvable.',
        });
      }

      return res.json({
        success: true,
        message: 'Entreprise mise à jour avec succès.',
        entreprise: result.rows[0],
      });
    } catch (error) {
      console.error('Erreur updateEntreprise :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la modification de l\'entreprise.',
        error: error.message,
      });
    }
  },

  async deleteEntreprise(req, res) {
    try {
      const { id } = req.params;

      // Nettoyer les liaisons éventuelles dans liste_recommandation
      await query('UPDATE liste_recommandation SET rec_liste_ent_id = array_remove(rec_liste_ent_id, $1::integer) WHERE $1::integer = ANY(rec_liste_ent_id)', [id]);

      const result = await query('DELETE FROM entreprise WHERE ent_id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Entreprise introuvable.',
        });
      }

      return res.json({
        success: true,
        message: `Entreprise « ${result.rows[0].ent_nom} » supprimée avec succès.`,
        deleted: result.rows[0],
      });
    } catch (error) {
      console.error('Erreur deleteEntreprise :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de l\'entreprise.',
        error: error.message,
      });
    }
  },

  // ==========================================================
  // 2. GESTION DES FACULTÉS & UNIVERSITÉS (CRUD)
  // ==========================================================
  async getAllFacultes(req, res) {
    try {
      const { search, pole } = req.query;
      let sql = 'SELECT * FROM faculte WHERE 1=1';
      const params = [];

      if (pole) {
        params.push(pole);
        sql += ` AND fac_pole = $${params.length}`;
      }

      if (search && search.trim()) {
        params.push(`%${search.trim()}%`);
        const idx = params.length;
        sql += ` AND (fac_nom ILIKE $${idx} OR fac_sigle ILIKE $${idx} OR fac_filiere ILIKE $${idx} OR fac_ville ILIKE $${idx} OR fac_description ILIKE $${idx})`;
      }

      sql += ' ORDER BY fac_nom ASC';
      const result = await query(sql, params);

      return res.json({
        success: true,
        count: result.rows.length,
        facultes: result.rows,
      });
    } catch (error) {
      console.error('Erreur getAllFacultes :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors du chargement des facultés.',
        error: error.message,
      });
    }
  },

  async getFaculteById(req, res) {
    try {
      const { id } = req.params;
      const result = await query('SELECT * FROM faculte WHERE fac_id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Faculté introuvable.',
        });
      }
      return res.json({
        success: true,
        faculte: result.rows[0],
      });
    } catch (error) {
      console.error('Erreur getFaculteById :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la faculté.',
        error: error.message,
      });
    }
  },

  async createFaculte(req, res) {
    try {
      const {
        fac_nom,
        fac_sigle,
        fac_type,
        fac_ville,
        fac_filiere,
        fac_description,
        fac_site_web,
        fac_pole,
      } = req.body;

      if (!fac_nom || !cleanString(fac_nom)) {
        return res.status(400).json({
          success: false,
          message: 'Le nom de la faculté ou université est obligatoire.',
        });
      }
      if (!fac_pole || !cleanString(fac_pole)) {
        return res.status(400).json({
          success: false,
          message: 'Le pôle d\'orientation est obligatoire.',
        });
      }

      const sql = `
        INSERT INTO faculte (
          fac_nom,
          fac_sigle,
          fac_type,
          fac_ville,
          fac_filiere,
          fac_description,
          fac_site_web,
          fac_pole
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;

      const values = [
        cleanString(fac_nom),
        cleanString(fac_sigle),
        cleanString(fac_type) || 'Public',
        cleanString(fac_ville) || 'Antananarivo',
        cleanString(fac_filiere),
        cleanString(fac_description),
        cleanString(fac_site_web),
        cleanString(fac_pole),
      ];

      const result = await query(sql, values);

      return res.status(201).json({
        success: true,
        message: 'Faculté créée avec succès.',
        faculte: result.rows[0],
      });
    } catch (error) {
      console.error('Erreur createFaculte :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la faculté.',
        error: error.message,
      });
    }
  },

  async updateFaculte(req, res) {
    try {
      const { id } = req.params;
      const {
        fac_nom,
        fac_sigle,
        fac_type,
        fac_ville,
        fac_filiere,
        fac_description,
        fac_site_web,
        fac_pole,
      } = req.body;

      if (!fac_nom || !cleanString(fac_nom)) {
        return res.status(400).json({
          success: false,
          message: 'Le nom de la faculté ou université est obligatoire.',
        });
      }
      if (!fac_pole || !cleanString(fac_pole)) {
        return res.status(400).json({
          success: false,
          message: 'Le pôle d\'orientation est obligatoire.',
        });
      }

      const sql = `
        UPDATE faculte
        SET
          fac_nom = $1,
          fac_sigle = $2,
          fac_type = $3,
          fac_ville = $4,
          fac_filiere = $5,
          fac_description = $6,
          fac_site_web = $7,
          fac_pole = $8
        WHERE fac_id = $9
        RETURNING *;
      `;

      const values = [
        cleanString(fac_nom),
        cleanString(fac_sigle),
        cleanString(fac_type) || 'Public',
        cleanString(fac_ville) || 'Antananarivo',
        cleanString(fac_filiere),
        cleanString(fac_description),
        cleanString(fac_site_web),
        cleanString(fac_pole),
        id,
      ];

      const result = await query(sql, values);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Faculté introuvable.',
        });
      }

      return res.json({
        success: true,
        message: 'Faculté mise à jour avec succès.',
        faculte: result.rows[0],
      });
    } catch (error) {
      console.error('Erreur updateFaculte :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la modification de la faculté.',
        error: error.message,
      });
    }
  },

  async deleteFaculte(req, res) {
    try {
      const { id } = req.params;

      // Nettoyer les liaisons éventuelles dans liste_recommandation
      await query('UPDATE liste_recommandation SET rec_liste_fac_id = array_remove(rec_liste_fac_id, $1::integer) WHERE $1::integer = ANY(rec_liste_fac_id)', [id]);

      const result = await query('DELETE FROM faculte WHERE fac_id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Faculté introuvable.',
        });
      }

      return res.json({
        success: true,
        message: `Faculté « ${result.rows[0].fac_nom} » supprimée avec succès.`,
        deleted: result.rows[0],
      });
    } catch (error) {
      console.error('Erreur deleteFaculte :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de la faculté.',
        error: error.message,
      });
    }
  },

  // ==========================================================
  // 3. GESTION DES MÉTIERS & DÉBOUCHÉS (CRUD)
  // ==========================================================
  async getAllMetiers(req, res) {
    try {
      const { search, pole } = req.query;
      let sql = 'SELECT * FROM metier WHERE 1=1';
      const params = [];

      if (pole) {
        params.push(pole);
        sql += ` AND met_pole = $${params.length}`;
      }

      if (search && search.trim()) {
        params.push(`%${search.trim()}%`);
        const idx = params.length;
        sql += ` AND (met_nom ILIKE $${idx} OR met_secteur ILIKE $${idx} OR met_niveau_requis ILIKE $${idx} OR met_description ILIKE $${idx} OR met_debouche ILIKE $${idx})`;
      }

      sql += ' ORDER BY met_nom ASC';
      const result = await query(sql, params);

      return res.json({
        success: true,
        count: result.rows.length,
        metiers: result.rows,
      });
    } catch (error) {
      console.error('Erreur getAllMetiers :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors du chargement des métiers.',
        error: error.message,
      });
    }
  },

  async getMetierById(req, res) {
    try {
      const { id } = req.params;
      const result = await query('SELECT * FROM metier WHERE met_id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Métier introuvable.',
        });
      }
      return res.json({
        success: true,
        metier: result.rows[0],
      });
    } catch (error) {
      console.error('Erreur getMetierById :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du métier.',
        error: error.message,
      });
    }
  },

  async createMetier(req, res) {
    try {
      const {
        met_nom,
        met_secteur,
        met_niveau_requis,
        met_salaire_indicatif,
        met_description,
        met_debouche,
        met_pole,
      } = req.body;

      if (!met_nom || !cleanString(met_nom)) {
        return res.status(400).json({
          success: false,
          message: 'L\'intitulé du métier est obligatoire.',
        });
      }
      if (!met_secteur || !cleanString(met_secteur)) {
        return res.status(400).json({
          success: false,
          message: 'Le secteur professionnel est obligatoire.',
        });
      }
      if (!met_pole || !cleanString(met_pole)) {
        return res.status(400).json({
          success: false,
          message: 'Le pôle d\'orientation est obligatoire.',
        });
      }

      const sql = `
        INSERT INTO metier (
          met_nom,
          met_secteur,
          met_niveau_requis,
          met_salaire_indicatif,
          met_description,
          met_debouche,
          met_pole
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;

      const values = [
        cleanString(met_nom),
        cleanString(met_secteur),
        cleanString(met_niveau_requis),
        cleanString(met_salaire_indicatif),
        cleanString(met_description),
        cleanString(met_debouche),
        cleanString(met_pole),
      ];

      const result = await query(sql, values);

      return res.status(201).json({
        success: true,
        message: 'Métier créé avec succès.',
        metier: result.rows[0],
      });
    } catch (error) {
      console.error('Erreur createMetier :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du métier.',
        error: error.message,
      });
    }
  },

  async updateMetier(req, res) {
    try {
      const { id } = req.params;
      const {
        met_nom,
        met_secteur,
        met_niveau_requis,
        met_salaire_indicatif,
        met_description,
        met_debouche,
        met_pole,
      } = req.body;

      if (!met_nom || !cleanString(met_nom)) {
        return res.status(400).json({
          success: false,
          message: 'L\'intitulé du métier est obligatoire.',
        });
      }
      if (!met_secteur || !cleanString(met_secteur)) {
        return res.status(400).json({
          success: false,
          message: 'Le secteur professionnel est obligatoire.',
        });
      }
      if (!met_pole || !cleanString(met_pole)) {
        return res.status(400).json({
          success: false,
          message: 'Le pôle d\'orientation est obligatoire.',
        });
      }

      const sql = `
        UPDATE metier
        SET
          met_nom = $1,
          met_secteur = $2,
          met_niveau_requis = $3,
          met_salaire_indicatif = $4,
          met_description = $5,
          met_debouche = $6,
          met_pole = $7
        WHERE met_id = $8
        RETURNING *;
      `;

      const values = [
        cleanString(met_nom),
        cleanString(met_secteur),
        cleanString(met_niveau_requis),
        cleanString(met_salaire_indicatif),
        cleanString(met_description),
        cleanString(met_debouche),
        cleanString(met_pole),
        id,
      ];

      const result = await query(sql, values);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Métier introuvable.',
        });
      }

      return res.json({
        success: true,
        message: 'Métier mis à jour avec succès.',
        metier: result.rows[0],
      });
    } catch (error) {
      console.error('Erreur updateMetier :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la modification du métier.',
        error: error.message,
      });
    }
  },

  async deleteMetier(req, res) {
    try {
      const { id } = req.params;

      // Nettoyer les liaisons éventuelles dans liste_recommandation
      await query('UPDATE liste_recommandation SET rec_liste_met_id = array_remove(rec_liste_met_id, $1::integer) WHERE $1::integer = ANY(rec_liste_met_id)', [id]);

      const result = await query('DELETE FROM metier WHERE met_id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Métier introuvable.',
        });
      }

      return res.json({
        success: true,
        message: `Métier « ${result.rows[0].met_nom} » supprimé avec succès.`,
        deleted: result.rows[0],
      });
    } catch (error) {
      console.error('Erreur deleteMetier :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du métier.',
        error: error.message,
      });
    }
  },
};

module.exports = ReferentielController;

