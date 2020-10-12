import { PageContent } from '../../models';
import crypto from 'crypto';

class ProductServices {
    constructor() {
        this.updateOptions = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };
        return {
            getPages: this.getPages.bind(this),
            getPageById: this.getPageById.bind(this),
            addPage: this.addPage.bind(this),
            editPage: this.editPage.bind(this),
            deletePage: this.deletePage.bind(this),
        }
    }

    async getPages({ limit, sortBy = 'name', orderBy, skip, query, email, active }) {
        try {
            let condition = { is_deleted: false };
            if (query) {
                query = '.*' + query + '.*';
                condition['name'] = { $regex: new RegExp('^' + query + '$', 'i') };
            }
            const pageContents = await PageContent.find(condition)
                .lean()
                .limit(limit)
                .skip(skip)
                .sort({ [sortBy]: orderBy });
            const totalRecords = await PageContent.countDocuments(condition);
            return {
                pageContents,
                totalRecords
            }
        } catch (e) {
            throw (e);
        }
    }

    async getPageById({ pageId }) {
        try {
            const pageContent = await PageContent.findOne({ _id: pageId, is_deleted: false });
            return pageContent;
        } catch (e) {
            throw (e)
        }
    }

    async addPage({
        name,
        heading,
        content,
        sections,
        pageType
    }) {
        try {
            const pageContent = await PageContent.create({
                name,
                heading,
                content,
                sections,
                pageType
            });
            return pageContent;
        } catch (e) {
            throw (e);
        }
    }

    async editPage({
        pageId,
        name,
        heading,
        content,
        sections,
        pageType
    }) {
        try {
            console.log(pageId);
            const pageContent = await PageContent.updateOne({ _id: pageId }, {
                name,
                heading,
                content,
                sections,
                pageType
            });
            return pageContent;
        } catch (e) {
            throw (e);
        }
    }

    async deletePage({ pageId }) {
        try {
            console.log(pageId);
            await PageContent.updateOne({ _id: pageId }, { $set: { is_deleted: true } });
            return true;
        } catch (error) {
            throw (error)
        }
    }
}

export default new ProductServices();