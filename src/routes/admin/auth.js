
import express from 'express';
const router = express.Router();
import AdminAuthController from '../../controllers/admin/auth';

// create login routes
router.post('/login', AdminAuthController.login)
// .post('/createAdmin', AdminAuthController.createAdmin)

module.exports = router;

