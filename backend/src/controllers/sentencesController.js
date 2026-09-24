const db = require('../db');

// A robot did this: CRUD for saved sentences - list, fetch one, create, update.
// No delete route for now, wasn't asked for and didn't want to guess at
// soft-delete vs hard-delete without knowing what's expected.

async function listSentences(req, res) {
  try {
    const { rows } = await db.query(
      'SELECT * FROM sentences ORDER BY updated_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load sentences' });
  }
}

async function getSentence(req, res) {
  try {
    const { rows } = await db.query('SELECT * FROM sentences WHERE id = $1', [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Sentence not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load sentence' });
  }
}

async function createSentence(req, res) {
  try {
    const { title, content, wordIds } = req.body;

    // content and wordIds should always travel together, but validate both
    // since we can't trust the client to keep them in sync.
    if (!content || !Array.isArray(wordIds)) {
      return res
        .status(400)
        .json({ error: 'content and wordIds[] are required' });
    }

    const { rows } = await db.query(
      `INSERT INTO sentences (title, content, word_ids)
       VALUES ($1, $2, $3) RETURNING *`,
      [title || 'Untitled sentence', content, wordIds]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save sentence' });
  }
}

async function updateSentence(req, res) {
  try {
    const { title, content, wordIds } = req.body;
    if (!content || !Array.isArray(wordIds)) {
      return res
        .status(400)
        .json({ error: 'content and wordIds[] are required' });
    }

    const { rows } = await db.query(
      `UPDATE sentences
       SET title = $1, content = $2, word_ids = $3, updated_at = now()
       WHERE id = $4 RETURNING *`,
      [title || 'Untitled sentence', content, wordIds, req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Sentence not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update sentence' });
  }
}

module.exports = {
  listSentences,
  getSentence,
  createSentence,
  updateSentence,
};
