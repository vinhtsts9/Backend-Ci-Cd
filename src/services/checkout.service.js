const findCartById = require("../models/repo/cart.repo")

const { BadRequestError, NotFoundError } = require("../core/error.response")
const { checkProductByServer } = require("../models/repo/product.repo")
const { getDiscountAmount } = require('./discount.service')
const { releaseLock, acquireLock } = require("./redis.service")
const { order } = require('../models/order.model')
class CheckoutService {
    static async checkoutReview({
        cartId, userId, shop_order_ids = []
    }) {
        const foundCart = await findCartById(cartId)
        
        if (!foundCart) throw new BadRequestError('Cart doesnt exist')
            const check_order = {
                totalPrice: 0,
                feeShip: 0,
                totalDiscount: 0,
                totalCheckout: 0
        }, shop_order_ids_new = []
        
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
            
            const checkProductServer = await checkProductByServer(item_products)
            
            if (!checkProductServer[0]) throw new BadRequestError('order wrong')
            
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
            
            check_order.totalPrice += checkoutPrice
            
            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: chekoutPrice,
                item_products: checkProductServer
            }
            if (shop_discounts.length > 0) {
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })
                check_order.totalDiscount = discount
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }
            check_order.totalCheckout += priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)

        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            check_order
        }
    }
    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })
        
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log(`[1]::`, products)
        
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireLock.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }
        
        if (acquireLock.includes(false)) {
            throw new BadRequestError('Co loi xay ra, vui long thu lai')
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        if (newOrder) {

        }

        return newOrder
    }

}

module.exports = CheckoutService