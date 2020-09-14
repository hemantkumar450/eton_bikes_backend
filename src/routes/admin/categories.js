
import express from 'express';
const router = express.Router();
import CategoryController from '../../controllers/admin/categories';

// create login routes
router.post('/createCategory', CategoryController.create);
router.get('/getCategories', CategoryController.getCateggories);
    // .post('/login', AdminAuthController.login)

module.exports = router;

