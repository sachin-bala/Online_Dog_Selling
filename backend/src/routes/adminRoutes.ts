import { Router } from 'express';
import {
  getAllUsers,
  getAllSellers,
  getAllDogs,
  getAllOrders,
  getAllPayments,
  getAllReviews,
  getPendingSellers,
  approveSeller,
  rejectSeller,
  getPendingDogs,
  approveDogListing,
  rejectDogListing,
  getAdminDashboardStats,
  updateUserStatus,
  approveDogOrder,
  dispatchDogOrder,
  rejectDogOrder,
  approveOrderPayment,
  cancelDogOrder,
} from '../controllers/adminController.js';
import { loginAdmin, registerAdmin } from '../controllers/authController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { requireRole, requireSuperAdmin } from '../middleware/roleMiddleware.js';

const router = Router();

// Public / Controlled Admin Auth Routes
router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

// Protect all following admin management routes
router.use(authenticateAdmin);
router.use(requireRole('ADMIN', 'SUPER_ADMIN', 'MODERATOR'));

router.get('/dashboard-stats', getAdminDashboardStats);
router.get('/users', getAllUsers);
router.get('/sellers', getAllSellers);
router.get('/dogs', getAllDogs);
router.get('/orders', getAllOrders);
router.get('/payments', getAllPayments);
router.get('/reviews', getAllReviews);

router.get('/pending-sellers', getPendingSellers);
router.get('/pending-dogs', getPendingDogs);

// Admin Action Execution Routes
router.post('/sellers/:sellerId/approve', requireRole('ADMIN', 'SUPER_ADMIN'), approveSeller);
router.post('/sellers/:sellerId/reject', requireRole('ADMIN', 'SUPER_ADMIN'), rejectSeller);

router.post('/dogs/:dogId/approve', requireRole('ADMIN', 'SUPER_ADMIN'), approveDogListing);
router.post('/dogs/:dogId/reject', requireRole('ADMIN', 'SUPER_ADMIN'), rejectDogListing);

// Order Approval & Dispatch Routes
router.post('/orders/:orderId/approve', requireRole('ADMIN', 'SUPER_ADMIN'), approveDogOrder);
router.post('/orders/:orderId/dispatch', requireRole('ADMIN', 'SUPER_ADMIN'), dispatchDogOrder);
router.post('/orders/:orderId/reject', requireRole('ADMIN', 'SUPER_ADMIN'), rejectDogOrder);
router.post('/orders/:orderId/approve-payment', requireRole('ADMIN', 'SUPER_ADMIN'), approveOrderPayment);
router.post('/orders/:orderId/cancel', requireRole('ADMIN', 'SUPER_ADMIN'), cancelDogOrder);

router.put('/users/:userId/status', requireSuperAdmin, updateUserStatus);

export default router;
