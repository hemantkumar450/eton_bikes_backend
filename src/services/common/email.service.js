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
            // let transport = nodemailer.createTransport({
            //     host: 'smtp.mailtrap.io',
            //     port: 2525,
            //     auth: {
            //         user: 'hemant.kumar450@gmail.com',
            //         pass: 'mjknh@123'
            //     }
            // });

            let transport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: app.etonEmailForVerificationId,
                    pass: app.etonEmailForVerificationPassword
                }
            });

            transport.sendMail(message, function (err, info) {
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