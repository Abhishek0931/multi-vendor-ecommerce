import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRoles } from '../middlewares/authorize.js';
import {
    placeOrder,
    getOrderById,
    getUserOrders,
    getVendorOrders,
    updateOrderStatus,
    cancelOrder
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/place', authenticate, placeOrder);
router.get('/user', authenticate, getUserOrders);
router.get('/vendor', authenticate,authorizeRoles('vendor', 'admin'), getVendorOrders);
router.get('/:orderId', authenticate, getOrderById);
router.patch('/:orderId/status', authenticate,authorizeRoles('vendor', 'admin'), updateOrderStatus);
router.patch('/:orderId/cancel', authenticate, cancelOrder);

/* 
router.patch('/:orderId/cancel', authenticate, (req, res) => {
    req.body.status = 'cancelled';
    updateOrderStatus(req, res);
});
*/

export default router;
