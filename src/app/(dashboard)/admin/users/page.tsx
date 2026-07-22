import { getAdminUsers } from '@/lib/api/admin-users-server';
import { UsersTable } from '@/components/admin/users-table';
import { AdminUser } from '@/types/admin';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AdminUsersPage() {
  let users: AdminUser[] = [];

  try {
    users = await getAdminUsers();
  } catch (error) {
    console.error('Error fetching users:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">
            Manage user accounts and view their progress
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/users/export">Export CSV</Link>
        </Button>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
