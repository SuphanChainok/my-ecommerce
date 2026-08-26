import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

// GET: ดึงรายการสินค้าทั้งหมด
export async function GET() {
    try {
        await connectDB();
        const products = await Product.find({}).sort({ createdAt: -1 });
        return NextResponse.json(products);
    } catch (error) {
        console.error('DATABASE ERROR:', error); // เพิ่มบรรทัดนี้
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST: เพิ่มสินค้าใหม่
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const newProduct = await Product.create(body);
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}