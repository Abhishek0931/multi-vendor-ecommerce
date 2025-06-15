import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

subcategorySchema.index({ name: 1, category: 1 }, { unique: true });

export default mongoose.model('Subcategory', subcategorySchema);