import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import type { RouteContext } from 'next/server';

// GET /api/products/:id
export async function GET(
    _request: Request,
    { params }: RouteContext<'/api/products/[id]'>
) {
    try {
        const { id } = await params;
        await connectDB();
        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}
