import { Schema, model, models, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  category: string;
  stock: number;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name:        { type: String,  required: true },
    price:       { type: Number,  required: true },
    description: { type: String },
    imageUrl:    { type: String },
    category:    { type: String,  default: 'general' },
    stock:       { type: Number,  default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = models.Product ?? model<IProduct>('Product', ProductSchema);

export default Product;
