// controllers/authController.js
const User = require('../models/User');
const passport = require('passport');
const isAuthenticated=require('../middleware/auth')


module.exports.registerForm=(req,res)=>{
    res.render('auth/register')
}
module.exports.register = async (req, res) => {
    try {
        const { username, password, name, email, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match.');
        }
        const user = new User({ username, name, email ,password,confirmPassword});
        await User.register(user, password);
        req.flash('success', 'You have registered successfully!');
        res.redirect('/');
    } catch (error) {
        req.flash('error', err.message);
    }
};

module.exports.loginForm=(req,res)=>{
    res.render('auth/login')
}


module.exports.login= passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'auth/login',
    failureFlash: true,
});

module.exports.logout= (req, res) => {
    req.logout(() => {
        req.flash('success', 'You have logged out successfully!');
        res.redirect('auth/login');
    });
};

