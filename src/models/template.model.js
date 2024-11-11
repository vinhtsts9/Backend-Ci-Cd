const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'template'
const COLLECTION_NAME = 'templates'
// Declare the Schema of the Mongo model
const templateSchema = new Schema({
    tem_id: { type: String, required: true },
    tem_name: { type: String, required: true },
    tem_status: { type: String, default: 'active' },
    tem_html: { type: String, required: true }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, templateSchema);