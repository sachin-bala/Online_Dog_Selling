import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Seller } from '../models/Seller.js';
import { Dog } from '../models/Dog.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { formatApiResponse } from '../utils/validators.js';
import { uploadBufferToCloudinary } from '../services/cloudinaryService.js';
import { createNotification } from '../services/notificationService.js';

export const registerAsSeller = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const {
      fullName,
      phone,
      city,
      state,
      pincode,
      govtIdNumber,
      kennelName,
      experienceYears,
      website,
      socialLinks,
    } = req.body;

    if (!fullName || !phone || !govtIdNumber || !kennelName) {
      return res.status(400).json(formatApiResponse(false, 'Please fill in all mandatory seller fields'));
    }

    let govtIdDocument = '';
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];

    if (files && !Array.isArray(files) && files.govtIdDocument && files.govtIdDocument[0]) {
      govtIdDocument = await uploadBufferToCloudinary(files.govtIdDocument[0].buffer, 'pawverse_sellers');
    }

    let existingSeller = await Seller.findOne({ userId: req.user._id });
    if (existingSeller) {
      existingSeller.fullName = fullName;
      existingSeller.phone = phone;
      existingSeller.address = { city, state, pincode, country: 'India' };
      existingSeller.govtIdNumber = govtIdNumber;
      if (govtIdDocument) existingSeller.govtIdDocument = govtIdDocument;
      existingSeller.kennelName = kennelName;
      existingSeller.experienceYears = Number(experienceYears) || 1;
      existingSeller.sellerStatus = 'PENDING';
      existingSeller.rejectionReason = undefined;
      await existingSeller.save();
    } else {
      existingSeller = await Seller.create({
        userId: req.user._id,
        fullName,
        phone,
        address: { city, state, pincode, country: 'India' },
        govtIdNumber,
        govtIdDocument,
        kennelName,
        experienceYears: Number(experienceYears) || 1,
        website: website || '',
        socialLinks: socialLinks || '',
        sellerStatus: 'PENDING',
      });

      // Update user role to SELLER
      await User.findByIdAndUpdate(req.user._id, { role: 'SELLER' });
    }

    await createNotification(
      req.user._id.toString(),
      'Seller Application Submitted',
      'Your seller application is under review by PawVerse AI administrators.',
      'SELLER'
    );

    return res.status(200).json(
      formatApiResponse(true, 'Seller verification request submitted successfully. Waiting for admin approval.', existingSeller)
    );
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const getSellerStatus = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) {
      return res.status(200).json(formatApiResponse(true, 'No seller application', { status: 'NONE' }));
    }

    return res.status(200).json(formatApiResponse(true, 'Seller status fetched', seller));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const getSellerDashboardStats = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) {
      return res.status(404).json(formatApiResponse(false, 'Seller account not found'));
    }

    const totalDogs = await Dog.countDocuments({ sellerId: seller._id });
    const approvedDogs = await Dog.countDocuments({ sellerId: seller._id, status: 'APPROVED' });
    const pendingDogs = await Dog.countDocuments({ sellerId: seller._id, status: 'PENDING' });
    const soldDogs = await Dog.countDocuments({ sellerId: seller._id, status: 'SOLD' });

    const orders = await Order.find({ sellerId: seller._id }).populate('dogId').populate('customerId');
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + o.amount, 0);

    const customerIds = Array.from(new Set(orders.map((o) => o.customerId._id.toString())));

    return res.status(200).json(
      formatApiResponse(true, 'Seller dashboard stats loaded', {
        sellerInfo: seller,
        totalDogs,
        approvedDogs,
        pendingDogs,
        soldDogs,
        totalOrders: orders.length,
        revenue: totalRevenue,
        uniqueCustomersCount: customerIds.length,
        recentOrders: orders.slice(0, 5),
      })
    );
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};
