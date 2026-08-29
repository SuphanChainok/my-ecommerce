import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthResult {
    success: boolean;
    userId?: string;
    role?: string;
    error?: string;
}

export async function verifyAuth(req: Request): Promise<AuthResult> {
    try {
        await connectDB();
        const token = req.headers.get('cookie')?.split(';').find((c) => c.trim().startsWith('token='))?.split('=')[1];

        if (!token) {
            return { success: false, error: 'ไม่ได้รับอนุญาต' };
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await User.findById(decoded.userId).select('role');

        if (!user) {
            return { success: false, error: 'ไม่พบผู้ใช้' };
        }

        return { success: true, userId: String(user._id), role: user.role };
    } catch {
        return { success: false, error: 'Token ไม่ถูกต้อง' };
    }
}

export async function verifyAdmin(req: Request): Promise<AuthResult> {
    const auth = await verifyAuth(req);
    if (!auth.success) return auth;

    if (auth.role !== 'admin') {
        return { success: false, error: 'ไม่มีสิทธิ์เข้าถึงส่วนนี้' };
    }

    return auth;
}

export function unauthorizedResponse(error: string = 'ไม่ได้รับอนุญาต') {
    return NextResponse.json({ error }, { status: 401 });
}

export function forbiddenResponse(error: string = 'ไม่มีสิทธิ์เข้าถึง') {
    return NextResponse.json({ error }, { status: 403 });
}
