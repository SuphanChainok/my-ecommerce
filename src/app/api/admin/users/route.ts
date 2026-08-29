import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ error: auth.error }, { status: 403 });
        }

        await connectDB();
        const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
        return NextResponse.json({ users });
    } catch (err: any) {
        console.error('Get Users Error:', err);
        return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
    }
}
