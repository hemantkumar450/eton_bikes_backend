
import express from 'express';
const router = express.Router();
import ProductController from '../../controllers/user/ManageProduct';

// create login routes
router.get('/products', ProductController.getProducts)
    .get('/products/:findKey', ProductController.getProductById)

module.exports = router;