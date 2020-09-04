
import express from 'express';
const router = express.Router();
import AdminAuthController from '../../controllers/admin/auth';

// create login routes
router.post('/createAdmin', AdminAuthController.createAdmin)
    .post('/login', AdminAuthController.login)

module.exports = router;

