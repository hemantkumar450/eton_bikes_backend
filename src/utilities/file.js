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

    async _getS3Params(key, body, imageRoute) {
        return {
            Key: key,
            Body: body,
            StorageClass: config.storage.s3.storageClass,
            Bucket: config.storage.s3.path + '/' + imageRoute
        };
    }

    async saveFile({ file, imageRoute }, resize = false, width = null, height = null) {
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
                fs.writeFileSync(`${config.storage.local.path}/${randomName}.${ext}`, data);
                uploadedFile = `${randomName}.${ext}`;
            } else {
                /** to do for S3 if required  */
                if (resize) {
                    // data = await this._resize(data, { width, height });
                }
                const fileParams = await this._getS3Params(`${randomName}.${ext}`, data, imageRoute);
                // uploadedFile = await AWS.S3Upload(fileParams);
            }
            return {
                name: `${randomName}.${ext}`,
                real_name,
                s3_link: uploadedFile ? uploadedFile.Location : '',
                size: size,
            }
        } catch (e) {
            throw (e)
        }
    }

    // async _resize(data, params) {
    //     try {
    //         const buffer = sharp(data);
    //         let newBuffer = false;
    //         newBuffer = await buffer.jpeg({
    //             quality: 100
    //         }).resize(params.height, params.width, {
    //             kernel: sharp.kernel.nearest, fit: 'contain'
    //         });
    //         return newBuffer;
    //     } catch (e) {
    //         throw (e)
    //     }
    // }
}

export default new File();