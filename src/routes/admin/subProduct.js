
import express from 'express';
const router = express.Router();
import SubProductController from '../../controllers/admin/ManageSubProduct';
const CheckToken = require('../../middlewares/checkToken');

// create login routes
router.get('/subProducts', CheckToken.jwtVerifyForAdmin, SubProductController.getSubProducts)
    .get('/subProducts/:subProductId', CheckToken.jwtVerifyForAdmin, SubProductController.getSubProductById)
    .post('/subProducts', CheckToken.jwtVerifyForAdmin, SubProductController.addOrEditSubProduct)
    .put('/subProducts/:subProductId', CheckToken.jwtVerifyForAdmin, SubProductController.addOrEditSubProduct)
    .delete('/subProducts/:subProductId', CheckToken.jwtVerifyForAdmin, SubProductController.deleteSubProduct)

module.exports = router;

