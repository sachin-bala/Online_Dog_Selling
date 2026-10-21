import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/userController.js';

const router = Router();

router.use(protect);

router.get('/', getWishlist);
router.post('/', (req, res) => {
  const dogId = req.body?.dogId || (req.params as any)?.dogId;
  (req.params as any).dogId = dogId;
  addToWishlist(req as any, res);
});
router.post('/:dogId', addToWishlist);
router.delete('/:dogId', removeFromWishlist);

export default router;
