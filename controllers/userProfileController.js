// routes/profile.js
const Profile = require('../models/Profile');
const User=require('../models/User')

module.exports.profile= async(req, res) => {
    let username = null;
    const user = await User.findOne({ username: req.user.username });
    if (user) {
        username = user.username;
    }
    const profiles = await Profile.find({});
    res.render('profile/profiles',{ profiles,username});
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


module.exports.createProfile = async (req, res) => {
    try {
        const { name, bio, location } = req.body;
        const image = req.file?.filename;


        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const existingProfile = await Profile.findOne({ username: user.username });
        if (existingProfile) {
            return res.status(400).send('Profile with this username already exists');
        }
        const profile = new Profile({name,image,bio,location, user: user._id,username: user.username });

        await profile.save();
        res.redirect('/profile/profiles');
    } catch (err) {
        console.error('Error creating profile:', err);
        res.status(500).send('Error creating profile: ' + err.message);
    }
};


// Display form to edit a profile
module.exports.editProfileForm = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params._id);
        if (!profile) {
            return res.send('Profile not found');
        }
        res.render('profile/edit_profile', { profile });
    } catch (err) {
        console.error(err);
        res.send('Error fetching profile');
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

