const { product, clothing, electronic, furniture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils/index')
const { findAllDraftsForShop, publishProductByShop, findAllPublishForShop, unPublishProductByShop, searchProductByUser, updateProductById, findAllProducts } = require('../models/repo/product.repo')
const { insertInventory } = require('../models/repo/inventory.repo')
const { pushNotiToSystem } = require('./notification.service')
const { error } = require('console')
const { findShopById } = require('../models/repo/shop.repo')
class ProductFactory {
    static productRegistry = {}
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product type ${type}`)

        return new productClass(payload).createProduct()
    }
    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product type ${type}`)

        return new productClass(payload).updateProduct(productId)
    }

    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }
    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }
    static async publishProductByShop({ product_shop, product_id }) {
        const shop = await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        const shop = await unPublishProductByShop({ product_shop, product_id })
    }
    static async getListSearchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }
    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumb'] })
    }
    static async findProducts({ product_id }) {
        return await findProducts({ product_id, unSelect: ['__v'] })
    }
    static async getListSearchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }
}
class Product {
    constructor({ product_name, product_thumb, product_description, product_price, product_type, product_shop, product_attributes, product_quantity }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
        this.product_quantity = product_quantity
    }
    async createProduct(productId) {
        const newProduct = await product.create({ ...this, _id: productId })
        if (newProduct) {
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
            console.log(`this shop::::${this.product_shop}`)
            const shopNoti = await findShopById({shop_id: this.product_shop})
            console.log(shopNoti)
            pushNotiToSystem({
                type: 'SHOP-001',
                receiveId: 1,
                senderId: this.product_shop,
                options: {
                    product_name: this.product_name,
                    shop_name: shopNoti.name
                }
            }).then(rs => console.log(rs))
            .catch(console.error)
        }
        
        return newProduct
    }
    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product })
    }
}
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError('create new clothing error')

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('create new product error')
        return newProduct
    }
    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this)
        console.log(objectParams)
        if (objectParams.product_attributes) {
            await updateProductById({ productId, bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), model: clothing })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}
class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError('create new electronic error')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('create new product error')

        return newProduct
    }
}
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('create new Furniture error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('create new product error')

        return newProduct
    }
}
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)
module.exports = ProductFactory;