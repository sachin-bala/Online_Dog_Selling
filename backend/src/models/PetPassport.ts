import mongoose, { Schema, Document } from 'mongoose';

export interface IPetPassport extends Document {
  dogId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  dogName: string;
  breed: string;
  microchipId: string;
  dnaVerified: boolean;
  birthDate: string;
  gender: string;
  ownerName: string;
  qrCodeUrl: string;
  vaccines: { name: string; date: string; status: 'Complete' | 'Due' }[];
  medicalRecords?: string[];
  ownershipHistory?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PetPassportSchema = new Schema<IPetPassport>(
  {
    dogId: { type: Schema.Types.ObjectId, ref: 'Dog', required: true, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    dogName: { type: String, required: true },
    breed: { type: String, required: true },
    microchipId: { type: String, required: true, unique: true },
    dnaVerified: { type: Boolean, default: true },
    birthDate: { type: String, required: true },
    gender: { type: String, required: true },
    ownerName: { type: String, required: true },
    qrCodeUrl: { type: String, default: '' },
    vaccines: [
      {
        name: { type: String, required: true },
        date: { type: String, required: true },
        status: { type: String, enum: ['Complete', 'Due'], default: 'Complete' },
      },
    ],
    medicalRecords: [{ type: String }],
    ownershipHistory: [{ type: String }],
  },
  { timestamps: true }
);

export const PetPassport = mongoose.model<IPetPassport>('PetPassport', PetPassportSchema);
