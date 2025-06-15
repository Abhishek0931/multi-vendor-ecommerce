import express from 'express';
import {
    createSize,
    getAllSizes,
    getSizeById,
    updateSize,
    deleteSize
} from '../controllers/sizeController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRoles } from '../middlewares/authorize.js';

const router = express.Router();

router.post('/add', authenticate, authorizeRoles('admin', 'vendor'), createSize);
router.get('/all', getAllSizes);
router.get('/:id', authenticate, authorizeRoles('admin', 'vendor'),getSizeById)
router.put('/update/:id', authenticate, authorizeRoles('admin', 'vendor'), updateSize);
router.delete('/delete/:id', authenticate, authorizeRoles('admin', 'vendor'), deleteSize);

export default router;