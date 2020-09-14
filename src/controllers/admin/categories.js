import categories from '../../services/common/categories';

class AdminCategories {
    constructor() {
        return {
            create: this.create.bind(this),
            getCateggories: this.getCateggories.bind(this),
        }
    }
    async create(req, res, next) {
        try {
            const resp  = await categories.saveCategories(req.body);
            return res.status(200).json({
                success: true,
                message: 'categories created',
                war: 'please do not expose this api',
                // resp,
            });
        } catch (error) {
            next(error);
        }
    }
    async getCateggories(req, res, next) {
        try {
            const data = await categories.fetchCategories();
            return res.status(200).json({
                success: true,
                message: 'All Categories',
                categories: data,
            });
        } catch (error) {
            next(error);
        }
    }
}
export default new AdminCategories();