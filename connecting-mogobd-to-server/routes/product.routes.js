const router = require('express').Router();
const productController = require('../controllers/product.controller');

// Define routes for CRUD operations on products
router.get('/products', productController.getProducts);                // Get all products
router.get('/products/:id', productController.getProductById);          // Get product by ID
router.post('/products', productController.addProduct);                // Add a new product
router.put('/products', productController.updateProduct);              // Update a product
router.delete('/products/:id', productController.deleteProduct);        // Delete a product

module.exports = router;