import express from 'express';
import { registerUser, loginUser, uploadAssignment, getAllAdmins } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/upload', protect, uploadAssignment);
router.get('/admins', protect, getAllAdmins)

export default router;
