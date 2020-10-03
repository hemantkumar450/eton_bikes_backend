
import express from 'express';
const router = express.Router();
import ProductController from '../../controllers/admin/ManageProduct';

// create login routes
router.get('/products', ProductController.getProducts)
    .get('/products/:productId', ProductController.getProductById)
    .post('/products', ProductController.addOrEditProduct)
    .post('fileUploader', ProductController.fileUploader)
    .put('/products/:productId', ProductController.addOrEditProduct)
    .delete('/products/:productId', ProductController.deleteProduct)

module.exports = router;