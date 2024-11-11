const { userModel } = require('../models/user.model')
const { BadRequestError } = require('../core/error.response')
const { SuccessResponse } = require('../core/success.response')
const { sendEmailToken } = require('../services/email.service')
const newUserService = async (
    email = null,
    capcha = null
) => {
    const user = await userModel.findOne({ email }).lean()

    if (user) {
        throw new BadRequestEror('email has already exist')
    }

    const result = await sendEmailToken({
        email
    })

    return {
        message: 'Sign up',
        metadata: {
            token: result
        }
    }
}
module.exports = { newUserService }