const User=require('../models/User')
const path = require('path');
const Product = require('../models/Product');

module.exports.newForm = async(req, res) => {
    try {
        const user= await User.findOne({username: req.user.username})
        res.render('products/addProduct')
    } catch (error) {
        
    }
};


module.exports.addProduct=async (req, res) => {
    try {
        // Extract form data from req.body and req.file
        const { name, price, author, quantity } = req.body;
        const image = req.file.filename; // Filename as stored by multer

        // Create new product instance
        const newProduct = new Product({ name, image, price, author, quantity });

        // Save product to database
        await newProduct.save();

        // Redirect to product list or success page
        res.redirect('products');
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
        const { name, image, price, author, quantity } = req.body;
        await Product.findByIdAndUpdate(req.params.id, { name, image, price, author, quantity });
        res.redirect('/'); // Redirect to the product list page after update
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Error updating product');
    }
};



module.exports.index = async (req, res) => {
    try {
        const products = await Product.find().sort({ _id: -1 })
        res.render('products/index', { products }); // Render a view to display products
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
};


module.exports.addToCart = async (req, res) => {
    try {
        const productId = req.params.id; // Assuming product ID is passed as a parameter
        const quantity = parseInt(req.body.quantity); // Assuming quantity is passed in the request body

        if (!req.session.cart) {
            req.session.cart = []; // Initialize cart if it doesn't exist in the session
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

        res.redirect('/prodcuts/cart'); // Redirect to the cart page or respond with a success message
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send('Error adding to cart');
    }
};


module.exports.deleteProduct = async (req, res) => {
    try {
        const productExists = await Product.exists({ _id: req.params.id });

        if (productExists) {
            const deleteProduct = req.params.id;
            await Product.findByIdAndRemove(deleteProduct);
            res.redirect('/');
        } else {
            res.status(404).send("Product not found");
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Error deleting product');
    }
};



