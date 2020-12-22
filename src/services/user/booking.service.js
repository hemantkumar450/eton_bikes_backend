import { Booking } from '../../models';
import crypto from 'crypto';
import razerPay from '../../utilities/razerPay';

class BookingServices {
    constructor() {
        return {
            createOrder: this.createOrder.bind(this),
            capturedPayment: this.capturedPayment.bind(this),
            validateWebhookSignature: this.validateWebhookSignature.bind(this),
            getBookingsByUser: this.getBookingsByUser.bind(this)
        }
    }

    async createOrder({ amount, currency = 'INR', user_id }) {
        try {
            const receipt = `receipt #${crypto.randomBytes(3).toString('hex')}`;
            const amountInPaisa = amount * 100;
            const notes = { amountInPaisa, user: user_id };
            const order = await razerPay.createOrder({ amount: amountInPaisa, currency, receipt, notes });
            const booking = await Booking.create({
                order: order.id,
                amount: amountInPaisa / 100,
                user: user_id
            });
            return { order_id: order.id, booking_id: booking.id, amount: amountInPaisa / 100 };
        } catch (error) {
            throw (error);
        }
    }

    async capturedPayment({ booking_id, payment_id, amount, currency }) {
        try {
            await razerPay.capturePayment({ payment_id, amount, currency });
            const status = 'success';
            const booking = await Booking.findOneAndUpdate(
                { _id: booking_id },
                {
                    payment: payment_id,
                    status
                }, { new: true });
            return booking;
        } catch (error) {
            throw (error);
        }
    }

    async validateWebhookSignature(webhook_body, webhook_signature) {
        try {
            const result = await razerPay.validateWebhookSignature(webhook_body, webhook_signature);
            if (Object.keys(result).length) {
                if (result.status === 'authorized') {
                    return result;
                }
                const booking = await Booking.findOneAndUpdate(
                    { order: result.order },
                    {
                        payment: result.payment,
                        status: result.status
                    },
                    { new: true }
                );
                return booking;
            }
            return result;
        } catch (error) {
            throw (error);
        }
    }

    async getBookingsByUser({ userId }) {
        try {
            const bookings = await Booking.find({ user: userId, status: 'success' })
                .populate({ path: 'sub_product' });
            return bookings;
        } catch (error) {
            throw (error);
        }
    }
}

export default new BookingServices();