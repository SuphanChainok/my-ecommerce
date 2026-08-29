'use client';

import { useState, useEffect } from 'react';

interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

interface ShippingAddress {
    fullName: string;
    phone: string;
    address: string;
    subdistrict: string;
    district: string;
    province: string;
    postalCode: string;
}

interface Order {
    _id: string;
    userId: { name: string; email: string };
    items: OrderItem[];
    totalAmount: number;
    paymentStatus: string;
    orderStatus: string;
    shippingAddress: ShippingAddress;
    trackingNumber: string;
    createdAt: string;
}

const statusOptions = [
    { value: 'pending', label: 'รอดำเนินการ', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    { value: 'processing', label: 'กำลังเตรียม', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { value: 'shipped', label: 'จัดส่งแล้ว', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    { value: 'delivered', label: 'ส่งถึงแล้ว', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
    { value: 'cancelled', label: 'ยกเลิก', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
];

const filterOptions = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'pending', label: 'รอดำเนินการ' },
    { value: 'processing', label: 'กำลังเตรียม' },
    { value: 'shipped', label: 'จัดส่งแล้ว' },
    { value: 'delivered', label: 'ส่งถึงแล้ว' },
    { value: 'cancelled', label: 'ยกเลิก' },
];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [editingTracking, setEditingTracking] = useState('');
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => { fetchOrders(); }, [filter]);
    useEffect(() => {
        if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
    }, [toast]);

    const fetchOrders = async () => {
        try {
            const url = filter === 'all' ? '/api/admin/orders' : `/api/admin/orders?status=${filter}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลได้');
            const data = await res.json();
            setOrders(data.orders);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderStatus: newStatus }),
            });
            if (!res.ok) throw new Error('ไม่สามารถอัปเดตสถานะได้');
            setToast({ message: 'อัปเดตสถานะสำเร็จ', type: 'success' });
            fetchOrders();
            if (selectedOrder?._id === orderId) setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        } catch (err: any) { setToast({ message: err.message, type: 'error' }); }
        finally { setSaving(false); }
    };

    const handleTrackingUpdate = async (orderId: string) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trackingNumber: editingTracking }),
            });
            if (!res.ok) throw new Error('ไม่สามารถอัปเดตเลขพัสดุได้');
            setToast({ message: 'อัปเดตเลขพัสดุสำเร็จ', type: 'success' });
            fetchOrders();
            if (selectedOrder?._id === orderId) setSelectedOrder({ ...selectedOrder, trackingNumber: editingTracking });
        } catch (err: any) { setToast({ message: err.message, type: 'error' }); }
        finally { setSaving(false); }
    };

    const getStatusColor = (s: string) => statusOptions.find((o) => o.value === s)?.color || 'bg-gray-500/10 text-gray-400';
    const getStatusLabel = (s: string) => statusOptions.find((o) => o.value === s)?.label || s;

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-6 animate-fade-in-up">
            {toast && <div className={`fixed top-20 right-6 z-50 px-6 py-4 rounded-xl shadow-lg ${toast.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'} backdrop-blur-sm`}>{toast.message}</div>}
            <div><h1 className="text-2xl font-bold text-white">จัดการคำสั่งซื้อ</h1><p className="text-gray-400 text-sm mt-1">ทั้งหมด {orders.length} รายการ</p></div>
            <div className="flex flex-wrap gap-2">
                {filterOptions.map((opt) => (
                    <button key={opt.value} onClick={() => setFilter(opt.value)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === opt.value ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}>{opt.label}</button>
                ))}
            </div>
            <div className="glass rounded-2xl overflow-hidden">
                {error ? <div className="p-6 text-center text-red-400">{error}</div> : orders.length === 0 ? <div className="p-6 text-center text-gray-500">ไม่พบคำสั่งซื้อ</div> : (
                    <div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-white/5 bg-white/[0.02]"><th className="px-6 py-4">รหัส</th><th className="px-6 py-4">ลูกค้า</th><th className="px-6 py-4">ยอดรวม</th><th className="px-6 py-4">สถานะ</th><th className="px-6 py-4">เลขพัสดุ</th><th className="px-6 py-4">วันที่</th><th className="px-6 py-4 text-right">จัดการ</th></tr></thead><tbody className="divide-y divide-white/5">{orders.map((order) => (<tr key={order._id} className="hover:bg-white/[0.02] transition-colors"><td className="px-6 py-4"><span className="font-mono text-gray-400">#{order._id.slice(-6)}</span></td><td className="px-6 py-4"><p className="text-white">{order.userId?.name || 'N/A'}</p><p className="text-xs text-gray-500">{order.userId?.email}</p></td><td className="px-6 py-4 text-white font-medium">฿{order.totalAmount.toLocaleString()}</td><td className="px-6 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>{getStatusLabel(order.orderStatus)}</span></td><td className="px-6 py-4 text-gray-400 text-sm">{order.trackingNumber || '-'}</td><td className="px-6 py-4 text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString('th-TH')}</td><td className="px-6 py-4"><button onClick={() => setSelectedOrder(order)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button></td></tr>))}</tbody></table></div>
                )}
            </div>
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="absolute inset-0" onClick={() => setSelectedOrder(null)} />
                    <div className="relative max-w-xl w-full bg-zinc-900 text-white rounded-2xl border border-zinc-800 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white">
                                รายละเอียดคำสั่งซื้อ <span className="text-violet-400">#{selectedOrder._id.slice(-6)}</span>
                            </h2>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Customer & Shipping Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">ข้อมูลลูกค้า</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-xs text-zinc-500">ชื่อ</p>
                                            <p className="text-sm text-white">{selectedOrder.userId?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500">อีเมล</p>
                                            <p className="text-sm text-zinc-300">{selectedOrder.userId?.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">ข้อมูลจัดส่ง</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-xs text-zinc-500">ผู้รับ</p>
                                            <p className="text-sm text-white">{selectedOrder.shippingAddress?.fullName || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500">ที่อยู่</p>
                                            <p className="text-sm text-zinc-300">
                                                {selectedOrder.shippingAddress?.address || '-'}
                                            </p>
                                            <p className="text-sm text-zinc-300">
                                                {selectedOrder.shippingAddress?.subdistrict || '-'}, {selectedOrder.shippingAddress?.district || '-'}
                                            </p>
                                            <p className="text-sm text-zinc-300">
                                                {selectedOrder.shippingAddress?.province || '-'} {selectedOrder.shippingAddress?.postalCode || ''}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500">โทรศัพท์</p>
                                            <p className="text-sm text-zinc-300">{selectedOrder.shippingAddress?.phone || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product List */}
                            <div>
                                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">รายการสินค้า</h3>
                                <div className="rounded-xl border border-zinc-700/50 overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-zinc-800/50 text-xs text-zinc-500 uppercase tracking-wider">
                                                <th className="px-4 py-2.5 text-left">สินค้า</th>
                                                <th className="px-4 py-2.5 text-center">จำนวน</th>
                                                <th className="px-4 py-2.5 text-right">ราคารวม</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-800">
                                            {selectedOrder.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={item.imageUrl || 'https://placehold.co/40x40/292524/737373?text=IMG'}
                                                                alt={item.name || 'สินค้า'}
                                                                className="w-10 h-10 rounded-lg object-cover border border-zinc-700"
                                                            />
                                                            <span className="text-sm text-white">{item.name || 'สินค้า'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-zinc-400 text-center">x{item.quantity}</td>
                                                    <td className="px-4 py-3 text-sm text-white text-right font-medium">฿{((Number(item.price) || 0) * item.quantity).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Total Amount */}
                                <div className="mt-3 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-between">
                                    <span className="text-sm font-medium text-zinc-300">ยอดรวมทั้งหมด</span>
                                    <span className="text-xl font-bold text-violet-400">฿{(Number(selectedOrder.totalAmount) || 0).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Payment & Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">การชำระเงิน</h3>
                                    <p className={`text-sm font-medium ${selectedOrder.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {selectedOrder.paymentStatus === 'paid' ? 'ชำระสำเร็จ via Stripe' : 'รอชำระเงิน'}
                                    </p>
                                    {selectedOrder.trackingNumber && (
                                        <p className="text-xs text-zinc-500 mt-1">เลขพัสดุ: {selectedOrder.trackingNumber}</p>
                                    )}
                                </div>
                                <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">สถานะคำสั่งซื้อ</h3>
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.orderStatus)}`}>
                                        {getStatusLabel(selectedOrder.orderStatus)}
                                    </span>
                                    <p className="text-xs text-zinc-500 mt-2">
                                        {new Date(selectedOrder.createdAt).toLocaleString('th-TH')}
                                    </p>
                                </div>
                            </div>

                            {/* Status Change & Tracking */}
                            <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">อัปเดตสถานะ & เลขพัสดุ</h3>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {statusOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleStatusChange(selectedOrder._id, opt.value)}
                                            disabled={saving || selectedOrder.orderStatus === opt.value}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                                selectedOrder.orderStatus === opt.value
                                                    ? opt.color
                                                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={editingTracking !== '' ? editingTracking : selectedOrder.trackingNumber || ''}
                                        onChange={(e) => setEditingTracking(e.target.value)}
                                        placeholder="กรอกเลขพัสดุ..."
                                        className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 transition-all"
                                    />
                                    <button
                                        onClick={() => handleTrackingUpdate(selectedOrder._id)}
                                        disabled={saving}
                                        className="px-4 py-2 rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/30 hover:bg-violet-500/30 transition-colors text-sm font-medium"
                                    >
                                        บันทึก
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="mt-6 w-full h-11 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors font-medium text-sm"
                        >
                            ปิด
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
