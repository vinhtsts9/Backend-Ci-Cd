const { BadRequestError } = require('../core/error.response')
const { OK, CREATED, SuccessResponse } = require('../core/success.response')
const AccessService = require('../services/access.service')
class AccessController {
    handlerRefeshToken = async (req, res, next) => {
        new SuccessResponse({
            message: 'Got token success',
            metadata: await AccessService.handlerRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout Success',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
    login = async (req, res, next) => {
        const { email } = req.body
        if (!email) throw new BadRequestError('email missing')
        new SuccessResponse({
            metadata: await AccessService.login(req.body)

        }).send(res)
    }
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registed Ok!',
            metadata: await AccessService.signUp(req.body),
            option: {
                limit: 10
            }
        }).send(res)
    }
}

module.exports = new AccessController()