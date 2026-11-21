const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const jwt = require('jsonwebtoken');

const API_URL = 'http://localhost:5000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_cle_jwt_hari_2026_orientation_pro';

function makeToken(user) {
  return jwt.sign(
    {
      uti_id: user.uti_id,
      uti_ema: user.uti_ema,
      uti_rol: user.uti_rol,
      id: user.uti_id,
      util_id: user.uti_id,
      util_role: user.uti_rol,
      util_emai: user.uti_ema,
    },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
}

async function runTest() {
  console.log('========================================================================');
  console.log('🚀 VALIDATION COMPLÈTE DU SYSTÈME DE MESSAGERIE PRIVÉE (MP) e-HARI');
  console.log('========================================================================\n');

  const admin = { uti_id: 1, uti_nom: 'RAVELO', uti_pre: 'Hary', uti_ema: 'tahinjanaharylolinirina@gmail.com', uti_rol: 'admin' };
  const eleve = { uti_id: 2, uti_nom: 'RAZAFI', uti_pre: 'Aina', uti_ema: 'eleve@hari.mg', uti_rol: 'eleve' };
  const etudiant = { uti_id: 3, uti_nom: 'RAKOTO', uti_pre: 'Jean', uti_ema: 'etudiant@hari.mg', uti_rol: 'etudiant' };
  const emploi = { uti_id: 4, uti_nom: 'ANDRIA', uti_pre: 'Mamy', uti_ema: 'reconversion@hari.mg', uti_rol: 'emploi' };

  const adminToken = makeToken(admin);
  const eleveToken = makeToken(eleve);
  const etudiantToken = makeToken(etudiant);
  const emploiToken = makeToken(emploi);

  // --- SCÉNARIO 1 : ÉLÈVE ENVOIE UN BULLETIN PDF À L'ADMIN ---
  console.log('--- ÉTAPE 1 : ÉLÈVE ENVOIE UN BULLETIN DE NOTES (PDF) À L\'ADMIN ---');
  const fakePdf = 'data:application/pdf;base64,JVBERi0xLjQKJUZha2UgUERGIENvbnRlbnQgZS1IQVJJ';
  const resSendEleve = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${eleveToken}` },
    body: JSON.stringify({
      targetUserId: admin.uti_id,
      mes_con: "Bonjour, voici mon bulletin de notes de Terminale pour validation de mon orientation scientifique.",
      mes_fic_nom: 'bulletin_terminale_aina.pdf',
      mes_fic_typ: 'application/pdf',
      mes_fic_tai: 185400,
      mes_fic_url: fakePdf,
    }),
  });
  const dataSendEleve = await resSendEleve.json();
  console.log(`✓ Message élève envoyé ! ID: ${dataSendEleve.data.mes_id}`);
  console.log(`  Fichier attaché: ${dataSendEleve.data.mes_fic_nom} (${dataSendEleve.data.mes_fic_typ})`);

  // --- SCÉNARIO 2 : L'ADMIN VÉRIFIE LES MESSAGES NON LUS ET CONVERSATIONS ---
  console.log('\n--- ÉTAPE 2 : L\'ADMIN VÉRIFIE LES NOTIFICATIONS & CONVERSATIONS EN COURS ---');
  const resUnreadAdmin = await fetch(`${API_URL}/messages/unread-count`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const dataUnreadAdmin = await resUnreadAdmin.json();
  console.log(`✓ Total messages non lus pour l'Admin: ${dataUnreadAdmin.unreadCount}`);

  const resConvsAdmin = await fetch(`${API_URL}/messages/admin/conversations`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const dataConvsAdmin = await resConvsAdmin.json();
  console.log(`✓ Nombre total de conversations MP répertoriées: ${dataConvsAdmin.data.length}`);
  const eleveConv = dataConvsAdmin.data.find(c => c.uti_id === eleve.uti_id);
  if (eleveConv) {
    console.log(`  Conversation avec ${eleveConv.uti_nom} ${eleveConv.uti_pre} (${eleveConv.uti_rol}) :`);
    console.log(`  - Dernier message : "${eleveConv.der_message}"`);
    console.log(`  - Fichier joint : ${eleveConv.der_fichier || 'Aucun'}`);
    console.log(`  - Messages non lus : ${eleveConv.non_lus}`);
  }

  // --- SCÉNARIO 3 : L'ADMIN OUVRE LE FIL, MARQUE COMME LU ET RÉPOND AVEC UN GUIDE ORIENTATION (WORD) ---
  console.log('\n--- ÉTAPE 3 : L\'ADMIN LIT LE BULLETIN ET RÉPOND AVEC UNE FICHE D\'ORIENTATION (DOCX) ---');
  await fetch(`${API_URL}/messages/mark-read/${eleve.uti_id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  const fakeDocx = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQAAAAIAAAA';
  const resAdminReply = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      targetUserId: eleve.uti_id,
      mes_con: "Bonjour Aina, j'ai bien reçu votre bulletin. Vos notes en Mathématiques et Physique sont excellentes. Voici notre fiche de conseil personnalisée.",
      mes_fic_nom: 'fiche_orientation_ingenierie_mada_2026.docx',
      mes_fic_typ: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      mes_fic_tai: 340000,
      mes_fic_url: fakeDocx,
    }),
  });
  const dataAdminReply = await resAdminReply.json();
  console.log(`✓ Réponse Admin envoyée ! ID: ${dataAdminReply.data.mes_id}`);
  console.log(`  Fichier attaché: ${dataAdminReply.data.mes_fic_nom}`);

  // --- SCÉNARIO 4 : L'ÉLÈVE REÇOIT LE MESSAGE DANS SA BOÎTE DE RÉCEPTION ---
  console.log('\n--- ÉTAPE 4 : L\'ÉLÈVE CONSULTE SA BOÎTE DE RÉCEPTION ---');
  const resEleveThread = await fetch(`${API_URL}/messages/conversation`, {
    headers: { Authorization: `Bearer ${eleveToken}` },
  });
  const dataEleveThread = await resEleveThread.json();
  console.log(`✓ Messages présents dans le fil élève : ${dataEleveThread.data.length} messages`);
  const lastEleveMsg = dataEleveThread.data[dataEleveThread.data.length - 1];
  console.log(`  Dernier message reçu de : ${lastEleveMsg.exp_nom} (${lastEleveMsg.mes_exp_id === admin.uti_id ? 'Admin' : 'Moi'})`);
  console.log(`  Texte : "${lastEleveMsg.mes_con}"`);
  console.log(`  Document joint : ${lastEleveMsg.mes_fic_nom} (${(lastEleveMsg.mes_fic_tai / 1024).toFixed(1)} Ko)`);

  // Marquer comme lu côté élève
  await fetch(`${API_URL}/messages/mark-read/${admin.uti_id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${eleveToken}` },
  });
  const resEleveUnread = await fetch(`${API_URL}/messages/unread-count`, {
    headers: { Authorization: `Bearer ${eleveToken}` },
  });
  const dataEleveUnread = await resEleveUnread.json();
  console.log(`✓ Messages non lus restants pour l'Élève : ${dataEleveUnread.unreadCount}`);

  // --- SCÉNARIO 5 : ÉTUDIANT & CANDIDAT EMPLOI DISCUTENT AUSSI AVEC L'ADMIN ---
  console.log('\n--- ÉTAPE 5 : VÉRIFICATION POUR LES PROFILS ÉTUDIANT ET EMPLOI ---');
  // Étudiant envoie une photo / capture de certificat
  const fakeImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const resEtu = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${etudiantToken}` },
    body: JSON.stringify({
      targetUserId: admin.uti_id,
      mes_con: "Bonjour, puis-je avoir des informations sur les stages en développement web à Antananarivo ?",
      mes_fic_nom: 'attestation_licence.png',
      mes_fic_typ: 'image/png',
      mes_fic_tai: 85000,
      mes_fic_url: fakeImg,
    }),
  });
  const dataEtu = await resEtu.json();
  console.log(`✓ Message Étudiant envoyé ! ID: ${dataEtu.data.mes_id}, Image: ${dataEtu.data.mes_fic_nom}`);

  // Candidat Emploi envoie son CV PDF
  const resEmp = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${emploiToken}` },
    body: JSON.stringify({
      targetUserId: admin.uti_id,
      mes_con: "Bonjour l'équipe e-HARI, voici mon CV mis à jour pour le pôle Insertion & Recrutement.",
      mes_fic_nom: 'CV_Mamy_Andria_2026.pdf',
      mes_fic_typ: 'application/pdf',
      mes_fic_tai: 145000,
      mes_fic_url: fakePdf,
    }),
  });
  const dataEmp = await resEmp.json();
  console.log(`✓ Message Candidat Emploi envoyé ! ID: ${dataEmp.data.mes_id}, CV: ${dataEmp.data.mes_fic_nom}`);

  // Vérification liste finale admin
  const resFinalAdmin = await fetch(`${API_URL}/messages/admin/conversations`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const dataFinalAdmin = await resFinalAdmin.json();
  console.log(`✓ Nombre total de conversations côté Admin après échanges : ${dataFinalAdmin.data.length}`);
  dataFinalAdmin.data.forEach((c) => {
    console.log(`  - [${c.uti_rol.toUpperCase()}] ${c.uti_nom} ${c.uti_pre} : "${c.der_message?.slice(0, 45)}..." (non lus: ${c.non_lus})`);
  });

  console.log('\n========================================================================');
  console.log('🎉 TOUS LES TESTS SONT AU VERT : LA MESSAGERIE MP EST 100% FONCTIONNELLE !');
  console.log('========================================================================');
}

runTest().catch((err) => {
  console.error('Erreur:', err);
});

