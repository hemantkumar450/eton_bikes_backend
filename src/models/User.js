import mongoose from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';
const Schema = mongoose.Schema;
import { mongoSchemaOptions } from '../utilities/constants';

const UserSchema = new Schema({
    name: String,
    gender: {
        type: String,
        enum: ['male', 'female', 'others']
    },
    profile_picture: {
        type: Schema.Types.ObjectId,
        ref: 'Media'
    },
    email_detail: {
        email: { type: String, unique: true, },
        is_verified: { type: Boolean, default: false },
        token: String,
    },
    password: String,
    phone_detail: {
        phone_nuber: { type: String },
        code: Number,
        expires: {
            type: Date,
            default: new Date()
        },
        is_verified: {
            type: Boolean,
            default: false
        }
    },
},
    mongoSchemaOptions
);
// UserSchema.index({ "first_name": 1, "middle_name": 1, "last_name": 1 }, { unique: true })
UserSchema.plugin(findOrCreate);

module.exports = UserSchema;
