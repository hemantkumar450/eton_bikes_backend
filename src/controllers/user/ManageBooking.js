import manageBookingService from '../../services/user/booking.service';

class ManageBooking {
    constructor() {
        return {
            createOrder: this.createOrder.bind(this),
            capturedPayment: this.capturedPayment.bind(this),
            validateWebhookSignature: this.validateWebhookSignature.bind(this),
            getBookingsByUser: this.getBookingsByUser.bind(this)
        }
    }

    async createOrder(req, res, next) {
        try {
            const order = await manageBookingService.createOrder(req.body, req.user);
            res.status(200).json({
                message: 'order Id',
                data: order
            })
        } catch (error) {
            next(error);
        }
    }

    async capturedPayment(req, res, next) {
        try {
            const payment = await manageBookingService.capturedPayment(req.body);
            res.status(200).json({
                message: 'payment captured',
                data: payment
            })
        } catch (error) {
            next(error);
        }
    }

    async validateWebhookSignature(req, res, next) {
        try {
            const result = await manageBookingService.validateWebhookSignature(req.body, req.headers);
            res.status(200).json({
                message: 'web hook validation',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getBookingsByUser(req, res, next) {
        try {
            const result = await manageBookingService.getBookingsByUser(req.user);
            res.status(200).json({
                message: 'Get booking list',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ManageBooking();