// Simple logger middleware to log HTTP method and URL
function logger(req, res, next) {
  console.log(req.method, req.url);
  next();
}

module.exports = logger;

