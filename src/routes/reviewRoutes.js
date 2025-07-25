import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import {
    addReview,
    updateReview,
    deleteReview,
    getProductReviews
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', authenticate, addReview);
router.put('/', authenticate, updateReview);
router.delete('/:productId', authenticate, deleteReview);
router.get('/product/:productId', getProductReviews);
// /api/reviews/product/:productId?page=2&limit=10 (pagination applied)

export default router;