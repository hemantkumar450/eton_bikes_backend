import pageService from '../../services/user/page-service.js';

class ManagePage {
    constructor() {
        return {
            getPageByType: this.getPageByType.bind(this),
        }
    }

    async getPageByType(req, res, next) {
        try {
            let page = await pageService.getPageByType(req.params);
            return res.status(200).json({
                success: true,
                message: "Page by Id",
                data: page
            });
        } catch (e) {
            next(e)
        }
    }
}

export default new ManagePage();