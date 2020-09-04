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
            jwtRefreshTokenForUser: this.jwtRefreshTokenForUser.bind(this),
            customerJwtVerify: this.customerJwtVerify.bind(this)
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
                    // const token = await redis.get(decryptedId);
                    // if (!token) {
                    //     return res.status(401).json({ type: 'Error', message: 'Invalid Token' });
                    // }
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
                    const phone_number = await aes256.decrypt(encryptedKey, encoded.phone_number);
                    // const key = `${decryptedId}_${phone_number}`;
                    // const userLoginDetail = await redis.hmGet(key);
                    // const isUserLoggedIn = await redis.get(decryptedId);
                    // const loggedInToken = req.headers.authorization.split('Bearer ')[1];
                    // const url = req.path.split('/')[1];
                    // if (url !== 'firebaseDetail' && userLoginDetail &&
                    //     !userLoginDetail.hasOwnProperty(loggedInToken)) {
                    //     return res.status(401).json({ type: 'Error', message: 'Invalid Token' });
                    // };
                    // if (url !== 'firebaseDetail' && !userLoginDetail) {
                    //     return res.status(401).json({ type: 'Error', message: 'Invalid Token' });
                    // }
                    const token = await redis.get(decryptedId);
                    if (!token) {
                        return res.status(401).json({ type: 'Error', message: 'Invalid Token' });
                    }
                    // if (!isUserLoggedIn) {
                    //     return res.status(401).json({ type: 'Error', message: 'Invalid Token' });
                    // }
                    req.user = {
                        id: decryptedId,
                        role: 'user',
                        phone_number,
                        // token: loggedInToken
                    }
                    logApiCalls(req);
                    next();
                }
            });
        } catch (e) {
            return res.status(401).json({ success: false, type: 'Erroro', message: 'Invalid Token' });
        }
    };

    customerJwtVerify(isHybrid) {
        return async function (req, res, next) {
            try {
                if (isHybrid && !req.headers.authorization) return next();
                if (!req.headers.authorization) return res.status(401).json({ success: false, type: 'Error', message: 'Invalid Token' });
                const token = req.headers.authorization.split('Bearer ')[1];
                jwt.verify(token, config.app.superSecretForUser, async (err, encoded) => {
                    if (err) {
                        return res.status(401).json({ success: false, type: 'Error', message: 'Invalid Token1' });
                    } else {
                        const encryptedKey = config.app.encryptionKey;
                        const decryptedId = await aes256.decrypt(encryptedKey, encoded.id);
                        const phone_number = await aes256.decrypt(encryptedKey, encoded.phone_number);
                        const token = await redis.get(decryptedId);
                        if (!token) {
                            return res.status(401).json({ type: 'Error', message: 'Invalid Token' });
                        }
                        req.user = {
                            id: decryptedId,
                            role: 'user',
                            phone_number,
                            // token
                        }
                        next();
                    }
                })
            } catch (e) {
                return res.status(401).json({ type: 'Error', message: 'Invalid Token' });
            }
        }
    }

    async jwtRefreshTokenForUser(req, res, next) {
        try {
            jwt.verify(req.body.refreshToken, config.app.refreshTokenSecretForUser, async (err, encoded) => {
                if (err) {
                    return res.status(401).json(
                        { success: false, type: 'Error', message: 'Invalid Refresh Token' }
                    );
                } else {
                    const encryptedKey = config.app.encryptionKey;
                    const decryptedId = await aes256.decrypt(encryptedKey, encoded.id);
                    const tokenList = JSON.parse(await redis.get(decryptedId));
                    if (!tokenList) {
                        return res.status(400).json(
                            { success: false, type: 'Error', message: 'User Logged Out. Please Login Again' }
                        );
                    }
                    // if refresh token exists
                    if ((req.body.refreshToken) && ('refreshToken' in tokenList)) {
                        const obj = {
                            id: encoded.id,
                            email: encoded.email,
                            phone_number: encoded.phone_number,
                            type: encoded.type
                        }
                        const token = jwt.sign(obj, config.app.superSecretForUser, { expiresIn: config.app.tokenLife })
                        const refreshToken = jwt.sign(obj, config.app.refreshTokenSecretForUser, { expiresIn: config.app.refreshTokenLife })
                        // update the token in the list
                        redis.set(decryptedId, JSON.stringify({ token, refreshToken }));
                        return res.status(200).json({ success: true, message: 'New Token & Refresh Token', data: { token, refreshToken } })
                    } else {
                        return res.status(401).json(
                            { success: false, type: 'Error', message: 'Invalid Request' }
                        );
                    }
                }
            });
        } catch (e) {
            return res.status(401).json(
                { success: false, type: 'Error', message: 'Invalid Token' }
            );
        }
    };
}

module.exports = new CheckToken();