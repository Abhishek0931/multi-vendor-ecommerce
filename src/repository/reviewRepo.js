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
    async getReviewsByProduct(productId) {
        return await Review.find({ product: productId }).populate('user', 'name');
    }
    async getReviewByUserAndProduct(userId, productId) {
        return await Review.findOne({ user: userId, product: productId });
    }
}

export default ReviewRepository;