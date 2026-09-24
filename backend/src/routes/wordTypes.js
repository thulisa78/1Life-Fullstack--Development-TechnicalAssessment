const express = require('express');
const { listWordTypes } = require('../controllers/wordTypesController');

const router = express.Router();
router.get('/', listWordTypes);

module.exports = router;
