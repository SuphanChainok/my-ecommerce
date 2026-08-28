import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
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
        const userId = await getUserIdFromReq(req);
        if (!userId) {
            return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
        }
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        return NextResponse.json(orders);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
