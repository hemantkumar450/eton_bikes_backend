import productService from '../../services/admin/product-service.js';
import mediaService from '../../services/common/media-service';


class ManageProduct {
    constructor() {
        return {
            getProducts: this.getProducts.bind(this),
            getProductById: this.getProductById.bind(this),
            addOrEditProduct: this.addOrEditProduct.bind(this),
            deleteProduct: this.deleteProduct.bind(this),
            fileUploader: this.fileUploader.bind(this),
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

    async addOrEditProduct(req, res, next) {
        try {
            let product = null;
            let message = 'Product Added';
            if (req.method == 'PUT') {
                const forEdit = Object.assign({}, req.params, req.body)
                product = await productService.editProduct(forEdit);
                message = 'Product Updated';
            } else {
                product = await productService.addProduct(req.body)
            }
            return res.status(200).json({
                message,
                data: product
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteProduct(req, res, next) {
        try {
            await productService.deleteProduct(req.params);
            return res.status(200).json({
                success: true,
                message: 'product deleted by id',
            })
        } catch (error) {
            next(error)
        }
    }

    async fileUploader(req, res, next) {
        try {
            let { file } = req.files;
            const image = await mediaService.saveMedia({ file });
            return res.status(200).json({
                success: true,
                message: 'Profile picture uploaded successfully',
                data: image
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new ManageProduct();