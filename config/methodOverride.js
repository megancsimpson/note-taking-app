const methodOverride = require('method-override');

function createMethodOverrideMiddleware() {
  return methodOverride((req) => {
    const header = req.headers['x-http-method-override'];
    if (header) return header;

    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }

    if (req.query && '_method' in req.query) {
      return req.query._method;
    }

    return undefined;
  });
}

module.exports = {
  createMethodOverrideMiddleware,
};
