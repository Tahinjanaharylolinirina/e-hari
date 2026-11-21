const express = require('express');
const router = express.Router();
const TestController = require('../controllers/testController');

// 1. Catalogues des propositions liées aux tests
router.get('/facultes', TestController.getFacultes);
router.get('/entreprises', TestController.getEntreprises);
router.get('/metiers', TestController.getMetiers);

// 2. Alias directs selon la terminologie utilisateur 'test-1' / 'test-2'
router.get('/test-1', TestController.getTest1);
router.get('/test-2', TestController.getTest2);

// 3. Obtenir les questions, options de réponses et caractéristiques pour n'importe quel rôle et numéro de test
// Exemples :
// GET /api/tests/eleve/1
// GET /api/tests/eleve/2
// GET /api/tests/etudiant/1
// GET /api/tests/etudiant/2
// GET /api/tests/emploi/1
// GET /api/tests/emploi/2
router.get('/:role/:testNumber', TestController.getQuestionsAndCharacteristics);

module.exports = router;

