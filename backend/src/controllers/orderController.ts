import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Order } from '../models/Order.js';
import { formatApiResponse } from '../utils/validators.js';

export const getCustomerOrders = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const orders = await Order.find({ customerId: req.user._id })
      .populate('dogId')
      .populate('sellerId')
      .sort({ createdAt: -1 });

    return res.status(200).json(formatApiResponse(true, 'Customer orders retrieved', orders));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('dogId').populate('sellerId').populate('customerId');

    if (!order) {
      return res.status(404).json(formatApiResponse(false, 'Order not found'));
    }

    return res.status(200).json(formatApiResponse(true, 'Order details fetched', order));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};
