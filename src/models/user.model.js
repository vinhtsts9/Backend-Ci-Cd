const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const UserSchema = new Schema({
    usr_id: { type: Number, required: true },
    usr_slug: { type: String, required: true },
    usr_name: { type: String, default: '' },
    usr_email: { type: String, required: true },
    usr_password: { type: String, default: '' },
    usr_salf: { type: String, default: '' },
    usr_sex: { type: String, default: '' },
    usr_date_of_birth: { type: Date, default: null },
    usr_phone: { type: String, default: '' },
    usr_avatar: { type: String, default: '' },
    usr_role: { type: Schema.Types.ObjectId, ref: 'Role' },
    usr_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})
module.exports = model(DOCUMENT_NAME, UserSchema)