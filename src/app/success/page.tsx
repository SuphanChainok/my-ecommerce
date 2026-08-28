'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, []);

    return (
        <div className="page-container mt-10 flex items-center justify-center">
            <div className="glass rounded-[2.5rem] p-12 md:p-16 max-w-lg w-full text-center border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-4xl font-bold mx-auto mb-8 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                    ✓
                </div>
                <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">ชำระเงินสำเร็จ!</h1>
                <p className="text-gray-400 text-lg font-light mb-8 leading-relaxed">
                    ขอบคุณสำหรับการสั่งซื้อ ระบบได้ทำการบันทึกข้อมูลเรียบร้อยแล้ว
                </p>
                {orderId && (
                    <p className="text-xs text-gray-500 mb-10 font-mono bg-white/5 inline-block px-4 py-2 rounded-full border border-white/10">
                        Order ID: {orderId}
                    </p>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/orders" className="btn-premium flex-1 text-center py-3.5">
                        ดูประวัติคำสั่งซื้อ
                    </Link>
                    <Link href="/" className="btn-glass flex-1 text-center py-3.5">
                        กลับหน้าหลัก
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="page-container mt-10 flex items-center justify-center"><div className="w-12 h-12 border-4 border-white/10 border-t-cyan-400 rounded-full animate-spin"></div></div>}>
            <SuccessContent />
        </Suspense>
    );
}
