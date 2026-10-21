import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Dog } from '../models/Dog.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { PetPassport } from '../models/PetPassport.js';
import { Seller } from '../models/Seller.js';
import { formatApiResponse } from '../utils/validators.js';
import { createRazorpayOrder, verifyRazorpaySignature } from '../services/paymentService.js';
import { createNotification } from '../services/notificationService.js';

export const createOrderPayment = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const { dogId, deliveryAddress, buyerName, buyerPhone, buyerEmail } = req.body;

    if (!dogId) {
      return res.status(400).json(formatApiResponse(false, 'Please select a valid dog to order'));
    }

    const dog = await Dog.findById(dogId);
    if (!dog) {
      return res.status(404).json(formatApiResponse(false, 'Dog not found'));
    }

    if (!dog.availability || dog.status !== 'APPROVED') {
      return res.status(400).json(formatApiResponse(false, 'This dog is no longer available for purchase'));
    }

    // Create Order Record
    const order = await Order.create({
      customerId: req.user._id,
      sellerId: dog.sellerId,
      dogId: dog._id,
      amount: dog.price,
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING_APPROVAL',
      buyerName: buyerName || req.user.fullName || 'VIP Buyer',
      buyerPhone: buyerPhone || (req.user as any).phone || deliveryAddress?.phone || '+91 98400 12345',
      buyerEmail: buyerEmail || req.user.email || 'buyer@pawverse.ai',
      deliveryAddress: deliveryAddress || {
        street: '123 Royal Pet Villa',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
        country: 'India',
      },
      trackingId: `GPS-PV-${Math.floor(1000 + Math.random() * 9000)}-TN`,
      estimatedDelivery: '3 - 5 Days',
    });

    // Create Razorpay Order
    const razorpayOrder = await createRazorpayOrder(dog.price, order._id.toString());

    // Record Payment Entry
    await Payment.create({
      orderId: order._id,
      customerId: req.user._id,
      razorpayOrderId: razorpayOrder.id,
      amount: dog.price,
      currency: 'INR',
      status: 'CREATED',
    });

    return res.status(200).json(
      formatApiResponse(true, 'Razorpay order created successfully', {
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_pawverse123',
        dogName: dog.name,
      })
    );
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const verifyPaymentSignature = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId || !razorpayOrderId) {
      return res.status(400).json(formatApiResponse(false, 'Missing payment parameters for verification'));
    }

    const orderRecord = await Order.findById(orderId);
    if (!orderRecord) {
      return res.status(404).json(formatApiResponse(false, 'Order record not found'));
    }

    // Check duplicate purchase guard
    const targetDog = await Dog.findById(orderRecord.dogId);
    if (!targetDog || targetDog.status === 'SOLD' || !targetDog.availability) {
      return res.status(400).json(formatApiResponse(false, 'This dog has already been sold to another buyer!'));
    }

    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId || 'pay_mock_123', razorpaySignature || 'sig_mock_123');

    if (!isValid) {
      await Payment.findOneAndUpdate({ razorpayOrderId }, { status: 'FAILED' });
      await Order.findByIdAndUpdate(orderId, { paymentStatus: 'FAILED' });
      return res.status(400).json(formatApiResponse(false, 'Payment signature verification failed!'));
    }

    // 1. Mark Payment CAPTURED
    await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId: razorpayPaymentId || `pay_verified_${Date.now()}`,
        razorpaySignature: razorpaySignature || `sig_verified_${Date.now()}`,
        status: 'CAPTURED',
      }
    );

    // 2. Mark Order PAID and AWAITING ADMIN APPROVAL
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'PAID',
        orderStatus: 'PENDING_APPROVAL',
      },
      { new: true }
    ).populate('dogId').populate('sellerId');

    // 3. Mark Dog as reserved / pending approval
    await Dog.findByIdAndUpdate(orderRecord.dogId, { availability: false, status: 'PENDING' });

    // 4. Create Digital Pet Passport for the Buyer
    const microchipId = targetDog.microchipNumber || `KCI-TN-${Math.floor(100000 + Math.random() * 900000)}`;
    await PetPassport.findOneAndUpdate(
      { dogId: targetDog._id },
      {
        dogId: targetDog._id,
        ownerId: req.user._id,
        dogName: targetDog.name,
        breed: targetDog.breed,
        microchipId,
        dnaVerified: true,
        birthDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        gender: targetDog.gender,
        ownerName: req.user.fullName,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PawVerse-${targetDog._id}`,
        vaccines: [
          { name: 'Core DHPP Puppy Vaccine', date: new Date().toISOString().split('T')[0], status: 'Complete' },
          { name: 'Rabies Shot Booster', date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'Due' },
        ],
      },
      { upsert: true, new: true }
    );

    // 5. Send Notifications
    await createNotification(
      req.user._id.toString(),
      'Order Sent to Admin for Approval ⏳',
      `Payment authorized for ${targetDog.name}! Your purchase information was sent to Admin for dispatch approval.`,
      'ORDER'
    );

    const sellerObj = await Seller.findById(targetDog.sellerId);
    if (sellerObj && sellerObj.userId) {
      await createNotification(
        sellerObj.userId.toString(),
        'Dog Purchase Request Placed! 🐕',
        `Your listing "${targetDog.name}" has an order awaiting Admin approval (₹${targetDog.price.toLocaleString()}).`,
        'ORDER'
      );
    }

    return res.status(200).json(formatApiResponse(true, 'Payment verified! Order sent to Admin for approval and dispatch.', updatedOrder));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};
