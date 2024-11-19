const express = require('express');
const connectDB = require('./config/db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();


// Product routes
app.use(require('./routes/product.routes'));

// Basic home route
app.get("/", (req, res) => {
    res.send("<h1>Welcome to the Home page.</h1>");
});

module.exports = app;