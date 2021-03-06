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
            let condition = { is_deleted: false };
            if (query) {
                query = query.trim().toUpperCase();
                condition['$or'] = [{ name: { $regex: '.*' + query + '.*' } }];
            }
            const products = await Product.find(condition)
                .populate('close_up_media')
                .populate('long_shot_media')
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
            let condition = { is_deleted: false };
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
            if (checkForHexRegExp.test(findKey)) {
                condition["_id"] = findKey;  // Yes, it's a valid ObjectId, proceed with `findById` call.
            } else {
                condition["slug"] = findKey;
            }

            let product = await Product.findOne(condition)
                .populate('close_up_media')
                .populate('long_shot_media');
            if (product) {
                product = product.toObject();
                if (product) {
                    const sub_products = await SubProduct.find({ product: product._id })
                        .populate('detail.media')
                        .populate('detail.icon');

                    product.sub_products = sub_products.filter(x => !x.is_deleted);
                }
                return product;
            }
            return null;
        } catch (e) {
            throw (e)
        }
    }
}

export default new ProductServices();