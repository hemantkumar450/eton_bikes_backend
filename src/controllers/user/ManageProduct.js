import productService from '../../services/user/product-service.js';

class ManageProduct {
    constructor() {
        return {
            getProducts: this.getProducts.bind(this),
            getProductById: this.getProductById.bind(this),
        }
    }

    async getProducts(req, res, next) {
        try {
            const products = await productService.getProducts(req.query);
            return res.status(200).json({
                success: true,
                message: "Product List",
                data: products
            })
        } catch (error) {
            next(error)
        }
    }

    async getProductById(req, res, next) {
        try {
            let product = await productService.getProductById(req.params);
            return res.status(200).json({
                success: true,
                message: "Product by Id",
                data: product
            });
        } catch (e) {
            next(e)
        }
    }
}

export default new ManageProduct();