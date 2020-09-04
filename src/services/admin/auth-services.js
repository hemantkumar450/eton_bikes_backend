import { Admin } from '../../models';
const {
    hashPassword
} = require('../../utilities/helper');
let bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import config from '../../config';
const aes256 = require('aes256');

class AdminAuthService {
    constructor() {
        return {
            authenticate: this.authenticate.bind(this),
            createToken: this.createToken.bind(this),
            createUser: this.createUser.bind(this)
        }
    }

    async authenticate({ email, password }) {
        try {
            let user = await Admin.findOne({
                email
            });
            if (!user) {
                throw ({
                    name: "cofynd",
                    code: 401,
                    message: `Invalid Credentials`
                })
            }
            const res = await bcrypt.compare(password, user.password);
            if (res) {
                return user;
            } else {
                throw ({
                    name: "cofynd",
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
            const encryptedKey = config.app.encryptionKey;
            const { _id, email, phone_number } = user;
            let obj = {};
            obj.id = await aes256.encrypt(encryptedKey, _id.toString());
            obj.phone_number = await aes256.encrypt(encryptedKey, phone_number.toString());
            obj.email = await aes256.encrypt(encryptedKey, email.toString());
            return jwt.sign(obj, config.app.superSecretForAdmin, {
                expiresIn: 60 * 60 * 12
            });
        } catch (e) {
            throw (e)
        }
    }

    async createUser({ name, gender, phone_number, email, password }) {
        try {
            password = await hashPassword(password)
            return await Admin.create({
                email,
                password,
                phone_number,
                name,
                gender
            });
        } catch (e) {
            throw (e)
        }
    }
}

export default new AdminAuthService();