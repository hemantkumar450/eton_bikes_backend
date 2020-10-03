import keyService from '../../services/admin/key-service.js';

class ManageKey {
    constructor() {
        return {
            getKeys: this.getKeys.bind(this),
            getKeysByCategory: this.getKeysByCategory.bind(this),
            addOrEditKey: this.addOrEditKey.bind(this),
            deleteKey: this.deleteKey.bind(this),
        }
    }

    async getKeys(req, res, next) {
        try {
            const products = await keyService.getKeys(req.query);
            return res.status(200).json({
                success: true,
                message: "Product List",
                data: products
            })
        } catch (error) {
            next(error)
        }
    }

    async getKeysByCategory(req, res, next) {
        try {
            let product = await keyService.getKeysByCategory(req.params);
            return res.status(200).json({
                success: true,
                message: "Product by Id",
                data: product
            });
        } catch (e) {
            next(e)
        }
    }

    async addOrEditKey(req, res, next) {
        try {
            let key = null;
            let message = 'Key Added';
            if (req.method == 'PUT') {
                const forEdit = Object.assign({}, req.params, req.body)
                key = await keyService.editKey(forEdit);
                message = 'Key Updated';
            } else {
                key = await keyService.addKey(req.body)
            }
            return res.status(200).json({
                message,
                data: key
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteKey(req, res, next) {
        try {
            await keyService.deleteKey(req.params);
            return res.status(200).json({
                success: true,
                message: 'product deleted by id',
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new ManageKey();