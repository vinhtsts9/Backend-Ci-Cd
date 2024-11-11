const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME ='Notifications'

const notificationSchema = new Schema({
    noti_type: {type:String, enum: ['ORDER-001','ORDER-002','SHOP-001','PROMOTION-001'], required: true},
    noti_senderId: {type:Schema.Types.ObjectId,ref: 'Shop', required:true},
    noti_receiveId: {type: Number, required:true},
    noti_content: {type: String, required:true},
    noti_options: {type: Object, default:{} }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = model(DOCUMENT_NAME, notificationSchema)