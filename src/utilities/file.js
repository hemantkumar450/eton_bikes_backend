import config from "../config";
import crypto from 'crypto';
const fileType = require('file-type');
var fs = require("fs");
// import sharp from 'sharp';

class File {
    constructor() {
        return {
            saveFile: this.saveFile.bind(this)
        }
    }

    _checkExtension(buffer) {
        // check extension from magic hex 
        // input file buffer
        try {
            return fileType(buffer);
        } catch (e) {
            throw (e)
        }
    }

    async _getName() {
        return crypto.randomBytes(20).toString('hex');
    }

    async saveFile({ file }) {
        try {
            let uploadedFile = null;
            let { name: real_name, size, data } = file;
            const randomName = await this._getName();
            const ext = this._checkExtension(data).ext
            if (config.storage.defaultStorage == 'local') {
                if (!config.allowedExtensions.includes(ext)) {
                    throw new Error({ message: "bad extension", expose: true });
                }
                if (!fs.existsSync(config.storage.local.path)) {
                    fs.mkdirSync(config.storage.local.path);
                }
                fs.writeFileSync(`${config.storage.local.path.media}/${randomName}.${ext}`, data);
                uploadedFile = `${randomName}.${ext}`;
            }
            return {
                name: `${randomName}.${ext}`,
                real_name,
                media_link: `${config.storage.local.path.media}/${randomName}.${ext}`,
            }
        } catch (e) {
            throw (e)
        }
    }
}

export default new File();