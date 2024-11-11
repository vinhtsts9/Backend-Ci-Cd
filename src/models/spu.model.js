const { model, Schema, Types } = require('mongoose')
const slugify = require('slugify')

const DOCUMENT_NAME = 'spu'
const COLLECTION_NAME = 'spus'

const productSchema = new Schema({
    product_id: { type: String, default: '' },
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_category: { type: Array, required: [] },
    //product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDeleted: { type: Boolean, default: false }
}, {
    collection: COLLECTION_NAME,
    timestamp: true
})

productSchema.index({ product_name: 'text', product_description: 'text' })

productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next();
})


module.exports = model(DOCUMENT_NAME, productSchema)