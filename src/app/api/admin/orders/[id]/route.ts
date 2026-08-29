import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ error: auth.error }, { status: 403 });
        }

        await connectDB();
        const { id } = await params;
        const body = await req.json();

        const updateData: any = {};
        if (body.orderStatus) updateData.orderStatus = body.orderStatus;
        if (body.trackingNumber !== undefined) updateData.trackingNumber = body.trackingNumber;

        const order = await Order.findByIdAndUpdate(id, updateData, { new: true });

        if (!order) {
            return NextResponse.json({ error: 'ไม่พบคำสั่งซื้อ' }, { status: 404 });
        }

        return NextResponse.json({ order });
    } catch (err: any) {
        console.error('Update Order Error:', err);
        return NextResponse.json({ error: err.message || 'ไม่สามารถแก้ไขคำสั่งซื้อได้' }, { status: 500 });
    }
}
