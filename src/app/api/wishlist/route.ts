import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
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

export async function POST(req: Request) {
    try {
        await connectDB();
        const userId = await getUserIdFromReq(req);
        if (!userId) {
            return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
        }

        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json({ error: 'กรุณาระบุสินค้า' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 });
        }

        const isWishlisted = user.wishlist.some((id: any) => String(id) === String(productId));

        if (isWishlisted) {
            user.wishlist = user.wishlist.filter((wId: any) => String(wId) !== String(productId));
        } else {
            user.wishlist.push(productId as any);
        }

        await user.save();
        return NextResponse.json({ wishlist: user.wishlist, isWishlisted: !isWishlisted });
    } catch {
        return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const userId = await getUserIdFromReq(req);
        if (!userId) {
            return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
        }

        const user = await User.findById(userId).populate('wishlist');
        return NextResponse.json({ wishlist: user?.wishlist || [] });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }
}
