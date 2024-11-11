const PubSubService = require('../services/redisPubSub.service')

class ProductTest{
    purchaseProduct({orderId,productId}) {
    const order = {
        orderId,
        productId
    }
    PubSubService.publish('order',JSON.stringify(order))
}}


module.exports = new ProductTest()