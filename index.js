require('dotenv').config();

// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.static("public"));

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_CONNECTION_STRING);

// Setup EJS
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use("/", homeRouter);

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
