
// const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');

// // Registration schema
// const registerSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     password: { type: String, required: true },
//     confirmPassword: { type: String, required: true }
// });

// // Login schema
// const loginSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     email:{type:String,required:true},
//     password: { type: String, required: true },
//     isAdmin: { type: Boolean, default: false }
// });

// // Use the passport-local-mongoose plugin on the login schema
// loginSchema.plugin(passportLocalMongoose);

// // Create the User model from the login schema
// const User = mongoose.model('User', loginSchema);

// // Export the User model
// module.exports = User;


