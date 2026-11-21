const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

// Middleware pour vérifier le token JWT
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé : Token manquant ou invalide.',
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'super_secret_cle_jwt_hari_2026_orientation_pro';

    const decoded = jwt.verify(token, secret);
    const userId = decoded.uti_id || decoded.util_id || decoded.utilisateur_id || decoded.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable.',
      });
    }

    const statut = user.uti_sta || user.util_stat || user.utilisateur_statut || user.statut;
    if (statut !== 'actif') {
      return res.status(403).json({
        success: false,
        message: `Compte ${statut}. Veuillez contacter l'administrateur.`,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expirée, veuillez vous reconnecter.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token invalide.',
      error: error.message,
    });
  }
};

// Middleware pour restreindre l'accès selon les rôles
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié.',
      });
    }

    const userRole = req.user.uti_rol || req.user.util_role || req.user.utilisateur_role || req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé. Rôle requis : ${allowedRoles.join(' ou ')}. Votre rôle : ${userRole}`,
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkRole,
};

