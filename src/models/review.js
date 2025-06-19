import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxlength: 1000 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

reviewSchema.index({ product: 1, user: 1 }, { unique: true }); // Prevent multiple reviews per product per user

export default mongoose.model('Review', reviewSchema);
// This code defines a Mongoose schema for product reviews in an e-commerce application.
// Each review is associated with a product and a user, includes a rating (1-5),
// an optional comment, and a timestamp for when the review was created.