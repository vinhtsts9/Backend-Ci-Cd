const { transport } = require("../dbs/init.nodemailer")
const { replacePlaceholder } = require("../utils")
const { newToken } = require("./otp.service")
const { getTemplate } = require("./template.service")

const sendEmailLinkVerify = ({
    html, toEmail, subject, text = 'xac nhan'
}) => {
    try {
        mailOptions = {
            from: 'Vinhtiensinh17@gmail.com',
            to: toEmail,
            html,
            text,
            subject
        }
        transport.sendEmail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error)
            }
            console.log('message sent', info.messageId)
        })
    } catch (error) {
        console.log('error send Email:', error)
        return error
    }
}

const sendEmailToken = async ({ email }) => {
    try {
        const token = await newToken({ email })

        const template = await getTemplate({
            tem_name: 'EMAIL_TEMPLATE_HTML'
        })

        const content = replacePlaceholder(
            template.tem_html, { link_verify: `http://locahost:3056/cgp/welcome-back?token=${token.otp_token}` }
        )

        sendEmailLinkVerify({
            html: content, toEmail: email, subject: 'Vui long xac nhan dang ki shopDev'
        }).catch(err => console.error(error))
    } catch (error) {
        return error
    }
}

module.exports = { sendEmailToken }