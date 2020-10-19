
import express from 'express';
const router = express.Router();
import UserAuthController from '../../controllers/user/auth';
const CheckToken = require('../../middlewares/checkToken');
// import firebaseToken from '../user/'

// create login routes
router.post('/signup', UserAuthController.createUser)
    .post('/login', UserAuthController.login)
    .post('/verify', CheckToken.verificationJwtVerify, UserAuthController.verifyEmail)
    .post('/update', CheckToken.jwtVerifyForUser, UserAuthController.updateUser)
    .post('/logout', CheckToken.jwtVerifyForUser, UserAuthController.logout)

module.exports = router;

