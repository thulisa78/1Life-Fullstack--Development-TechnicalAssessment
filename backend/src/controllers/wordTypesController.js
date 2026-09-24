const db = require('../db');

async function listWordTypes(req, res) {
  try {
    const { rows } = await db.query(
      'SELECT id, name FROM word_types ORDER BY id ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load word types' });
  }
}

module.exports = { listWordTypes };
