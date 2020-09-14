import mongoose from "mongoose";
import findOrCreate from "mongoose-findorcreate";
const Schema = mongoose.Schema;
import { mongoSchemaOptions } from "../utilities/constants";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    description: String,
    child_categories: [{
      type: Schema.Types.ObjectId,
      ref: "Category",
    }],
    parent_category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  mongoSchemaOptions
);

CategorySchema.plugin(findOrCreate);

module.exports = CategorySchema;
