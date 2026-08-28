import { Schema, model, models, Document, Types } from 'mongoose';

export type PaymentStatus = 'pending' | 'paid';
export type OrderStatus = 'processing' | 'shipped' | 'delivered';

export interface IOrderItem {
    productId: Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
}

export interface IOrder extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    stripeSessionId?: string;
    trackingNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
    {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name:      { type: String, required: true },
        price:     { type: Number, required: true },
        quantity:  { type: Number, required: true },
    },
    { _id: false }
);

const OrderSchema = new Schema<IOrder>(
    {
        userId:           { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items:            { type: [OrderItemSchema], required: true },
        totalAmount:      { type: Number, required: true },
        paymentStatus:    { type: String, enum: ['pending', 'paid'], default: 'pending' },
        orderStatus:      { type: String, enum: ['processing', 'shipped', 'delivered'], default: 'processing' },
        stripeSessionId:  { type: String },
        trackingNumber:   { type: String },
    },
    { timestamps: true }
);

const Order = models.Order ?? model<IOrder>('Order', OrderSchema);

export default Order;
