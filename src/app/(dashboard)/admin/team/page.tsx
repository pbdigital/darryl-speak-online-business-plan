import { checkAdminAccess } from '@/lib/admin';
import { getAdminUsers } from '@/lib/api/admin-users-server';
import { redirect } from 'next/navigation';
import { AdminTeamTable } from '@/components/admin/admin-team-table';
import { AdminTeamMember } from '@/types/admin';

export default async function AdminTeamPage() {
  const { isAdmin, userId } = await checkAdminAccess();

  if (!userId) {
    redirect('/login');
  }

  if (!isAdmin) {
    redirect('/plan');
  }

  let admins: AdminTeamMember[] = [];
  let allUsers: Array<{
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  }> = [];

  try {
    const users = await getAdminUsers();
    admins = users
      .filter((user) => user.is_admin)
      .map((user) => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        admin_granted_at: user.admin_granted_at,
        granted_by_name: user.granted_by_name,
      }))
      .sort((a, b) =>
        (b.admin_granted_at ?? '').localeCompare(a.admin_granted_at ?? '')
      );
    allUsers = users
      .map(({ id, first_name, last_name, email }) => ({
        id,
        first_name,
        last_name,
        email,
      }))
      .sort((a, b) =>
        (a.first_name ?? '').localeCompare(b.first_name ?? '')
      );
  } catch (error) {
    console.error('Error fetching admin team:', error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Admin Team</h1>
        <p className="text-gray-600 mt-1">
          Manage who has admin access to the dashboard.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <AdminTeamTable
          admins={admins}
          currentUserId={userId}
          allUsers={allUsers}
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <h3 className="font-medium text-gray-900 mb-2">Admin Permissions</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>View all user accounts and their plan progress</li>
          <li>Reset user access (send password reset emails)</li>
          <li>Export user data as CSV</li>
          <li>Add or remove other admin users</li>
        </ul>
      </div>
    </div>
  );
}
