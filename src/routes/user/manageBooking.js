import express from 'express';
const router = express.Router();
import ManageBookingController from '../../controllers/user/ManageBooking';

router.post('/order', ManageBookingController.createOrder)
    .post('/payment', ManageBookingController.capturedPayment)
    .post('/payment/validate', ManageBookingController.validateWebhookSignature)
    .get('/bookings', ManageBookingController.getBookingsByUser)

module.exports = router;