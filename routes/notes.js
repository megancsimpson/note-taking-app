const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', ensureAuthenticated, notesController.listNotes);
router.get('/search', ensureAuthenticated, notesController.searchNotes);
router.get('/new', ensureAuthenticated, notesController.showCreateNote);
router.post('/', ensureAuthenticated, notesController.createNote);
router.get('/:id/edit', ensureAuthenticated, notesController.showEditNote);
router.put('/:id', ensureAuthenticated, notesController.updateNote);
router.delete('/:id', ensureAuthenticated, notesController.deleteNote);

module.exports = router;
