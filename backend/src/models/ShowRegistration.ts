import mongoose, { Schema, Document } from 'mongoose';

export type ShowRegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface IShowRegistration extends Document {
  showId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  ownerName: string;
  email: string;
  phone: string;
  dogName: string;
  breed: string;
  age: string;
  gender: string;
  category: string;
  photoUrl?: string;
  documents?: string[];
  paymentStatus: 'PAID' | 'PENDING';
  registrationStatus: ShowRegistrationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ShowRegistrationSchema = new Schema<IShowRegistration>(
  {
    showId: { type: Schema.Types.ObjectId, ref: 'DogShow', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dogName: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: String, default: '' },
    gender: { type: String, default: 'Male' },
    category: { type: String, required: true },
    photoUrl: { type: String, default: '' },
    documents: [{ type: String }],
    paymentStatus: { type: String, enum: ['PAID', 'PENDING'], default: 'PAID' },
    registrationStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  },
  { timestamps: true }
);

export const ShowRegistration = mongoose.model<IShowRegistration>('ShowRegistration', ShowRegistrationSchema);
