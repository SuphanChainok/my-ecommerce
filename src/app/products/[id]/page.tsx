'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

function Toast({ message, onHide }: { message: string; onHide: () => void }) {
    const [hiding, setHiding] = useState(false);
    useEffect(() => {
        const t1 = setTimeout(() => setHiding(true), 2500);
        const t2 = setTimeout(() => onHide(), 2800);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [onHide]);
    return (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass border-cyan-500/50 px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 ${hiding ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">✓</div>
            <span className="text-white font-medium text-sm">{message}</span>
        </div>
    );
}

interface Product {
    _id: string;
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
    stock: number;
    category?: string;
    averageRating?: number;
    reviewCount?: number;
}

interface Review {
    _id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

function StarRating({ rating, onRate, readonly }: { rating: number; onRate?: (r: number) => void; readonly?: boolean }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => onRate && onRate(star)}
                    onMouseEnter={() => !readonly && setHover(star)}
                    onMouseLeave={() => !readonly && setHover(0)}
                    className={`text-xl transition-colors ${(hover || rating) >= star ? 'text-yellow-400' : 'text-gray-600'} ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { addToCart } = useCart();
    const router = useRouter();
    const { user } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [qty, setQty] = useState(1);
    const [toast, setToast] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then((r) => r.json())
            .then((data) => {
                if (data && !data.error) setProduct(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (!product) return;
        fetch(`/api/reviews?productId=${product._id}`)
            .then((r) => r.ok ? r.json() : Promise.reject())
            .then((data) => setReviews(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, [product]);

    const handleAddToCart = () => {
        if (!product || product.stock <= 0) return;
        addToCart(product, qty);
        setToast(`Added ${qty}x ${product.name} to cart`);
    };

    const handleBuyNow = () => {
        if (!product || product.stock <= 0) return;
        addToCart(product, qty);
        router.push('/cart');
    };

    const handleSubmitReview = async () => {
        if (!user || !product || !reviewText.trim()) return;
        setReviewLoading(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product._id, userName: user.name, rating: reviewRating, comment: reviewText }),
            });
            const data = await res.json();
            if (res.ok) {
                setReviews((prev) => [data, ...prev]);
                setReviewText('');
                setReviewRating(5);
                setToast('ให้คะแนนเรียบร้อยแล้ว');
                // Refresh product to update avg rating
                fetch(`/api/products/${id}`).then((r) => r.json()).then((data) => {
                    if (data && !data.error) setProduct(data);
                });
            } else {
                alert(data.error || 'เกิดข้อผิดพลาด');
            }
        } catch {
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
        setReviewLoading(false);
    };

    if (loading) return (
        <div className="page-container mt-10">
            <div className="glass rounded-3xl p-8 h-150 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/10 border-t-cyan-400 rounded-full animate-spin"></div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="page-container mt-10 text-center">
            <div className="glass p-16 rounded-3xl inline-block border-white/10 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-6">Product Not Found</h2>
                <Link href="/" className="btn-glass inline-block px-8 py-3 text-lg">Return to Collection</Link>
            </div>
        </div>
    );

    const inStock = product.stock > 0;

    return (
        <div className="page-container animate-fade-in-up">
            {toast && <Toast message={toast} onHide={() => setToast('')} />}

            <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group font-medium tracking-wide">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-x-1 transition-transform"><path d="M15 18l-6-6 6-6"/></svg>
                Back to Collection
            </Link>

            <div className="glass rounded-[2.5rem] overflow-hidden border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Left: Image */}
                    <div className="relative p-8 lg:p-16 flex items-center justify-center bg-linear-to-br from-white/5 to-transparent border-b lg:border-b-0 lg:border-r border-white/5">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-violet-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                        <img
                            src={product.imageUrl || 'https://placehold.co/600x600/111/444'}
                            alt={product.name}
                            className="w-full max-w-md aspect-square object-cover rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 border border-white/10 transition-transform duration-500 hover:scale-105"
                        />
                    </div>

                    {/* Right: Info */}
                    <div className="p-8 lg:p-16 flex flex-col justify-center relative">
                        <div className={`inline-block px-4 py-1.5 rounded-full border ${product.stock > 0 ? (product.stock < 10 ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400') : 'bg-red-500/10 border-red-500/30 text-red-400'} text-xs font-bold tracking-widest uppercase mb-6 w-fit backdrop-blur-md`}>
                            {product.stock > 0 ? (product.stock < 10 ? 'Low Stock' : 'In Stock') : 'Sold Out'}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-5xl font-bold text-gradient">
                                ฿{product.price.toLocaleString()}
                            </span>
                        </div>

                        {product.averageRating !== undefined && product.averageRating > 0 && (
                            <div className="flex items-center gap-2 mb-6">
                                <StarRating rating={Math.round(product.averageRating)} readonly />
                                <span className="text-yellow-400 font-bold">{product.averageRating}</span>
                                <span className="text-gray-500 text-sm">({product.reviewCount} รีวิว)</span>
                            </div>
                        )}

                        <div className="w-full h-px bg-linear-to-r from-white/10 to-transparent mb-10"></div>

                        <div className="mb-10">
                            <h3 className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-4">Overview</h3>
                            <p className="text-gray-300 leading-relaxed font-light text-lg">
                                {product.description || 'Elevate your experience with this premium product, designed with cutting-edge technology and unparalleled aesthetics. Perfect for the modern connoisseur.'}
                            </p>
                        </div>

                        {/* Quantity */}
                        <div className="mb-12 flex items-center gap-6">
                            <h3 className="text-sm text-gray-400 uppercase tracking-widest font-bold">Quantity</h3>
                            <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 shadow-inner">
                                <button
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition disabled:opacity-30 disabled:hover:bg-transparent"
                                    onClick={() => setQty(q => Math.max(1, q-1))}
                                    disabled={qty <= 1}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </button>
                                <span className="w-14 text-center text-white font-bold text-lg">{qty}</span>
                                <button
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition disabled:opacity-30 disabled:hover:bg-transparent"
                                    onClick={() => setQty(q => Math.min(product.stock, q+1))}
                                    disabled={qty >= product.stock}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </button>
                            </div>
                            <span className="text-sm text-gray-500 font-medium tracking-wide">
                                {product.stock} available
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-5 mt-auto">
                            <button
                                onClick={handleAddToCart}
                                disabled={!inStock}
                                className="btn-glass flex-1 flex justify-center items-center gap-3 h-16 text-lg font-bold tracking-wide disabled:opacity-50"
                            >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={!inStock}
                                className="btn-premium flex-1 h-16 text-lg font-bold tracking-wide shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16 glass rounded-[2.5rem] p-8 md:p-12 border-white/10">
                <h2 className="text-3xl font-extrabold text-white mb-8 tracking-tight">รีวิวสินค้า</h2>

                {/* Review Form */}
                {user ? (
                    <div className="bg-white/5 rounded-2xl p-6 mb-10 border border-white/10">
                        <h3 className="text-white font-bold mb-4">ให้คะแนนสินค้านี้</h3>
                        <div className="flex items-center gap-4 mb-4">
                            <StarRating rating={reviewRating} onRate={setReviewRating} />
                            <span className="text-gray-400 text-sm">{reviewRating} / 5</span>
                        </div>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="แบ่งปันประสบการณ์ของคุณ..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none h-24 mb-4"
                        />
                        <button
                            onClick={handleSubmitReview}
                            disabled={reviewLoading || !reviewText.trim()}
                            className="btn-premium px-8 py-3 disabled:opacity-50"
                        >
                            {reviewLoading ? 'กำลังบันทึก...' : 'ส่งรีวิว'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-white/5 rounded-2xl p-6 mb-10 border border-white/10 text-center">
                        <p className="text-gray-400">กรุณา<a href="/" className="text-cyan-400 hover:underline mx-1">เข้าสู่ระบบ</a>เพื่อให้คะแนนสินค้า</p>
                    </div>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">ยังไม่มีรีวิวสำหรับสินค้านี้</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
                                            {review.userName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{review.userName}</p>
                                            <p className="text-gray-500 text-xs">{new Date(review.createdAt).toLocaleDateString('th-TH')}</p>
                                        </div>
                                    </div>
                                    <StarRating rating={review.rating} readonly />
                                </div>
                                <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
