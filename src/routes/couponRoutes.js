import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import  { authorizeRoles } from '../middlewares/authorize.js';
import {
    createCoupon,
    getCouponByCode,
    getCouponById,
    getAllCoupons,
    updateCoupon,
    deleteCoupon
} from '../controllers/couponController.js';

const router = express.Router();

// Admin only for create, update, delete (add your own admin middleware if needed)
router.post('/', authenticate, authorizeRoles('admin'), createCoupon);
router.get('/', authenticate, authorizeRoles('admin'), getAllCoupons);
router.get('/code/:code', authenticate, authorizeRoles('admin'), getCouponByCode);


// Public routes as of now ( change if needed )
router.get('/:id', authenticate, getCouponById);
router.put('/:id', authenticate, updateCoupon);
router.delete('/:id', authenticate, deleteCoupon);

export default router;