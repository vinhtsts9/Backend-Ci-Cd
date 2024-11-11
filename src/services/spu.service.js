const { findShopById } = require("../models/repo/shop.repo")
const _ = require('lodash')
const { NotFoundError } = require('../core/error.response')
const spuModel = require("../models/spu.model")
const { randomProductId } = require("../utils")
const { newSku, allSkuBySpuId } = require("./sku.service")
const newSpu = async ({
    product_id,
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_category,
    product_shop,
    product_attributes,
    product_quantity,
    product_variations,
    sku_list = []
}) => {
    try {
        const foundShop = await findShopById({ shop_id: product_shop })
        if (!foundShop) throw new NotFoundError('Shop not found')

        const spu = await spuModel.create({
            product_id: randomProductId(),
            product_name,
            product_thumb,
            product_description,
            product_price,
            product_category,
            product_shop,
            product_attributes,
            product_quantity,
            product_variations
        })
        console.log(123)
        if (spu && sku_list.length) {
            newSku({ sku_list, spu_id: spu.product_id }).then()
        }
        return spu
    } catch (error) {

    }
}
const oneSpu = async ({ spu_id }) => {
    try {
        console.log('Đang tìm SPU với id:', spu_id);
        const spu = await spuModel.findOne({
            product_id: spu_id
        }).lean();

        if (!spu) {
            console.log(`Không tìm thấy SPU với id: ${spu_id}`);
            throw new NotFoundError('SPU không tìm thấy');
        }

        console.log('SPU tìm thấy:', spu);

        const skus = await allSkuBySpuId({ product_id: spu.product_id });
        console.log('SKUs tìm thấy:', skus);

        return {
            spu_info: _.omit(spu, ['__v', 'updatedAt']),
            sku_list: skus.map(sku => _.omit(sku, ['__v', 'updatedAt', 'createdAt', 'isDeleted']))
        };
    } catch (error) {
        console.error('Lỗi trong oneSpu:', error);
        throw error;
    }
}

module.exports = {
    newSpu,
    oneSpu
}