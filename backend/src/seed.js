const fs = require('fs');
const path = require('path');
const db = require('./db');

const WORD_TYPES = [
  'Noun', 'Verb', 'Adjective', 'Adverb', 'Pronoun',
  'Preposition', 'Conjunction', 'Determiner', 'Exclamation',
];

const WORDS_BY_TYPE = {
  Noun: ['dog', 'city', 'teacher', 'mountain', 'bottle', 'idea'],
  Verb: ['run', 'build', 'whisper', 'jump', 'consider', 'write'],
  Adjective: ['quiet', 'brilliant', 'rusty', 'enormous', 'gentle', 'blue'],
  Adverb: ['quickly', 'softly', 'rarely', 'happily', 'yesterday', 'here'],
  Pronoun: ['she', 'they', 'it', 'we', 'who', 'someone'],
  Preposition: ['under', 'beside', 'through', 'before', 'with', 'into'],
  Conjunction: ['and', 'but', 'because', 'although', 'or', 'so'],
  Determiner: ['the', 'a', 'this', 'every', 'some', 'my'],
  Exclamation: ['wow', 'ouch', 'hey', 'oh', 'alas', 'hooray'],
};

// A robot did this: seeds word types + a starter vocabulary. Safe to re-run,
// everything is guarded with ON CONFLICT / existence checks.
async function seed() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await db.query(schema);

  for (const name of WORD_TYPES) {
    await db.query(
      `INSERT INTO word_types (name) VALUES ($1)
       ON CONFLICT (name) DO NOTHING`,
      [name]
    );
  }

  const { rows: types } = await db.query('SELECT id, name FROM word_types');
  const typeIdByName = Object.fromEntries(types.map((t) => [t.name, t.id]));

  for (const [typeName, words] of Object.entries(WORDS_BY_TYPE)) {
    const typeId = typeIdByName[typeName];
    for (const word of words) {
      const { rows } = await db.query(
        'SELECT id FROM words WHERE text = $1 AND type_id = $2',
        [word, typeId]
      );
      if (rows.length === 0) {
        await db.query(
          'INSERT INTO words (text, type_id) VALUES ($1, $2)',
          [word, typeId]
        );
      }
    }
  }

  console.log('Seed complete: word types and starter vocabulary loaded.');
  await db.pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
