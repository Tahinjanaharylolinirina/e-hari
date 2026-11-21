const { pool } = require('./config/db');

async function showDatabaseStatus() {
  try {
    const dbInfo = await pool.query('SELECT current_database(), current_user, inet_server_port()');
    console.log('📌 Connecté à :', dbInfo.rows[0]);

    const users = await pool.query(
      'SELECT uti_id, uti_nom, uti_pre, uti_ema, uti_rol, uti_tel, uti_adr, uti_sta FROM utilisateur ORDER BY uti_id'
    );
    console.log('\n👥 Table "utilisateur" (attributs 3 lettres : uti_) :');
    console.table(users.rows);

    const eleves = await pool.query(`
      SELECT 
        pe.ele_id AS id_profil,
        pe.ele_uti_id AS uti_id,
        u.uti_nom AS nom,
        u.uti_pre AS prenom,
        pe.ele_cla AS classe,
        pe.ele_ser AS serie,
        pe.ele_eta AS etablissement
      FROM profil_eleve pe
      JOIN utilisateur u ON pe.ele_uti_id = u.uti_id
      ORDER BY pe.ele_id
    `);
    console.log('\n🎒 Table "profil_eleve" (reliée aux utilisateurs) :');
    console.table(eleves.rows);

    const etudiants = await pool.query(`
      SELECT 
        pet.etu_id AS id_profil,
        pet.etu_uti_id AS uti_id,
        u.uti_nom AS nom,
        u.uti_pre AS prenom,
        pet.etu_niv_etu AS niveau,
        pet.etu_fil AS filiere,
        pet.etu_eta AS etablissement
      FROM profil_etudiant pet
      JOIN utilisateur u ON pet.etu_uti_id = u.uti_id
      ORDER BY pet.etu_id
    `);
    console.log('🎓 Table "profil_etudiant" (reliée aux utilisateurs) :');
    console.table(etudiants.rows);

    const reconversion = await pool.query(`
      SELECT 
        pr.rec_id AS id_profil,
        pr.rec_uti_id AS uti_id,
        u.uti_nom AS nom,
        u.uti_pre AS prenom,
        pr.rec_sit_act AS situation,
        pr.rec_met_act AS metier
      FROM profils_reconversion pr
      JOIN utilisateur u ON pr.rec_uti_id = u.uti_id
      ORDER BY pr.rec_id
    `);
    console.log('🔄 Table "profils_reconversion" (reliée aux utilisateurs) :');
    console.table(reconversion.rows);

    const edts = await pool.query(`
      SELECT 
        e.edt_id,
        e.edt_uti_id AS uti_id,
        u.uti_nom AS nom_eleve,
        u.uti_pre AS prenom_eleve,
        e.edt_don AS taches_par_tranches,
        e.edt_dat_cre AS cree_le,
        e.edt_dat_mod AS modifie_le
      FROM emploi_du_temps e
      JOIN utilisateur u ON e.edt_uti_id = u.uti_id
      ORDER BY e.edt_id
    `);
    console.log('📅 Table "emploi_du_temps" (liée à l\'élève, tâches par tranches numérotées 1..16) :');
    console.table(edts.rows.map(r => ({
      edt_id: r.edt_id,
      uti_id: r.uti_id,
      eleve: `${r.nom_eleve} ${r.prenom_eleve}`,
      taches: JSON.stringify(r.taches_par_tranches),
      modifie_le: r.modifie_le,
    })));

  } catch (error) {
    console.error('❌ Erreur :', error.message);
  } finally {
    await pool.end();
  }
}

showDatabaseStatus();
