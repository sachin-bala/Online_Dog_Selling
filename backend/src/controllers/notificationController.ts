import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Notification } from '../models/Notification.js';
import { formatApiResponse } from '../utils/validators.js';

export const getNotifications = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(30);
    const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false });

    return res.status(200).json(formatApiResponse(true, 'Notifications fetched', { notifications, unreadCount }));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    return res.status(200).json(formatApiResponse(true, 'Notification marked as read'));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
    return res.status(200).json(formatApiResponse(true, 'All notifications marked as read'));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    return res.status(200).json(formatApiResponse(true, 'Notification deleted'));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};
