const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// 1. Consultation des annuaires / profils pour orientation
// Liste des élèves (Collège / Lycée)
router.get('/eleves', UserController.getPupils);

// Liste des étudiants (Enseignement supérieur)
router.get('/etudiants', UserController.getStudents);

// Liste des personnes en recherche d'emploi / reconversion
router.get('/emploi', UserController.getEmplois);
router.get('/emplois', UserController.getEmplois);
router.get('/reconversion', UserController.getReconversions);
router.get('/reconversions', UserController.getReconversions);

// 2. Statistiques globales (Admin)
router.get('/stats', verifyToken, checkRole('admin'), UserController.getStats);

// 3. Gestion globale des utilisateurs (Admin)
router.get('/', verifyToken, checkRole('admin'), UserController.getAllUsers);

// 4. Tests d'orientation spécifiques à l'Élève
router.post('/eleve/test-interets', verifyToken, checkRole('eleve'), UserController.submitEleveInterestsTest);
router.post('/eleve/test-matieres', verifyToken, checkRole('eleve'), UserController.submitEleveMatieresTest);
router.post('/eleve/facebook-analysis', verifyToken, checkRole('eleve'), UserController.saveEleveFacebookAnalysis);
router.post('/eleve/revision-schedule', verifyToken, checkRole('eleve'), UserController.saveEleveRevisionSchedule);
router.post('/eleve/edt', verifyToken, checkRole('eleve'), UserController.saveEleveRevisionSchedule);
router.get('/eleve/edt', verifyToken, checkRole('eleve'), UserController.getEleveRevisionSchedule);

// Tests d'orientation & compétences professionnelles spécifiques à l'Étudiant
router.post('/etudiant/test-interets', verifyToken, checkRole('etudiant'), UserController.submitEtudiantInterestsTest);
router.post('/etudiant/test-competences', verifyToken, checkRole('etudiant'), UserController.submitEtudiantCompetencesTest);

// Tests de transition, compétences transférables & bilan spécifiques à l'Emploi / Reconversion
router.post('/emploi/test-interets', verifyToken, checkRole('emploi', 'reconversion'), UserController.submitEmploiInterestsTest);
router.post('/emploi/test-competences', verifyToken, checkRole('emploi', 'reconversion'), UserController.submitEmploiCompetencesTest);
router.post('/reconversion/test-interets', verifyToken, checkRole('emploi', 'reconversion'), UserController.submitReconversionInterestsTest);
router.post('/reconversion/test-competences', verifyToken, checkRole('emploi', 'reconversion'), UserController.submitReconversionCompetencesTest);

// 5. Consultation d'un utilisateur par son ID
router.get('/:id', verifyToken, UserController.getUserById);

// 5. Modification du profil (Admin ou l'utilisateur lui-même)
router.put('/:id', verifyToken, UserController.updateUser);

// 6. Modification du statut actif/inactif/suspendu (Admin)
router.patch('/:id/statut', verifyToken, checkRole('admin'), UserController.updateUserStatus);

// 7. Suppression d'un utilisateur (Admin)
router.delete('/:id', verifyToken, checkRole('admin'), UserController.deleteUser);

module.exports = router;
