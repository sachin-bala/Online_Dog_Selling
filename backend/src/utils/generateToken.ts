import jwt from 'jsonwebtoken';
import { env } from '../config/environment.js';

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, env.JWT_SECRET, {
    expiresIn: '7d',
  });
};
