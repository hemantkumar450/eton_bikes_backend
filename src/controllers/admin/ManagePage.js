import pageService from '../../services/admin/page-service.js';

class ManagePage {
    constructor() {
        return {
            getPages: this.getPages.bind(this),
            getPageById: this.getPageById.bind(this),
            addOrEditPage: this.addOrEditPage.bind(this),
            deletePage: this.deletePage.bind(this),
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

    async addOrEditPage(req, res, next) {
        try {
            let page = null;
            let message = 'Page Added';
            if (req.method == 'PUT') {
                const forEdit = Object.assign({}, req.params, req.body)
                page = await pageService.editPage(forEdit);
                message = 'Page Updated';
            } else {
                page = await pageService.addPage(req.body)
            }
            return res.status(200).json({
                message,
                data: page
            })
        } catch (error) {
            next(error)
        }
    }

    async deletePage(req, res, next) {
        try {
            await pageService.deletePage(req.params);
            return res.status(200).json({
                success: true,
                message: 'page deleted by id',
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new ManagePage();