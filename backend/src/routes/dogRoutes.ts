import { Router } from 'express';
import {
  createDogListing,
  updateDogListing,
  deleteDogListing,
  getPublicDogs,
  getDogById,
} from '../controllers/dogController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/', getPublicDogs);
router.get('/:id', getDogById);

router.post('/', protect, requireAdmin, upload.array('images', 5), createDogListing);
router.put('/:id', protect, requireAdmin, upload.array('images', 5), updateDogListing);
router.delete('/:id', protect, requireAdmin, deleteDogListing);

export default router;
