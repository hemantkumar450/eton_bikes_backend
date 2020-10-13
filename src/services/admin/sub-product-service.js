import { SubProduct } from '../../models';

class SubProductServices {
    constructor() {
        this.updateOptions = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };
        return {
            getSubProducts: this.getSubProducts.bind(this),
            getSubProductById: this.getSubProductById.bind(this),
            addSubProduct: this.addSubProduct.bind(this),
            editSubProduct: this.editSubProduct.bind(this),
            deleteSubProduct: this.deleteSubProduct.bind(this)
        }
    }

    async getSubProducts({ limit, sortBy = 'name', orderBy, skip, query, email, active }) {
        try {
            let condition = { is_deleted: false };
            if (query) {
                query = '.*' + query + '.*';
                condition['name'] = { $regex: new RegExp('^' + query + '$', 'i') };
            }
            if (email) {
                condition['email'] = { $regex: '.*' + email.toLowerCase() + '.*' }
            }
            if (+active === 1) {
                condition['active'] = true;
            } else if (+active === 0) {
                condition['active'] = false;
            }
            const subProducts = await SubProduct.find(condition)

                .lean()
                .limit(limit)
                .skip(skip)
                .sort({ [sortBy]: orderBy });
            const totalRecords = await SubProduct.countDocuments(condition);
            return {
                subProducts,
                totalRecords
            }
        } catch (e) {
            throw (e);
        }
    }

    async getSubProductById({ subProductId }) {
        try {
            const subProduct = await SubProduct.findOne({ _id: subProductId, is_deleted: false })
                .populate({ path: 'product', select: '_id , name' })
                .populate('detail.media')
                .populate('detail.icon');
            return subProduct;
        } catch (e) {
            throw (e)
        }
    }

    async addSubProduct({
        name,
        description,
        product,
        detail,
        build_specs,
        active
    }) {
        try {
            const subProduct = await SubProduct.create({
                name,
                description,
                product,
                detail,
                build_specs,
                active
            });
            return subProduct;
        } catch (e) {
            throw (e);
        }
    }

    async editSubProduct({
        subProductId,
        name,
        description,
        product,
        detail,
        build_specs,
        active
    }) {
        try {
            const subProduct = await SubProduct.updateOne({ _id: subProductId }, {
                name,
                description,
                product,
                detail,
                build_specs,
                active
            });
            return subProduct;
        } catch (e) {
            throw (e);
        }
    }

    async deleteSubProduct({ subProductId }) {
        try {
            await SubProduct.updateOne({ _id: subProductId }, { $set: { is_deleted: true } });
            return true;
        } catch (error) {
            throw (error)
        }
    }
}

export default new SubProductServices();