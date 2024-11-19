const mongoose = require('mongoose');

// Async function to connect to MongoDB database
const connectDB = async () => {
    try {
        // Connect to the MongoDB database (change the URI as needed)
        await mongoose.connect("mongodb://localhost:27017/ProductDB", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database is connected.');
    } catch (error) {
        // Log any errors and terminate the process
        console.error('Database connection error: ', error);
        process.exit(1);
    }
};

// Export the connection function to be used in app.js
module.exports = connectDB;