
import express from 'express';
const router = express.Router();
import PageController from '../../controllers/user/ManagePage';
const CheckToken = require('../../middlewares/checkToken');

// create login routes
router.get('/pages/:pageType', PageController.getPageByType)

module.exports = router;