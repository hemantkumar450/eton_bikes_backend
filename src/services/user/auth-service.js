import { User } from '../../models';
const jwt = require('jsonwebtoken');
import config from '../../config';
import redis from '../../utilities/redis';
import emailService from '../common/email.service';
let bcrypt = require('bcrypt');
const {
    hashPassword
} = require('../../utilities/helper');
const aes256 = require('aes256');
import { emailTemplate, replaceVariables } from '../../utilities/constants';
import app from '../../config/app';

class UserAuthService {
    constructor() {
        this.updateOptions = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };
        return {
            authenticate: this.authenticate.bind(this),
            createToken: this.createToken.bind(this),
            createUser: this.createUser.bind(this),
            updateUser: this.updateUser.bind(this),
            verifyEmail: this.verifyEmail.bind(this),
            resendEmailVerification: this.resendEmailVerification.bind(this),
            logout: this.logout.bind(this),
        }
    }

    async authenticate({ email, password }) {
        try {
            let user = await User.findOne({
                'email_detail.email': email,
                'email_detail.is_verified': true
            });
            if (!user) {
                throw ({
                    name: "etonBikes",
                    code: 401,
                    message: `Invalid Email Or Email is not verified`
                })
            }
            const res = await bcrypt.compare(password, user.password);
            if (res) {
                return user;
            } else {
                throw ({
                    name: "etonBikes",
                    code: 401,
                    message: `Invalid Credentials`
                })
            }
        } catch (e) {
            throw (e)
        }
    };

    async createToken(user) {
        try {
            const { _id, email_detail } = user;
            let obj = {};
            const encryptedKey = config.app.encryptionKey;
            obj.id = await aes256.encrypt(encryptedKey, _id.toString());
            obj.email = await aes256.encrypt(encryptedKey, email_detail.email);
            const token = jwt.sign(obj, config.app.superSecretForUser, {
                expiresIn: config.app.tokenLife
            });
            redis.set(_id.toString(), JSON.stringify({ token }));
            return token;
        } catch (e) {
            throw (e)
        }
    }

    async createUser({ name, email, password, profile_picture, gender }) {
        try {
            password = await hashPassword(password);
            const token = await this.generateVerificationLink(email);
            const link = `${config.app.frontEndUrl}?token=${token}`;
            const message = Object.assign({}, emailTemplate.verifyToken);
            const object = { from: app.etonEmailForVerificationId, to: email, link: link }
            message.from = replaceVariables(message.from, object);
            message.to = replaceVariables(message.to, object);
            message.html = replaceVariables(message.html, object);
            emailService.sendMail(message);
            const email_detail = { email, token };
            return await User.create({
                name,
                email_detail,
                profile_picture,
                gender,
                password
            });
        } catch (e) {
            throw (e)
        }
    }

    async updateUser({ id, name, gender, email }) {
        try {
            let condition = {};
            if (name) {
                condition['name'] = name;
            }
            if (gender) {
                condition['gender'] = gender;
            }
            if (email) {
                await this._checkEmailExist(email, id)
                condition['email'] = email;
            }
            const user = await User.findOneAndUpdate(
                { _id: id }, condition, { new: true }
            )
            return user;
        } catch (e) {
            throw (e)
        }
    }

    async logout({ id }) {
        try {
            await redis.delete(id);
            return true;
        } catch (error) {
            throw (error);
        }
    }

    async generateVerificationLink(email) {
        try {
            const token = jwt.sign({}, config.app.verificationSecret, {
                expiresIn: "24h"
            });
            await User.update({ 'email_detail.email': email }, { 'email_detail.token': token });
            return token;
        } catch (e) {
            throw (e)
        }
    }

    async verifyEmail({ token }) {
        try {
            const user = await User.findOneAndUpdate(
                { 'email_detail.token': token },
                { 'email_detail.is_verified': true }
            );
            if (!user) {
                this._throwException('Invalid or Link Expired');
            }
            return true;
        } catch (e) {
            throw (e)
        }
    }

    async resendEmailVerification({ email }) {
        try {
            let user = await User.findOne({
                'email_detail.email': email
            });
            if (user) {
                if (user.email_detail.is_verified) {
                    this._throwException('Email already verified');
                }
                const link = await this.generateVerificationLink(email);
                // await emailServices.send({
                //     code: 'EMAIL-VERIFICATION',
                //     htmlVariables: { name: user.name, "verification-link": link },
                //     subjectVariables: {},
                //     emails: [email]
                // });
            } else {
                this._throwException('User not registered');
            }
        } catch (e) {
            throw (e)
        }
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
            name: "etonBikes",
            code: 400,
            message
        });
    }
}

export default new UserAuthService();