const { isAuthenticated } = require('../middleware/auth');
const User = require('../models/User');
const passport = require('passport');

module.exports.registerForm = (req, res) => {
    res.render('auth/register');
};

module.exports.register = async (req, res) => {
    try {
        const { username, name, email,password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match.');
            return res.redirect('/auth/register'); 
        }
        const user = new User({ username, name, email,password, confirmPassword });
        await User.register(user, password);
        req.flash('success', 'You have registered successfully!');
        res.redirect('/auth/login');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/auth/register'); 
    }
};

module.exports.loginForm = (req, res) => {
    res.render('auth/login');
};

module.exports.login = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
});


