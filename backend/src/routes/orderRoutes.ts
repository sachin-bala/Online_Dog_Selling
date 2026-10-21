import { Router } from 'express';
import { getCustomerOrders, getOrderById } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getCustomerOrders);
router.get('/:id', protect, getOrderById);

export default router;
