import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { 
    getCart,
    addItem,
    removeItem, 
    emptyCart,
    applyCoupon,
    removeCoupon
    } from '../controllers/cartController.js';

const router = express.Router();

router.get('/', authenticate, getCart);
router.post('/add', authenticate, addItem);
router.delete('/remove/:vendorId/:productId/:variantId', authenticate, removeItem);
router.delete('/empty', authenticate, emptyCart);
router.post('/apply-coupon', authenticate, applyCoupon);
router.post('/remove-coupon', authenticate, removeCoupon);

export default router;