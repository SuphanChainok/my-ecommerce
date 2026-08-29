'use client';

import { useState, useEffect } from 'react';

interface Review {
    _id: string;
    productId: { _id: string; name: string };
    userId: { _id: string; name: string; email: string };
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => { fetchReviews(); }, []);
    useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); } }, [toast]);

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/admin/reviews');
            if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลได้');
            const data = await res.json();
            setReviews(data.reviews);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('คุณต้องการลบรีวิวนี้ใช่หรือไม่?')) return;
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('ไม่สามารถลบรีวิวได้');
            setToast({ message: 'ลบรีวิวสำเร็จ', type: 'success' });
            fetchReviews();
        } catch (err: any) { setToast({ message: err.message, type: 'error' }); }
    };

    const filteredReviews = reviews.filter((r) => r.comment.toLowerCase().includes(search.toLowerCase()) || r.userName.toLowerCase().includes(search.toLowerCase()) || r.productId?.name?.toLowerCase().includes(search.toLowerCase()));

    const renderStars = (rating: number) => (
        <div className="flex items-center gap-0.5">{[1, 2, 3, 4, 5].map((star) => (<svg key={star} width="14" height="14" viewBox="0 0 24 24" fill={star <= rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={star <= rating ? 'text-yellow-400' : 'text-gray-600'}><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>))}</div>
    );

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-6 animate-fade-in-up">
            {toast && <div className={`fixed top-20 right-6 z-50 px-6 py-4 rounded-xl shadow-lg ${toast.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'} backdrop-blur-sm`}>{toast.message}</div>}
            <div><h1 className="text-2xl font-bold text-white">จัดการรีวิว</h1><p className="text-gray-400 text-sm mt-1">ทั้งหมด {reviews.length} รายการ</p></div>
            <div className="glass rounded-xl p-4"><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหารีวิว..." className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-all" /></div>
            <div className="space-y-4">
                {error ? <div className="glass rounded-2xl p-6 text-center text-red-400">{error}</div> : filteredReviews.length === 0 ? <div className="glass rounded-2xl p-6 text-center text-gray-500">ไม่พบรีวิว</div> : (
                    filteredReviews.map((review) => (
                        <div key={review._id} className="glass rounded-2xl p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2"><div className="w-8 h-8 rounded-full bg-linear-to-tr from-violet-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs">{review.userName.charAt(0).toUpperCase()}</div><div><p className="text-white font-medium text-sm">{review.userName}</p><p className="text-xs text-gray-500">{review.userId?.email}</p></div></div>
                                    <div className="flex items-center gap-2 mb-2">{renderStars(review.rating)}<span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('th-TH')}</span></div>
                                    <p className="text-gray-300 text-sm mb-2">{review.comment}</p>
                                    <p className="text-xs text-gray-500">สินค้า: <span className="text-violet-400">{review.productId?.name || 'N/A'}</span></p>
                                </div>
                                <button onClick={() => handleDelete(review._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
