import express from 'express';
import { registerAdmin, loginAdmin, getAssignments, updateAssignmentStatus } from '../controllers/admin.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/assignments', protect, getAssignments);
router.post('/assignments/:id/accept', protect, updateAssignmentStatus);
router.post('/assignments/:id/reject', protect, updateAssignmentStatus);

export default router;
