function ensureToken(req, res, next) {
  if (!req.headers.token) {
    return res.status(401).send('Unauthorized');
  }
  return next();
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
}

module.exports = {
  ensureToken,
  ensureAuthenticated,
};