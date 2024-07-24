const mongoose = require("mongoose");

// const itemSchema = mongoose.Schema({
//   product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//   quantity: { type: Number, default: 1 },
// });

// const cartSchema = mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   products: [itemSchema],
//   total: { type: Number, default: 0 },
//   __v: { type: Number, select: false },
// });

// module.exports = mongoose.model("Cart", cartSchema);

// Assuming you have mongoose imported and connected to your database



// Define Cart schema
const cartSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 }
    }]
});

// Create Cart model
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

