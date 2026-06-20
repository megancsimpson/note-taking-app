const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

router.get('/', homeController.renderHome);
router.get('/about', homeController.renderAbout);

// Export the router to be used in index.js
module.exports = router;
