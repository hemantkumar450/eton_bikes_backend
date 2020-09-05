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
    active: {
      type: Boolean,
      default: true,
    },
  },
  mongoSchemaOptions
);

CategorySchema.plugin(findOrCreate);

module.exports = CategorySchema;
