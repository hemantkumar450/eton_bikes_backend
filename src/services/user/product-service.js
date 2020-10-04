import { Product, SubProduct } from '../../models';

class ProductServices {
    constructor() {
        return {
            getProducts: this.getProducts.bind(this),
            getProductById: this.getProductById.bind(this),
        }
    }

    async getProducts({ limit, sortBy = 'name', orderBy, skip, query }) {
        try {
            let condition = { is_deleted: false, active: true };
            if (query) {
                query = query.trim().toUpperCase();
                condition['$or'] = [{ name: { $regex: '.*' + query + '.*' } }];
            }
            const products = await Product.find(condition)
                .lean()
                .limit(limit)
                .skip(skip)
                .sort({ [sortBy]: orderBy });
            const totalRecords = await Product.countDocuments(condition);
            return {
                products,
                totalRecords
            }
        } catch (e) {
            throw (e);
        }
    }

    async getProductById({ findKey }) {
        try {
            let condition = { is_deleted: false, active: true };
            if (findKey.match(/^[0-9a-fA-F]{24}$/)) {
                condition["_id"] = findKey;  // Yes, it's a valid ObjectId, proceed with `findById` call.
            } else {
                condition["slug"] = findKey;
            }
            const product = await Product.findOne(condition);
            if (product) {
                product.sub_products = await SubProduct.find({ product: product._id });
            }
            return product;
        } catch (e) {
            throw (e)
        }
    }
}

export default new ProductServices();