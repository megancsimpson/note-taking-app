const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

router.get('/', ensureAuthenticated, notesController.listNotes);
router.get('/search', ensureAuthenticated, notesController.searchNotes);
router.get('/new', ensureAuthenticated, notesController.showCreateNote);
router.post('/', ensureAuthenticated, notesController.createNote);
router.get('/:id/edit', ensureAuthenticated, notesController.showEditNote);
router.put('/:id', ensureAuthenticated, notesController.updateNote);
router.delete('/:id', ensureAuthenticated, notesController.deleteNote);

module.exports = router;
