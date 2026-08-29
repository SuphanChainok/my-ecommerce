import { requireAdmin } from '@/lib/serverAuth';
import AdminUsersPage from './AdminUsersPage';

export default async function AdminUsersRoute() {
    await requireAdmin();
    return <AdminUsersPage />;
}
