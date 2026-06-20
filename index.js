const { loadEnv } = require('./config/env');
loadEnv();

const passport = require('passport');
const express = require('express');
const { connectDatabase } = require('./config/database');
const { createSessionMiddleware } = require('./config/session');
const { createMethodOverrideMiddleware } = require('./config/methodOverride');
const { requestLogger } = require('./middleware/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

require('./config/passport');
const app = express();

connectDatabase(process.env.MONGO_CONNECTION_STRING).catch((err) => {
    console.error('MongoDB connection failed:', err.message);
});

// Setup EJS
app.set('view engine', 'ejs');

// Body parsers: ensure we parse JSON and urlencoded bodies before method-override
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(createMethodOverrideMiddleware());

app.use(createSessionMiddleware());
app.use(passport.initialize());
app.use(passport.session());

// JSON and static files middleware
app.use(express.static('public'));

// Routes
const homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');
const notesRouter = require('./routes/notes');
const adminRouter = require('./routes/admin');
const crashRouter = require('./routes/crash');

app.use("/", homeRouter);
app.use("/", authRouter);
app.use("/notes", notesRouter);
app.use("/admin", adminRouter);
app.use("/crash", crashRouter);


app.use(notFoundHandler);
app.use(errorHandler);


// Listen to requests on PORT 3000 if this file is run directly
if (require.main === module) {
    app.listen(3000, () => {
        console.log('Server is running');
    });
}

module.exports = app; // Export app for testing