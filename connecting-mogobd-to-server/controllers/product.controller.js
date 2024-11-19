const { ProductModel } = require('../models/product.models');

module.exports = {
    getProducts: async (req, res) => {
        try {
            const query = {};

            // Apply price filters if available in the query parameters
            if (req.query.gt) {
                query.price = { $gt: parseInt(req.query.gt) };
            }
            if (req.query.lt) {
                query.price = { ...query.price, $lt: parseInt(req.query.lt) };
            }

            // Find products matching the query and return the count
            const count = await ProductModel.find(query).countDocuments();
            const products = await ProductModel.find(query)
                .sort({ price: -1 })
                .select({ _id: 0, title: 1, price: 1, description: 1 });

            // Respond with the list of products and total count
            res.status(200).json({ products, count });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get a product by its ID
    getProductById: async (req, res) => {
        try {
            const product = await ProductModel.findById(req.params.id, {
                title: 1,
                price: 1,
                description: 1,
                _id: 0
            });

            if (!product) {
                return res.status(404).json({ message: "Product not found!" });
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Add a new product
    addProduct: async (req, res) => {
        try {
            const newProduct = new ProductModel({
                title: req.body.title,
                price: req.body.price,
                description: req.body.description
            });
            const savedProduct = await newProduct.save();
            res.status(201).json(savedProduct);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update an existing product by its ID
    updateProduct: async (req, res) => {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(
                req.body._id,
                { $set: { price: req.body.price } },
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ message: "Product not found!" });
            }
            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete a product by its ID
    deleteProduct: async (req, res) => {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);

            if (!deletedProduct) {
                return res.status(404).json({ message: "Product not found!" });
            }

            res.status(200).json({ message: "Product deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};