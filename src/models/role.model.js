const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'Role'
const COLLECTION_NAME = 'Roles'

const RoleSchema = new Schema({
    rol_name: { type: String, default: 'user', enum: ['user', 'admin', 'shop'] },
    rol_slug: { type: String, require: true },
    rol_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
    rol_description: { type: String, default: '' },
    rol_grants: [{
        resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
        actions: [{ type: String, required: true }],
        attributes: { type: String, default: '*' }
    }]
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})
module.exports = model(DOCUMENT_NAME, RoleSchema)