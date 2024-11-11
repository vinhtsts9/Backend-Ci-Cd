const keyTokenModel = require('../models/keyToken.model')
const { Types } = require('mongoose')
class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            /*const token = await keyTokenModel.create({
                user: userId,
                publicKey,
                privateKey
            })
            return token ? token.publicKey : null*/
            const filter = { user: userId }, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = { upsert: true, new: true }

            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: userId })
    }
    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne({ _id: id }).lean()
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken })
    }
    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken })
    }
    static deleteKeyById = async (userId) => {
        return await keyTokenModel.findOneAndDelete({ user: userId })
    }
}
module.exports = KeyTokenService