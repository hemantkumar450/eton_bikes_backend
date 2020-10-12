import { Key } from '../../models';

class KeyServices {
    constructor() {
        this.updateOptions = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };
        return {
            getKeys: this.getKeys.bind(this),
            getKeysByCategory: this.getKeysByCategory.bind(this),
            addKey: this.addKey.bind(this),
            editKey: this.editKey.bind(this),
            deleteKey: this.deleteKey.bind(this)
        }
    }

    async getKeys({ limit, sortBy = 'name', orderBy, skip, query }) {
        try {
            let condition = { is_deleted: false };
            if (query) {
                query = '.*' + query + '.*';
                console.log(query)
                condition['name'] = { $regex: new RegExp('^' + query + '$', 'i') };
            }
            const keys = await Key.find(condition)
                .lean()
                .limit(limit)
                .skip(skip)
                .sort({ [sortBy]: orderBy });
            const totalRecords = await Key.countDocuments(condition);
            return {
                keys,
                totalRecords
            }
        } catch (e) {
            throw (e);
        }
    }

    async getKeysByCategory({ category }) {
        try {
            const key = await Key.find({ category, is_deleted: false });
            return key;
        } catch (e) {
            throw (e)
        }
    }

    async addKey({
        order,
        name,
        category
    }) {
        try {
            const key = await Key.create({
                order,
                name,
                category
            });
            return key;
        } catch (e) {
            throw (e);
        }
    }

    async editKey({
        keyId,
        order,
        name,
        category
    }) {
        try {
            const key = await Key.updateOne({ _id: keyId }, {
                order,
                name,
                category
            });
            return key;
        } catch (e) {
            throw (e);
        }
    }

    async deleteKey({ keyId }) {
        try {
            await Key.updateOne({ _id: keyId }, { $set: { is_deleted: true } });
            return true;
        } catch (error) {
            throw (error)
        }
    }
}

export default new KeyServices();