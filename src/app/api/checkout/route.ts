import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { items } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'ไม่มีสินค้าในตะกร้า' }, { status: 400 });
        }

        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        // ดึงผู้ใช้จาก cookie
        const token = req.headers.get('cookie')?.split(';').find((c) => c.trim().startsWith('token='))?.split('=')[1];
        let userId: string | null = null;

        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
                userId = decoded.userId;
            } catch {
                // ผู้ใช้ยังไม่ได้เข้าสู่ระบบ
            }
        }

        const totalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

        // สร้างออเดอร์ใน DB ก่อนแล้วส่ง orderId ไปกับ Stripe
        const order = await Order.create({
            userId: userId || (await User.create({ name: 'Guest', email: 'guest@example.com', password: 'guest' }))._id,
            items: items.map((item: any) => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1,
            })),
            totalAmount,
            paymentStatus: 'pending',
            orderStatus: 'processing',
        });

        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: 'thb',
                product_data: {
                    name: item.name,
                    images: item.imageUrl ? [item.imageUrl] : [],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity || 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/success?orderId=${order._id}`,
            cancel_url: `${origin}/cart`,
            metadata: { orderId: String(order._id) },
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Checkout Error:', err);
        return NextResponse.json(
            { error: err.message || 'เกิดข้อผิดพลาดในการสร้างรายการชำระเงิน' },
            { status: 500 }
        );
    }
}
