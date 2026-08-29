import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';

export async function GET(req: Request) {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ error: auth.error }, { status: 403 });
        }

        await connectDB();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        const query = status && status !== 'all' ? { orderStatus: status } : {};
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'name email')
            .lean();

        return NextResponse.json({ orders });
    } catch (err: any) {
        console.error('Get Orders Error:', err);
        return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
    }
}
