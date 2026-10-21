import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

// Public routes for all buyers and visitors
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin-Exclusive routes for creating, updating, and removing Dog Foods & Dog Accessories
router.post(
  '/',
  authenticateAdmin,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  upload.array('images', 5),
  createProduct
);

router.put(
  '/:id',
  authenticateAdmin,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  upload.array('images', 5),
  updateProduct
);

router.delete(
  '/:id',
  authenticateAdmin,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  deleteProduct
);

export default router;
