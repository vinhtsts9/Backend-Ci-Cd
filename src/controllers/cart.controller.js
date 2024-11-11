const CartService = require('../services/cart.service')
const { SuccessResponse } = require('../core/success.response')

class CartController {
    addTocart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful add to cart',
            metadata: await CartService.addToCart(erq.body)
        }).send(res)
    }
    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful update cart',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful delete cart',
            metadata: await CartService.deleteUserCart({
                ...req.body
            })
        }).send(res)
    }
    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful list cart',
            metadata: await CartService.getListCart(req.body)
        }).send(res)
    }
}
module.exports = new CartController()