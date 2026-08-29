'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
}

interface RecentOrder {
    _id: string;
    userId: { name: string; email: string };
    totalAmount: number;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const statusLabels: Record<string, string> = {
    pending: 'รอดำเนินการ',
    processing: 'กำลังเตรียม',
    shipped: 'จัดส่งแล้ว',
    delivered: 'ส่งถึงแล้ว',
    cancelled: 'ยกเลิก',
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalUsers: 0 });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/admin/dashboard');
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'ไม่สามารถโหลดข้อมูลได้');
            }
            const data = await res.json();
            setStats(data.stats);
            setRecentOrders(data.recentOrders);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass rounded-2xl p-6 text-center">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div>
                <h1 className="text-2xl font-bold text-white">แดชบอร์ด</h1>
                <p className="text-gray-400 text-sm mt-1">ภาพรวมระบบร้านค้า</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm">ยอดขายรวม</span>
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">฿{stats.totalRevenue.toLocaleString()}</p>
                </div>

                <div className="glass rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm">คำสั่งซื้อทั้งหมด</span>
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.totalOrders.toLocaleString()}</p>
                </div>

                <div className="glass rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm">สินค้าทั้งหมด</span>
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400">
                                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.totalProducts.toLocaleString()}</p>
                </div>

                <div className="glass rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-sm">สมาชิกทั้งหมด</span>
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
                </div>
            </div>

            <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">คำสั่งซื้อล่าสุด</h2>
                    <Link href="/admin/orders" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                        ดูทั้งหมด
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">ยังไม่มีคำสั่งซื้อ</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
                                    <th className="pb-3 pr-4">รหัส</th>
                                    <th className="pb-3 pr-4">ลูกค้า</th>
                                    <th className="pb-3 pr-4">ยอดรวม</th>
                                    <th className="pb-3 pr-4">สถานะ</th>
                                    <th className="pb-3">วันที่</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentOrders.map((order) => (
                                    <tr key={order._id} className="text-sm">
                                        <td className="py-3 pr-4">
                                            <span className="font-mono text-gray-400">#{order._id.slice(-6)}</span>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <div>
                                                <p className="text-white">{order.userId?.name || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{order.userId?.email}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4 text-white font-medium">
                                            ฿{order.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="py-3 pr-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[order.orderStatus] || statusColors.pending}`}>
                                                {statusLabels[order.orderStatus] || order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString('th-TH')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
