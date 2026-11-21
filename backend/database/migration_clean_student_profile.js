const { query } = require('../config/db');

async function migrate() {
  console.log('🚀 Démarrage de la migration de profil_etudiant...');
  try {
    // 1. Supprimer les colonnes inutiles de profil_etudiant
    console.log('1. Suppression des colonnes etu_ann_bac, etu_cen_int, etu_com, etu_bio, etu_cv_url...');
    await query(`
      ALTER TABLE profil_etudiant 
      DROP COLUMN IF EXISTS etu_ann_bac,
      DROP COLUMN IF EXISTS etu_cen_int,
      DROP COLUMN IF EXISTS etu_com,
      DROP COLUMN IF EXISTS etu_bio,
      DROP COLUMN IF EXISTS etu_cv_url;
    `);
    console.log('✅ Colonnes supprimées avec succès de profil_etudiant.');

    // 2. Mettre à jour l'utilisateur RAKOTO Jean avec les valeurs demandées
    console.log('2. Mise à jour des informations de l\'étudiant RAKOTO Jean...');
    await query(`
      UPDATE utilisateur 
      SET 
        uti_nom = 'RAKOTO',
        uti_pre = 'Jean',
        uti_ema = 'etudiant@hari.mg',
        uti_tel = '0340000003',
        uti_adr = 'Ankatso, Antananarivo'
      WHERE uti_ema = 'etudiant@hari.mg' OR uti_id = 3;
    `);

    await query(`
      UPDATE profil_etudiant 
      SET 
        etu_eta = 'Université d''Antananarivo (Faculté des Sciences)',
        etu_fil = 'Informatique & Technologies Numériques',
        etu_niv_etu = 'Licence 3'
      WHERE etu_uti_id = (SELECT uti_id FROM utilisateur WHERE uti_ema = 'etudiant@hari.mg' LIMIT 1);
    `);
    console.log('✅ Données de l\'étudiant RAKOTO Jean mises à jour.');

    // 3. Vérification des colonnes restantes
    const cols = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'profil_etudiant'
      ORDER BY ordinal_position;
    `);
    console.log('📋 Nouvelles colonnes de profil_etudiant :');
    cols.rows.forEach(c => console.log(`   - ${c.column_name} (${c.data_type})`));

    // 4. Vérification de l'étudiant
    const etu = await query(`
      SELECT u.uti_id, u.uti_nom, u.uti_pre, u.uti_ema, u.uti_tel, u.uti_adr, 
             pe.etu_eta, pe.etu_fil, pe.etu_niv_etu, pe.etu_ori_pro_1, pe.etu_ori_pro_2
      FROM utilisateur u
      JOIN profil_etudiant pe ON u.uti_id = pe.etu_uti_id
      WHERE u.uti_ema = 'etudiant@hari.mg';
    `);
    console.log('👤 Profil étudiant en BDD :', etu.rows[0]);

    console.log('🎉 Migration terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la migration :', error);
  } finally {
    process.exit(0);
  }
}

migrate();
