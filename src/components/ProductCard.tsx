'use client';
import Link from 'next/link';

interface ProductProps {
    _id: string;
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
    stock: number;
}

export default function ProductCard({ product }: { product: ProductProps }) {
    return (
        <Link href={`/products/${product._id}`} className="glass rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(139,92,246,0.15)] hover:border-violet-500/30 flex flex-col h-full relative">
            <div className="relative w-full aspect-4/3 overflow-hidden">
                <img
                    src={product.imageUrl || 'https://placehold.co/600x400/111/444'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#050505] to-transparent opacity-60"></div>
                
                {product.stock <= 0 && (
                    <div className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                        Sold Out
                    </div>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                    <div className="absolute top-4 right-4 bg-orange-500/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                        Only {product.stock} Left
                    </div>
                )}
            </div>
            
            <div className="p-6 flex flex-col flex-1 relative z-10 bg-linear-to-b from-transparent to-[#050505]/90 -mt-10">
                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-1 font-light leading-relaxed">
                    {product.description || 'Experience the next generation of premium tech.'}
                </p>
                <div className="flex justify-between items-end mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Price</span>
                        <span className="text-2xl font-extrabold text-white flex items-baseline gap-1">
                            <span className="text-cyan-400 text-lg">฿</span>
                            {product.price.toLocaleString()}
                        </span>
                    </div>
                    
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-violet-500 group-hover:border-violet-500 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-300 text-gray-400 group-hover:text-white">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}