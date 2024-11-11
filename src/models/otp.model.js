const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'otp_log'
const COLLECTION_NAME = 'otp_logs'
// Declare the Schema of the Mongo model
const otpSchema = new Schema({
    otp_token: { type: String, required: true },
    otp_email: { type: String, required: true },
    otp_status: { type: String, default: 'pending', enum: ['active', 'pending', 'blocked'] },
    expireAt: {
        type: Date, default: Date.now, expire: 60
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, otpSchema);