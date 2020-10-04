
import express from 'express';
const router = express.Router();
import ProductController from '../../controllers/user/ManageProduct';
const CheckToken = require('../../middlewares/checkToken');

// create login routes
router.get('/products', CheckToken.jwtVerifyForAdmin, ProductController.getProducts)
    .get('/products/:findKey', CheckToken.jwtVerifyForAdmin, ProductController.getProductById)

module.exports = router;