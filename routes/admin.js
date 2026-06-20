const express = require("express");

const adminController = require('../controllers/adminController');
const { ensureToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', ensureToken, adminController.getAdminHome);

module.exports = router;

