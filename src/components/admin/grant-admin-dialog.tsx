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
import { grantAdmin, grantAdminByEmail } from '@/lib/api/admin-team';
import { createClient } from '@/lib/supabase/client';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [invited, setInvited] = useState<string | null>(null);

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

  const typedEmail = search.trim().toLowerCase();
  // Offer to create an account when the search is an email nobody has yet.
  const canCreate =
    !selectedUser &&
    EMAIL_PATTERN.test(typedEmail) &&
    !users.some((user) => user.email?.toLowerCase() === typedEmail);

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

  const handleCreate = async () => {
    setIsLoading(true);
    setError(null);

    const response = await grantAdminByEmail({
      email: typedEmail,
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
    });

    if (!response.success) {
      setError(response.errors?.[0]?.message || 'Failed to create the admin account');
      setIsLoading(false);
      return;
    }

    // The same email as "Forgot password", so they choose their own password
    // and nobody has to send one.
    const supabase = createClient();
    const { error: emailError } = await supabase.auth.resetPasswordForEmail(typedEmail, {
      redirectTo: `${window.location.origin}/api/auth/confirm?next=/reset-password`,
    });

    setIsLoading(false);
    if (emailError) {
      setError(
        `The admin account was created, but the set-password email failed: ${emailError.message}. They can use "Forgot password" on the log in page.`
      );
      router.refresh();
      return;
    }

    setInvited(typedEmail);
    router.refresh();
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedUser(null);
    setSearch('');
    setError(null);
    setFirstName('');
    setLastName('');
    setInvited(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Admin</DialogTitle>
          <DialogDescription>
            Search for a user, or type the email of someone without an account. Admins can see
            every user and the free plan report, and manage the admin team.
          </DialogDescription>
        </DialogHeader>

        {invited ? (
          <div className="space-y-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
            <p className="font-medium">Admin account created for {invited}</p>
            <p>
              We&apos;ve emailed them a link to choose their password. Then they log in with
              email at the usual log in page and open the Admin Dashboard.
            </p>
          </div>
        ) : (
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
              {filteredUsers.length === 0 && !canCreate ? (
                <p className="p-3 text-sm text-gray-500 text-center">
                  {search ? 'No users found. Type their full email to create an admin account.' : 'Start typing to search users'}
                </p>
              ) : filteredUsers.length === 0 ? null : (
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

          {canCreate && (
            <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm text-gray-700">
                No account for <span className="font-medium">{typedEmail}</span> yet. Create one
                as an admin and email them a link to set their password.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="First name"
                  aria-label="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  placeholder="Last name"
                  aria-label="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
        )}

        <DialogFooter>
          {invited ? (
            <Button onClick={handleClose}>Done</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              {canCreate ? (
                <Button onClick={handleCreate} disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Admin Account'}
                </Button>
              ) : (
                <Button onClick={handleGrant} disabled={!selectedUser || isLoading}>
                  {isLoading ? 'Granting...' : 'Grant Admin Access'}
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
