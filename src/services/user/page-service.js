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
            getPageByType: this.getPageByType.bind(this)
        }
    }

    async getPageByType({ pageType }) {
        try {
            const pageContent = await PageContent.findOne({ pageType: pageType, is_deleted: false });
            return pageContent;
        } catch (e) {
            throw (e)
        }
    }
}

export default new ProductServices();