const { query, pool } = require('../config/db');

async function inspectSchema() {
  const codeCols = await query(`
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND (column_name LIKE '%code%' OR column_name LIKE '%_cod%')
    ORDER BY table_name, column_name;
  `);
  console.log('--- COLONNES AVEC CODE ---');
  for (const c of codeCols.rows) {
    console.log(`Table: ${c.table_name} | Colonne: ${c.column_name} (${c.data_type})`);
  }

  const allTables = await query(`
    SELECT table_name, table_type
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_type, table_name;
  `);
  console.log('\n--- TOUTES LES TABLES ET VUES ---');
  for (const t of allTables.rows) {
    console.log(`${t.table_type}: ${t.table_name}`);
  }
}

inspectSchema().then(() => pool.end()).catch(err => { console.error(err); process.exit(1); });

