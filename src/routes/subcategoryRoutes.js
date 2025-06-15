import express from 'express';
import subcategoryController from '../controllers/subcategoryController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRoles } from '../middlewares/authorize.js';

const router = express.Router();

// Only admins can create, update, or delete subcategories
router.post('/add', authenticate, authorizeRoles('admin', 'vendor'), subcategoryController.create);
router.put('/update/:id', authenticate, authorizeRoles('admin', 'vendor'), subcategoryController.update);
router.delete('/delete/:id', authenticate, authorizeRoles('admin', 'vendor'), subcategoryController.delete);

// Anyone can view subcategories
router.get('/all', subcategoryController.getAll);
router.get('/:id', subcategoryController.getById);

export default router;