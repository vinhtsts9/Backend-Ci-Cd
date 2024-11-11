const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENTNAME = 'Key'
const COLLECTIONNAME = 'Keys'
// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
    },
    refreshTokensUsed: {
        type: Array, default: []
    },
    refreshToken: {
        type: String, required: true
    }
}, {
    collection: COLLECTIONNAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENTNAME, keyTokenSchema);