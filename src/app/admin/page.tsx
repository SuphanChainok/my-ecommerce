import { requireAdmin } from '@/lib/serverAuth';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
    await requireAdmin();
    return <AdminDashboard />;
}
