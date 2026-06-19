const Note = require('../models/Note');
const sanitizeHtml = require('sanitize-html');

exports.listNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    const displayMessage = req.query.message
      ? req.query.message
      : notes.length === 0
        ? 'No notes yet. Create one above.'
        : null;
    res.render('notes', { title: 'My Notes', user: req.user, notes, searchQuery: null, displayMessage });
  } catch (err) {
    res.status(500).send('Unable to load notes');
  }
};

exports.createNote = async (req, res) => {
  try {
    const cleanContent = sanitizeHtml(req.body.content || '', {
      allowedTags: ['b','i','em','strong','u','s','strike','h1','h2','h3','p','br','ul','ol','li','hr','a','div','span','input'],
      allowedAttributes: {
        a: ['href','name','target','rel'],
        input: ['type','checked','class']
      },
      allowedSchemes: ['http','https','mailto']
    });

    const note = new Note({
      userId: req.user.id,
      title: req.body.title || 'Untitled note',
      content: cleanContent,
    });
    await note.save();
    res.redirect('/notes');
  } catch (err) {
    res.status(500).send('Unable to create note');
  }
};

exports.showCreateNote = async (req, res) => {
  try {
    res.render('create-note', { title: 'Create Note', user: req.user });
  } catch (err) {
    res.status(500).send('Unable to load note creation page');
  }
};

exports.showEditNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) {
      return res.redirect('/notes');
    }
    res.render('edit-note', { title: 'Edit Note', user: req.user, note });
  } catch (err) {
    res.status(500).send('Unable to load note');
  }
};

exports.updateNote = async (req, res) => {
  try {
    const cleanContent = sanitizeHtml(req.body.content || '', {
      allowedTags: ['b','i','em','strong','u','s','strike','h1','h2','h3','p','br','ul','ol','li','hr','a','div','span','input'],
      allowedAttributes: {
        a: ['href','name','target','rel'],
        input: ['type','checked','class']
      },
      allowedSchemes: ['http','https','mailto']
    });

    await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        title: req.body.title || 'Untitled note',
        content: cleanContent,
        updatedAt: Date.now(),
      },
    );
    res.redirect('/notes');
  } catch (err) {
    res.status(500).send('Unable to update note');
  }
};

exports.deleteNote = async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.redirect('/notes?message=' + encodeURIComponent('Note deleted.'));
  } catch (err) {
    res.status(500).send('Unable to delete note');
  }
};

exports.searchNotes = async (req, res) => {
  try {
    const query = req.query.q || '';
    const notes = await Note.find({
      userId: req.user.id,
      title: { $regex: `^${query}`, $options: 'i' }
    }).sort({ updatedAt: -1 });
    
    const displayMessage = notes.length === 0 ? `No notes found matching "${query}"` : null;
    res.render('notes', {
      title: 'Search Results',
      user: req.user,
      notes,
      searchQuery: query,
      displayMessage
    });
  } catch (err) {
    res.status(500).send('Unable to search notes');
  }
};
