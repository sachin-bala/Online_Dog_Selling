import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { env } from '../config/environment.js';
import { User, IUser } from '../models/User.js';
import { formatApiResponse } from '../utils/validators.js';
import { loadAdminsFromDisk } from '../utils/adminStore.js';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json(formatApiResponse(false, 'Not authorized, token missing'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id?: string; userId?: string; role: string };
    const userId = decoded.userId || decoded.id;
    let user: any = null;

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId).select('-password');
    }

    const freshAdminMap = loadAdminsFromDisk();
    if (user && user.email) {
      const diskAdmin = freshAdminMap.get(String(user.email).trim().toLowerCase());
      if (diskAdmin && ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes((diskAdmin.role || '').toUpperCase())) {
        user = diskAdmin;
      }
    }

    if (!user && userId) {
      for (const adminObj of freshAdminMap.values()) {
        if (adminObj.id === userId || adminObj._id === userId) {
          user = adminObj;
          break;
        }
      }
    }

    if (decoded.role && ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(decoded.role.toUpperCase())) {
      if (!user || !['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes((user.role || '').toUpperCase())) {
        user = {
          ...(user ? (user.toObject ? user.toObject() : user) : {}),
          id: userId,
          _id: userId,
          role: decoded.role.toUpperCase(),
          accountStatus: 'ACTIVE',
          emailVerified: true
        };
      }
    }

    if (!user) {
      return res.status(401).json(formatApiResponse(false, 'User specified in token no longer exists'));
    }

    if (user.accountStatus === 'SUSPENDED') {
      return res.status(403).json(formatApiResponse(false, 'Your account has been suspended by administration'));
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json(formatApiResponse(false, 'Not authorized, invalid or expired token'));
  }
};

export const authenticateAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json(formatApiResponse(false, 'Admin authentication required, token missing'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id?: string; userId?: string; role: string };
    const userId = decoded.userId || decoded.id;
    let user: any = null;

    // Check persistent disk admin store first
    const freshAdminMap = loadAdminsFromDisk();
    if (userId) {
      for (const adminObj of freshAdminMap.values()) {
        if (adminObj.id === userId || adminObj._id === userId) {
          user = adminObj;
          break;
        }
      }
    }

    if (!user && userId && mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId).select('-password');
    }

    if (user && user.email) {
      const diskAdmin = freshAdminMap.get(String(user.email).trim().toLowerCase());
      if (diskAdmin && ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes((diskAdmin.role || '').toUpperCase())) {
        user = diskAdmin;
      }
    }

    if (!user && decoded.role && ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(decoded.role.toUpperCase())) {
      user = {
        id: userId,
        _id: userId,
        role: decoded.role.toUpperCase(),
        accountStatus: 'ACTIVE',
        emailVerified: true
      };
    }

    if (!user) {
      return res.status(401).json(formatApiResponse(false, 'Admin account no longer exists'));
    }

    if (user.accountStatus !== 'ACTIVE') {
      return res.status(403).json(formatApiResponse(false, 'Your admin account is inactive.'));
    }

    const userRole = (user.role || decoded.role || '').toUpperCase();
    if (!['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(userRole)) {
      return res.status(403).json(formatApiResponse(false, 'You do not have permission to access the admin portal.'));
    }

    req.user = user;
    next();
  } catch (err: any) {
    return res.status(401).json(formatApiResponse(false, 'Not authorized, invalid or expired admin session token'));
  }
};

