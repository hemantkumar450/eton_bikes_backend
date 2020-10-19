import jwt from 'jsonwebtoken';
import config from '../config';
import redis from '../utilities/redis';
const aes256 = require('aes256');
let logApiCalls = require('./logApiCalls');

class CheckToken {
    constructor() {
        return {
            jwtVerifyForAdmin: this.jwtVerifyForAdmin.bind(this),
            jwtVerifyForUser: this.jwtVerifyForUser.bind(this),
            verificationJwtVerify: this.verificationJwtVerify.bind(this)
        }
    }

    async jwtVerifyForAdmin(req, res, next) {
        try {
            const token = req.headers.authorization.split('Bearer ')[1];
            jwt.verify(token, config.app.superSecretForAdmin, async (err, encoded) => {
                if (err) {
                    return res.status(401).json({ success: false, type: 'Error', message: 'Invalid Token' });
                } else {
                    const encryptedKey = config.app.encryptionKey;
                    const decryptedId = await aes256.decrypt(encryptedKey, encoded.id);
                    const decryptedPhoneNumber = await aes256.decrypt(encryptedKey, encoded.phone_number);
                    const decryptedEmail = await aes256.decrypt(encryptedKey, encoded.email);
                    req.admin = {
                        id: decryptedId,
                        email: decryptedEmail,
                        phone_number: decryptedPhoneNumber,
                        role: 'admin'
                    }
                    next();
                }
            });
        } catch (e) {
            return res.status(401).json({ success: false, type: 'Erroro', message: 'Invalid Token' });
        }
    };

    async jwtVerifyForUser(req, res, next) {
        try {
            const token = req.headers.authorization.split('Bearer ')[1];
            jwt.verify(token, config.app.superSecretForUser, async (err, encoded) => {
                if (err) {
                    return res.status(401).json({ success: false, type: 'Error', message: 'Invalid Token' });
                } else {
                    const encryptedKey = config.app.encryptionKey;
                    const decryptedId = await aes256.decrypt(encryptedKey, encoded.id);
                    const decryptedEmail = await aes256.decrypt(encryptedKey, encoded.email);
                    const token = await redis.get(decryptedId);
                    if (!token) {
                        return res.status(401).json({ type: 'Error', message: 'Invalid Token' });
                    }
                    req.user = {
                        id: decryptedId,
                        role: 'user',
                        email: decryptedEmail,
                    }
                    logApiCalls(req);
                    next();
                }
            });
        } catch (e) {
            return res.status(401).json({ success: false, type: 'Erroro', message: 'Invalid Token' });
        }
    };

    async verificationJwtVerify(req, res, next) {
        try {
            jwt.verify(req.body.token, config.app.verificationSecret, async (err, decoded) => {
                if (err) {
                    return res.status(400).json({ type: 'Error', message: 'Invalid or Link Expired' });
                } else {
                    next();
                }
            })
        } catch (e) {
            return res.status(400).json({ type: 'Error', message: 'Invalid or Link Expired' });
        }
    }
}

module.exports = new CheckToken();