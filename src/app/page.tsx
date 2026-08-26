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
            <div className="relative rounded-[2rem] overflow-hidden glass p-8 md:p-16 mb-16 flex flex-col md:flex-row items-center gap-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/30 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="flex-1 relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
                        Next Generation
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                        Elevate your <br/>
                        <span className="text-gradient">Digital Lifestyle.</span>
                    </h1>
                    <p className="text-gray-400 text-lg mb-10 max-w-xl leading-relaxed font-light">
                        Discover our curated collection of premium electronics designed to seamlessly integrate with your modern life. Experience the extraordinary.
                    </p>
                    <div className="flex gap-4">
                        <button className="btn-premium px-8 py-4 text-lg">Explore Collection</button>
                    </div>
                </div>
                
                <div className="flex-1 w-full relative z-10 hidden md:block">
                    <img 
                        src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop" 
                        alt="Hero" 
                        className="w-full h-100 object-cover rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.3)] opacity-90 border border-white/10"
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