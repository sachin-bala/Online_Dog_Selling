import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  type: 'FOOD' | 'ACCESSORY';
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  weight?: string;
  lifeStage?: string;
  material?: string;
  size?: string;
  images: string[];
  description: string;
  features: string[];
  ingredients?: string;
  isAvailable: boolean;
  featured: boolean;
  addedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 150,
    },
    type: {
      type: String,
      required: [true, 'Product type (FOOD or ACCESSORY) is required'],
      enum: ['FOOD', 'ACCESSORY'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be greater than zero'],
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 25,
      min: 0,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 18,
    },
    weight: {
      type: String,
      default: '',
    },
    lifeStage: {
      type: String,
      default: '',
    },
    material: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    features: {
      type: [String],
      default: [],
    },
    ingredients: {
      type: String,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    addedBy: {
      type: String,
      default: 'admin',
      immutable: true, // Only Admin can add products!
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 'text', brand: 'text', description: 'text' });

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
