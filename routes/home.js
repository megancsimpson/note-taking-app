const express = require('express'); 
const router = express.Router(); 

// Home route
router.get('/', (req, res) => {
  res.render('home', {
    title: 'Home',
    user: req.user || null
  });
});

router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    user: req.user || null
  });
});

// Export the router to be used in index.js
module.exports = router;
