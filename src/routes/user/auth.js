
import express from 'express';
const router = express.Router();
import UserAuthController from '../../controllers/user/auth';
const CheckToken = require('../../middlewares/checkToken');
// import firebaseToken from '../user/'

// create login routes
router.post('/check', UserAuthController.createAndUpdateUser)
    .post('/verify', UserAuthController.verify)
    .post('/refreshToken', CheckToken.jwtRefreshTokenForUser)
    .post('/resendCode', UserAuthController.regenerateCode)
    .get('/otpSend/:phoneNumber', CheckToken.jwtVerifyForUser, UserAuthController.otpSend)
    .post('/logout', CheckToken.jwtVerifyForUser, UserAuthController.logout)

module.exports = router;

