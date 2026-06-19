require('dotenv').config();

// Importing required modules
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
require('./config/passport');
const homeRouter = require('./routes/home');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_CONNECTION_STRING);

// Setup EJS
app.set('view engine', 'ejs');

// Body parsers: ensure we parse JSON and urlencoded bodies before method-override
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Robust method-override: honor header, form body `_method`, or query param
app.use(methodOverride(function (req, res) {
    // X-HTTP-Method-Override header (common for proxies/clients)
    const header = req.headers['x-http-method-override'];
    if (header) return header;

    // If body has _method (from forms), use and remove it
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method;
        delete req.body._method;
        return method;
    }

    // Also support ?_method=DELETE in querystring
    if (req.query && '_method' in req.query) {
        return req.query._method;
    }
    return undefined;
}));

// Logger middleware
const logger = require('./middleware/logger');
app.use(logger); 

// Google login Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// JSON and static files middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
const authRouter = require('./routes/auth');
const notesRouter = require('./routes/notes');
const adminRouter = require('./routes/admin');
const crashRouter = require('./routes/crash');

app.use("/", homeRouter);
app.use("/", authRouter);
app.use("/notes", notesRouter);
app.use("/admin", adminRouter);
app.use("/crash", crashRouter);


// Centralized error handler
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});


// Listen to requests on PORT 3000 if this file is run directly
if (require.main === module) {
    app.listen(3000, () => {
        console.log('Server is running');
    });
}

module.exports = app;