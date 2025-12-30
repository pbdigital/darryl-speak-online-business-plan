'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdminUser } from '@/types/admin';

interface UsersTableProps {
  users: AdminUser[];
}

const PAGE_SIZE = 20;

export function UsersTable({ users }: UsersTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [authFilter, setAuthFilter] = useState<string>('all');
  const [completionFilter, setCompletionFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesName =
          user.first_name?.toLowerCase().includes(searchLower) ||
          user.last_name?.toLowerCase().includes(searchLower);
        const matchesEmail = user.email?.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesEmail) return false;
      }

      // Auth provider filter
      if (authFilter !== 'all') {
        if (authFilter === 'wordpress' && user.auth_provider !== 'wordpress') return false;
        if (authFilter === 'email' && user.auth_provider === 'wordpress') return false;
      }

      // Completion filter
      if (completionFilter !== 'all') {
        const completion = user.sections_completed / user.total_sections;
        if (completionFilter === 'not-started' && user.has_plan) return false;
        if (completionFilter === 'in-progress' && (completion === 0 || completion === 1)) return false;
        if (completionFilter === 'completed' && completion !== 1) return false;
      }

      return true;
    });
  }, [users, search, authFilter, completionFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

  const handleRowClick = useCallback(
    (userId: string) => {
      router.push(`/admin/users/${userId}`);
    },
    [router]
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getCompletionBadge = (user: AdminUser) => {
    if (!user.has_plan) {
      return <Badge variant="outline">Not Started</Badge>;
    }
    const percentage = Math.round(
      (user.sections_completed / user.total_sections) * 100
    );
    if (percentage === 100) {
      return <Badge className="bg-green-100 text-green-800">Complete</Badge>;
    }
    return (
      <Badge variant="secondary">
        {percentage}% ({user.sections_completed}/{user.total_sections})
      </Badge>
    );
  };

  const getProviderBadge = (provider: string | null) => {
    if (provider === 'wordpress') {
      return <Badge className="bg-blue-100 text-blue-800">POWER AGENT®</Badge>;
    }
    return <Badge variant="outline">{provider || 'Email'}</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <Select
          value={authFilter}
          onValueChange={(value) => {
            setAuthFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Auth Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            <SelectItem value="wordpress">POWER AGENT® SSO</SelectItem>
            <SelectItem value="email">Email/OAuth</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={completionFilter}
          onValueChange={(value) => {
            setCompletionFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Completion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-600">
        Showing {paginatedUsers.length} of {filteredUsers.length} users
        {filteredUsers.length !== users.length && ` (filtered from ${users.length})`}
      </p>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Signed Up</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Plan Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(user.id)}
                >
                  <TableCell className="font-medium">
                    {user.first_name || user.last_name
                      ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                      : 'Unnamed'}
                    {user.is_admin && (
                      <Badge className="ml-2 bg-purple-100 text-purple-800" variant="secondary">
                        Admin
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.email || '-'}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                  <TableCell>{getProviderBadge(user.auth_provider)}</TableCell>
                  <TableCell>{getCompletionBadge(user)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
