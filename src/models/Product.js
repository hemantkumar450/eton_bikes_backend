import mongoose from "mongoose";
import findOrCreate from "mongoose-findorcreate";
const Schema = mongoose.Schema;
import { mongoSchemaOptions } from "../utilities/constants";

const ProductSchema = new Schema(
  {
    name: String,
    title: String,
    description: String,
    features: [
      {
        key: String,
        value: String,
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
    },
    slug: {
      type: String,
      unique: true,
    },
    close_up_images: [
      {
        type: Schema.Types.ObjectId,
        ref: "media",
      },
    ],
    long_shot_images: [
      {
        type: Schema.Types.ObjectId,
        ref: "media",
      },
    ],
    video_urls: [
      {
        type: String,
      },
    ],
    sub_product: [
      {
        type: Schema.Types.ObjectId,
        ref: "subProduct",
      },
    ],
  },
  mongoSchemaOptions
);

ProductSchema.plugin(findOrCreate);

module.exports = ProductSchema;
