'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart(); // ล้างตะกร้าสินค้าเมื่อชำระเงินสำเร็จ
    }, []);

    return (
        <div className="text-center py-16 bg-white rounded-lg shadow max-w-md mx-auto my-10 p-8">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h1 className="text-2xl font-bold mb-2">ชำระเงินสำเร็จ!</h1>
            <p className="text-gray-600 mb-6">
                ขอบคุณสำหรับการสั่งซื้อ ระบบได้ทำการบันทึกข้อมูลเรียบร้อยแล้ว
            </p>
            {orderId && (
                <p className="text-xs text-gray-400 mb-6 font-mono">
                    Order ID: {orderId}
                </p>
            )}
            <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
                กลับหน้าหลัก
            </Link>
        </div>
    );
}