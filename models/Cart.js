const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 0 },
});

const cartSchema = mongoose.Schema({
  products: [itemSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  total: { type: Number, default: 0 },
  __v: { type: Number, select: false },
});

module.exports = mongoose.model("Cart", cartSchema);
