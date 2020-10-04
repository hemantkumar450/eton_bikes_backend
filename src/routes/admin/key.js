
import express from 'express';
const router = express.Router();
import KeyController from '../../controllers/admin/ManageKey';
const CheckToken = require('../../middlewares/checkToken');

// create login routes
router.get('/keys', CheckToken.jwtVerifyForAdmin, KeyController.getKeys)
    .get('/keys/:category', CheckToken.jwtVerifyForAdmin, KeyController.getKeysByCategory)
    .post('/keys', CheckToken.jwtVerifyForAdmin, KeyController.addOrEditKey)
    .put('/keys/:keyId', CheckToken.jwtVerifyForAdmin, KeyController.addOrEditKey)
    .delete('/keys/:keyId', CheckToken.jwtVerifyForAdmin, KeyController.deleteKey)

module.exports = router;