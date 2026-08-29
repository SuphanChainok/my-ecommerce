import { Schema, model, models, Document, Types } from 'mongoose';

export type PaymentStatus = 'pending' | 'paid';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface IShippingAddress {
    fullName: string;
    phone: string;
    address: string;
    subdistrict: string;
    district: string;
    province: string;
    postalCode: string;
}

export interface IOrderItem {
    productId: Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

export interface IOrder extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    shippingAddress: IShippingAddress;
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
        imageUrl:  { type: String },
    },
    { _id: false }
);

const ShippingAddressSchema = new Schema<IShippingAddress>({
    fullName:    { type: String, required: true },
    phone:       { type: String, required: true },
    address:     { type: String, required: true },
    subdistrict: { type: String, required: true },
    district:    { type: String, required: true },
    province:    { type: String, required: true },
    postalCode:  { type: String, required: true },
}, { _id: false });

const OrderSchema = new Schema<IOrder>(
    {
        userId:           { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items:            { type: [OrderItemSchema], required: true },
        totalAmount:      { type: Number, required: true },
        paymentStatus:    { type: String, enum: ['pending', 'paid'], default: 'pending' },
        orderStatus:      { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
        shippingAddress:  { type: ShippingAddressSchema, required: true },
        stripeSessionId:  { type: String },
        trackingNumber:   { type: String },
    },
    { timestamps: true }
);

const Order = models.Order ?? model<IOrder>('Order', OrderSchema);

export default Order;
