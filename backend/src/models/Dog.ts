import mongoose, { Schema, Document } from 'mongoose';

export type DogListingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SOLD' | 'UNAVAILABLE';

export interface IDog extends Document {
  name: string;
  breed: string;
  category: string;
  age: string;
  ageMonths: number;
  gender: 'Male' | 'Female';
  price: number;
  originalPrice?: number;
  location: string;
  color: string;
  weightKg: number;
  images: string[];
  frames360?: string[];
  videoUrl?: string;
  vaccinationStatus: string;
  vaccinationRecords?: string[];
  healthCertificate?: string;
  medicalHistory?: string[];
  microchipNumber?: string;
  sellerId: mongoose.Types.ObjectId;
  sellerInfo?: {
    name: string;
    businessName: string;
    avatar: string;
    rating: number;
    reviewsCount: number;
    city: string;
    phone: string;
  };
  availability: boolean;
  status: DogListingStatus;
  rejectionReason?: string;
  certified: boolean;
  featured: boolean;
  traits: {
    affection: number;
    energy: number;
    grooming: number;
    barking: number;
    trainability: number;
  };
  suitableFor: {
    apartment: boolean;
    kids: boolean;
    firstTimeOwner: boolean;
    climate: string;
  };
  foodRecommendation: string;
  exerciseRecommendation: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const DogSchema = new Schema<IDog>(
  {
    name: { type: String, required: true, trim: true },
    breed: { type: String, required: true, index: true },
    category: { type: String, default: 'Family Dogs' },
    age: { type: String, required: true },
    ageMonths: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    price: { type: Number, required: true, index: true },
    originalPrice: { type: Number },
    location: { type: String, required: true, index: true },
    color: { type: String, default: 'Mixed' },
    weightKg: { type: Number, default: 5 },
    images: [{ type: String, required: true }],
    frames360: [{ type: String }],
    videoUrl: { type: String, default: '' },
    vaccinationStatus: { type: String, default: 'Fully Vaccinated' },
    vaccinationRecords: [{ type: String }],
    healthCertificate: { type: String, default: '' },
    medicalHistory: [{ type: String }],
    microchipNumber: { type: String, default: '' },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    sellerInfo: {
      name: { type: String, default: '' },
      businessName: { type: String, default: '' },
      avatar: { type: String, default: '' },
      rating: { type: Number, default: 5 },
      reviewsCount: { type: Number, default: 1 },
      city: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    availability: { type: Boolean, default: true },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'SOLD', 'UNAVAILABLE'], default: 'PENDING', index: true },
    rejectionReason: { type: String, default: '' },
    certified: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    traits: {
      affection: { type: Number, default: 5 },
      energy: { type: Number, default: 4 },
      grooming: { type: Number, default: 3 },
      barking: { type: Number, default: 2 },
      trainability: { type: Number, default: 5 },
    },
    suitableFor: {
      apartment: { type: Boolean, default: true },
      kids: { type: Boolean, default: true },
      firstTimeOwner: { type: Boolean, default: true },
      climate: { type: String, default: 'Any' },
    },
    foodRecommendation: { type: String, default: 'High Quality Puppy Formula' },
    exerciseRecommendation: { type: String, default: '30-45 Mins Daily Play' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

DogSchema.index({ createdAt: -1 });

export const Dog = mongoose.model<IDog>('Dog', DogSchema);
