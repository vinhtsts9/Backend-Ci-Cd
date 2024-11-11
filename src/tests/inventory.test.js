const PubSubService = require('../services/redisPubSub.service')
class InventoryTest  {
    constructor(){
        PubSubService.subscribe('order',(channel,message) => {
            InventoryTest.updateInventory(message)
        }
        )
    }
    static updateInventory(orderId,productId) {
        console.log(`update inventory for order ${orderId} and product ${productId}`)
    }
}
module.exports = new InventoryTest()
