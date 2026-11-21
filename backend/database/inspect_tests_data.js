const { query, pool } = require('../config/db');

async function checkTestsData() {
  const te1 = await query('SELECT * FROM tests_eleves_1');
  const te2 = await query('SELECT * FROM tests_eleves_2');
  const tet1 = await query('SELECT * FROM tests_etudiants_1');
  const tet2 = await query('SELECT * FROM tests_etudiants_2');
  const tem1 = await query('SELECT * FROM tests_emploi_1');
  const tem2 = await query('SELECT * FROM tests_emploi_2');

  console.log(`tests_eleves_1: ${te1.rows.length} rows`);
  console.log(`tests_eleves_2: ${te2.rows.length} rows`);
  console.log(`tests_etudiants_1: ${tet1.rows.length} rows`);
  console.log(`tests_etudiants_2: ${tet2.rows.length} rows`);
  console.log(`tests_emploi_1: ${tem1.rows.length} rows`);
  console.log(`tests_emploi_2: ${tem2.rows.length} rows`);

  if (te1.rows.length > 0) console.log('Sample te1:', te1.rows[0]);
  if (te2.rows.length > 0) console.log('Sample te2:', te2.rows[0]);
  if (tet1.rows.length > 0) console.log('Sample tet1:', tet1.rows[0]);
  if (tem1.rows.length > 0) console.log('Sample tem1:', tem1.rows[0]);
}

checkTestsData().then(() => pool.end()).catch(err => { console.error(err); process.exit(1); });

