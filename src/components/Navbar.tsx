'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { totalItems } = useCart();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

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

                {/* Desktop Navigation */}
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
                        <div className="hidden md:flex items-center gap-4">
                            <span className="text-sm text-gray-300 hidden sm:block">{user.name}</span>
                            <button onClick={logout} className="text-sm text-gray-400 hover:text-white transition-colors">Logout</button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
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

                    {/* Hamburger Menu Button - Mobile Only */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 animate-fade-in-up">
                    <div className="px-6 py-4 space-y-1">
                        <Link href="/" onClick={closeMobileMenu} className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                            Home
                        </Link>
                        <Link href="/products" onClick={closeMobileMenu} className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                            Discover
                        </Link>
                        {user && (
                            <>
                                <Link href="/wishlist" onClick={closeMobileMenu} className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                                    Wishlist
                                </Link>
                                <Link href="/orders" onClick={closeMobileMenu} className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                                    Orders
                                </Link>
                            </>
                        )}
                        {user?.role === 'admin' && (
                            <Link href="/admin" onClick={closeMobileMenu} className="block px-4 py-3 rounded-lg text-violet-400 hover:text-violet-300 hover:bg-white/5 transition-colors">
                                Admin
                            </Link>
                        )}

                        <div className="border-t border-white/5 pt-3 mt-3">
                            {user ? (
                                <div className="space-y-1">
                                    <div className="px-4 py-2 text-sm text-gray-400">
                                        สวัสดี, <span className="text-white font-medium">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={() => { logout(); closeMobileMenu(); }}
                                        className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <Link href="/login" onClick={closeMobileMenu} className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                                        Login
                                    </Link>
                                    <Link href="/register" onClick={closeMobileMenu} className="block px-4 py-3 rounded-lg text-center bg-linear-to-r from-violet-500 to-cyan-400 text-white font-medium">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
