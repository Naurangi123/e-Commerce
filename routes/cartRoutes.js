// const express = require('express');
// const router = express.Router();
// const Cart = require('../models/Cart');
// const Product = require('../models/Product');

// // Get cart by user
// router.get('/add-cart/:id', async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ user: req.params.id }).populate('products.product');
//         res.redirect('/cart',{cart})
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// });

// // Add to cart
// router.post('/add-cart/:id', async (req, res) => {
//     const userId = req.params.id;
//     const { productId, quantity } = req.body;

//     try {
//         let cart = await Cart.findOne({ user: userId });
//         if (!cart) {
//             cart = new Cart({ user: userId, products: [] });
//         }

//         const product = await Product.findById(productId);
//         if (!product) return res.status(404).json({ msg: 'Product not found' });

//         const existingProduct = cart.products.find(p => p.product.toString() === productId);
//         if (existingProduct) {
//             existingProduct.quantity += parseInt(quantity);
//         } else {
//             cart.products.push({ product: productId, quantity: parseInt(quantity) });
//         }

//         await cart.save();
//         res.redirect('/cart');

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// });
// module.exports = router;

const express = require('express');
const router = express.Router();

router.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    res.render('cart/edit', { cart });
});

router.post('/cart/update/:index', (req, res) => {
    const cart = req.session.cart || [];
    const index = req.params.index;
    const quantity = req.body.quantity;

    if (cart[index]) {
        cart[index].quantity = quantity;
    }

    req.session.cart = cart;
    res.redirect('/cart');
});

router.post('/cart/remove/:index', (req, res) => {
    const cart = req.session.cart || [];
    const index = req.params.index;

    if (cart[index]) {
        cart.splice(index, 1);
    }

    req.session.cart = cart;
    res.redirect('/cart');
});

module.exports = router;

