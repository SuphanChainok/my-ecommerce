import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        await connectDB();

        const { email, name, password } = await req.json();

        // ตรวจสอบว่ามี admin อยู่แล้วหรือไม่
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            return NextResponse.json(
                { error: 'มี Admin อยู่แล้ว', adminEmail: existingAdmin.email },
                { status: 400 }
            );
        }

        // ตรวจสอบว่า email ซ้ำหรือไม่
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // อัปเดต role เป็น admin
            existingUser.role = 'admin';
            await existingUser.save();
            return NextResponse.json({ message: 'อัปเดต Role เป็น Admin สำเร็จ', email });
        }

        // สร้าง admin ใหม่
        const user = await User.create({
            name: name || 'Admin',
            email,
            password: password || 'admin123',
            role: 'admin',
        });

        return NextResponse.json({
            message: 'สร้าง Admin สำเร็จ',
            email: user.email,
            password: password || 'admin123',
        }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
