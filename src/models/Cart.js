import mongoose from "mongoose";
import findOrCreate from "mongoose-findorcreate";
const Schema = mongoose.Schema;
import { mongoSchemaOptions } from "../utilities/constants";

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user"
    },
    sub_product: {
      type: Schema.Types.ObjectId,
      ref: "SubProduct"
    },
    status: {
      type: String,
      enum: ["bucket", "purchased", "removed"],
      default: "bucket"
    },
  },
  mongoSchemaOptions
);

CartSchema.plugin(findOrCreate);

module.exports = CartSchema;
