const User=require('../models/User')
const path = require('path');
const Product = require('../models/Product');
const isAuthenticated=require('../middleware/auth')

module.exports.newForm = (req, res) => {
        res.render('products/addProduct')
};

module.exports.addProduct=async (req, res) => {
    try {
        const { name, price, author, quantity } = req.body;
        const image = req.file.filename; 
        const newProduct = new Product({ name, image, price, author, quantity });
        await newProduct.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('Error creating product');
    }
}


module.exports.editForm = async (req, res) => {
    try {
        const product = await Product.findById(req.params._id);
        if (!product) {
            res.status(404).send('Product not found');
            return;
        }
        res.render('products/editProduct', { product }); // Corrected template path
    } catch (error) {
        console.error('Error fetching product for edit:', error);
        res.status(500).send('Error fetching product for edit');
    }
};



module.exports.updateProduct = async (req, res) => {
    try {
        const { name, price, author, quantity } = req.body;
        const image = req.file.filename; 
        await Product.findByIdAndUpdate(req.params._id, { name, image, price, author, quantity });

        res.redirect('/'); // Redirect to the product list page after update
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Error updating product');
    }
};

module.exports.cartForm = (req, res) => {
    res.render('products/addCart')
};

module.exports.addToCart = async (req, res) => {
    try {
        const product_id = await Product.exists({ _id: req.params._id });
        const productId = product_id 
        const quantity = parseInt(req.body.quantity);

        if (!req.session.cart) {
            req.session.cart = []; 
        }

        let cart = req.session.cart;
        let found = false;

        // Check if the product is already in the cart
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].productId === productId) {
                cart[i].quantity += quantity;
                found = true;
                break;
            }
        }
        // If the product is not already in the cart, add it
        if (!found) {
            cart.push({ productId, quantity });
        }
        req.session.cart = cart; // Save updated cart back to the session

        res.redirect('/cart'); // Redirect to the cart page or respond with a success message
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send('Error adding to cart');
    }
};

module.exports.deleteProduct = async (req, res) => {
    try {
        const productExists = await Product.exists({ _id: req.params._id }); // Ensure consistent naming (_id)

        if (productExists) {
            const deletedProduct = await Product.findByIdAndDelete(req.params._id);
            if (deletedProduct) {
                res.redirect('/');
            } else {
                res.status(404).send("Product not found");
            }
        } else {
            res.status(404).send("Product not found");
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Error deleting product');
    }
};




