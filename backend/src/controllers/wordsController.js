const db = require('../db');

// Returns words, optionally filtered to one word type via ?typeId=
async function listWords(req, res) {
  try {
    const { typeId } = req.query;
    const params = [];
    let sql = 'SELECT id, text, type_id FROM words';
    if (typeId) {
      params.push(typeId);
      sql += ' WHERE type_id = $1';
    }
    sql += ' ORDER BY text ASC';
    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load words' });
  }
}

module.exports = { listWords };
