const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {
    static handlerRefreshToken = async ({ user, keyStore, refreshToken }) => {
        const { userId, email } = user
        console.log(refreshToken)
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong!! Pls relogin')
        }
        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registed')

        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop not registed')
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })
        return {
            user:{ userId, email },
            tokens
        }

    }
    static logout = async (keyStore) => {
        const delKey = KeyTokenService.removeKeyById(keyStore._id)
        return delKey
    }
    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new BadRequestError('Shop not registed')

        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication error')

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const userId = foundShop._id
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            publicKey, privateKey, userId

        })
        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }
    static signUp = async ({ name, email, password }) => {
        try {
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                throw new BadRequestError('Error: Email has already registed')
            }
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password:passwordHash
            })
            if (newShop) {
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    throw new BadRequestError('Error: Dont have keystores')
                }
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
                return {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                     }
            }
            return {
                code: 200,
                metadata: null
            }


        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: error
            }
        }
    }
}
module.exports = AccessService