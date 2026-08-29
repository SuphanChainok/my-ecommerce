'use client';

import { useState, useEffect } from 'react';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => { fetchUsers(); }, []);
    useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); } }, [toast]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลได้');
            const data = await res.json();
            setUsers(data.users);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/users/${userId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: newRole }) });
            if (!res.ok) throw new Error('ไม่สามารถอัปเดต Role ได้');
            setToast({ message: 'อัปเดต Role สำเร็จ', type: 'success' });
            fetchUsers();
        } catch (err: any) { setToast({ message: err.message, type: 'error' }); }
        finally { setSaving(false); }
    };

    const filteredUsers = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-6 animate-fade-in-up">
            {toast && <div className={`fixed top-20 right-6 z-50 px-6 py-4 rounded-xl shadow-lg ${toast.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'} backdrop-blur-sm`}>{toast.message}</div>}
            <div><h1 className="text-2xl font-bold text-white">จัดการสมาชิก</h1><p className="text-gray-400 text-sm mt-1">ทั้งหมด {users.length} คน</p></div>
            <div className="glass rounded-xl p-4"><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาสมาชิก..." className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-all" /></div>
            <div className="glass rounded-2xl overflow-hidden">
                {error ? <div className="p-6 text-center text-red-400">{error}</div> : filteredUsers.length === 0 ? <div className="p-6 text-center text-gray-500">ไม่พบสมาชิก</div> : (
                    <div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-white/5 bg-white/[0.02]"><th className="px-6 py-4">สมาชิก</th><th className="px-6 py-4">อีเมล</th><th className="px-6 py-4">โทรศัพท์</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">วันที่สมัคร</th><th className="px-6 py-4 text-right">จัดการ</th></tr></thead><tbody className="divide-y divide-white/5">{filteredUsers.map((user) => (<tr key={user._id} className="hover:bg-white/[0.02] transition-colors"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-linear-to-tr from-violet-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">{user.name.charAt(0).toUpperCase()}</div><p className="text-white font-medium">{user.name}</p></div></td><td className="px-6 py-4 text-gray-400">{user.email}</td><td className="px-6 py-4 text-gray-400">{user.phone || '-'}</td><td className="px-6 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${user.role === 'admin' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : 'bg-white/5 text-gray-300 border-white/10'}`}>{user.role === 'admin' ? 'Admin' : 'User'}</span></td><td className="px-6 py-4 text-gray-400 text-sm">{new Date(user.createdAt).toLocaleDateString('th-TH')}</td><td className="px-6 py-4"><select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value as 'user' | 'admin')} disabled={saving} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all cursor-pointer"><option value="user" className="bg-[#0a0a0a]">User</option><option value="admin" className="bg-[#0a0a0a]">Admin</option></select></td></tr>))}</tbody></table></div>
                )}
            </div>
        </div>
    );
}
