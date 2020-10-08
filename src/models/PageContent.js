import mongoose from "mongoose";
import findOrCreate from "mongoose-findorcreate";
const Schema = mongoose.Schema;
import { mongoSchemaOptions } from "../utilities/constants";

const PageContentSchema = new Schema(
  {
    name: {
      type: String,
      unique: true
    },
    heading: String,
    content: String,
    sections: [{
      name: String,
      heading: String,
      order: Number,
      media_side: {
        type: String,
        enum: ['left', 'right', 'center'],
        default: 'left'
      },
      redirect_detail: [{
        button_text: String,
        redirect_url: String
      }],
      content: String,
      medias: [{
        type: Schema.Types.ObjectId,
        ref: "media"
      }],
      sectionType: {
        type: String,
        enum: ["banner", "social_media", "api_call", "slider", "media_panel"]
      }
    }],
    pageType: {
      type: String,
      enum: ["home"]
    },
    is_deleted: {
      type: Boolean,
      default: false
    }
  },
  mongoSchemaOptions
);

PageContentSchema.plugin(findOrCreate);

module.exports = PageContentSchema;
