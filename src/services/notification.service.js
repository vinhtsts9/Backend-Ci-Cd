const notiModel = require('../models/notification.model')

const pushNotiToSystem = async({
    type , receiveId , senderId, options={}
}) => {
    let noti_content 

    if (type === 'SHOP-001') {
        noti_content = `${options.shop_name} vua them moi 1 san pham ${options.product_name}`
    } else if(type === 'PROMOTION-001') {
        noti_content = `${senderId} vua them moi 1 voucher`
    }

    const newNoti = await notiModel.create({
        noti_type: type,
        noti_content,
        noti_receiveId: receiveId,
        noti_senderId: senderId,
        noti_options: options
    })

    return newNoti
}

module.exports = {
    pushNotiToSystem
}