import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ error: auth.error }, { status: 403 });
        }

        await connectDB();

        const [totalRevenueResult, totalOrders, totalProducts, totalUsers, recentOrders] = await Promise.all([
            Order.aggregate([
                { $match: { paymentStatus: 'paid' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),
            Order.countDocuments(),
            Product.countDocuments(),
            User.countDocuments(),
            Order.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('userId', 'name email')
                .lean(),
        ]);

        const totalRevenue = totalRevenueResult[0]?.total || 0;

        return NextResponse.json({
            stats: { totalRevenue, totalOrders, totalProducts, totalUsers },
            recentOrders,
        });
    } catch (err: any) {
        console.error('Dashboard Error:', err);
        return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
    }
}
