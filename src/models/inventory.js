import mongoose from 'mongoose';
import product from './product.js';

const inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    variant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true  
    },

    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    stock: {
        type: Number,
        required: true,
        min: 0
    },

    reserved: {
        type: Number,
        default: 0
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
})

inventorySchema.index({ product: 1, variant: 1, vendor: 1 }, { unique: true });

export default mongoose.model('Inventory', inventorySchema);
// This schema defines the inventory for each product variant per vendor.