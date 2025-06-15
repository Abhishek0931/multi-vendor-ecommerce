import express from 'express';
import {
    createProduct,
    getProductById,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getVendorProducts,
    approveProduct,
    rejectProduct
} from '../controllers/productController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRoles } from '../middlewares/authorize.js';
import { uploadVariantImages } from '../middlewares/uploadFile.js';

const router = express.Router();

// Vendor routes
router.post('/add', authenticate, authorizeRoles('vendor', 'admin'), uploadVariantImages, createProduct);
router.put('/update/:id', authenticate, authorizeRoles('vendor', 'admin'), uploadVariantImages, updateProduct);
router.delete('/delete/:id', authenticate, authorizeRoles('vendor', 'admin'), deleteProduct);
router.get('/my', authenticate, authorizeRoles('vendor'), getVendorProducts);

// Public & Buyer routes
router.get('/all', getAllProducts);
router.get('/:id', getProductById);

// Admin routes
router.put('/approve/:id', authenticate, authorizeRoles('admin'), approveProduct);
router.put('/reject/:id', authenticate, authorizeRoles('admin'), rejectProduct);

export default router;