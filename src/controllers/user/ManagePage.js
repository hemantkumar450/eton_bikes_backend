import pageService from '../../services/admin/page-service.js';

class ManagePage {
    constructor() {
        return {
            getPages: this.getPages.bind(this),
            getPageById: this.getPageById.bind(this),
        }
    }

    async getPages(req, res, next) {
        try {
            const pages = await pageService.getPages(req.query);
            return res.status(200).json({
                success: true,
                message: "Page List",
                data: pages
            })
        } catch (error) {
            next(error)
        }
    }

    async getPageById(req, res, next) {
        try {
            let page = await pageService.getPageById(req.params);
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