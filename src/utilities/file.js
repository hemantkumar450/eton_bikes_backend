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

    async _checkExtension(buffer) {
        // check extension from magic hex 
        // input file buffer
        try {
            return await fileType.fromBuffer(buffer);
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
            const extensionObject = await this._checkExtension(data);
            if (config.storage.defaultStorage == 'local') {
                if (!config.app.allowedExtensions.includes(extensionObject.ext)) {
                    throw new Error({ message: "bad extension", expose: true });
                }
                if (!fs.existsSync(config.storage.local.path.media)) {
                    fs.mkdirSync(config.storage.local.path.media);
                }
                console.log(`${config.storage.local.path.media}/${randomName}.${extensionObject.ext}`);
                fs.writeFileSync(`${config.storage.local.path.media}/${randomName}.${extensionObject.ext}`, data);
                uploadedFile = `${randomName}.${extensionObject.ext}`;
            }
            return {
                name: `${randomName}.${extensionObject.ext}`,
                real_name,
                media_link: `${config.storage.local.path.media}/${randomName}.${extensionObject.ext}`,
            }
        } catch (e) {
            throw (e)
        }
    }
}

export default new File();