import auth from '../../services/admin/auth-services';


class AdminAuth {
    constructor() {
        return {
            login: this.login.bind(this),
            createAdmin: this.createAdmin.bind(this)
        }
    }

    async createAdmin(req, res, next) {
        try {
            await auth.createUser(req.body);
            return res.status(200).json({
                success: true,
                message: 'admin create',
                war: 'please do not expose this api'
            })
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            let user = await auth.authenticate(req.body);
            let token = await auth.createToken(user);
            user.password = undefined;
            return res.status(200).json({
                success: true,
                token: token,
                user
            });
        } catch (e) {
            next(e)
        }
    }

}

export default new AdminAuth();