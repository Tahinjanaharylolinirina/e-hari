const { query } = require('../config/db');
const { getQuestions, getCaracteristiques } = require('../data/testsConstantData');

const TestController = {
  // Récupérer le catalogue des facultés et universités
  async getFacultes(req, res) {
    try {
      const { pole } = req.query;
      let sql = 'SELECT * FROM faculte';
      const params = [];
      if (pole) {
        sql += ' WHERE fac_pole = $1';
        params.push(pole);
      }
      sql += ' ORDER BY fac_nom ASC';
      const result = await query(sql, params);
      return res.json({
        success: true,
        count: result.rows.length,
        facultes: result.rows,
      });
    } catch (error) {
      console.error('Erreur getFacultes :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des facultés.',
        error: error.message,
      });
    }
  },

  // Récupérer le catalogue des entreprises partenaires
  async getEntreprises(req, res) {
    try {
      const { pole } = req.query;
      let sql = 'SELECT * FROM entreprise';
      const params = [];
      if (pole) {
        sql += ' WHERE ent_pole = $1';
        params.push(pole);
      }
      sql += ' ORDER BY ent_nom ASC';
      const result = await query(sql, params);
      return res.json({
        success: true,
        count: result.rows.length,
        entreprises: result.rows,
      });
    } catch (error) {
      console.error('Erreur getEntreprises :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des entreprises.',
        error: error.message,
      });
    }
  },

  // Récupérer le catalogue des métiers et débouchés
  async getMetiers(req, res) {
    try {
      const { pole } = req.query;
      let sql = 'SELECT * FROM metier';
      const params = [];
      if (pole) {
        sql += ' WHERE met_pole = $1';
        params.push(pole);
      }
      sql += ' ORDER BY met_nom ASC';
      const result = await query(sql, params);
      return res.json({
        success: true,
        count: result.rows.length,
        metiers: result.rows,
      });
    } catch (error) {
      console.error('Erreur getMetiers :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des métiers.',
        error: error.message,
      });
    }
  },

  // Récupérer les questions, réponses possibles et caractéristiques d'un test spécifique
  // Rôles : 'eleve', 'etudiant', 'emploi'
  // TestNumber : 1 ou 2
  async getQuestionsAndCharacteristics(req, res) {
    try {
      const { role, testNumber } = req.params;
      const num = parseInt(testNumber, 10);

      if (!['eleve', 'etudiant', 'emploi'].includes(role) || ![1, 2].includes(num)) {
        return res.status(400).json({
          success: false,
          message: 'Paramètres invalides. Rôles autorisés: eleve, etudiant, emploi. Numéro de test: 1 ou 2.'
        });
      }

      // Récupérer directement depuis les données constantes en code
      const caracteristiques = getCaracteristiques(role, num);
      const questions = getQuestions(role, num);

      // Récupérer les catalogues de propositions liées (facultés, entreprises, métiers)
      const facRes = await query('SELECT fac_id, fac_nom, fac_sigle, fac_type, fac_ville, fac_filiere, fac_description, fac_site_web, fac_pole FROM faculte ORDER BY fac_nom ASC');
      const entRes = await query('SELECT ent_id, ent_nom, ent_secteur, ent_secteur_detail, ent_ville, ent_implantation, ent_description, ent_poste_recrute, ent_profil_recherche, ent_accessibilite, ent_email_contact, ent_site_web, ent_pole FROM entreprise ORDER BY ent_nom ASC');
      const metRes = await query('SELECT met_id, met_nom, met_secteur, met_niveau_requis, met_salaire_indicatif, met_description, met_debouche, met_pole FROM metier ORDER BY met_nom ASC');

      return res.json({
        success: true,
        role,
        testNumber: num,
        caracteristiques,
        questions,
        facultes: facRes.rows,
        entreprises: entRes.rows,
        metiers: metRes.rows,
      });
    } catch (error) {
      console.error('Erreur getQuestionsAndCharacteristics :', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des données du test.',
        error: error.message
      });
    }
  },

  // Alias pratique pour Test 1 Élève ('questions-1' / 'caracteristiques-1')
  async getTest1(req, res) {
    req.params = { role: 'eleve', testNumber: '1' };
    return TestController.getQuestionsAndCharacteristics(req, res);
  },

  // Alias pratique pour Test 2 Élève
  async getTest2(req, res) {
    req.params = { role: 'eleve', testNumber: '2' };
    return TestController.getQuestionsAndCharacteristics(req, res);
  }
};

module.exports = TestController;

