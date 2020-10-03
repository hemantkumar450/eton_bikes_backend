
import express from 'express';
const router = express.Router();
import SubProductController from '../../controllers/admin/ManageSubProduct';

// create login routes
router.get('/subProducts', SubProductController.getSubProducts)
    .get('/subProducts/:subProductId', SubProductController.getSubProductById)
    .post('/subProducts', SubProductController.addOrEditSubProduct)
    .put('/subProducts/:subProductId', SubProductController.addOrEditSubProduct)
    .delete('/subProducts/:subProductId', SubProductController.deleteSubProduct)

module.exports = router;

