'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface Product {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
    stock: number;
}

export default function WishlistPage() {
    const { user, loading: authLoading } = useAuth();
    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetch('/api/wishlist')
            .then((r) => r.ok ? r.json() : Promise.reject())
            .then((data) => {
                setItems(data.wishlist || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [user]);

    const toggleWishlist = async (productId: string) => {
        await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
        });
        setItems((prev) => prev.filter((p) => p._id !== productId));
    };

    if (authLoading) {
        return (
            <div className="page-container mt-10 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/10 border-t-cyan-400 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="page-container mt-10 text-center">
                <div className="glass p-16 rounded-3xl inline-block border-white/10 shadow-2xl">
                    <h2 className="text-3xl font-bold text-white mb-6">กรุณาเข้าสู่ระบบ</h2>
                    <p className="text-gray-400 mb-8">คุณต้องเข้าสู่ระบบก่อนจึงจะดูสินค้าที่ชอบได้</p>
                    <Link href="/" className="btn-premium inline-block px-8 py-3">กลับหน้าหลัก</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10 tracking-tight">สินค้าที่ชอบ</h1>
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="glass rounded-3xl p-6 border-white/10">
                            <div className="skeleton w-full aspect-4/3 rounded-2xl mb-4" />
                            <div className="skeleton h-6 w-3/4 mb-2 rounded" />
                            <div className="skeleton h-4 w-1/2 rounded" />
                        </div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="glass rounded-3xl p-16 text-center border-white/10">
                    <p className="text-gray-400 text-xl font-light mb-6">ยังไม่มีสินค้าที่ชอบ</p>
                    <Link href="/products" className="btn-premium inline-block px-8 py-3">เลือกซื้อสินค้า</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {items.map((item) => (
                        <div key={item._id} className="glass rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(139,92,246,0.15)] hover:border-violet-500/30 flex flex-col h-full relative">
                            <div className="relative w-full aspect-4/3 overflow-hidden">
                                <img
                                    src={item.imageUrl || 'https://placehold.co/600x400/111/444'}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-[#050505] to-transparent opacity-60"></div>
                                <button
                                    onClick={() => toggleWishlist(item._id)}
                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-500/80 backdrop-blur-md text-white flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:scale-110 transition-transform"
                                >
                                    ♥
                                </button>
                            </div>
                            <div className="p-6 flex flex-col flex-1 relative z-10 bg-linear-to-b from-transparent to-[#050505]/90 -mt-10">
                                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                                    {item.name}
                                </h3>
                                <div className="mt-auto flex justify-between items-end">
                                    <span className="text-2xl font-extrabold text-white flex items-baseline gap-1">
                                        <span className="text-cyan-400 text-lg">฿</span>
                                        {item.price.toLocaleString()}
                                    </span>
                                </div>
                                <Link href={`/products/${item._id}`} className="btn-glass mt-4 text-center py-2.5">
                                    ดูรายละเอียด
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
