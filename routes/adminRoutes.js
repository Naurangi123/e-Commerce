const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();
const upload=require('../middleware/upload')
const Product = require('../models/Product');


router.get('/', productController.index);
router.get('/addProduct', productController.newForm);


router.post('/', upload, async (req, res) => {
    try {
        // Extract form data from req.body and req.file
        const { name, price, author, quantity } = req.body;
        const image = req.file.filename; // Filename as stored by multer

        // Create new product instance
        const newProduct = new Product({ name, image, price, author, quantity });

        // Save product to database
        await newProduct.save();

        // Redirect to product list or success page
        res.redirect('products/index');
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('Error creating product');
    }
});


router.get('/products/:_id/edit', productController.editForm);
router.put('/:_id', productController.updateProduct);
router.post('/:_id/addCart', productController.addToCart);
router.delete('/:_id', productController.deleteProduct);

module.exports = router;


