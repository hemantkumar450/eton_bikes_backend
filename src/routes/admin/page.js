
import express from 'express';
const router = express.Router();
import PageController from '../../controllers/admin/ManagePage';
const CheckToken = require('../../middlewares/checkToken');

// create login routes
router.get('/pages', CheckToken.jwtVerifyForAdmin, PageController.getPages)
    .get('/pages/:pageId', CheckToken.jwtVerifyForAdmin, PageController.getPageById)
    .post('/pages', CheckToken.jwtVerifyForAdmin, PageController.addOrEditPage)
    .put('/pages/:pageId', CheckToken.jwtVerifyForAdmin, PageController.addOrEditPage)
    .delete('/pages/:pageId', CheckToken.jwtVerifyForAdmin, PageController.deletePage)

module.exports = router;