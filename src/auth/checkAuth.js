const { findById } = require("../services/apikey.service")

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        console.log(key)
        if (!key) {
            return res.status(403).json({
                message: 'Fobidden Error'
            })
        }
        const objKey = await findById(key)
        if (!objKey) {
            return res.status(403).json({
                message: 'Fobidden Error'
            })
        }
        console.log(objKey)
        req.objKey = objKey
        return next()
    } catch (error) {

    }
}
const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'Permission dinied'
            })
        }
        console.log('permission ', req.objKey.permissions)
        const validPermission = req.objKey.permissions.includes(permission)
        if (!validPermission) {
            return res.status(403).json({
                message: 'Permission false'
            })
        }
        return next()
    }
}
module.exports = {
    apiKey,
    permission,
}