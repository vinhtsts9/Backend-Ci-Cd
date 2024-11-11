const { cart } = require('../cart.model')
const findCartById = async (cartId) => {
    return await cart.findOne({ _id: cartId }).lean()
}
module.exports = findCartById 