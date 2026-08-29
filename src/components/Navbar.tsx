'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { totalItems } = useCart();
    const { user, logout } = useAuth();

    return (
        <nav className="glass-nav sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-violet-500 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.7)] transition-shadow duration-300">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white">My<span className="text-gradient">Shop</span></span>
                </Link>

                <div className="hidden md:flex items-center gap-10">
                    <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Home</Link>
                    <Link href="/products" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Discover</Link>
                    {user && (
                        <>
                            <Link href="/wishlist" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Wishlist</Link>
                            <Link href="/orders" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Orders</Link>
                        </>
                    )}
                    {user?.role === 'admin' && (
                        <Link href="/admin" className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors">Admin</Link>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-300 hidden sm:block">{user.name}</span>
                            <button onClick={logout} className="text-sm text-gray-400 hover:text-white transition-colors">Logout</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors">Login</Link>
                            <Link href="/register" className="text-sm font-medium px-4 py-2 rounded-full bg-linear-to-r from-violet-500 to-cyan-400 text-white hover:opacity-90 transition-opacity">Register</Link>
                        </div>
                    )}
                    <Link href="/cart" className="relative p-2.5 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center group">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-white transition-colors">
                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        {totalItems > 0 && (
                            <span className="absolute top-1 right-1 bg-cyan-400 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)] border border-[#050505]">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
