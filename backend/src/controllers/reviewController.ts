import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Review } from '../models/Review.js';
import { Order } from '../models/Order.js';
import { formatApiResponse } from '../utils/validators.js';

export const createReview = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const { orderId, rating, comment } = req.body;

    if (!orderId || !rating || !comment) {
      return res.status(400).json(formatApiResponse(false, 'Missing required review fields (orderId, rating, comment)'));
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json(formatApiResponse(false, 'Order record not found'));
    }

    if (order.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json(formatApiResponse(false, 'You can only review dogs from your own completed orders'));
    }

    if (order.paymentStatus !== 'PAID') {
      return res.status(400).json(formatApiResponse(false, 'Reviews can only be submitted for paid & verified purchases'));
    }

    const existingReview = await Review.findOne({ orderId: order._id });
    if (existingReview) {
      return res.status(400).json(formatApiResponse(false, 'You have already submitted a review for this purchase'));
    }

    const review = await Review.create({
      userId: req.user._id,
      dogId: order.dogId,
      sellerId: order.sellerId,
      orderId: order._id,
      rating: Number(rating),
      comment,
    });

    return res.status(201).json(formatApiResponse(true, 'Review submitted successfully', review));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};
