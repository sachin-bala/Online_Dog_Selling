import { Request, Response } from 'express';
import { calculateBreedRecommendations, generatePetAiResponse, runBatchDatasetEvaluation } from '../services/aiService.js';
import { formatApiResponse } from '../utils/validators.js';

export const getBreedRecommendation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { budget, homeType, familySize, children, workingHours, climate, activityLevel, experience } = req.body;

    const recommendations = calculateBreedRecommendations({
      budget: Number(budget) || 30000,
      homeType: homeType || 'house_yard',
      familySize: Number(familySize) || 4,
      children: Boolean(children),
      workingHours: workingHours || '4-6_hours',
      climate: climate || 'Hot',
      activityLevel: activityLevel || 'moderate',
      experience: experience || 'first_time',
    });

    return res.status(200).json(formatApiResponse(true, 'Breed recommendations generated', recommendations));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const handleAiChat = async (req: Request, res: Response): Promise<any> => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json(formatApiResponse(false, 'Message prompt cannot be empty'));
    }

    const aiResponse = generatePetAiResponse(message);

    return res.status(200).json(formatApiResponse(true, 'AI chat reply generated', aiResponse));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const runBatchTestDataset = async (req: Request, res: Response): Promise<any> => {
  try {
    const datasetPayload = req.body?.dataset || req.body;
    const customDataset = Array.isArray(datasetPayload) ? datasetPayload : undefined;
    const batchResult = runBatchDatasetEvaluation(customDataset);

    return res.status(200).json(formatApiResponse(true, 'Dataset auto-testing completed successfully', batchResult));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};
