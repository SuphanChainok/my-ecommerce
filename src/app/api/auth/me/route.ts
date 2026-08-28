import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(req: Request) {
    try {
        await connectDB();
        const token = req.headers.get('cookie')?.split(';').find((c) => c.trim().startsWith('token='))?.split('=')[1];

        if (!token) {
            return NextResponse.json({ user: null });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return NextResponse.json({ user: null });
        }

        return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch {
        return NextResponse.json({ user: null });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/',
    });
    return response;
}
