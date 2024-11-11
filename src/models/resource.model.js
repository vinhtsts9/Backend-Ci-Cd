const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'Resource'
const COLLECTION_NAME = 'Resources'

const ResourceSchema = new Schema({
    src_name: { type: String, required: true },
    src_slug: { type: String, required: true },
    src_description: { type: String, required: '' }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})
module.exports = model(DOCUMENT_NAME, ResourceSchema)