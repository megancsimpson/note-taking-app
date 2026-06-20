const express = require("express");
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.googleAuthCallback, authController.redirectAfterLogin);
router.get('/logout', authController.logout);

module.exports = router;