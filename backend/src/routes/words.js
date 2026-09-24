const express = require('express');
const { listWords } = require('../controllers/wordsController');

const router = express.Router();
router.get('/', listWords);

module.exports = router;
