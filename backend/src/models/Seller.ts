import mongoose, { Schema, Document } from 'mongoose';

export type SellerStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ISeller extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  address: {
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  govtIdNumber: string;
  govtIdDocument?: string;
  kennelName: string;
  experienceYears: number;
  website?: string;
  socialLinks?: string;
  additionalDocs?: string[];
  sellerStatus: SellerStatus;
  rejectionReason?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema = new Schema<ISeller>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, default: '' },
      country: { type: String, default: 'India' },
    },
    govtIdNumber: { type: String, required: true },
    govtIdDocument: { type: String, default: '' },
    kennelName: { type: String, required: true },
    experienceYears: { type: Number, default: 1 },
    website: { type: String, default: '' },
    socialLinks: { type: String, default: '' },
    additionalDocs: [{ type: String }],
    sellerStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    rejectionReason: { type: String, default: '' },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

export const Seller = mongoose.model<ISeller>('Seller', SellerSchema);
