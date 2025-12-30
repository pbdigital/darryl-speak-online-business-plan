'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminTeamMember } from '@/types/admin';
import { GrantAdminDialog } from './grant-admin-dialog';
import { RevokeAdminDialog } from './revoke-admin-dialog';

interface AdminTeamTableProps {
  admins: AdminTeamMember[];
  currentUserId: string;
  allUsers: Array<{ id: string; first_name: string | null; last_name: string | null; email: string | null }>;
}

export function AdminTeamTable({ admins, currentUserId, allUsers }: AdminTeamTableProps) {
  const [showGrantDialog, setShowGrantDialog] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<AdminTeamMember | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getName = (admin: AdminTeamMember) => {
    if (admin.first_name || admin.last_name) {
      return `${admin.first_name || ''} ${admin.last_name || ''}`.trim();
    }
    return admin.email || 'Unnamed';
  };

  // Filter out users who are already admins for the grant dialog
  const nonAdminUsers = allUsers.filter(
    (user) => !admins.some((admin) => admin.id === user.id)
  );

  const isLastAdmin = admins.length <= 1;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {admins.length} admin{admins.length !== 1 ? 's' : ''}
        </p>
        <Button onClick={() => setShowGrantDialog(true)}>
          Add Admin
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Granted</TableHead>
              <TableHead>Granted By</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No admins found
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">
                    {getName(admin)}
                    {admin.id === currentUserId && (
                      <Badge className="ml-2 bg-blue-100 text-blue-800" variant="secondary">
                        You
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{admin.email || '-'}</TableCell>
                  <TableCell>{formatDate(admin.admin_granted_at)}</TableCell>
                  <TableCell>{admin.granted_by_name || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => setRevokeTarget(admin)}
                      disabled={isLastAdmin}
                      title={isLastAdmin ? 'Cannot remove the last admin' : 'Remove admin access'}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <GrantAdminDialog
        open={showGrantDialog}
        onOpenChange={setShowGrantDialog}
        users={nonAdminUsers}
      />

      <RevokeAdminDialog
        admin={revokeTarget}
        onClose={() => setRevokeTarget(null)}
        isSelf={revokeTarget?.id === currentUserId}
      />
    </div>
  );
}
