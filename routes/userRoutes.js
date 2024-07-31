const express = require('express');
const userController = require('../controllers/authController');
const isAuthenticated=require('../middleware/auth')
const router = express.Router();

router.get('/register', userController.registerForm);
router.post('/register', userController.register);
router.get('/login', userController.loginForm);
router.post('/login', userController.login);


module.exports = router;


