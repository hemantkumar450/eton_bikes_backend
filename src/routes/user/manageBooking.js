import express from 'express';
const router = express.Router();
import ManageBookingController from '../../controllers/user/ManageBooking';

const CheckToken = require('../../middlewares/checkToken');

router.post('/order', CheckToken.jwtVerifyForUser, ManageBookingController.createOrder)
    .post('/payment', CheckToken.jwtVerifyForUser, ManageBookingController.capturedPayment)
    .post('/update-booking-failed', CheckToken.jwtVerifyForUser, ManageBookingController.updateFailedBooking)
    .post('/payment/validate', ManageBookingController.validateWebhookSignature)
    .get('/bookings', ManageBookingController.getBookingsByUser)

module.exports = router;