require('dotenv').config();

// Importing required modules
const session = require('express-session');
const passport = require('passport');
require('./config/passport');
const homeRouter = require('./routes/home');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.static("public"));

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_CONNECTION_STRING);

// Setup EJS
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

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
const adminRouter = require('./routes/admin');
const crashRouter = require('./routes/crash');

app.use("/", homeRouter);
app.use("/", authRouter);
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