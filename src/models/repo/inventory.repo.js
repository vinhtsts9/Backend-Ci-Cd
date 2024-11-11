const { inventory } = require('../inventory.model')
const { Types } = require('mongoose')
const insertInventory = async ({
    productId, shopId, stock, location = 'unKnow'
}) => {
    return await inventory.create({
        inven_productId: productId,
        inven_location: location,
        inven_stock: stock,
        inven_shopId: shopId,

    })
}

const reservationInventory = async (productId, cartId, quantity) => {
    const query = {
        inven_productId: productId,
        inven_stock: { $gte: quantity }
    }, updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservations: {
                cartId,
                quantity,
                createdOn: new Date()
            }
        }
    }, options = { upsert: true, new: true }
    return await inventory.updateOne(query, updateSet)
}
module.exports = {
    insertInventory, reservationInventory
}