const apiKeyModel = require('../models/apikey.model')
const crypto = require('crypto')
const findById = async (key) => {
    // const newKey = await apiKeyModel.create({ key: crypto.randomBytes(64).toString('hex'), permissions: ['0000'] })
    // console.log(newKey)
    try {
        const objKey = await apiKeyModel.findOne({ key, status: true }).lean()
        return objKey
    } catch (error) {
        console.log(error)
    }
}
module.exports = { findById }