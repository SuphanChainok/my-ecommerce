import { Schema, model, models, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name:        { type: String,  required: true },
    price:       { type: Number,  required: true },
    description: { type: String },
    imageUrl:    { type: String },
    stock:       { type: Number,  default: 0 },
  },
  { timestamps: true }
);

const Product = models.Product ?? model<IProduct>('Product', ProductSchema);

export default Product;
