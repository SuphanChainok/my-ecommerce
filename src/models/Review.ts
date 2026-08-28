import { Schema, model, models, Document, Types } from 'mongoose';

export interface IReview extends Document {
    _id: Types.ObjectId;
    productId: Types.ObjectId;
    userId: Types.ObjectId;
    userName: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
        userName:  { type: String, required: true },
        rating:    { type: Number, required: true, min: 1, max: 5 },
        comment:   { type: String, required: true },
    },
    { timestamps: true }
);

ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

const Review = models.Review ?? model<IReview>('Review', ReviewSchema);

export default Review;
