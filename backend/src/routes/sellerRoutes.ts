import { Router } from 'express';
import { registerAsSeller, getSellerStatus, getSellerDashboardStats } from '../controllers/sellerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post(
  '/register',
  protect,
  upload.fields([{ name: 'govtIdDocument', maxCount: 1 }]),
  registerAsSeller
);

router.get('/status', protect, getSellerStatus);
router.get('/dashboard-stats', protect, getSellerDashboardStats);

export default router;
