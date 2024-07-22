const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();
const upload=require('../middleware/upload')
const isAuth = require('../middleware/auth');


router.get('/addProduct', isAuth, productController.newForm);
router.post('/', upload, productController.addProduct);
router.get('/:_id/edit',isAuth, productController.editForm);
router.put('/:_id/',upload, productController.updateProduct);
router.delete('/:_id',isAuth, productController.deleteProduct);

module.exports = router;


