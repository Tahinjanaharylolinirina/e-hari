const fs = require('fs');
const path = require('path');
const { query, pool } = require('../config/db');

async function exportTestsToCode() {
  console.log('📦 Extraction de toutes les données constantes des tests...');

  const roles = [
    { role: 'eleve', num: 1, qTable: 'questions_eleves_1', rTable: 'reponses_eleves_1', cTable: 'caracteristiques_eleves_1' },
    { role: 'eleve', num: 2, qTable: 'questions_eleves_2', rTable: 'reponses_eleves_2', cTable: 'caracteristiques_eleves_2' },
    { role: 'etudiant', num: 1, qTable: 'questions_etudiants_1', rTable: 'reponses_etudiants_1', cTable: 'caracteristiques_etudiants_1' },
    { role: 'etudiant', num: 2, qTable: 'questions_etudiants_2', rTable: 'reponses_etudiants_2', cTable: 'caracteristiques_etudiants_2' },
    { role: 'emploi', num: 1, qTable: 'questions_emploi_1', rTable: 'reponses_emploi_1', cTable: 'caracteristiques_emploi_1' },
    { role: 'emploi', num: 2, qTable: 'questions_emploi_2', rTable: 'reponses_emploi_2', cTable: 'caracteristiques_emploi_2' },
  ];

  const constantData = {};

  for (const item of roles) {
    const key = `${item.role}_${item.num}`;
    const qRes = await query(`SELECT * FROM ${item.qTable} ORDER BY que_ordre ASC`);
    const rRes = await query(`SELECT * FROM ${item.rTable} ORDER BY rep_id ASC`);
    const cRes = await query(`SELECT * FROM ${item.cTable} ORDER BY car_id ASC`);

    const questions = qRes.rows.map(q => {
      const reponses = rRes.rows
        .filter(r => r.rep_que_id === q.que_id)
        .map(r => ({
          id: r.rep_id,
          code: r.rep_code,
          titre: r.rep_titre,
          description: r.rep_description,
          pts_sci: r.rep_pt_sci || 0,
          pts_lit: r.rep_pt_lit || 0,
          categorie: r.rep_categorie || r.rep_pole || null,
          pole: r.rep_pole || r.rep_categorie || null,
        }));

      return {
        id: q.que_id,
        ordre: q.que_ordre,
        texte: q.que_texte,
        pts_sci: q.que_pts_sci || 0,
        pts_lit: q.que_pts_lit || 0,
        reponses,
      };
    });

    const caracteristiques = cRes.rows.map(c => ({
      id: c.car_id,
      code: c.car_code,
      nom: c.car_nom,
      short_nom: c.car_short_nom,
      description: c.car_description,
      qualites: c.car_qualites || null,
      recommandations: c.car_recommandations || null,
      debouches: c.car_debouches || null,
      secteurs: c.car_secteurs || null,
      metiers: c.car_metiers || null,
      pts_sci_min: c.car_pts_sci_min || 0,
      pts_lit_min: c.car_pts_lit_min || 0,
    }));

    constantData[key] = {
      role: item.role,
      testNum: item.num,
      questions,
      caracteristiques,
    };
  }

  const fileContent = `/**
 * Catalogue constant et statique des tests e-HARI
 * Gestion 100% au niveau du code (questions, réponses possibles, points et traits de caractéristiques / résultats).
 * Aucune dépendance sur des tables statiques en BDD.
 */

const TESTS_CONSTANT_DATA = ${JSON.stringify(constantData, null, 2)};

function getQuestions(role, testNum) {
  const key = \`\${role}_\${testNum}\`;
  return TESTS_CONSTANT_DATA[key]?.questions || [];
}

function getCaracteristiques(role, testNum) {
  const key = \`\${role}_\${testNum}\`;
  return TESTS_CONSTANT_DATA[key]?.caracteristiques || [];
}

/**
 * Calculer automatiquement le score, les points et le trait / résultat dominant
 */
function evaluateTest(role, testNum, answers = {}, selectedKeys = []) {
  const testInfo = TESTS_CONSTANT_DATA[\`\${role}_\${testNum}\`];
  if (!testInfo) return { pts_sci: 0, pts_lit: 0, resultat: null };

  const rawAnswers = Array.isArray(answers) 
    ? answers 
    : (typeof answers === 'object' ? Object.values(answers) : [answers]);

  const allSelected = [...rawAnswers, ...selectedKeys].filter(v => typeof v === 'string' || typeof v === 'number');

  let pts_sci = 0;
  let pts_lit = 0;
  const catCounts = {};

  // Parcourir toutes les options de réponses du test
  for (const q of testInfo.questions) {
    for (const r of q.reponses) {
      const match = allSelected.some(a => String(a) === String(r.code) || String(a) === String(r.id) || String(a) === String(r.titre));
      if (match) {
        pts_sci += r.pts_sci || 0;
        pts_lit += r.pts_lit || 0;
        const cat = r.categorie || r.pole;
        if (cat) catCounts[cat] = (catCounts[cat] || 0) + 1;
      }
    }
  }

  // Déterminer la catégorie / le pôle dominant
  const dominantCat = Object.keys(catCounts).sort((a, b) => catCounts[b] - catCounts[a])[0];

  // Associer la caractéristique correspondante
  let matchedCar = null;
  if (dominantCat) {
    matchedCar = testInfo.caracteristiques.find(c => c.code === dominantCat);
  }
  if (!matchedCar && testInfo.caracteristiques.length > 0) {
    matchedCar = testInfo.caracteristiques[0];
  }

  return {
    pts_sci,
    pts_lit,
    dominantCat,
    resultat: matchedCar?.nom || null,
    caracteristique: matchedCar,
    scores: catCounts,
  };
}

module.exports = {
  TESTS_CONSTANT_DATA,
  getQuestions,
  getCaracteristiques,
  evaluateTest,
};
`;

  const targetPath = path.join(__dirname, '../data/testsConstantData.js');
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, fileContent, 'utf-8');
  console.log(`✅ Fichier généré avec succès : ${targetPath}`);
}

exportTestsToCode()
  .then(() => pool.end())
  .catch(err => {
    console.error('Erreur exportTestsToCode :', err);
    process.exit(1);
  });

