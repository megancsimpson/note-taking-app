const express = require("express");
const crashController = require('../controllers/crashController');

const router = express.Router();

router.get('/', crashController.crash);

module.exports = router;

