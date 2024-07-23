const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User=require('../models/User')

module.exports.getAllProducts = async (req, res) => {
    try {
        let username = null;
        const user = await User.findOne({ username: req.user.username });
        if (user) {
            username = user.username;
        }
        const products = await Product.find({});
        res.render('products/index', { products, username });
    } catch (err) {
        res.status(500).send("Error retrieving products");
    }
};

module.exports.addProductToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);
        console.log('product',product)
        if (!product) {
            return res.status(404).send("Product not found");
        }

        const cart = await Cart.findOne({ userId: req.user._id });
        console.log("cart",cart)
        if (!cart) {
            const newCart = new Cart({
                userId: req.user._id,
                products: [{ product: productId, quantity: 1 }]
            });
            console.log("newcart",newCart)
            await newCart.save();
        } else {
            const existingProduct = cart.products.find(p => p.product.toString() === productId);
            console.log("existingProduct",existingProduct)
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }
            await cart.save();
        }

        res.redirect('/cart');
    } catch (err) {
        res.status(500).send("Error adding product to cart");
    }
};

module.exports.updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return res.status(404).send("Cart not found");
        }

        const product = cart.products.find(p => p.product.toString() === productId);
        if (!product) {
            return res.status(404).send("Product not found in cart");
        }

        if (quantity <= 0) {
            cart.products = cart.products.filter(p => p.product.toString() !== productId);
        } else {
            product.quantity = quantity;
        }

        await cart.save();
        res.redirect('/cart');
    } catch (err) {
        res.status(500).send("Error updating cart");
    }
};

module.exports.removeProductFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return res.status(404).send("Cart not found");
        }

        cart.products = cart.products.filter(p => p.product.toString() !== productId);

        await cart.save();
        res.redirect('/cart');
    } catch (err) {
        res.status(500).send("Error removing product from cart");
    }
};

module.exports.getCart = async (req, res) => {
    try {
        let username = null;
        const user = await User.findOne({ username: req.user.username });
        if (user) {
            username = user.username;
        }
        const cart = await Cart.findOne({ userId: req.user._id }).populate('products.product');
        console.log("cart",cart)
        res.render('cart/cart', { cart,username });
    } catch (err) {
        res.status(500).send("Error retrieving cart");
    }
};
