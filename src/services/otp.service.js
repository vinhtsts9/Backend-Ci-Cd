const otpModel = require('../models/otp.model')
const crypto = require('crypto')
const generateToken = () => {
    const token = crypto.randomInt(0, Math.pow(2, 32))
}

const newToken = async (email) => {
    const tokenGenarate = generateToken()
    token = otpModel.create({
        otp_token: tokenGenarate,
        otp_email: email
    })

    return token
}
module.exports = { newToken }