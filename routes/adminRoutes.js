const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();
const upload=require('../middleware/upload')
const {isAuthenticated} = require('../middleware/auth');


router.get('/addProduct', isAuthenticated, productController.newForm);
router.post('/', upload, productController.addProduct);
router.get('/:_id/edit',isAuthenticated, productController.editForm);
router.put('/:_id/',upload, productController.updateProduct);
router.delete('/:_id',isAuthenticated, productController.deleteProduct);

module.exports = router;


