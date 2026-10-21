import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware.js';
import { formatApiResponse } from '../utils/validators.js';
import { Seller } from '../models/Seller.js';

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): any => {
    if (!req.user) {
      return res.status(401).json(formatApiResponse(false, 'User not authenticated'));
    }

    const userRole = (req.user.role || '').toUpperCase();
    const allowedRoles = roles.map((r) => r.toUpperCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json(
        formatApiResponse(false, `User role '${req.user.role}' is not authorized to access this route`)
      );
    }

    next();
  };
};

export const requireRole = (...roles: string[]) => {
  return authorizeRoles(...roles);
};

export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction): any => {
  if (!req.user) {
    return res.status(401).json(formatApiResponse(false, 'User not authenticated'));
  }

  if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN') {
    return res.status(403).json(
      formatApiResponse(false, 'Access Denied: Super Admin privileges required for this action')
    );
  }

  next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): any => {
  if (!req.user) {
    return res.status(401).json(formatApiResponse(false, 'User not authenticated'));
  }

  const role = (req.user.role || '').toUpperCase();
  if (!['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(role)) {
    return res.status(403).json(
      formatApiResponse(false, 'Access Denied: Only Admin users are authorized to manage seller dogs')
    );
  }

  next();
};

export const requireApprovedSeller = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  if (!req.user) {
    return res.status(401).json(formatApiResponse(false, 'User not authenticated'));
  }

  const role = (req.user.role || '').toUpperCase();
  if (['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(role)) {
    return next(); // Admins can manage
  }

  return res.status(403).json(formatApiResponse(false, 'Access Denied: Only Admin users are authorized to add or modify dog listings.'));
};
