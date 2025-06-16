import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { 
    getCart,
    addItem,
    removeItem, 
    emptyCart 
    } from '../controllers/cartController.js';

const router = express.Router();

router.get('/', authenticate, getCart);
router.post('/add', authenticate, addItem);
router.delete('/remove/:vendorId/:productId/:variantId', authenticate, removeItem);
router.delete('/empty', authenticate, emptyCart);

export default router;