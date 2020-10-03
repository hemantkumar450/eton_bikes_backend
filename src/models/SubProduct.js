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
    product: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    detail: {
      name: String,
      image: {
        type: Schema.Types.ObjectId,
        ref: "Media"
      },
      icon: {
        type: Schema.Types.ObjectId,
        ref: "Media"
      }
    },
    build_specs: [{
      key: {
        type: Schema.Types.ObjectId,
        ref: "Key",
      },
      value: String,
    }],
    active: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false
    }
  },
  mongoSchemaOptions
);

CategorySchema.plugin(findOrCreate);

module.exports = CategorySchema;
