import express from 'express';
import {
    register,
    login,
    refresh,
    getProfile,
    updateProfile,
    blockUser,
    unblockUser,
    getAllUsers,
    deleteUser
} from '../controllers/userController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRoles } from '../middlewares/authorize.js';
import { uploadFile } from '../middlewares/uploadFile.js';


const router = express.Router();


router.post('/register', uploadFile, register);
router.post('/login', login);
router.post('/refresh', refresh);

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, uploadFile, updateProfile);

router.get('/', authenticate, authorizeRoles('admin'), getAllUsers);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteUser);
router.put('/block/:id', authenticate, authorizeRoles('admin'), blockUser);
router.put('/unblock/:id', authenticate, authorizeRoles('admin'), unblockUser);

export default router;