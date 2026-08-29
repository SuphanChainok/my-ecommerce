import { requireAdmin } from '@/lib/serverAuth';
import AdminProductsPage from './AdminProductsPage';

export default async function AdminProductsRoute() {
    await requireAdmin();
    return <AdminProductsPage />;
}
