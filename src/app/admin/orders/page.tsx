import { requireAdmin } from '@/lib/serverAuth';
import AdminOrdersPage from './AdminOrdersPage';

export default async function AdminOrdersRoute() {
    await requireAdmin();
    return <AdminOrdersPage />;
}
