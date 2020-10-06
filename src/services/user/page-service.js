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
            getPageById: this.getPageById.bind(this)
        }
    }

    async getPageById({ pageType }) {
        try {
            const pageContent = await PageContent.findOne({ pageType: pageType, is_deleted: false });
            return pageContent;
        } catch (e) {
            throw (e)
        }
    }
}

export default new ProductServices();