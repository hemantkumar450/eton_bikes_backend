
import express from 'express';
const router = express.Router();
import ProductController from '../../controllers/admin/ManageProduct';
const CheckToken = require('../../middlewares/checkToken');

// create login routes
router.get('/products', CheckToken.jwtVerifyForAdmin, ProductController.getProducts)
    .get('/products/:productId', CheckToken.jwtVerifyForAdmin, ProductController.getProductById)
    .post('/products', CheckToken.jwtVerifyForAdmin, ProductController.addOrEditProduct)
    .post('/fileUploader', CheckToken.jwtVerifyForAdmin, ProductController.fileUploader)
    .put('/products/:productId', CheckToken.jwtVerifyForAdmin, ProductController.addOrEditProduct)
    .delete('/products/:productId', CheckToken.jwtVerifyForAdmin, ProductController.deleteProduct)

module.exports = router;