import mongoose, { Schema, Document } from 'mongoose';

export type DogShowStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface IDogShow extends Document {
  title: string;
  eventName?: string;
  bannerImage: string;
  image?: string;
  description: string;
  organizer: string;
  location?: string;
  venue: string;
  city: string;
  state: string;
  country: string;
  date: string;
  time?: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  registrationDetails?: string;
  categories: string[];
  rules: string[];
  prizes: string;
  sponsors: string[];
  chiefGuest?: string;
  contactEmail: string;
  contactPhone: string;
  websiteLink?: string;
  registrationFee: number;
  status: DogShowStatus;
  winners?: { category: string; dogName: string; ownerName: string; rank: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const DogShowSchema = new Schema<IDogShow>(
  {
    title: { type: String, required: true, trim: true },
    eventName: { type: String, trim: true },
    bannerImage: { type: String, default: '' },
    image: { type: String, default: '' },
    description: { type: String, required: true },
    organizer: { type: String, default: 'Kennel Club of India (KCI)' },
    location: { type: String, default: '' },
    venue: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: 'Tamil Nadu' },
    country: { type: String, default: 'India' },
    date: { type: String, required: true },
    time: { type: String, default: '09:00 AM' },
    startTime: { type: String, default: '09:00 AM' },
    endTime: { type: String, default: '06:00 PM' },
    registrationDeadline: { type: String, default: '' },
    registrationDetails: { type: String, default: '' },
    categories: [{ type: String }],
    rules: [{ type: String }],
    prizes: { type: String, default: '' },
    sponsors: [{ type: String }],
    chiefGuest: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    websiteLink: { type: String, default: '' },
    registrationFee: { type: Number, default: 0 },
    status: { type: String, enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'], default: 'UPCOMING' },
    winners: [
      {
        category: String,
        dogName: String,
        ownerName: String,
        rank: String,
      },
    ],
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export const DogShow = mongoose.model<IDogShow>('DogShow', DogShowSchema);
