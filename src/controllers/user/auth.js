import auth from '../../services/user/auth-service';


class AdminAuth {
    constructor() {
        return {
            login: this.login.bind(this),
            verifyEmail: this.verifyEmail.bind(this),
            createUser: this.createUser.bind(this),
            updateUser: this.updateUser.bind(this),
            logout: this.logout.bind(this),
        }
    }

    async login(req, res, next) {
        try {
            let user = await auth.authenticate(req.body);
            let token = await auth.createToken(user);
            user.password = undefined;
            return res.status(200).json({
                success: true,
                token,
                user
            });
        } catch (e) {
            next(e)
        }
    }

    async verifyEmail(req, res, next) {
        try {
            let user = await auth.verifyEmail(req.body);
            return res.status(200).json({
                success: true,
                message: 'email verification',
                data: user
            });
        } catch (e) {
            next(e)
        }
    }

    async createUser(req, res, next) {
        try {
            const user = await auth.createUser(req.body)
            return res.status(200).json({
                success: true,
                message: 'User Added',
                data: user
            })
        } catch (error) {
            next(error)
        }
    }

    async updateUser(req, res, next) {
        try {
            const forEdit = Object.assign({}, req.user, req.body)
            const user = await auth.updateUser(forEdit)
            return res.status(200).json({
                success: true,
                message: 'User Updated',
                data: user
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
}

export default new AdminAuth();