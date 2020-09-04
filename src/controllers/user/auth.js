import auth from '../../services/user/auth-service';


class AdminAuth {
    constructor() {
        return {
            createAndUpdateUser: this.createAndUpdateUser.bind(this),
            verify: this.verify.bind(this),
            regenerateCode: this.regenerateCode.bind(this),
            logout: this.logout.bind(this),
            otpSend: this.otpSend.bind(this),
        }
    }

    async createAndUpdateUser(req, res, next) {
        try {
            let user = null;
            let message = 'User Added';
            if (req.method == 'PUT') {
                const forEdit = Object.assign({}, req.user, req.body)
                user = await auth.updateUser(forEdit)
                message = 'User Updated';
            } else {
                user = await auth.createUser(req.body)
            }
            return res.status(200).json({
                success: true,
                message,
                data: user
            })
        } catch (error) {
            next(error)
        }
    }

    async verify(req, res, next) {
        try {
            const user = await auth.userVerify(req.body);
            let { token, refreshToken } = await auth.createToken(user);
            const data = { token, refreshToken, user };
            return res.status(200).json({
                success: true,
                message: 'User verified',
                data
            })
        } catch (error) {
            next(error)
        }
    }

    async regenerateCode(req, res, next) {
        try {
            const code = await auth.regenerateCode(req.body);
            return res.status(200).json({
                success: true,
                message: 'resend code',
                data: code
            })
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            const object = Object.assign({}, req.user, req.body);
            await auth.logout(object);
            return res.status(200).json({
                success: true,
                message: 'Successfully logged Out'
            });
        } catch (error) {
            next(error);
        }
    }

    async otpSend(req, res, next) {
        try {
            const object = Object.assign({}, req.params, req.user);
            const result = await auth.otpSend(object);
            return res.status(200).json({
                success: true,
                message: 'Otp sent',
                data: result
            })
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminAuth();