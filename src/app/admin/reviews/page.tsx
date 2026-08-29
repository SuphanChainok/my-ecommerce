import { requireAdmin } from '@/lib/serverAuth';
import AdminReviewsPage from './AdminReviewsPage';

export default async function AdminReviewsRoute() {
    await requireAdmin();
    return <AdminReviewsPage />;
}
