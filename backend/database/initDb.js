const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

async function initDatabase() {
  const client = await pool.connect();
  try {
    console.log('🔄 Initialisation de la BDD avec les attributs courts (règle des 3 lettres)...');

    // 1. Exécution du schéma SQL
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('✅ Tables créées avec succès :');
    console.log('   - utilisateurs         (uti_id, uti_nom, uti_pre, uti_ema, uti_pas, uti_rol, uti_tel, uti_adr...)');
    console.log('   - profil_eleve       (ele_id, ele_uti_id, ele_cla, ele_ser, ele_eta...)');
    console.log('   - profil_etudiant    (etu_id, etu_uti_id, etu_niv_etu, etu_fil, etu_eta...)');
    console.log('   - profil_emploi       (emp_id, emp_uti_id, emp_sit_act, emp_met_act...)');

    console.log('🌱 Amorçage des 4 comptes de test...');

    const salt = await bcrypt.genSalt(10);
    const mdpAdmin = await bcrypt.hash('Admin123!', salt);
    const mdpEleve = await bcrypt.hash('Eleve123!', salt);
    const mdpEtudiant = await bcrypt.hash('Etudiant123!', salt);
    const mdpReconversion = await bcrypt.hash('Reconversion123!', salt);

    // 1. Administrateur
    await client.query(
      `INSERT INTO utilisateur (uti_nom, uti_pre, uti_ema, uti_pas, uti_rol, uti_tel, uti_adr, uti_sta)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      ['RAVELO', 'Hary', 'admin@hari.mg', mdpAdmin, 'admin', '0340000001', 'Lot II M 35 Antanimena, Antananarivo', 'actif']
    );

    // 2. Élève
    const eleveRes = await client.query(
      `INSERT INTO utilisateur (uti_nom, uti_pre, uti_ema, uti_pas, uti_rol, uti_tel, uti_adr, uti_sta)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING uti_id`,
      ['RAZAFI', 'Aina', 'eleve@hari.mg', mdpEleve, 'eleve', '0340000002', 'Lot IV G 12 Itaosy, Antananarivo', 'actif']
    );
    await client.query(
      `INSERT INTO profil_eleve (ele_uti_id, ele_cla, ele_ser, ele_eta)
       VALUES ($1, $2, $3, $4)`,
      [
        eleveRes.rows[0].uti_id,
        'Terminale',
        'Série Scientifique (S)',
        'Lycée Moderne d\'Antananarivo'
      ]
    );
    await client.query(
      `INSERT INTO tests_eleves_1 (te1_uti_id, te1_cen_int, te1_ori_pro_1)
       VALUES ($1, $2, $3)`,
      [
        eleveRes.rows[0].uti_id,
        'Jeux vidéo, Technologies, Robotique',
        'Orientation Provisoire n°1 : Pôle Sciences, Numérique & Ingénierie'
      ]
    );
    await client.query(
      `INSERT INTO tests_eleves_2 (te2_uti_id, te2_mat_pre, te2_ori_pro_2)
       VALUES ($1, $2, $3)`,
      [
        eleveRes.rows[0].uti_id,
        'Mathématiques, Physique, Informatique',
        'Sciences Biologiques, Santé & Médecine'
      ]
    );

    // 3. Étudiant
    const etudiantRes = await client.query(
      `INSERT INTO utilisateur (uti_nom, uti_pre, uti_ema, uti_pas, uti_rol, uti_tel, uti_adr, uti_sta)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING uti_id`,
      ['RAKOTO', 'Jean', 'etudiant@hari.mg', mdpEtudiant, 'etudiant', '0340000003', 'Ankatso, Antananarivo', 'actif']
    );
    await client.query(
      `INSERT INTO profil_etudiant (etu_uti_id, etu_eta, etu_fil, etu_niv_etu)
       VALUES ($1, $2, $3, $4)`,
      [
        etudiantRes.rows[0].uti_id,
        'Université d\'Antananarivo (Faculté des Sciences)',
        'Informatique & Technologies Numériques',
        'Licence 3',
      ]
    );
    await client.query(
      `INSERT INTO tests_etudiants_1 (tet1_uti_id, tet1_ori_pro_1)
       VALUES ($1, $2)`,
      [
        etudiantRes.rows[0].uti_id,
        'Profil Bâtisseur, Concepteur & Ingénieur'
      ]
    );
    await client.query(
      `INSERT INTO tests_etudiants_2 (tet2_uti_id, tet2_ori_pro_2)
       VALUES ($1, $2)`,
      [
        etudiantRes.rows[0].uti_id,
        'Pôle Technologies Numériques, Développement & Cybersécurité'
      ]
    );

    // 4. Emploi & Insertion
    const emploiRes = await client.query(
      `INSERT INTO utilisateur (uti_nom, uti_pre, uti_ema, uti_pas, uti_rol, uti_tel, uti_adr, uti_sta)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING uti_id`,
      ['ANDRIA', 'Mamy', 'reconversion@hari.mg', mdpReconversion, 'emploi', '0340000004', 'Lot III F 45 Sabotsy Namehana, Antananarivo', 'actif']
    );
    await client.query(
      `INSERT INTO profil_emploi (emp_uti_id, emp_sit_act, emp_met_act)
       VALUES ($1, $2, $3)`,
      [
        emploiRes.rows[0].uti_id,
        'En recherche d\'opportunité professionnelle',
        'Comptable Junior'
      ]
    );
    await client.query(
      `INSERT INTO tests_emploi_1 (tem1_uti_id, tem1_ori_pro_1)
       VALUES ($1, $2)`,
      [
        emploiRes.rows[0].uti_id,
        'Profil Métiers du Numérique, Web & Data'
      ]
    );
    await client.query(
      `INSERT INTO tests_emploi_2 (tem2_uti_id, tem2_ori_pro_2)
       VALUES ($1, $2)`,
      [
        emploiRes.rows[0].uti_id,
        'Pôle Technologies Numériques, Web & Data'
      ]
    );

    console.log('✅ Base de données réinitialisée avec succès !');
  } catch (error) {
    console.error('❌ Erreur :', error);
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;
