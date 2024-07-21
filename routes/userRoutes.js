
// const express = require('express');
// const passport = require('passport');
// const userController = require('../controllers/userController');

// const router = express.Router();

// router.get('/register',  userController.registerForm);
// router.post('/register',  userController.register);
// router.get('/login',  userController.loginForm);
// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login'
// }), userController.login);
// router.get('/logout', userController.logout);

// module.exports = router;

const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/register', userController.registerForm);
router.post('/register', userController.register); //register
router.get('/login', userController.loginForm);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

module.exports = router;

