import ReviewService from '../services/reviewService.js';
const reviewService = new ReviewService();

export const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const review = await reviewService.addReview(req.user._id, productId, rating, comment);
        res.status(201).json({ message: 'Review added', review });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const review = await reviewService.updateReview(req.user._id, productId, rating, comment);
        res.json({ message: 'Review updated', review });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { productId } = req.params;
        await reviewService.deleteReview(req.user._id, productId);
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { reviews, total } = await reviewService.getProductReviews(productId, page, limit);
        res.json({
            reviews,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};