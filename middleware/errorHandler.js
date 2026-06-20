function notFoundHandler(req, res) {
  res.status(404).send('Not Found');
}

function errorHandler(err, req, res, next) {
  res.status(500).json({ message: err.message });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
