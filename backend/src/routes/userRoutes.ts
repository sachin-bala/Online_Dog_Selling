import { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getPetPassports,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/change-password', changePassword);

router.get('/wishlist', getWishlist);
router.post('/wishlist/:dogId', addToWishlist);
router.delete('/wishlist/:dogId', removeFromWishlist);

router.get('/pet-passports', getPetPassports);

export default router;
