import mongoose from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';
const Schema = mongoose.Schema;
import { mongoSchemaOptions } from '../utilities/constants';

const AdminSchema = new Schema({
    name: String,
    gender: {
        type: String,
        enum: ['male', 'female', 'others']
    },
    email: { type: String },
    phone_number: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
},
    mongoSchemaOptions
);

AdminSchema.plugin(findOrCreate);

module.exports = AdminSchema;