const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
});

const cartSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [itemSchema],
  total: { type: Number, default: 0 },
  __v: { type: Number, select: false },
});

module.exports = mongoose.model("Cart", cartSchema);
