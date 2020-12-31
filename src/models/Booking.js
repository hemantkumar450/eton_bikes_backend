import mongoose from "mongoose";
import findOrCreate from "mongoose-findorcreate";
const Schema = mongoose.Schema;
import { mongoSchemaOptions } from "../utilities/constants";

const BookingSchema = new Schema(
  {
    order: String,
    payment: String,
    amount: Number,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    product_details: [{
      sub_product: {
        type: Schema.Types.ObjectId,
        ref: "sub_product",
      },
      quantity: {
        type: Number,
        default: 1
      }
    }],
    payment_detail: Object,
    status: {
      type: String,
      enum: ["failed", "success", "pending"],
      default: "pending",
    },
  },
  mongoSchemaOptions
);

BookingSchema.plugin(findOrCreate);

module.exports = BookingSchema;
