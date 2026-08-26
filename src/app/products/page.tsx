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

export default function ProductsPage() {
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
            {/* Header Section */}
            <div className="relative rounded-[2rem] overflow-hidden glass p-8 md:p-12 mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10">
                <div className="absolute -top-32 -right-32 w-72 h-72 bg-violet-600/25 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-cyan-600/15 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-md">
                        All Products
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
                        Discover Our <span className="text-gradient">Collection</span>
                    </h1>
                    <p className="text-gray-400 text-lg font-light max-w-xl leading-relaxed">
                        Browse our complete lineup of premium electronics. Find the perfect tech for your lifestyle.
                    </p>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
