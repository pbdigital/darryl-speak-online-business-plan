'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { grantAdmin } from '@/lib/api/admin-team';

interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

interface GrantAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: User[];
}

export function GrantAdminDialog({ open, onOpenChange, users }: GrantAdminDialogProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    if (!search) return users.slice(0, 10);
    const searchLower = search.toLowerCase();
    return users
      .filter((user) => {
        const name = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
        const email = user.email?.toLowerCase() || '';
        return name.includes(searchLower) || email.includes(searchLower);
      })
      .slice(0, 10);
  }, [users, search]);

  const getName = (user: User) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.email || 'Unnamed';
  };

  const handleGrant = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    setError(null);

    const response = await grantAdmin(selectedUser.id);

    if (response.success) {
      onOpenChange(false);
      setSelectedUser(null);
      setSearch('');
      router.refresh();
    } else {
      setError(response.errors?.[0]?.message || 'Failed to grant admin access');
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedUser(null);
    setSearch('');
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Admin</DialogTitle>
          <DialogDescription>
            Search for a user to grant admin access. They will be able to manage users and the admin team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedUser(null);
            }}
            autoFocus
          />

          {selectedUser ? (
            <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
              <p className="font-medium">{getName(selectedUser)}</p>
              <p className="text-sm text-gray-600">{selectedUser.email}</p>
            </div>
          ) : (
            <div className="max-h-[200px] overflow-y-auto border rounded-lg divide-y">
              {filteredUsers.length === 0 ? (
                <p className="p-3 text-sm text-gray-500 text-center">
                  {search ? 'No users found' : 'Start typing to search users'}
                </p>
              ) : (
                filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedUser(user)}
                  >
                    <p className="font-medium">{getName(user)}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </button>
                ))
              )}
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleGrant} disabled={!selectedUser || isLoading}>
            {isLoading ? 'Granting...' : 'Grant Admin Access'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
