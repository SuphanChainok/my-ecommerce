'use client';

import { useEffect, useState, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';

interface Product {
    _id: string;
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
    stock: number;
    category?: string;
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

const categories = ['electronics', 'clothing', 'home', 'accessories', 'general'];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);

    const fetchProducts = useCallback(() => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sortBy) params.set('sortBy', sortBy);

        setLoading(true);
        fetch(`/api/products?${params.toString()}`)
            .then((r) => r.json())
            .then((data) => {
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [search, category, minPrice, maxPrice, sortBy]);

    useEffect(() => {
        const timer = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timer);
    }, [fetchProducts]);

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

            {/* Search & Filters */}
            <div className="glass rounded-3xl p-6 mb-10 border-white/10">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input
                            type="text"
                            placeholder="ค้นหาสินค้า..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden btn-glass px-6 py-3.5 flex items-center justify-center gap-2"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="16" y2="12"></line><line x1="4" y1="18" x2="12" y2="18"></line></svg>
                        ตัวกรอง
                    </button>
                    <div className="hidden md:flex items-center gap-3">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-full px-5 py-3.5 text-white focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer"
                        >
                            <option value="newest" className="bg-[#111]">สินค้าใหม่</option>
                            <option value="price-asc" className="bg-[#111]">ราคาต่ำ-สูง</option>
                            <option value="price-desc" className="bg-[#111]">ราคาสูง-ต่ำ</option>
                        </select>
                    </div>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">หมวดหมู่</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-[#111]">ทั้งหมด</option>
                                {categories.map((c) => (
                                    <option key={c} value={c} className="bg-[#111]">{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">ราคาต่ำสุด</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">ราคาสูงสุด</label>
                            <input
                                type="number"
                                placeholder="99999"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => { setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); setSortBy('newest'); }}
                                className="w-full btn-glass py-3.5 rounded-full"
                            >
                                ล้างตัวกรอง
                            </button>
                        </div>
                    </div>
                )}
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
                            ไม่พบสินค้าที่ตรงกับเงื่อนไข
                        </div>
                    ) : (
                        products.map((p) => <ProductCard key={p._id} product={p} />)
                    )}
                </div>
            )}
        </div>
    );
}
