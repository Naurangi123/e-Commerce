// controllers/authController.js
const User = require('../models/User');
const passport = require('passport');


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
        req.login(user, (err) => {
            if (err) {
                return res.status(400).send('Error logging in after registration: ' + err.message);
            }
            res.redirect('/');
        });
    } catch (error) {
        res.status(400).send('Error registering user: ' + error.message);
    }
};

module.exports.loginForm=(req,res)=>{
    res.render('auth/login')
}


module.exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, async(err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    })(req, res, next);
};

module.exports.logout = (req, res) => {
    req.logout()
    res.redirect('auth/login');
};

