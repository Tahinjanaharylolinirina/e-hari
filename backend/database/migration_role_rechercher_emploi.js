const { query, pool } = require('../config/db');

async function migrate() {
  console.log('--- MIGRATION DU RÔLE VERS "rechercher emploi" ---');
  await query('ALTER TABLE utilisateur DROP CONSTRAINT IF EXISTS utilisateurs_uti_rol_check;');
  await query(`
    ALTER TABLE utilisateur 
    ADD CONSTRAINT utilisateurs_uti_rol_check 
    CHECK (uti_rol IN ('admin', 'eleve', 'etudiant', 'rechercher emploi', 'emploi', 'reconversion'));
  `);
  const upd = await query(`
    UPDATE utilisateur 
    SET uti_rol = 'rechercher emploi' 
    WHERE uti_rol IN ('emploi', 'reconversion');
  `);
  console.log(`Utilisateurs mis à jour : ${upd.rowCount}`);

  const roles = await query('SELECT DISTINCT uti_rol FROM utilisateur ORDER BY uti_rol;');
  console.log('Rôles distincts actuels en BDD :', roles.rows);
}

migrate()
  .then(() => pool.end())
  .catch((err) => {
    console.error('Erreur migration :', err);
    process.exit(1);
  });

