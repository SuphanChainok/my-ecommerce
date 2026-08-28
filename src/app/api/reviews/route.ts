import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function getUserIdFromReq(req: Request) {
    const token = req.headers.get('cookie')?.split(';').find((c) => c.trim().startsWith('token='))?.split('=')[1];
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        return decoded.userId;
    } catch {
        return null;
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const productId = url.searchParams.get('productId');

        if (productId) {
            const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
            return NextResponse.json(reviews);
        }

        const reviews = await Review.find({}).sort({ createdAt: -1 }).limit(20);
        return NextResponse.json(reviews);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const userId = await getUserIdFromReq(req);
        if (!userId) {
            return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
        }

        const body = await req.json();
        const { productId, userName, rating, comment } = body;

        if (!productId || !userName || !rating || !comment) {
            return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
        }

        const review = await Review.create({
            productId,
            userId,
            userName,
            rating: Number(rating),
            comment,
        });

        // คำนวณคะแนนเฉลี่ยและอัปเดตสินค้า
        const stats = await Review.aggregate([
            { $match: { productId } },
            { $group: { _id: '$productId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]);

        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                averageRating: Math.round(stats[0].avgRating * 10) / 10,
                reviewCount: stats[0].count,
            });
        }

        return NextResponse.json(review, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'คุณได้ให้คะแนนสินค้านี้แล้ว' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}
