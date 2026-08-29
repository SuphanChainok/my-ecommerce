import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';

type Params = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, { params }: Params) {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ error: auth.error }, { status: 403 });
        }

        await connectDB();
        const { id } = await params;

        const review = await Review.findByIdAndDelete(id);
        if (!review) {
            return NextResponse.json({ error: 'ไม่พบรีวิว' }, { status: 404 });
        }

        // Update product average rating
        const reviews = await Review.find({ productId: review.productId });
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        await Product.findByIdAndUpdate(review.productId, {
            averageRating: Math.round(avgRating * 10) / 10,
            reviewCount: reviews.length,
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Delete Review Error:', err);
        return NextResponse.json({ error: 'ไม่สามารถลบรีวิวได้' }, { status: 500 });
    }
}
