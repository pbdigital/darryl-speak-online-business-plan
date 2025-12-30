import { createClient } from '@/lib/supabase/server';
import { checkAdminAccess } from '@/lib/admin';
import { redirect } from 'next/navigation';
import { AdminTeamTable } from '@/components/admin/admin-team-table';
import { AdminTeamMember } from '@/types/admin';

async function getAdmins(): Promise<AdminTeamMember[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('admin_users_view')
    .select('id, first_name, last_name, email, admin_granted_at, granted_by_name')
    .eq('is_admin', true)
    .order('admin_granted_at', { ascending: false });

  if (error) {
    console.error('Error fetching admins:', error);
    return [];
  }

  return data as AdminTeamMember[];
}

async function getAllUsers(): Promise<Array<{ id: string; first_name: string | null; last_name: string | null; email: string | null }>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('admin_users_view')
    .select('id, first_name, last_name, email')
    .order('first_name', { ascending: true });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data;
}

export default async function AdminTeamPage() {
  const { isAdmin, userId } = await checkAdminAccess();

  if (!userId) {
    redirect('/login');
  }

  if (!isAdmin) {
    redirect('/plan');
  }

  const [admins, allUsers] = await Promise.all([
    getAdmins(),
    getAllUsers(),
  ]);

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
