import express from 'express';
import {
    createColor,
    getAllColors,
    getColorById,
    updateColor,
    deleteColor
} from '../controllers/colorController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRoles } from '../middlewares/authorize.js';

const router = express.Router();

router.post('/add', authenticate, authorizeRoles('admin', 'vendor'), createColor);
router.get('/all', getAllColors);
router.get('/:id', authenticate, authenticate, authorizeRoles('admin', 'vendor'), getColorById);
router.put('/update/:id', authenticate, authorizeRoles('admin', 'vendor'), updateColor);
router.delete('/delete/:id', authenticate, authorizeRoles('admin', 'vendor'), deleteColor);

export default router;