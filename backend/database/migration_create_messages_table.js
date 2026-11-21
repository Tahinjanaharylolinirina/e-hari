const { query } = require('../config/db');

async function migrate() {
  console.log('--- Migration : Création de la table message ---');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS message (
      mes_id SERIAL PRIMARY KEY,
      mes_exp_id INTEGER NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
      mes_des_id INTEGER NOT NULL REFERENCES utilisateur(uti_id) ON DELETE CASCADE,
      mes_con TEXT,
      mes_fic_nom VARCHAR(255),
      mes_fic_typ VARCHAR(100),
      mes_fic_tai INTEGER,
      mes_fic_url TEXT,
      mes_lu BOOLEAN DEFAULT FALSE,
      mes_dat_cre TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_mes_exp_id ON message(mes_exp_id);
    CREATE INDEX IF NOT EXISTS idx_mes_des_id ON message(mes_des_id);
    CREATE INDEX IF NOT EXISTS idx_mes_conv ON message(mes_exp_id, mes_des_id);
    CREATE INDEX IF NOT EXISTS idx_mes_dat_cre ON message(mes_dat_cre);
  `;

  await query(createTableQuery);
  console.log('Table message créée avec succès avec index de recherche et intégrité référentielle.');

  // Mettre à jour schema.sql pour la documentation
  process.exit(0);
}

migrate().catch(err => {
  console.error('Erreur migration:', err);
  process.exit(1);
});

