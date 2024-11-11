const { model, Schema, Types } = require('mongoose')

const DOCUMENTNAME = 'Apikey'
const COLLECTIONNAME = 'Apikeys'

const apiKeySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222']
    }
}, {
    timestamps: true,
    collection: COLLECTIONNAME
});
module.exports = model(DOCUMENTNAME, apiKeySchema)