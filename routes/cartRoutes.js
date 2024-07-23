const express = require('express');
const router = express.Router();
const cartController=require('../controllers/cartController')
const { isAuthenticated } = require('../middleware/auth');

router.get('/products',isAuthenticated, cartController.getAllProducts);
router.get('/', isAuthenticated, cartController.getCart);
router.post('/add', isAuthenticated, cartController.addProductToCart);
router.post('/update', isAuthenticated, cartController.updateCart);
router.post('/remove', isAuthenticated, cartController.removeProductFromCart);

module.exports = router;
