'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface Order {
    _id: string;
    items: { name: string; price: number; quantity: number }[];
    totalAmount: number;
    paymentStatus: string;
    orderStatus: string;
    trackingNumber?: string;
    createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        paid: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        pending: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        shipped: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
        delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    const labels: Record<string, string> = {
        paid: 'ชำระแล้ว',
        pending: 'รอชำระเงิน',
        processing: 'กำลังจัดส่ง',
        shipped: 'จัดส่งแล้ว',
        delivered: 'ส่งถึงแล้ว',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
            {labels[status] || status}
        </span>
    );
}

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetch('/api/orders')
            .then((r) => r.ok ? r.json() : Promise.reject())
            .then((data) => {
                setOrders(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [user]);

    if (authLoading) {
        return (
            <div className="page-container mt-10 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/10 border-t-cyan-400 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="page-container mt-10 text-center">
                <div className="glass p-16 rounded-3xl inline-block border-white/10 shadow-2xl">
                    <h2 className="text-3xl font-bold text-white mb-6">กรุณาเข้าสู่ระบบ</h2>
                    <p className="text-gray-400 mb-8">คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถดูประวัติคำสั่งซื้อได้</p>
                    <Link href="/" className="btn-premium inline-block px-8 py-3">กลับหน้าหลัก</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10 tracking-tight">ประวัติคำสั่งซื้อ</h1>
            {loading ? (
                <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="glass rounded-3xl p-8 border-white/10">
                            <div className="skeleton h-8 w-48 mb-6 rounded" />
                            <div className="skeleton h-4 w-full mb-4 rounded" />
                            <div className="skeleton h-4 w-3/4 rounded" />
                        </div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="glass rounded-3xl p-16 text-center border-white/10">
                    <p className="text-gray-400 text-xl font-light mb-6">ยังไม่มีคำสั่งซื้อ</p>
                    <Link href="/products" className="btn-premium inline-block px-8 py-3">เลือกซื้อสินค้า</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="glass rounded-3xl p-8 border-white/10 hover:border-white/20 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <p className="text-xs text-gray-500 font-mono mb-1">Order ID: {order._id}</p>
                                    <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString('th-TH')}</p>
                                </div>
                                <div className="flex gap-2">
                                    <StatusBadge status={order.paymentStatus} />
                                    <StatusBadge status={order.orderStatus} />
                                </div>
                            </div>
                            <div className="space-y-4 mb-6">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0">
                                        <div>
                                            <p className="text-white font-medium">{item.name}</p>
                                            <p className="text-gray-500 text-sm">x{item.quantity}</p>
                                        </div>
                                        <span className="text-cyan-400 font-bold">฿{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div>
                                    <span className="text-gray-400 text-sm">ยอดรวม </span>
                                    <span className="text-2xl font-extrabold text-gradient">฿{order.totalAmount.toLocaleString()}</span>
                                </div>
                                {order.trackingNumber && (
                                    <div className="text-right">
                                        <span className="text-xs text-gray-500 block">Tracking Number</span>
                                        <span className="text-white font-mono text-sm">{order.trackingNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
