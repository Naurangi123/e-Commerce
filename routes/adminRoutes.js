const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();
const upload=require('../middleware/upload')
const isAuth = require('../middleware/auth');


router.get('/addProduct', isAuth, productController.newForm);
router.post('/', isAuth, upload, productController.addProduct);
router.get('/:_id/edit',isAuth, productController.editForm);
router.put('/:_id/',isAuth, productController.updateProduct);
router.post('/:_id/addCart',isAuth, productController.addToCart);
router.delete('/:_id',isAuth, productController.deleteProduct);

module.exports = router;


