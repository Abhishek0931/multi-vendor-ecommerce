import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
    color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Color',
        required: true
    },

    size: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Size',
            required: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    quantity: {
        type: Number,
        required: true,
        min: 0
    },

    images: [{ type: String, required: true }]
},
{ _id: false });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: false,
        trim: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    }, // base price or default

    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
        
    },

    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subcategory'
    },

    tags: [{ type: String}],

    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    isApproved: {
        type: Boolean,
        default: false
    },

    variants: [variantSchema],

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});



export default mongoose.model('Product', productSchema);
// This schema defines the structure of the Product document in MongoDB.