const { cart } = require('../models/cart.model')
const { BadRequestError, NotFoundError } = require("../core/error.response")
const { getProductById } = require('../models/repo/product.repo')

class CartService {
    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product
                }
            }, options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }
    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        }, updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }, options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateSet, options)
    }
    static async addToCart({ userId, product = {} }) {
        const useCart = await cart.findOne({
            cart_userId: userId
        })
        if (!useCart) return await CartService.createUserCart({ userId, product })
        if (!useCart.cart_products.length) {
            useCart.cart_products = [product]
            return await useCart.save()
        }

        return await CartService.updateUserCartQuantity({ userId, product })
    }
    static async addToCartV2({ userId, product = {} }) {
        const { productId, quantity, oldQuantity } = shop_order_ids[0]?.item_products[0]
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new NotFoundError('not found')
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product do not belong to shops')
        }
        if (quantity === 0) {

        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }
    static async deleteUserCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }
                }
            }
        const deleteCart = await cart.updateOne(query, updateSet)
        return deleteCart
    }
    static async getListCart({ userId }) {
        return await cart.findOne({
            cart_userId: userId
        }).lean()
    }
}
module.exports = CartService