import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(req: Request) {
    try {
        const { items } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'ไม่มีสินค้าในตะกร้า' }, { status: 400 });
        }

        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

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
            payment_method_types: ['card'], // กำหนดเป็นบัตรอย่างเดียวเพื่อป้องกัน error
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/?success=true`,
            cancel_url: `${origin}/cart`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe Error:', err);
        return NextResponse.json(
            { error: err.message || 'เกิดข้อผิดพลาดในการสร้างรายการชำระเงิน' },
            { status: 500 }
        );
    }
}