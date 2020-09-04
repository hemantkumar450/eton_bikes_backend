import { User, Firebase } from '../../models';
const jwt = require('jsonwebtoken');
import config from '../../config';
const aes256 = require('aes256');
import redis from '../../utilities/redis';
import { populate } from '../../utilities/constants';

class UserAuthService {
    constructor() {
        this.updateOptions = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };
        return {
            createToken: this.createToken.bind(this),
            createUser: this.createUser.bind(this),
            updateUser: this.updateUser.bind(this),
            userVerify: this.userVerify.bind(this),
            regenerateCode: this.regenerateCode.bind(this),
            logout: this.logout.bind(this),
            hasAdminRole: this.hasAdminRole.bind(this),
            otpSend: this.otpSend.bind(this),
            _checkExpiry: this._checkExpiry.bind(this)
        }
    }

    async createToken(user) {
        try {
            const { _id: userId } = user;
            let obj = await this._createTokenObject(user);
            const token = jwt.sign(obj, config.app.superSecretForUser, {
                expiresIn: config.app.tokenLife
            });
            const refreshToken = jwt.sign(obj, config.app.refreshTokenSecretForUser, { expiresIn: config.app.refreshTokenLife })
            redis.set(userId.toString(), JSON.stringify({ token, refreshToken }));
            return { token, refreshToken };
        } catch (e) {
            throw (e)
        }
    }

    async createUser({ phone_number }) {
        let user = await User.findOne({ phone_number });
        const code = this._randomCodeGenerator(phone_number);
        const phone_verification = { code, is_verified: false, expires: new Date() };
        /**TODO 
         * call message service for sending OTP on given phone_nuumber
         */
        if (user) {
            user = await User.findOneAndUpdate(
                { phone_number },
                { phone_verification },
                this.updateOptions
            );
        } else {
            const u_id = await this._createUniqueInteger();
            user = await User.create({
                phone_number,
                u_id,
                phone_verification
            });
        }
        const message = `Your verification code is ${user.phone_verification.code}`;
        const sms = await this._smsService({ phone_number, message });
        return null;//Object.assign({}, sms, user.phone_verification);
    }

    async _createUniqueInteger() {
        try {
            const random_number = Date.now() + Math.floor(Math.random() * 899999 + Math.random() * 999999)
            const str_random_number = random_number.toString();
            const unique_number = Number(str_random_number.slice(4, 13));
            const user = await User.findOne({ u_id: unique_number });
            if (user) {
                return await this._createUniqueInteger();
            }
            return unique_number;
        } catch (error) {
            throw (error);
        }
    }

    async otpSend({ id, phoneNumber: phone_number }) {
        const code = this._randomCodeGenerator(phone_number);
        const phone_verification = { code, expires: new Date() };
        await User.findOneAndUpdate(
            { _id: id },
            { phone_verification },
        );
        const message = `Your verification code is ${code}`;
        const sms = await this._smsService({ phone_number, message });
        return null//Object.assign({}, sms, phone_verification);
    }

    async updateUser({ id, first_name, middle_name, last_name, gender, email, user_name }) {
        try {
            let condition = { is_sign_up: true };
            if (first_name) {
                condition['first_name'] = first_name;
            }
            if (middle_name) {
                condition['middle_name'] = middle_name;
            }
            if (last_name) {
                condition['last_name'] = last_name;
            }
            if (gender) {
                condition['gender'] = gender;
            }
            if (email) {
                await this._checkEmailExist(email, id)
                condition['email'] = email;
            }
            if (user_name) {
                condition['user_name'] = user_name;
            }
            const user = await User.findOneAndUpdate(
                { _id: id }, condition, { new: true }
            )
            return user;
        } catch (e) {
            throw (e)
        }
    }

    async userVerify({ phone_number, code }) {
        const user = await User.findOne({ phone_number });
        if (this._checkExpiry(user, code)) {
            const user = await User.findOneAndUpdate({ phone_number },
                {
                    'phone_verification.is_verified': true,
                },
                this.updateOptions
            ).populate({
                path: 'profile_picture',
                populate: populate.createdBy
            })
            return user;
        } else {
            this._throwException('Invalid code or code expired')
        }
    }

    async regenerateCode({ phone_number }) {
        try {
            const code = this._randomCodeGenerator(phone_number);
            /**TODO 
            * call message service for re-sending OTP on given phone_nuumber
            */
            const user = await User.findOneAndUpdate({ phone_number },
                {
                    'phone_verification.code': code,
                    'phone_verification.expires': new Date()
                },
                this.updateOptions
            );
            const message = `Your resend verification code is ${user.phone_verification.code}`;
            await this._smsService({ phone_number, message });
            return null;//user.phone_verification;
        } catch (error) {
            throw (error);
        }
    }

    // { id: user_id, device_id, phone_number, token } -- param
    async logout({ id, device_id }) {
        try {
            // const key = `${user_id}_${phone_number}`;
            // const userLog = await redis.hmGet(key);
            // const object = {};
            // Object.keys(userLog).forEach(property => {
            //     if (property !== token) {
            //         object[property] = userLog[property];
            //     }
            // });
            // await redis.delete(key);
            // if (this._isEmptyObject(object)) {
            //     await redis.delete(user_id);
            // } else {
            //     await redis.hmSet(key, object);
            // }
            // await Firebase.deleteOne({ device_id });
            await Firebase.deleteOne({ device_id })
            await redis.delete(id);
            return true;
        } catch (error) {
            throw (error);
        }
    }

    hasAdminRole(wedding, userId) {
        try {
            let is_admin = wedding.created_by == userId ? true : false;
            if (!is_admin) {
                const has_admin = wedding.admins.find(x => x == userId)
                is_admin = has_admin ? true : false;
            }
            return is_admin;
        } catch (error) {
            throw (error);
        }
    }

    // _isEmptyObject(map) {
    //     for (var key in map) {
    //         if (map.hasOwnProperty(key)) {
    //             return false;
    //         }
    //     }
    //     return true;
    // }

    _checkExpiry(user, code) {
        if (user && user.phone_verification.code === Number(code)) {
            const t1 = new Date();
            const t2 = new Date(user.phone_verification.expires);
            var dif = t1.getTime() - t2.getTime();
            var Seconds = dif / 1000;
            var Seconds_Between_Dates = Math.abs(Seconds);
            if (Seconds_Between_Dates <= 60) {
                return true;
            }
        }
        return false;
    }


    _randomCodeGenerator(phone_number) {
        if (config.app.mode == 'DEVELOPMENT' || config.app.loginNumbers.indexOf(phone_number) > -1) {
            return 1234;
        }
        return Math.floor(1000 + Math.random() * 9000);
    }

    async _checkEmailExist(email, userId) {
        try {
            const user = await User.findOne({ email });
            if (user && user._id.toString() !== userId.toString()) {
                this._throwException('Email is already registered');
            }
            return true;
        } catch (error) {
            throw (error)
        }
    }

    _throwException(message) {
        throw ({
            name: "wittyVows",
            code: 400,
            message
        });
    }
}

export default new UserAuthService();