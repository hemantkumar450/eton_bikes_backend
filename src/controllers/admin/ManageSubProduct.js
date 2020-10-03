import subProductService from '../../services/admin/sub-product-service.js';


class ManageSubProduct {
    constructor() {
        return {
            getSubProducts: this.getSubProducts.bind(this),
            getSubProductById: this.getSubProductById.bind(this),
            addOrEditSubProduct: this.addOrEditSubProduct.bind(this),
            deleteSubProduct: this.deleteSubProduct.bind(this)
        }
    }

    async getSubProducts(req, res, next) {
        try {
            const subProducts = await subsubProductService.getSubProducts(req.query);
            return res.status(200).json({
                success: true,
                message: "Sub Product List",
                data: subProducts
            });
        } catch (error) {
            next(error)
        }
    }

    async getSubProductById(req, res, next) {
        try {
            let subProduct = await subProductService.getSubProductById(req.params);
            return res.status(200).json({
                success: true,
                message: "Sub Product by Id",
                data: subProduct
            });
        } catch (e) {
            next(e)
        }
    }

    async addOrEditSubProduct(req, res, next) {
        try {
            let subProduct = null;
            let message = 'Sub Product Added';
            if (req.method == 'PUT') {
                const forEdit = Object.assign({}, req.params, req.body)
                subProduct = await subProductService.editSubProduct(forEdit);
                message = 'Sub Product Updated';
            } else {
                subProduct = await subProductService.addSubProduct(req.body)
            }
            return res.status(200).json({
                message,
                data: subProduct
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteSubProduct(req, res, next) {
        try {
            await subProductService.deleteSubProduct(req.params);
            return res.status(200).json({
                success: true,
                message: 'product deleted by id',
            })
        } catch (error) {
            next(error)
        }
    }

}

export default new ManageSubProduct();