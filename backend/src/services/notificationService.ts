import { Notification } from '../models/Notification.js';

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'SYSTEM' | 'ORDER' | 'SELLER' | 'SHOW' | 'CHAT' = 'SYSTEM'
) => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      read: false,
    });
    return notification;
  } catch (error) {
    console.error('[ Notification Error ] Failed to create notification:', error);
    return null;
  }
};
