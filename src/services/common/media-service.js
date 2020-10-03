import { Media } from '../../models';
import fileUtilities from '../../utilities/file';
import _ from 'lodash';


class MediaService {
    constructor() {
        return {
            getMediaDetailById: this.getMediaDetailById.bind(this),
            saveMedia: this.saveMedia.bind(this),
            deleteMedia: this.deleteMedia.bind(this),
        }
    }

    async saveMedia({
        file,
        media_type = "image",
    }) {
        try {
            const { name, media_link } = await fileUtilities.saveFile({ file });
            return await Media.create({
                name,
                media_link,
                media_type,
            });
        } catch (error) {
            throw (error);
        }
    }

    async getMediaDetailById({ mediaId }) {
        try {
            return await Media.findOne({ _id: mediaId });
        } catch (error) {
            throw (error);
        }
    }

    async deleteMedia({ mediaId }) {
        try {
            await Media.findOneAndUpdate({ _id: mediaId }, { is_deleted: true });
        } catch (error) {
            throw (error)
        }
    }

    _throwException(message) {
        throw ({
            name: "etonBikes",
            code: 400,
            message
        });
    }
}

export default new MediaService();