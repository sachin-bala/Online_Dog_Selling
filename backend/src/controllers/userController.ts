import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { User } from '../models/User.js';
import { Wishlist } from '../models/Wishlist.js';
import { PetPassport } from '../models/PetPassport.js';
import { Dog } from '../models/Dog.js';
import { formatApiResponse } from '../utils/validators.js';

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json(formatApiResponse(false, 'User profile not found'));
    }

    return res.status(200).json(formatApiResponse(true, 'User profile fetched successfully', user));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const { fullName, phone, address, profileImage } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json(formatApiResponse(false, 'User not found'));
    }

    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (address) {
      user.address = {
        street: address.street || user.address?.street || '',
        city: address.city || user.address?.city || '',
        state: address.state || user.address?.state || '',
        pincode: address.pincode || user.address?.pincode || '',
        country: address.country || user.address?.country || 'India',
      };
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    return res.status(200).json(formatApiResponse(true, 'Profile updated successfully', updatedUser));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json(formatApiResponse(false, 'Please provide current and new password'));
    }

    if (newPassword.length < 6) {
      return res.status(400).json(formatApiResponse(false, 'New password must be at least 6 characters long'));
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user || !user.password) {
      return res.status(404).json(formatApiResponse(false, 'User not found'));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json(formatApiResponse(false, 'Current password is incorrect'));
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json(formatApiResponse(true, 'Password updated successfully'));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const getWishlist = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const items = await Wishlist.find({ userId: req.user._id }).populate('dogId');
    const dogIds = items.map((i) => i.dogId?._id?.toString() || i.dogId?.toString()).filter(Boolean);

    return res.status(200).json(formatApiResponse(true, 'Wishlist fetched', { dogIds, items }));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const { dogId } = req.params;
    const dog = await Dog.findById(dogId);

    if (!dog) {
      return res.status(404).json(formatApiResponse(false, 'Dog not found'));
    }

    await Wishlist.findOneAndUpdate(
      { userId: req.user._id, dogId: dog._id },
      { userId: req.user._id, dogId: dog._id },
      { upsert: true, new: true }
    );

    return res.status(200).json(formatApiResponse(true, 'Added to wishlist'));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const { dogId } = req.params;
    await Wishlist.findOneAndDelete({ userId: req.user._id, dogId });

    return res.status(200).json(formatApiResponse(true, 'Removed from wishlist'));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};

export const getPetPassports = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'Unauthorized'));
    }

    const passports = await PetPassport.find({ ownerId: req.user._id }).populate('dogId');
    return res.status(200).json(formatApiResponse(true, 'Pet passports retrieved', passports));
  } catch (error: any) {
    return res.status(500).json(formatApiResponse(false, error.message));
  }
};
