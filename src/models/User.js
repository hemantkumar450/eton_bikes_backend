import mongoose from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';
const Schema = mongoose.Schema;
import { mongoSchemaOptions } from '../utilities/constants';

const UserSchema = new Schema({
    u_id: {
        type: Number,
        default: new Date().valueOf()
    },
    first_name: String,
    middle_name: String,
    last_name: String,
    user_name: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'others']
    },
    profile_picture: {
        type: Schema.Types.ObjectId,
        ref: 'Media'
    },
    email: {
        type: String
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    phone_number: {
        type: String,
        unique: true,
        required: true
    },
    phone_verification: {
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
    is_sign_up: {
        type: Boolean,
        default: false
    },
    /** TODO will also remove this if there is no trcaking of wedding send invite */
    pending_invitation: [{
        type: Schema.Types.ObjectId,
        ref: 'Wedding'
    }],
    accepted_invitation: [{
        side: {
            type: String,
            enum: ['bride', 'groom']
        },
        wedding: {
            type: Schema.Types.ObjectId,
            ref: 'Wedding'
        }
    }],
    block_users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
},
    mongoSchemaOptions
);

// UserSchema.index({ "first_name": 1, "middle_name": 1, "last_name": 1 }, { unique: true })
UserSchema.plugin(findOrCreate);

module.exports = UserSchema;
