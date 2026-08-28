'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { cart, totalAmount, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'เกิดข้อผิดพลาด');
                setLoading(false);
            }
        } catch {
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
            setLoading(false);
        }
    };

    return (
        <div className="page-container animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10 tracking-tight">Checkout</h1>
            {cart.length === 0 ? (
                <div className="glass rounded-3xl p-16 text-center border-white/10">
                    <p className="text-gray-400 text-xl font-light mb-6">ไม่มีสินค้าในตะกร้า</p>
                    <button onClick={() => router.push('/products')} className="btn-premium px-8 py-3">เลือกซื้อสินค้า</button>
                </div>
            ) : (
                <div className="glass rounded-[2.5rem] p-8 md:p-12 border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                    <div className="space-y-6 mb-10">
                        {cart.map((item) => (
                            <div key={item._id} className="flex items-center justify-between border-b border-white/5 pb-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0">
                                        <img src={item.imageUrl || 'https://placehold.co/100x100/111/444'} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">{item.name}</h3>
                                        <p className="text-gray-400 text-sm">จำนวน: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="text-cyan-400 font-bold text-xl">฿{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-white/10 pt-8">
                        <span className="text-gray-300 text-xl font-medium">ยอดรวม</span>
                        <span className="text-4xl font-extrabold text-gradient">฿{totalAmount.toLocaleString()}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="btn-premium w-full mt-10 h-16 text-lg font-bold tracking-wide shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-50"
                    >
                        {loading ? 'กำลังดำเนินการ...' : 'ชำระเงินด้วย Stripe'}
                    </button>
                </div>
            )}
        </div>
    );
}
