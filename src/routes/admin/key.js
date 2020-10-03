
import express from 'express';
const router = express.Router();
import KeyController from '../../controllers/admin/ManageKey';

// create login routes
router.get('/keys', KeyController.getKeys)
    .get('/keys/:category', KeyController.getKeysByCategory)
    .post('/keys', KeyController.addOrEditKey)
    .put('/keys/:keyId', KeyController.addOrEditKey)
    .delete('/keys/:keyId', KeyController.deleteKey)

module.exports = router;