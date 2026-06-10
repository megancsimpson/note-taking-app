const express = require('express'); 
const router = express.Router(); 

// Home route
router.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

// Export the router to be used in index.js
module.exports = router;
