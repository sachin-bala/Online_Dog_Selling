import { Router } from 'express';
import {
  getDogShows,
  getDogShowById,
  createDogShow,
  updateDogShow,
  deleteDogShow,
  registerForShow,
} from '../controllers/dogShowController.js';
import { protect, authenticateAdmin } from '../middleware/authMiddleware.js';
import { uploadShowImage, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = Router();

// PUBLIC: Any user (logged-in or guest) can view dog shows dynamically
router.get('/', getDogShows);
router.get('/:id', getDogShowById);

// AUTHENTICATED: Any logged-in user can register for a show
router.post('/:id/register', protect, registerForShow);

// ADMIN ONLY: Authenticated admin only routes for creating, updating, and deleting dog shows
router.post(
  '/',
  authenticateAdmin,
  handleUploadError(uploadShowImage.single('image')),
  createDogShow
);

router.put(
  '/:id',
  authenticateAdmin,
  handleUploadError(uploadShowImage.single('image')),
  updateDogShow
);

router.delete(
  '/:id',
  authenticateAdmin,
  deleteDogShow
);

export default router;
