import nodemailer from 'nodemailer';
import app from '../../config/app';

class EmailService {
    constructor() {
        return {
            sendMail: this.sendMail.bind(this),
        }
    }

    async sendMail(message) {
        try {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: app.etonEmailForVerificationId,
                    pass: app.etonEmailForVerificationPassword
                }
            });
            transporter.sendMail(message, function (err, info) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(info);
                }
            });
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

export default new EmailService();