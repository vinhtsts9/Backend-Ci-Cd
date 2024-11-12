const { model, Schema, Types } = require('mongoose');
const DOCUMENTNAME = 'Shop'
const COLLECTIONNAME = 'Shops'

// Declare the Schema of the Mongo model
var shopSchema = new Schema({
    name: {
        type: String,
        trim: true,
        maxLength: 150
    },
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: COLLECTIONNAME
});

//Export the model
module.exports = model(DOCUMENTNAME, shopSchema);