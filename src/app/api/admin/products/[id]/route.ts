import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ error: auth.error }, { status: 403 });
        }

        await connectDB();
        const { id } = await params;
        const body = await req.json();

        const product = await Product.findByIdAndUpdate(
            id,
            {
                name: body.name,
                price: body.price,
                description: body.description,
                imageUrl: body.imageUrl,
                category: body.category,
                stock: body.stock,
            },
            { new: true, runValidators: true }
        );

        if (!product) {
            return NextResponse.json({ error: 'ไม่พบสินค้า' }, { status: 404 });
        }

        return NextResponse.json({ product });
    } catch (err: any) {
        console.error('Update Product Error:', err);
        return NextResponse.json({ error: err.message || 'ไม่สามารถแก้ไขสินค้าได้' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: Params) {
    try {
        const auth = await verifyAdmin(req);
        if (!auth.success) {
            return NextResponse.json({ error: auth.error }, { status: 403 });
        }

        await connectDB();
        const { id } = await params;

        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return NextResponse.json({ error: 'ไม่พบสินค้า' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Delete Product Error:', err);
        return NextResponse.json({ error: 'ไม่สามารถลบสินค้าได้' }, { status: 500 });
    }
}
