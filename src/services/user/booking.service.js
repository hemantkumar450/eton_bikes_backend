import { Booking, User } from "../../models";
import crypto from "crypto";
import razerPay from "../../utilities/razerPay";
import cartService from "./cart-service";
import emailService from '../common/email.service';
import { emailTemplate, replaceVariables } from '../../utilities/constants';
import app from '../../config/app';

class BookingServices {
  constructor() {
    return {
      createOrder: this.createOrder.bind(this),
      capturedPayment: this.capturedPayment.bind(this),
      validateWebhookSignature: this.validateWebhookSignature.bind(this),
      getBookingsByUser: this.getBookingsByUser.bind(this),
      updateFailedBooking: this.updateFailedBooking.bind(this)
    };
  }

  async updateFailedBooking({ booking_id, error }) {
    try {
      const status = "failed";
      const booking = await Booking.findOneAndUpdate(
        { _id: booking_id },
        {
          payment: error.metadata.payment_id,
          status,
          payment_detail: error
        },
        { new: true }
      );
      return booking;
    } catch (error) {
      throw error;
    }
  }

  async createOrder({ user_id }) {
    try {
      // amount, currency = 'INR',
      const userCartItems = await cartService.getCartItemsByUser({
        userId: user_id,
      });
      //   let amount;
      let amount = 0;
      const subProduct = [];
      userCartItems.forEach((el) => {
        const price = el.sub_product.build_specs.find((p) => p.key === "Price");
        const ind = subProduct.findIndex((ele) => ele.sub_product === el.sub_product.id);
        if (ind > -1) {
          subProduct[ind].quantity += 1;
          amount += parseInt(price.value);
        } else {
          subProduct.push({
            sub_product: el.sub_product.id,
            quantity: 1,
          });
          amount += parseInt(price.value);
        }
      });
      //   amount = 1;
      //   console.log(amount, tempArr, 'Data');
      const receipt = `receipt #${crypto.randomBytes(3).toString('hex')}`;
      const amountInPaisa = amount * 100;
      const notes = { amountInPaisa, user: user_id };
      const order = await razerPay.createOrder({ amount: amountInPaisa, currency: 'INR', receipt, notes });
      const booking = await Booking.create({
        order: order.id,
        amount: amount,
        user: user_id,
        product_details: subProduct
      });
      return { order_id: order.id, booking_id: booking.id, amount: amount };
    } catch (error) {
      throw error;
    }
  }

  async capturedPayment({ booking_id, payment_id, amount, user_id, data }) {
    try {
      const user = await User.findOne({ _id: user_id });
      await razerPay.capturePayment({ payment_id, amount: parseInt(amount) * 100, currency: 'INR' });
      const status = "success";
      const message = Object.assign({}, emailTemplate.CapturedPayment);
      const object = { from: app.etonEmailForVerificationId, to: user.email_detail.email, userName: user.name }
      message.from = replaceVariables(message.from, object);
      message.to = replaceVariables(message.to, object);
      message.html = replaceVariables(message.html, object);
      const booking = await Booking.findOneAndUpdate(
        { _id: booking_id },
        {
          payment: payment_id,
          payment_detail: data,
          status,
        },
        { new: true }
      );
      await cartService.deleteUserCartItems({ userId: user_id });
      emailService.sendMail(message);
      return booking;
    } catch (error) {
      throw error;
    }
  }

  async validateWebhookSignature(webhook_body, webhook_signature) {
    try {
      const result = await razerPay.validateWebhookSignature(
        webhook_body,
        webhook_signature
      );
      if (Object.keys(result).length) {
        if (result.status === "authorized") {
          return result;
        }
        const booking = await Booking.findOneAndUpdate(
          { order: result.order },
          {
            payment: result.payment,
            status: result.status,
          },
          { new: true }
        );
        return booking;
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getBookingsByUser({ userId }) {
    try {
      const bookings = await Booking.find({
        user: userId,
        status: "success",
      }).populate({ path: "sub_product" });
      return bookings;
    } catch (error) {
      throw error;
    }
  }
}

export default new BookingServices();
