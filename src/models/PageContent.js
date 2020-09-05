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
    sections:[{
        name: String,
        heading: String,
        order: Number,
        content: String,
        medias:[{
            type: Schema.Types.ObjectId,
            ref: "media"
        }]
    }]
  },
  mongoSchemaOptions
);

PageContentSchema.plugin(findOrCreate);

module.exports = PageContentSchema;
