import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event;
    try {
        // ตรวจสอบ Signature เพื่อรับประกันว่าข้อมูลส่งมาจาก Stripe จริง
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // เมื่อชำระเงินสำเร็จ
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const orderId = session.metadata?.orderId;

        if (orderId) {
            await connectDB();

            // อัปเดตสถานะออเดอร์เป็น paid
            const order = await Order.findByIdAndUpdate(
                orderId,
                { paymentStatus: 'paid', orderStatus: 'processing' },
                { new: true }
            );

            // ตัดสต็อกสินค้าในคลัง
            if (order) {
                for (const item of order.items) {
                    await Product.findByIdAndUpdate(item.productId, {
                        $inc: { stock: -item.quantity },
                    });
                }
            }
        }
    }

    return NextResponse.json({ received: true });
}