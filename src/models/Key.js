import mongoose from "mongoose";
import findOrCreate from "mongoose-findorcreate";
const Schema = mongoose.Schema;
import { mongoSchemaOptions } from "../utilities/constants";

const KeySchema = new Schema(
    {
        order: String,
        name: String,
        category: {
            type: String,
            enum: ['geometry', "component", "build_spec", "key_feature"],
            default: 'geometry'
        },
        is_deleted: {
            type: Boolean,
            default: false
          }
    },
    mongoSchemaOptions
);

KeySchema.plugin(findOrCreate);

module.exports = KeySchema;
