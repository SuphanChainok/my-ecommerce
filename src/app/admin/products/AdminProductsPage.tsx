'use client';

import { useState, useEffect } from 'react';

interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string;
    stock: number;
    averageRating: number;
    reviewCount: number;
    createdAt: string;
}

interface ProductFormData {
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string;
    stock: number;
}

const emptyForm: ProductFormData = {
    name: '',
    price: 0,
    description: '',
    imageUrl: '',
    category: 'general',
    stock: 0,
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<ProductFormData>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/admin/products');
            if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลได้');
            const data = await res.json();
            setProducts(data.products);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setFormData(emptyForm);
        setShowModal(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            price: Number(product.price) || 0,
            description: product.description || '',
            imageUrl: product.imageUrl || '',
            category: product.category || 'general',
            stock: product.stock ?? 0,
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?')) return;

        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('ไม่สามารถลบสินค้าได้');
            setToast({ message: 'ลบสินค้าสำเร็จ', type: 'success' });
            fetchProducts();
        } catch (err: any) {
            setToast({ message: err.message, type: 'error' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = editingProduct ? `/api/admin/products/${editingProduct._id}` : '/api/admin/products';
            const method = editingProduct ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'ไม่สามารถบันทึกได้');
            }

            setToast({ message: editingProduct ? 'แก้ไขสินค้าสำเร็จ' : 'เพิ่มสินค้าสำเร็จ', type: 'success' });
            setShowModal(false);
            fetchProducts();
        } catch (err: any) {
            setToast({ message: err.message, type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const filteredProducts = products.filter((p) =>
        (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            {toast && (
                <div className={`fixed top-20 right-6 z-50 px-6 py-4 rounded-xl shadow-lg ${toast.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'} backdrop-blur-sm`}>
                    {toast.message}
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">จัดการสินค้า</h1>
                    <p className="text-gray-400 text-sm mt-1">ทั้งหมด {products.length} รายการ</p>
                </div>
                <button onClick={handleAdd} className="btn-premium px-5 py-2.5 text-sm font-semibold flex items-center gap-2 w-fit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    เพิ่มสินค้าใหม่
                </button>
            </div>

            <div className="glass rounded-xl p-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ค้นหาสินค้า..."
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-all"
                />
            </div>

            <div className="glass rounded-2xl overflow-hidden">
                {error ? (
                    <div className="p-6 text-center text-red-400">{error}</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">ไม่พบสินค้า</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-4">สินค้า</th>
                                    <th className="px-6 py-4">หมวดหมู่</th>
                                    <th className="px-6 py-4">ราคา</th>
                                    <th className="px-6 py-4">สต็อก</th>
                                    <th className="px-6 py-4">คะแนน</th>
                                    <th className="px-6 py-4 text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={product.imageUrl || 'https://placehold.co/50x50/111/444'} alt={product.name || 'สินค้า'} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                                                <div>
                                                    <p className="text-white font-medium line-clamp-1">{product.name || 'ไม่ระบุชื่อ'}</p>
                                                    <p className="text-xs text-gray-500 line-clamp-1">{product.description || '-'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs bg-white/5 text-gray-300 border border-white/10">
                                                {product.category || 'ไม่ระบุ'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-white font-medium">฿{(Number(product.price) || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`font-medium ${(product.stock ?? 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {product.stock ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                                                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                                <span className="text-sm text-gray-300">{(Number(product.averageRating) || 0).toFixed(1)}</span>
                                                <span className="text-xs text-gray-500">({product.reviewCount ?? 0})</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(product)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => handleDelete(product._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative w-full max-w-lg glass rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-white mb-6">
                            {editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">ชื่อสินค้า</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">ราคา (บาท)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        required
                                        min="0"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">สต็อก</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                        required
                                        min="0"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">หมวดหมู่</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">URL รูปภาพ</label>
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-all"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">คำอธิบาย</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-11 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors">
                                    ยกเลิก
                                </button>
                                <button type="submit" disabled={saving} className="flex-1 h-11 rounded-xl btn-premium flex items-center justify-center">
                                    {saving ? (
                                        <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        editingProduct ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
