import Review from '../models/review.js';

class ReviewRepository {
    async createReview(data) {
        return await Review.create(data);
    }
    async updateReview(reviewId, data) {
        return await Review.findByIdAndUpdate(reviewId, data, { new: true });
    }
    async deleteReview(reviewId) {
        return await Review.findByIdAndDelete(reviewId);
    }
    async getReviewsByProduct(productId, page = 1, limit = 10) {
        const skip = (page -1) * limit;
        const [reviews, total] = await Promise.all([
            Review.find({ product: productId })
                .populate('user', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Review.countDocuments({ product: productId })
        ]);
        
        return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async getReviewByUserAndProduct(userId, productId) {
        return await Review.findOne({ user: userId, product: productId });
    }
}

export default ReviewRepository;