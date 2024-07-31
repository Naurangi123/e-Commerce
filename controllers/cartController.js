const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User=require('../models/User')
const mongoose=require('mongoose')


module.exports.addProductToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return req.flash("error","Invalid productId");
        }
        const product = await Product.findById(productId);

        if (!product) {
            return req.flash("error","Product not found");
        }
        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            const newCart = new Cart({
                userId: req.user._id,
                products: [{ product: productId, quantity: 1 }]
            });
            await newCart.save();
            return res.redirect('/'); 
        }

        const existingProductIndex = cart.products.findIndex(p => {
            return p.product?.toString() === productId.toString();
        });
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();
        res.redirect('/');
    } catch (err) {
        req.flash("error","Error adding product to cart");
    }
};

module.exports.updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return req.flash("error","Cart not found");
        }

        const product = cart.products.find(p => p.product.toString() === productId);
        if (!product) {
            return req.flash("error","Product not found in cart");
        }

        if (quantity <= 0) {
            cart.products = cart.products.filter(p => p.product.toString() !== productId);
        } else {
            product.quantity = quantity;
        }

        await cart.save();
        res.redirect('/cart');
    } catch (err) {
        req.flash("error","Error updating cart");
    }
};

module.exports.removeProductFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return req.flash("error","Cart not found");
        }

        cart.products = cart.products.filter(p => p.product.toString() !== productId);

        await cart.save();
        res.redirect('/cart');
    } catch (err) {
        req.flash("error","Error removing product from cart");
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
        res.render('cart/cart', { cart,username });
    } catch (err) {
        req.flash('error',"Error retrieving cart");
    }
};
