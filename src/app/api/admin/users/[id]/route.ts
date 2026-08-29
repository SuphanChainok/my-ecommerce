import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

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
        if (body.role) updateData.role = body.role;

        const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'ไม่พบสมาชิก' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (err: any) {
        console.error('Update User Error:', err);
        return NextResponse.json({ error: err.message || 'ไม่สามารถแก้ไขสมาชิกได้' }, { status: 500 });
    }
}
