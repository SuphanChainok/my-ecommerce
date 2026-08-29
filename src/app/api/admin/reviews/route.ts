import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';

export async function GET(req: Request) {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ error: auth.error }, { status: 403 });
        }

        await connectDB();
        const reviews = await Review.find()
            .sort({ createdAt: -1 })
            .populate('productId', 'name')
            .populate('userId', 'name email')
            .lean();

        return NextResponse.json({ reviews });
    } catch (err: any) {
        console.error('Get Reviews Error:', err);
        return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
    }
}
