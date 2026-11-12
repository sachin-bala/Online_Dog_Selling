import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Seller } from '../models/Seller.js';
import { User } from '../models/User.js';
import { Dog } from '../models/Dog.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { Review } from '../models/Review.js';
import { DogShow } from '../models/DogShow.js';
import { ShowRegistration } from '../models/ShowRegistration.js';
import { formatApiResponse } from '../utils/validators.js';
import { sendSellerApprovalEmail, sendDogApprovalEmail } from '../services/emailService.js';
import { createNotification } from '../services/notificationService.js';

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json(formatApiResponse(true, 'Users fetched successfully', users));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const getAllSellers = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const sellers = await Seller.find().populate('userId', 'fullName email phone').sort({ createdAt: -1 });
    return res.status(200).json(formatApiResponse(true, 'Sellers fetched successfully', sellers));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const getAllDogs = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const dogs = await Dog.find().populate('sellerId').sort({ createdAt: -1 });
    return res.status(200).json(formatApiResponse(true, 'Dogs fetched successfully', dogs));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const orders = await Order.find().populate('customerId', 'fullName email phone').populate('dogId').sort({ createdAt: -1 });
    return res.status(200).json(formatApiResponse(true, 'Orders fetched successfully', orders));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const getAllPayments = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const payments = await Payment.find().populate('customerId', 'fullName email').populate('orderId').sort({ createdAt: -1 });
    return res.status(200).json(formatApiResponse(true, 'Payments fetched successfully', payments));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const getAllReviews = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const reviews = await Review.find().populate('userId', 'fullName profileImage').populate('dogId', 'name breed').sort({ createdAt: -1 });
    return res.status(200).json(formatApiResponse(true, 'Reviews fetched successfully', reviews));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const getPendingSellers = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const pendingSellers = await Seller.find({ sellerStatus: 'PENDING' }).populate('userId', 'fullName email phone');
    return res.status(200).json(formatApiResponse(true, 'Pending sellers retrieved', pendingSellers));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const approveSeller = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { sellerId } = req.params;
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json(formatApiResponse(false, 'Seller registration record not found'));
    }

    seller.sellerStatus = 'APPROVED';
    seller.reviewedBy = req.user?._id as any;
    seller.reviewedAt = new Date();
    await seller.save();

    await User.findByIdAndUpdate(seller.userId, { accountStatus: 'ACTIVE', role: 'SELLER' });

    const user = await User.findById(seller.userId);
    if (user) {
      await sendSellerApprovalEmail(user.email, seller.fullName, 'APPROVED');
      await createNotification(user._id.toString(), 'Seller Application Approved 🎉', 'Your PawVerse AI seller verification has been approved!', 'SELLER');
    }

    return res.status(200).json(formatApiResponse(true, 'Seller approved successfully', seller));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const rejectSeller = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { sellerId } = req.params;
    const { reason } = req.body;

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json(formatApiResponse(false, 'Seller registration record not found'));
    }

    seller.sellerStatus = 'REJECTED';
    seller.rejectionReason = reason || 'Document validation failed';
    seller.reviewedBy = req.user?._id as any;
    seller.reviewedAt = new Date();
    await seller.save();

    const user = await User.findById(seller.userId);
    if (user) {
      await sendSellerApprovalEmail(user.email, seller.fullName, 'REJECTED', seller.rejectionReason);
      await createNotification(user._id.toString(), 'Seller Application Status', `Application rejected: ${seller.rejectionReason}`, 'SELLER');
    }

    return res.status(200).json(formatApiResponse(true, 'Seller rejected', seller));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const getPendingDogs = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const pendingDogs = await Dog.find({ status: 'PENDING' }).populate('sellerId');
    return res.status(200).json(formatApiResponse(true, 'Pending dog listings retrieved', pendingDogs));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const approveDogListing = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { dogId } = req.params;
    const dog = await Dog.findById(dogId);

    if (!dog) {
      return res.status(404).json(formatApiResponse(false, 'Dog listing not found'));
    }

    dog.status = 'APPROVED';
    await dog.save();

    const seller = await Seller.findById(dog.sellerId);
    if (seller) {
      const sellerUser = await User.findById(seller.userId);
      if (sellerUser) {
        await sendDogApprovalEmail(sellerUser.email, dog.name, 'APPROVED');
        await createNotification(sellerUser._id.toString(), 'Dog Listing Approved', `Your dog listing "${dog.name}" is now live!`, 'SELLER');
      }
    }

    return res.status(200).json(formatApiResponse(true, 'Dog listing approved and published', dog));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const rejectDogListing = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { dogId } = req.params;
    const { reason } = req.body;

    const dog = await Dog.findById(dogId);
    if (!dog) {
      return res.status(404).json(formatApiResponse(false, 'Dog listing not found'));
    }

    dog.status = 'REJECTED';
    dog.rejectionReason = reason || 'Documentation or image quality insufficient';
    await dog.save();

    const seller = await Seller.findById(dog.sellerId);
    if (seller) {
      const sellerUser = await User.findById(seller.userId);
      if (sellerUser) {
        await sendDogApprovalEmail(sellerUser.email, dog.name, 'REJECTED', dog.rejectionReason);
        await createNotification(sellerUser._id.toString(), 'Dog Listing Rejected', `Listing "${dog.name}" rejected: ${dog.rejectionReason}`, 'SELLER');
      }
    }

    return res.status(200).json(formatApiResponse(true, 'Dog listing rejected', dog));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const getAdminDashboardStats = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await Seller.countDocuments();
    const pendingSellers = await Seller.countDocuments({ sellerStatus: 'PENDING' });
    const approvedSellers = await Seller.countDocuments({ sellerStatus: 'APPROVED' });
    const rejectedSellers = await Seller.countDocuments({ sellerStatus: 'REJECTED' });

    const totalDogs = await Dog.countDocuments();
    const pendingDogs = await Dog.countDocuments({ status: 'PENDING' });
    const approvedDogs = await Dog.countDocuments({ status: 'APPROVED' });
    const soldDogs = await Dog.countDocuments({ status: 'SOLD' });

    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ paymentStatus: 'PAID' });
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);

    const totalShows = await DogShow.countDocuments();
    const totalParticipants = await ShowRegistration.countDocuments();

    const pendingSellersList = await Seller.find({ sellerStatus: 'PENDING' }).populate('userId', 'fullName email phone').limit(10);
    const pendingDogsList = await Dog.find({ status: 'PENDING' }).populate('sellerId').limit(10);

    return res.status(200).json(
      formatApiResponse(true, 'Admin stats loaded successfully', {
        totalUsers,
        totalSellers,
        pendingSellers,
        approvedSellers,
        rejectedSellers,
        totalDogs,
        pendingDogs,
        approvedDogs,
        soldDogs,
        totalOrders,
        revenue: totalRevenue,
        totalShows,
        totalParticipants,
        pendingSellersList,
        pendingDogsList,
      })
    );
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const updateUserStatus = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(formatApiResponse(false, 'User not found'));
    }

    user.accountStatus = status;
    await user.save();

    return res.status(200).json(formatApiResponse(true, `User status updated to ${status}`, user));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const approveDogOrder = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('dogId').populate('customerId');

    if (!order) {
      return res.status(404).json(formatApiResponse(false, 'Order not found'));
    }

    order.orderStatus = 'APPROVED';
    order.approvedAt = new Date();
    if (!order.trackingId) {
      order.trackingId = `GPS-PV-${Math.floor(1000 + Math.random() * 9000)}-TN`;
    }
    await order.save();

    // Mark dog as officially sold and unavailable
    if (order.dogId) {
      const dogId = (order.dogId as any)._id || order.dogId;
      await Dog.findByIdAndUpdate(dogId, { availability: false, status: 'SOLD' });
    }

    // Notify Customer
    if (order.customerId) {
      const customerUserId = (order.customerId as any)._id || order.customerId;
      const dogName = (order.dogId as any)?.name || 'Companion Dog';
      await createNotification(
        customerUserId.toString(),
        'Order Approved by Admin! 🎉',
        `Your purchase of "${dogName}" has been verified and approved by PawVerse Admin. Delivery preparations started.`,
        'ORDER'
      );
    }

    return res.status(200).json(formatApiResponse(true, 'Order approved successfully! Dog marked as sold.', order));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const dispatchDogOrder = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('dogId').populate('customerId');

    if (!order) {
      return res.status(404).json(formatApiResponse(false, 'Order not found'));
    }

    order.orderStatus = 'OUT_FOR_DELIVERY';
    order.dispatchedAt = new Date();
    if (!order.trackingId) {
      order.trackingId = `GPS-PV-${Math.floor(1000 + Math.random() * 9000)}-TN`;
    }
    await order.save();

    // Notify Customer with Live GPS Details
    if (order.customerId) {
      const customerUserId = (order.customerId as any)._id || order.customerId;
      const dogName = (order.dogId as any)?.name || 'Companion Dog';
      await createNotification(
        customerUserId.toString(),
        'Dog Dispatched with Live GPS! 🚚',
        `"${dogName}" is now in transit in our AC climate-controlled van with vet escort. Live GPS tracking: ${order.trackingId}`,
        'ORDER'
      );
    }

    return res.status(200).json(formatApiResponse(true, 'Order marked as dispatched with live GPS tracking.', order));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const rejectDogOrder = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const order = await Order.findById(orderId).populate('dogId').populate('customerId');

    if (!order) {
      return res.status(404).json(formatApiResponse(false, 'Order not found'));
    }

    order.orderStatus = 'CANCELLED';
    order.rejectionReason = reason || 'Documentation or verification check failed';
    await order.save();

    // Release dog back to available pool
    if (order.dogId) {
      const dogId = (order.dogId as any)._id || order.dogId;
      await Dog.findByIdAndUpdate(dogId, { availability: true, status: 'APPROVED' });
    }

    // Notify Customer
    if (order.customerId) {
      const customerUserId = (order.customerId as any)._id || order.customerId;
      const dogName = (order.dogId as any)?.name || 'Companion Dog';
      await createNotification(
        customerUserId.toString(),
        'Order Cancelled',
        `Purchase request for "${dogName}" could not be approved. Reason: ${order.rejectionReason}`,
        'ORDER'
      );
    }

    return res.status(200).json(formatApiResponse(true, 'Order rejected and dog availability restored.', order));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

// ─── ADMIN: Approve Payment manually (mark as PAID without Razorpay) ──────────
export const approveOrderPayment = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('dogId').populate('customerId');
    if (!order) {
      return res.status(404).json(formatApiResponse(false, 'Order not found'));
    }

    // Update payment record to CAPTURED
    await Payment.findOneAndUpdate(
      { orderId: order._id },
      {
        status: 'CAPTURED',
        razorpayPaymentId: `admin_approved_${Date.now()}`,
        razorpaySignature: `admin_sig_${Date.now()}`,
      }
    );

    // Update order payment status and move to PENDING_APPROVAL for dispatch
    order.paymentStatus = 'PAID';
    if (order.orderStatus === 'PENDING_PAYMENT') {
      order.orderStatus = 'PENDING_APPROVAL';
    }
    await order.save();

    // Notify customer
    if (order.customerId) {
      const customerUserId = (order.customerId as any)._id || order.customerId;
      const dogName = (order.dogId as any)?.name || 'Dog';
      await createNotification(
        customerUserId.toString(),
        'Payment Approved by Admin ✅',
        `Your payment for "${dogName}" has been manually approved by PawVerse Admin. Your order is now pending dispatch.`,
        'ORDER'
      );
    }

    return res.status(200).json(formatApiResponse(true, 'Payment approved successfully. Order moved to Pending Approval.', order));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

// ─── ADMIN: Cancel Order (immediate cancel, no reason required) ───────────────
export const cancelDogOrder = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(orderId).populate('dogId').populate('customerId');
    if (!order) {
      return res.status(404).json(formatApiResponse(false, 'Order not found'));
    }

    order.orderStatus = 'CANCELLED';
    order.paymentStatus = order.paymentStatus === 'PAID' ? 'REFUNDED' : order.paymentStatus;
    order.rejectionReason = reason || 'Cancelled by Admin';
    await order.save();

    // Release dog back to available pool
    if (order.dogId) {
      const dogId = (order.dogId as any)._id || order.dogId;
      await Dog.findByIdAndUpdate(dogId, { availability: true, status: 'APPROVED' });
    }

    // Notify customer
    if (order.customerId) {
      const customerUserId = (order.customerId as any)._id || order.customerId;
      const dogName = (order.dogId as any)?.name || 'Dog';
      const refundNote = order.paymentStatus === 'REFUNDED' ? ' A refund will be processed within 5-7 business days.' : '';
      await createNotification(
        customerUserId.toString(),
        'Order Cancelled by Admin',
        `Your order for "${dogName}" has been cancelled. Reason: ${order.rejectionReason}.${refundNote}`,
        'ORDER'
      );
    }

    return res.status(200).json(formatApiResponse(true, 'Order cancelled successfully.', order));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

