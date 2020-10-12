import { Product, SubProduct } from '../../models';
import crypto from 'crypto';

class ProductServices {
    constructor() {
        this.updateOptions = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };
        return {
            getProducts: this.getProducts.bind(this),
            getProductById: this.getProductById.bind(this),
            addProduct: this.addProduct.bind(this),
            editProduct: this.editProduct.bind(this),
            deleteProduct: this.deleteProduct.bind(this)
        }
    }

    async getProducts({ limit, sortBy = 'name', orderBy, skip, query, active, dropdown }) {
        try {
            let condition = { is_deleted: false };
            if (query) {
                query = '.*' + query + '.*';
                condition['name'] = { $regex: new RegExp('^' + query + '$', 'i') };
            }
            if (+active === 1) {
                condition['active'] = true;
            } else if (+active === 0) {
                condition['active'] = false;
            }
            if (+dropdown === 1) {
                return await Product.find(condition, { name: 1, email: 1 })
                    .lean()
                    .sort({ [sortBy]: orderBy })
                    .lean();
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

    async getProductById({ productId }) {
        try {
            const product = await Product.findOne({ _id: productId, is_deleted: false })
                .populate('long_shot_media')
                .populate('close_up_media');
            if (product) {
                product.sub_products = await SubProduct.find({ product: productId });
            }
            return product;
        } catch (e) {
            throw (e)
        }
    }

    async addProduct({
        name,
        title,
        description,
        features,
        close_up_media,
        long_shot_media,
        media_urls,
        geometry,
        tech_support
    }) {
        try {
            const slug = await this._createSlug(null, name);
            const product = await Product.create({
                name,
                title,
                description,
                features,
                slug,
                close_up_media,
                long_shot_media,
                media_urls,
                geometry,
                tech_support
            });
            return product;
        } catch (e) {
            throw (e);
        }
    }

    async editProduct({
        productId,
        name,
        title,
        description,
        features,
        close_up_media,
        long_shot_media,
        media_urls,
        geometry,
        tech_support
    }) {
        try {
            const slug = await this._createSlug(productId, name);
            const product = await Product.updateOne({ _id: productId }, {
                name,
                title,
                description,
                features,
                slug,
                close_up_media,
                long_shot_media,
                media_urls,
                geometry,
                tech_support
            });
            return product;
        } catch (e) {
            throw (e);
        }
    }

    async deleteProduct({ productId }) {
        try {
            await Product.updateOne({ _id: productId }, { $set: { is_deleted: true } });
            return true;
        } catch (error) {
            throw (error)
        }
    }

    async _createSlug(productId, name) {
        try {
            if (productId) {
                const product = await Product.findOne({ _id: productId });
                if (product && product.slug) {
                    return product.slug;
                }
            }
            let slugName = `${name}`;
            slugName = slugName.toString().toLowerCase()
                .replace(/\s+/g, '-')        // Replace spaces with -
                .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
                .replace(/\-\-+/g, '-')      // Replace multiple - with single -
                .replace(/^-+/, '')          // Trim - from start of text
                .replace(/-+$/, '');         // Trim - from end of text
            const product = await Product.findOne({ slug: slugName });
            if (product) {
                slugName = product.slug + '-' + crypto.randomBytes(2).toString('hex');
                return await this._createSlug(productId, slugName);
            }
            return slugName;
        } catch (error) {
            throw (error);
        }
    }
}

export default new ProductServices();