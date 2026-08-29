'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';

interface Product {
    _id: string;
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
    stock: number;
}

function SkeletonCard() {
    return (
        <div className="glass rounded-3xl overflow-hidden flex flex-col aspect-3/4">
            <div className="skeleton w-full aspect-4/3" />
            <div className="p-6 flex flex-col flex-1 -mt-6">
                <div className="skeleton h-7 w-3/4 mb-3 rounded" />
                <div className="skeleton h-4 w-full mb-2 rounded" />
                <div className="skeleton h-4 w-2/3 mb-6 rounded" />
                <div className="mt-auto flex justify-between items-end">
                    <div className="skeleton h-8 w-24 rounded" />
                    <div className="skeleton h-12 w-12 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then((r) => r.json())
            .then((data) => {
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="page-container animate-fade-in-up">
            {/* Hero Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center px-4 md:px-8 py-8 md:py-16 relative overflow-hidden">
                {/* Background Glows */}
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/30 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none"></div>

                {/* ฝั่งข้อความ */}
                <div className="space-y-4 text-center md:text-left relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
                        Next Generation
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white">
                        Elevate your <span className="text-gradient">Digital Lifestyle.</span>
                    </h1>
                    <p className="text-sm md:text-base text-gray-400 max-w-lg mx-auto md:mx-0">
                        Discover our curated collection of premium electronics designed to seamlessly integrate with your modern life. Experience the extraordinary.
                    </p>
                    <button className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full font-medium text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow">
                        Explore Collection
                    </button>
                </div>

                {/* ฝั่งรูปภาพ */}
                <div className="w-full h-48 md:h-80 relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.2)]">
                    <img
                        src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop"
                        alt="Premium Electronics"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Title Section */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Featured Products</h2>
                    <p className="text-gray-400 text-lg font-light">Carefully selected for unparalleled quality and performance</p>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 px-4 md:px-8">
                    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 px-4 md:px-8">
                    {products.length === 0 ? (
                        <div className="col-span-full py-24 text-center text-gray-500 glass rounded-3xl text-xl font-light">
                            No products available at the moment.
                        </div>
                    ) : (
                        products.map((p) => <ProductCard key={p._id} product={p} />)
                    )}
                </div>
            )}
        </div>
    );
}