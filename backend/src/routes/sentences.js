const express = require('express');
const {
  listSentences,
  getSentence,
  createSentence,
  updateSentence,
} = require('../controllers/sentencesController');

const router = express.Router();

router.get('/', listSentences);
router.get('/:id', getSentence);
router.post('/', createSentence);
router.put('/:id', updateSentence);

module.exports = router;
