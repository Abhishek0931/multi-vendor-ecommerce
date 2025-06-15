import express from 'express';
import categoryController from '../controllers/categoryController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRoles } from '../middlewares/authorize.js';

const router = express.Router();

// Only admins or vendors(self) can create, update, or delete categories
router.post('/add', authenticate, authorizeRoles('admin', 'vendor'), categoryController.create);
router.put('/update/:id', authenticate, authorizeRoles('admin', 'vendor'), categoryController.update);
router.delete('/delete/:id', authenticate, authorizeRoles('admin', 'vendor'), categoryController.delete);

// Anyone can view categories
router.get('/all', categoryController.getAll);
router.get('/:id', categoryController.getById);

export default router;