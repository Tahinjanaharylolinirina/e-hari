const { pool } = require('../config/db');

async function migrateEdtFormat() {
  try {
    const SCHEDULE_HOURS = [
      '05:00 - 06:00', '06:00 - 07:00', '07:00 - 08:00', '08:00 - 09:00',
      '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00',
      '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00',
      '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00',
    ];

    const records = await pool.query('SELECT edt_id, edt_uti_id, edt_don FROM emploi_du_temps');

    for (const row of records.rows) {
      const data = row.edt_don;
      if (!data) continue;

      let cleanTasks = {};

      if (data.weeklyGrid) {
        Object.entries(data.weeklyGrid).forEach(([day, slots]) => {
          const dayTasks = {};
          SCHEDULE_HOURS.forEach((h, idx) => {
            const val = (slots[h] || '').trim();
            if (val && val.toLowerCase() !== 'libre' && val.toLowerCase() !== 'repos') {
              dayTasks[String(idx + 1)] = val;
            }
          });
          if (Object.keys(dayTasks).length > 0) {
            cleanTasks[day] = dayTasks;
          }
        });
      } else {
        cleanTasks = data;
      }

      await pool.query(
        'UPDATE emploi_du_temps SET edt_don = $1, edt_dat_mod = CURRENT_TIMESTAMP WHERE edt_id = $2',
        [JSON.stringify(cleanTasks), row.edt_id]
      );

      await pool.query(
        'UPDATE profil_eleve SET ele_edt_rev = $1, ele_dat_mod = CURRENT_TIMESTAMP WHERE ele_uti_id = $2',
        [JSON.stringify(cleanTasks), row.edt_uti_id]
      );

      console.log(`✅ Élève ID ${row.edt_uti_id} migré au format épuré :`, cleanTasks);
    }

    console.log('🎉 Migration du format EDT terminée avec succès !');
  } catch (err) {
    console.error('❌ Erreur migration format EDT :', err);
  } finally {
    await pool.end();
  }
}

migrateEdtFormat();

