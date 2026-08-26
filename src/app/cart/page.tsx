'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'เกิดข้อผิดพลาดในการชำระเงิน');
                return;
            }
            alert('ชำระเงินสำเร็จ! Order ID: ' + data.orderId);
            clearCart();
            window.location.href = '/';
        } catch {
            alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="page-container mt-10 animate-fade-in-up">
                <div className="glass rounded-[3rem] p-16 md:p-24 text-center max-w-3xl mx-auto border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-64 bg-linear-to-b from-cyan-500/10 to-transparent pointer-events-none blur-3xl"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-64 bg-linear-to-t from-violet-500/10 to-transparent pointer-events-none blur-3xl"></div>

                    <div className="w-28 h-28 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
                            <circle cx="9" cy="21" r="2" /><circle cx="20" cy="21" r="2" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tight">Your cart is empty</h2>
                    <p className="text-gray-400 mb-10 text-lg font-light leading-relaxed max-w-lg mx-auto">Looks like you haven't added anything yet. Discover our premium collection and elevate your digital setup today.</p>
                    <Link href="/" className="btn-premium inline-block px-10 py-4 text-lg tracking-wide shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">Explore Collection</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container animate-fade-in-up pb-20">
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">Checkout</h1>
            <p className="text-gray-400 mb-12 text-lg font-light">Review your premium selection and proceed to secure payment.</p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Cart Items */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Your Items</span>
                        <button onClick={clearCart} className="text-sm font-semibold text-red-400/80 hover:text-red-400 transition-colors uppercase tracking-widest">Clear All</button>
                    </div>

                    {cart.map((item) => (
                        <div key={item._id} className="glass rounded-[2rem] p-6 flex flex-col sm:flex-row gap-6 sm:items-center border-white/5 hover:bg-white/5 transition-colors relative overflow-hidden group shadow-lg hover:shadow-xl hover:border-white/10">
                            <img src={item.imageUrl || 'https://placehold.co/150x150/111/444'} alt={item.name} className="w-full sm:w-28 sm:h-28 object-cover rounded-2xl border border-white/10 group-hover:scale-105 transition-transform duration-500" />

                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">{item.name}</h3>
                                <p className="text-cyan-400 font-bold mb-4 text-lg">฿{item.price.toLocaleString()}</p>

                                <div className="flex justify-between sm:justify-start items-center gap-6">
                                    <div className="flex items-center bg-black/40 border border-white/10 rounded-full shadow-inner p-1">
                                        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors" onClick={() => updateQuantity(item._id, -1)}>−</button>
                                        <span className="w-10 text-center text-sm font-bold text-white">{item.quantity}</span>
                                        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors" onClick={() => updateQuantity(item._id, +1)}>+</button>
                                    </div>
                                    <div className="sm:hidden text-right">
                                        <button onClick={() => removeFromCart(item._id)} className="text-[10px] text-gray-500 hover:text-red-400 uppercase tracking-widest font-bold transition-colors">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden sm:flex flex-col justify-between items-end h-28 pr-2">
                                <p className="text-xl font-extrabold text-white mt-1">฿{(item.price * item.quantity).toLocaleString()}</p>
                                <button onClick={() => removeFromCart(item._id)} className="text-[10px] text-gray-500 hover:text-red-400 uppercase tracking-widest font-bold transition-colors mb-1">
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-5 xl:col-span-4">
                    <div className="glass rounded-[2.5rem] p-8 lg:p-10 sticky top-28 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 rounded-full blur-[60px] pointer-events-none"></div>

                        <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">Order Summary</h2>

                        <div className="space-y-5 mb-8">
                            <div className="flex justify-between text-gray-300 font-light">
                                <span>Subtotal</span>
                                <span className="font-medium text-white">฿{totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-300 font-light">
                                <span>Shipping</span>
                                <span className="text-cyan-400 font-bold uppercase tracking-wider text-sm flex items-center">Free</span>
                            </div>
                            <div className="flex justify-between text-gray-300 font-light">
                                <span>Tax</span>
                                <span className="text-gray-500 italic text-sm">Calculated at checkout</span>
                            </div>
                        </div>

                        <div className="w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent mb-8"></div>

                        <div className="flex justify-between items-end mb-10">
                            <span className="text-white font-medium text-lg">Total</span>
                            <span className="text-4xl font-extrabold text-gradient">
                                ฿{totalAmount.toLocaleString()}
                            </span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="btn-premium w-full h-16 text-lg font-bold tracking-wide shadow-[0_0_20px_rgba(139,92,246,0.3)] flex justify-center items-center gap-3 mb-6 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                        >
                            {loading ? (
                                <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>Secure Checkout <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>
                            )}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 uppercase tracking-widest font-bold">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            256-bit encrypted payment
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}