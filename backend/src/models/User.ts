import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN' | 'MODERATOR';
export type AccountStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  profileImage?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  emailVerified: boolean;
  accountStatus: AccountStatus;
  otp?: string;
  otpExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, select: false },
    phone: { type: String, default: '' },
    role: {
      type: String,
      enum: ['CUSTOMER', 'SELLER', 'ADMIN', 'SUPER_ADMIN', 'MODERATOR'],
      default: 'CUSTOMER',
    },
    profileImage: { type: String, default: '' },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      country: { type: String, default: 'India' },
    },
    emailVerified: { type: Boolean, default: false },
    accountStatus: { type: String, enum: ['PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED'], default: 'ACTIVE' },
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
