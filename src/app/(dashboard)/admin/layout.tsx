import { redirect } from 'next/navigation';
import { checkAdminAccess, getAdminProfile } from '@/lib/admin';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const { isAdmin, userId } = await checkAdminAccess();

  if (!userId) {
    redirect('/login');
  }

  if (!isAdmin) {
    redirect('/plan');
  }

  const profile = await getAdminProfile();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-[#1a2744] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="font-semibold text-lg">
                Admin Dashboard
              </Link>
              <nav className="hidden md:flex items-center gap-4">
                <Link
                  href="/admin"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Overview
                </Link>
                <Link
                  href="/admin/users"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Users
                </Link>
                <Link
                  href="/admin/team"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Admin Team
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">
                {profile?.firstName || profile?.email}
              </span>
              <Link
                href="/plan"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Back to Plan
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
