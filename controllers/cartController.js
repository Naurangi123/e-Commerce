const { isValidObjectId } = require("mongoose");
const Cart = require("../models/Cart");
const User = require("../models/User");


module.exports.getAllItem= async (req, res) => {
    const userId = req.params.userId;
    console.log("userId",userId)
    try {
        const cart = await Cart.findOne({ _id: userId });
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

module.exports.addItemToCart = async (req, res) => {
    let userId = req.params.userId;
    console.log("userId",userId)
    if (!userId || !isValidObjectId(userId) || !(await User.exists({ _id: userId }))) {
        console.log("userId",userId)
        return res.status(400).send({ status: false, message: "Invalid user ID" });
    }

    let productId = req.body.productId;
    if (!productId) {
        return res.status(400).send({ status: false, message: "Invalid product" });
    }

    try {
        let cart = await Cart.findOne({ _id: userId });
        if (cart) {
            let itemIndex = cart.products.findIndex((p) => p.productId == productId);
            if (itemIndex > -1) {
                cart.products[itemIndex].quantity += 1;
            } else {
                cart.products.push({ productId: productId, quantity: 1 });
            }
            cart = await cart.save();
            return res.redirect("addCart",{ updatedCart: cart });
        } else {
            const newCart = await Cart.create({ _id: userId, products: [{ productId: productId, quantity: 1 }] });
            return res.render("newcart",{ newCart: newCart });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports.getCart = async (req, res) => {
    let userId = req.params.userId;
    if (!userId || !isValidObjectId(userId) || !(await User.exists({ _id: userId }))) {
        return res.status(400).send({ status: false, message: "Invalid user ID" });
    }
    try {
        let cart = await Cart.findOne({ _id: userId });
        if (!cart) {
            return res.status(404).send({ status: false, message: "Cart not found for this user" });
        }
        res.redirect('cart',{cart: cart });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports.deleteItem = async (req, res) => {
    let userId = req.params.userId;
    let productId = req.body.productId;

    if (!userId || !isValidObjectId(userId) || !(await User.exists({ _id: userId }))) {
        return res.status(400).send({ status: false, message: "Invalid user ID" });
    }

    try {
        let cart = await Cart.findOne({ _id: userId });
        if (!cart) {
            return res.status(404).send({ status: false, message: "Cart not found for this user" });
        }

        let itemIndex = cart.products.findIndex((p) => p.productId == productId);
        if (itemIndex > -1) {
            cart.products[itemIndex].quantity -= 1;
            if (cart.products[itemIndex].quantity <= 0) {
                cart.products.splice(itemIndex, 1);
            }
            cart = await cart.save();
            return res.status(200).send({ status: true, updatedCart: cart });
        } else {
            return res.status(400).send({ status: false, message: "Item does not exist in cart" });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

module.exports.removeItem = async (req, res) => {
    let userId = req.params.userId;
    let productId = req.body.productId;

    if (!userId || !isValidObjectId(userId) || !(await User.exists({ _id: userId }))) {
        return res.status(400).send({ status: false, message: "Invalid user ID" });
    }

    try {
        let cart = await Cart.findOne({ _id: userId });
        if (!cart) {
            return res.status(404).send({ status: false, message: "Cart not found for this user" });
        }

        let itemIndex = cart.products.findIndex((p) => p.productId == productId);
        if (itemIndex > -1) {
            cart.products.splice(itemIndex, 1);
            cart = await cart.save();
            return res.status(200).send({ status: true, updatedCart: cart });
        } else {
            return res.status(400).send({ status: false, message: "Item does not exist in cart" });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};
