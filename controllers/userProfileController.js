// routes/profile.js
const Profile = require('../models/Profile');
const User=require('../models/User')
const Product=require('../models/Product')
const Cart=require('../models/Cart')
//1
module.exports.profile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.render('profile/create_profile');
        }

        const username = user.username;
        const productCount = await Product.countDocuments({});
        const cart=await Cart.findOne({userId:user._id})
        const cartItemCount = cart && cart.products ? cart.products.reduce((total, item) => total + item.quantity, 0): 0;
        const profile = await Profile.findOne({ username: req.user.username });

        res.render("profile/profiles", { profile, username, productCount, cartItemCount });
    } catch (err) {
        req.flash("error", "Error loading profile");
        res.redirect('/');
    }
};



// Display form to create a new profile
module.exports.profileForm= async(req, res) => {
    let username = null;
    const user = await User.findOne({ username: req.user.username });
    if (user) {
        username = user.username;
    }
    res.render('profile/create_profile',{username});
};

//1

module.exports.createProfile = async (req, res) => {
    try {
        const { bio, location } = req.body;
        const image = req.file?.filename;

        // Find the user by username
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const existingProfile = await Profile.findOne({ username: user.username });
        if (existingProfile) {
            req.flash("error", 'Profile with this username already exists');
            return res.redirect('/profile/profiles');
        }

        const profile = new Profile({ name: user.name, image, bio, location, user: user._id,username: user.username });

        await profile.save();

        res.redirect("/profile/profiles");
    } catch (err) {
        req.flash("error", 'Error creating profile');
        res.render('profile/create_profile');
    }
};




// Display form to edit a profile
module.exports.editProfileForm = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params._id);
        if (!profile) {
            req.flash('error', 'Profile not found');
            return res.redirect('/profile/profiles');
        }
        res.render('profile/edit_profile', { profile });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error fetching profile');
        res.redirect('/profile/profiles');
    }
};


// Handle submission of edited profile form
module.exports.editProfile= async (req, res) => {
    try {
        const { name, bio, location } = req.body;
        const image = req.file ? req.file.filename : undefined; 
        await Profile.findByIdAndUpdate(req.params._id, { name, image, bio, location });
        res.redirect('/profile/profiles'); 
    } catch (err) {
        console.error(err);
        res.send('Error updating profile');
    }
};

// Delete a profile
module.exports.deleteProfile= async (req, res) => {
    try {
        await Profile.findByIdAndDelete(req.params._id);
        res.redirect('/profile/profiles'); 
    } catch (err) {
        console.error(err);
        res.send('Error deleting profile');
    }
};

