const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// Registration schema
const registerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
});

registerSchema.plugin(passportLocalMongoose);

const Register = mongoose.model("Register", registerSchema);

module.exports = Register;
