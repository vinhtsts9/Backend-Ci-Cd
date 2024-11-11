const { BadRequestError, NotFoundError } = require("../core/error.response")
const discount = require("../models/discount.model")
const { convertToObjectId } = require("../utils")
const { findAllProducts } = require("../models/repo/product.repo")
const { findAllDiscountCodeUnSelected, checkDiscountExists } = require("../models/repo/discount.repo")
class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active, shopId, min_order_value,
            product_ids, applies_to, name, description, type, value, max_uses, uses_count, max_uses_per_user, user_used
        } = payload

        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has experied ')
        }
        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start day must be before end day')
        }
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: shopId
        }).lean()
        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount Exist!')
        }
        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: user_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })
        return newDiscount
    }
    static async updateDiscountCode() {

    }
    static async getAllDiscountCodeWithProduct({
        code, shopId, limit = 50, page = 1
    }) {

        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: shopId
        }).lean()
        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new BadRequestError('discount not found')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to === 'all') {
            products = await findAllProducts({
                filter: {
                    product_shop: shopId,
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if (discount_applies_to === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })

        }
        return products
    }
    static async getAllDiscountCodeByShop({ limit, page, shopId }) {
        const discounts = findAllDiscountCodeUnSelected({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: shopId,
                discount_is_active: true
            },
            unselect: ['__v', 'discount_shopId'],
            model: discount
        })

        return discounts
    }

    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExists({
            model: discount, filter: {
                discount_code: codeId,
                discount_shopId: shopId
            }
        })

        if (!foundDiscount) throw new NotFoundError('discount doesnt exist')
        const {
            discount_is_active,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_max_uses,
            discount_type,
            discount_end_date,
            discount_start_date,
            discount_value
        } = foundDiscount
        if (!discount_is_active) throw new NotFoundError('discount expried')
        if (!discount_max_uses) throw new NotFoundError('discount are out')
        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) throw new NotFoundError('discount code has expried')

        let totalOrder = 0
        console.log(products)
        let productss = products
        if (discount_min_order_value > 0) {
            totalOrder = productss.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(`discount require a minimum order of ${discount_min_order_value}`)
            }
        }
        if (discount_max_uses_per_user > 0) {
            const userUsesDiscount = discount_users_used.find(user => user.userId === userId)
            if (userUsesDiscount) {

            }
        }
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }
    static async deleteDiscountCode({ shopId, codeId }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: shopId
        })
        return deleted
    }
    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            discount_shopId: shopId,
            discount_code: codeId
        })
        if (!foundDiscount) throw new BadRequestError('discount doesnt exist')
        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_user_used: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })
        return result
    }
}
module.exports = DiscountService;