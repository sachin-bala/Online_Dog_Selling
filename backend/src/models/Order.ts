import mongoose, { Schema, Document } from 'mongoose';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type OrderStatus = 
  | 'PENDING_PAYMENT' 
  | 'PAID' 
  | 'CONFIRMED' 
  | 'PENDING_APPROVAL' 
  | 'APPROVED' 
  | 'DISPATCHED' 
  | 'PROCESSING' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  dogId: mongoose.Types.ObjectId;
  amount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentMethod: string;
  buyerName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  trackingId: string;
  estimatedDelivery: string;
  deliveryCoords?: { lat: number; lng: number };
  approvedAt?: Date;
  dispatchedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    dogId: { type: Schema.Types.ObjectId, ref: 'Dog', required: true },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' },
    orderStatus: {
      type: String,
      enum: [
        'PENDING_PAYMENT',
        'PAID',
        'CONFIRMED',
        'PENDING_APPROVAL',
        'APPROVED',
        'DISPATCHED',
        'PROCESSING',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED'
      ],
      default: 'PENDING_APPROVAL',
    },
    paymentMethod: { type: String, default: 'Razorpay UPI/Cards' },
    buyerName: { type: String, default: '' },
    buyerPhone: { type: String, default: '' },
    buyerEmail: { type: String, default: '' },
    deliveryAddress: {
      street: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    trackingId: { type: String, default: '' },
    estimatedDelivery: { type: String, default: '3 - 5 Days' },
    deliveryCoords: {
      lat: { type: Number, default: 13.0827 },
      lng: { type: Number, default: 80.2707 },
    },
    approvedAt: { type: Date },
    dispatchedAt: { type: Date },
    rejectionReason: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
