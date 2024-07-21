const Register = require('../models/Register');
const passport = require('passport');

// Display registration form
module.exports.registerForm = (req, res) => {
    res.render('register');
};

// Handle registration logic
module.exports.register = async (req, res, next) => {
    try {
        const { username, name, email, password, confirmPassword } = req.body;
        
        // Validate passwords
        if (password !== confirmPassword) {
            return res.redirect('/register');
        }

        // Create a new Register model instance
        const newUser = new Register({ username, name, email,password,confirmPassword });
        
        // Call Register.register to register the user
        await Register.register(newUser, password);

        // Upon successful registration, log in the user
        passport.authenticate('local')(req, res, () => {;
            res.redirect('products');
        });
    } catch (err) {
        res.redirect('/register',err);
    }
};

// Display login form
module.exports.loginForm = (req, res) => {
    res.render('login');
};


module.exports.login = async (req, res, next) => {
    const {username,password}=req.body;
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!username||!password) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }
        req.login(user, err => {
            if (err) return next(err);
            res.redirect('products');
        });
    })(req, res, next);
};
// Handle logout
module.exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
};


