import mongoose from "mongoose";
import findOrCreate from "mongoose-findorcreate";
const Schema = mongoose.Schema;
import { mongoSchemaOptions } from "../utilities/constants";

const MediaSchema = new Schema(
  {
    name: String,
    // tags: [String],
    // caption: {
    //   type: String,
    //   default: null,
    // },
    // size: Number,
    // ext: String,
    // media_url: String,
    // video_thumbnail: String,
    // duration: Number,
    // aspect_ratio: Number,
    // media_type: {
    //   type: String,
    //   enum: ["video", "image"],
    //   default: "image",
    // },
    // is_deleted: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  mongoSchemaOptions
);

MediaSchema.plugin(findOrCreate);

module.exports = MediaSchema;
