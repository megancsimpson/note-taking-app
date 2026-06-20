const Note = require('../models/Note');
const sanitizeHtml = require('sanitize-html');

const NOTE_SANITIZE_OPTIONS = {
  allowedTags: ['b', 'i', 'em', 'strong', 'u', 's', 'strike', 'h1', 'h2', 'h3', 'p', 'br', 'ul', 'ol', 'li', 'hr', 'a', 'div', 'span', 'input'],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel'],
    input: ['type', 'checked', 'class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
};

const decodeHtmlEntities = (text = '') => {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x([0-9A-Fa-f]+);/g, (_match, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_match, num) => String.fromCharCode(Number(num)));
};

const htmlToText = (html = '') => {
  if (!html) return '';

  const decodedHtml = decodeHtmlEntities(html);
  const withBreaks = decodedHtml
    .replace(/<\s*li[^>]*>/gi, '- ')
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\s*\/\s*(p|div|h[1-6]|li|tr|table|blockquote)[^>]*>/gi, '\n')
    .replace(/<\s*\/\s*(ul|ol|thead|tbody|tfoot)[^>]*>/gi, '\n');

  return withBreaks
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const generatePreview = (html, maxLen = 120) => {
  const text = htmlToText(html);
  if (text) {
    return text.length <= maxLen ? text : `${text.slice(0, maxLen).trimEnd()}...`;
  }

  const fallback = sanitizeHtml(html || '', {
    allowedTags: [],
    allowedAttributes: {},
  }).replace(/\s+/g, ' ').trim();

  if (fallback) {
    return fallback.length <= maxLen ? fallback : `${fallback.slice(0, maxLen).trimEnd()}...`;
  }

  return 'No content available';
};

const sanitizeNoteContent = (content = '') => sanitizeHtml(content, NOTE_SANITIZE_OPTIONS);

const mapNotesWithPreview = (notes) => {
  return notes.map((note) => ({
    ...note.toObject(),
    preview: generatePreview(note.content),
  }));
};

exports.listNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    const notesWithPreview = mapNotesWithPreview(notes);

    const displayMessage = req.query.message
      ? req.query.message
      : notes.length === 0
        ? 'No notes yet. Create one above.'
        : null;
    res.render('notes/notes', { title: 'My Notes', user: req.user, notes: notesWithPreview, searchQuery: null, displayMessage });
  } catch (err) {
    res.status(500).send('Unable to load notes');
  }
};

exports.createNote = async (req, res) => {
  try {
    const cleanContent = sanitizeNoteContent(req.body.content || '');

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
    res.render('notes/create-note', { title: 'Create Note', user: req.user });
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
    res.render('notes/edit-note', { title: 'Edit Note', user: req.user, note });
  } catch (err) {
    res.status(500).send('Unable to load note');
  }
};

exports.updateNote = async (req, res) => {
  try {
    const cleanContent = sanitizeNoteContent(req.body.content || '');

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
    
    const notesWithPreview = mapNotesWithPreview(notes);

    const displayMessage = notes.length === 0 ? `No notes found matching "${query}"` : null;
    res.render('notes/notes', {
      title: 'Search Results',
      user: req.user,
      notes: notesWithPreview,
      searchQuery: query,
      displayMessage
    });
  } catch (err) {
    res.status(500).send('Unable to search notes');
  }
};
