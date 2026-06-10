// Simple authentication middleware to check for token in headers
function auth(req, res, next) {
  if (!req.headers.token) {
    return res.status(401).send("Unauthorized")
  }
  next()
}

module.exports = auth;