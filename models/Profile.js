const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const profileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    image:{type:String,required:true},
    bio:{type:String,required:true},
    location:{type:String,required:true},
    username: { type: String, unique: true } 
});

profileSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Profile', profileSchema);