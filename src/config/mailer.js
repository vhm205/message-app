import nodeMailer from 'nodemailer';

const sendMail = (to, subject, content) => {
    let transporter = nodeMailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })

    let options = {
        to,
        subject,
        html: content
    }

    return transporter.sendMail(options)
}

module.exports = sendMail
