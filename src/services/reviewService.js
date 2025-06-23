import ReviewRepository from '../repository/reviewRepo.js';
import OrderRepository from '../repository/orderRepo.js';
import Product from '../models/product.js';

const reviewRepo = new ReviewRepository();
const orderRepo = new OrderRepository();

class ReviewService {
    async addReview(userId, productId, rating, comment) {
        // Only allow review if user has purchased the product
        const hasOrdered = await orderRepo.hasUserOrderedProduct(userId, productId);
        if (!hasOrdered) throw new Error('You can only review products you have purchased.');

        // Prevent duplicate review
        const existing = await reviewRepo.getReviewByUserAndProduct(userId, productId);
        if (existing) throw new Error('You have already reviewed this product.');

        const review = await reviewRepo.createReview({ user: userId, product: productId, rating, comment });
        await Product.updateRatings(productId); // <-- Update product ratings
        return review;
    }

    async updateReview(userId, productId, rating, comment) {
        const review = await reviewRepo.getReviewByUserAndProduct(userId, productId);
        if (!review) throw new Error('Review not found.');
        if (!review.user.equals(userId)) throw new Error('Unauthorized');
        const updatedReview = await reviewRepo.updateReview(review._id, { rating, comment });
        await Product.updateRatings(productId); // Update after update
        return updatedReview;
    }

    async deleteReview(userId, productId) {
        const review = await reviewRepo.getReviewByUserAndProduct(userId, productId);
        if (!review) throw new Error('Review not found.');
        if (!review.user.equals(userId)) throw new Error('Unauthorized');
        await reviewRepo.deleteReview(review._id);
        await Product.updateRatings(productId); // Update after delete
        return;
    }

    async getProductReviews(productId, page = 1, limit = 10) {
        return await reviewRepo.getReviewsByProduct(productId, page, limit);
    }
}

export default ReviewService;