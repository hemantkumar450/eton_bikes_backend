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
    slug: {
      type: String,
      unique: true,
    },
    close_up_media: [
      {
        type: Schema.Types.ObjectId,
        ref: "media",
      },
    ],
    long_shot_media: [
      {
        type: Schema.Types.ObjectId,
        ref: "media",
      },
    ],
    media_urls: [{
      category: { type: String, enum: ["youtube", "media"], default: "media" },
      url: String
    }],
    geometry: [{
      key: String,
      high: [{
        key: {
          type: Schema.Types.ObjectId,
          ref: "Key",
        },
        small: Number,
        medium: Number,
        large: Number,
      }],
      low: [{
        key: {
          type: Schema.Types.ObjectId,
          ref: "Key",
        },
        small: Number,
        medium: Number,
        large: Number,
      }],
      frame_size: [{
        key: String,
        from: Number,
        to: Number
      }]
    }],
    tech_support: {
      faqs: [{
        key: String,
        value: String,
      }],
      components: [{
        key: String,
        value: String,
      }],
      warranty_and_registration: String
    },
    is_deleted: {
      type: Boolean,
      default: false
    }
  },
  mongoSchemaOptions
);

ProductSchema.plugin(findOrCreate);

module.exports = ProductSchema;
