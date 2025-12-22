import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

async function getAdminStats() {
  const supabase = await createClient();

  // Get total users count
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // Get users signed up this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const { count: usersThisWeek } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', oneWeekAgo.toISOString());

  // Get total business plans
  const { count: totalPlans } = await supabase
    .from('business_plans')
    .select('*', { count: 'exact', head: true });

  // Get recent signups (last 5)
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    totalUsers: totalUsers ?? 0,
    usersThisWeek: usersThisWeek ?? 0,
    totalPlans: totalPlans ?? 0,
    recentUsers: recentUsers ?? [],
  };
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of platform activity and users
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              New This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{stats.usersThisWeek}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Business Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPlans}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/admin/users"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <p className="font-medium text-gray-900">View All Users</p>
              <p className="text-sm text-gray-600">
                Search, filter, and manage user accounts
              </p>
            </Link>
            <Link
              href="/admin/users?export=true"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <p className="font-medium text-gray-900">Export User Data</p>
              <p className="text-sm text-gray-600">
                Download user list as CSV
              </p>
            </Link>
            <Link
              href="/admin/team"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <p className="font-medium text-gray-900">Manage Admin Team</p>
              <p className="text-sm text-gray-600">
                Add or remove admin access
              </p>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentUsers.length === 0 ? (
              <p className="text-gray-600 text-sm">No users yet</p>
            ) : (
              <ul className="space-y-3">
                {stats.recentUsers.map((user) => (
                  <li key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : 'Unnamed User'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
