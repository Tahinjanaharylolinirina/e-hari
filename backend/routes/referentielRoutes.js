const express = require('express');
const ReferentielController = require('../controllers/referentielController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// ============================================================
// 1. ENTREPRISES
// ============================================================
// Lecture ouverte / authentifiée
router.get('/entreprises', ReferentielController.getAllEntreprises);
router.get('/entreprises/:id', ReferentielController.getEntrepriseById);

// Écriture réservée à l'ADMINISTRATEUR
router.post('/entreprises', verifyToken, checkRole('admin'), ReferentielController.createEntreprise);
router.put('/entreprises/:id', verifyToken, checkRole('admin'), ReferentielController.updateEntreprise);
router.delete('/entreprises/:id', verifyToken, checkRole('admin'), ReferentielController.deleteEntreprise);

// ============================================================
// 2. FACULTÉS & UNIVERSITÉS (avec alias 'fecultes')
// ============================================================
// Lecture ouverte / authentifiée
router.get('/facultes', ReferentielController.getAllFacultes);
router.get('/facultes/:id', ReferentielController.getFaculteById);
router.get('/fecultes', ReferentielController.getAllFacultes);
router.get('/fecultes/:id', ReferentielController.getFaculteById);

// Écriture réservée à l'ADMINISTRATEUR
router.post('/facultes', verifyToken, checkRole('admin'), ReferentielController.createFaculte);
router.put('/facultes/:id', verifyToken, checkRole('admin'), ReferentielController.updateFaculte);
router.delete('/facultes/:id', verifyToken, checkRole('admin'), ReferentielController.deleteFaculte);

router.post('/fecultes', verifyToken, checkRole('admin'), ReferentielController.createFaculte);
router.put('/fecultes/:id', verifyToken, checkRole('admin'), ReferentielController.updateFaculte);
router.delete('/fecultes/:id', verifyToken, checkRole('admin'), ReferentielController.deleteFaculte);

// ============================================================
// 3. MÉTIERS & CARRIÈRES
// ============================================================
// Lecture ouverte / authentifiée
router.get('/metiers', ReferentielController.getAllMetiers);
router.get('/metiers/:id', ReferentielController.getMetierById);

// Écriture réservée à l'ADMINISTRATEUR
router.post('/metiers', verifyToken, checkRole('admin'), ReferentielController.createMetier);
router.put('/metiers/:id', verifyToken, checkRole('admin'), ReferentielController.updateMetier);
router.delete('/metiers/:id', verifyToken, checkRole('admin'), ReferentielController.deleteMetier);

module.exports = router;

