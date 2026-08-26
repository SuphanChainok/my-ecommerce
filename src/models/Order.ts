import { Schema, model, models, Document, Types } from 'mongoose';

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userEmail: string;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  stripeSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name:      { type: String, required: true },
    price:     { type: Number, required: true },
    quantity:  { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    userEmail:      { type: String,  required: true },
    items:          { type: [OrderItemSchema], required: true },
    totalAmount:    { type: Number,  required: true },
    status:         { type: String,  enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
    stripeSessionId:{ type: String },
  },
  { timestamps: true }
);

const Order = models.Order ?? model<IOrder>('Order', OrderSchema);

export default Order;
