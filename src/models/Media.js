import mongoose from "mongoose";
import findOrCreate from "mongoose-findorcreate";
const Schema = mongoose.Schema;
import { mongoSchemaOptions } from "../utilities/constants";

const MediaSchema = new Schema(
  {
    name: String,
    caption: {
      type: String,
      default: null,
    },
    media_link: String,
    media_type: {
      type: String,
      enum: ["video", "image"],
      default: "image",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  mongoSchemaOptions
);

MediaSchema.plugin(findOrCreate);

module.exports = MediaSchema;
