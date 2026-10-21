import { Router } from 'express';
import { getBreedRecommendation, handleAiChat, runBatchTestDataset } from '../controllers/aiController.js';

const router = Router();

router.post('/breed-recommendation', getBreedRecommendation);
router.post('/chat', handleAiChat);
router.get('/batch-test-dataset', runBatchTestDataset);
router.post('/batch-test-dataset', runBatchTestDataset);

export default router;
