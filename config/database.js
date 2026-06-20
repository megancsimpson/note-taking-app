const mongoose = require('mongoose');

async function connectDatabase(uri) {
  if (!uri) {
    throw new Error('MONGO_CONNECTION_STRING is not configured');
  }

  await mongoose.connect(uri);
}

module.exports = {
  connectDatabase,
};
