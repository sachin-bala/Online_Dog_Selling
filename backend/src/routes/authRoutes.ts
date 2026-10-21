import { Router } from 'express';
import { registerUser, loginUser, loginAdmin, verifyOtp, getCurrentUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', loginAdmin);
router.post('/verify-otp', protect, verifyOtp);
router.get('/me', protect, getCurrentUser);

export default router;
