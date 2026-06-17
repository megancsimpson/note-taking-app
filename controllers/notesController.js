const Note = require('../models/Note');

exports.listNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.render('notes', { title: 'My Notes', user: req.user, notes });
  } catch (err) {
    res.status(500).send('Unable to load notes');
  }
};

exports.createNote = async (req, res) => {
  try {
    const note = new Note({
      userId: req.user.id,
      title: req.body.title || 'Untitled note',
      content: req.body.content || '',
    });
    await note.save();
    res.redirect('/notes');
  } catch (err) {
    res.status(500).send('Unable to create note');
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
    await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        title: req.body.title || 'Untitled note',
        content: req.body.content || '',
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
    res.redirect('/notes');
  } catch (err) {
    res.status(500).send('Unable to delete note');
  }
};
