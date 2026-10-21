import { Router } from 'express';
import { createOrderPayment, verifyPaymentSignature } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/create-order', protect, createOrderPayment);
router.post('/verify', protect, verifyPaymentSignature);

export default router;
