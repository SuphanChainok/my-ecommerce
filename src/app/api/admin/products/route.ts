import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

export async function GET(req: Request) {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ error: auth.error }, { status: 403 });
        }

        await connectDB();
        const products = await Product.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ products });
    } catch (err: any) {
        console.error('Get Products Error:', err);
        return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ error: auth.error }, { status: 403 });
        }

        await connectDB();
        const body = await req.json();

        const product = await Product.create({
            name: body.name,
            price: body.price,
            description: body.description,
            imageUrl: body.imageUrl,
            category: body.category || 'general',
            stock: body.stock || 0,
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (err: any) {
        console.error('Create Product Error:', err);
        return NextResponse.json({ error: err.message || 'ไม่สามารถสร้างสินค้าได้' }, { status: 500 });
    }
}
