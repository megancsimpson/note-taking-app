const session = require('express-session');

function createSessionMiddleware() {
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  });
}

module.exports = {
  createSessionMiddleware,
};
