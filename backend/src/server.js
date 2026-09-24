// A robot did this: application entry point - wires up middleware, mounts
// the three route groups, and starts the HTTP server.
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const wordTypesRouter = require('./routes/wordTypes');
const wordsRouter = require('./routes/words');
const sentencesRouter = require('./routes/sentences');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/word-types', wordTypesRouter);
app.use('/api/words', wordsRouter);
app.use('/api/sentences', sentencesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sentence Builder API listening on http://localhost:${PORT}`);
});
