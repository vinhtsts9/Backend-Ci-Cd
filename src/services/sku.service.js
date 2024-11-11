const _ = require('lodash')
const skuModel = require("../models/sku.model")
const { randomProductId } = require("../utils")
const { CACHE_PRODUCT } = require('../configs/constant')
const { getCache, setCacheExpiration } = require('../models/repo/cache.repo')

const newSku = async ({ spu_id, sku_list }) => {
    try {
        const convert_sku_list = sku_list.map(sku => {
            return { ...sku, product_id: spu_id, sku_id: `${spu_id}.${randomProductId()}` }
        })
        const skus = skuModel.create(convert_sku_list)
        return skus
    } catch (error) {

    }
}

const oneSku = async ({ sku_id, product_id }) => {
    try {
        //1. check params
        if (sku_id < 0) return null
        if (product_id < 0) return null
        //2. Lay key tu cache
        const skuKeyCache = `${CACHE_PRODUCT.SKU}${sku_id}`

        //3. Lay du lieu tu dbs

        const skuCache = await skuModel.findOne({
            sku_id, product_id
        }).lean()

        const valueCache = skuCache ? skuCache : null
        setCacheExpiration({
            key: skuKeyCache,
            value: JSON.stringify(valueCache),
            expirationInSeconds: 30
        }).then()


        return {
            skuCache,
            toLoad: 'dbs'
        }

        //return _.omit(skuCache, ['__v', 'updatedAt', 'createdAt', 'isDeleted'])
    } catch (error) {
        return error
    }
}

const allSkuBySpuId = async ({ product_id }) => {
    try {
        const skus = await skuModel.find({ product_id }).lean()
        return skus
    } catch (error) {
        return error
    }
}

module.exports = { newSku, oneSku, allSkuBySpuId }