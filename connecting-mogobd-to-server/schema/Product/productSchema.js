const mongoose = require('mongoose');

// Product schema for MongoDB
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Product title is required."],
        minlength: [3, "Product title length must be at least 3."],
        maxlength: [100, "Product title length must be under 100."],
        lowercase: true,
        enum: {
            values: ["Samsung", "Apple"],
            message: "{VALUE} is not supported."
        }
    },
    price: {
        type: Number,
        required: true,
        min: [100, "Price must be at least 100."],
        max: [2000, "Price must be under 2000."]
    },
    email: {
        type: String,
        unique: [true, "Email already exists!"]
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Product", productSchema);