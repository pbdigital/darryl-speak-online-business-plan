'use client';

import { useState, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import { revokeAdmin } from '@/lib/api/admin-team';
import { AdminTeamMember } from '@/types/admin';

interface RevokeAdminDialogProps {
  admin: AdminTeamMember | null;
  onClose: () => void;
  isSelf: boolean;
}

const CONFIRMATION_PHRASE = 'remove admin';

export function RevokeAdminDialog({ admin, onClose, isSelf }: RevokeAdminDialogProps) {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!admin) {
      setConfirmation('');
      setError(null);
    }
  }, [admin]);

  const getName = () => {
    if (!admin) return '';
    if (admin.first_name || admin.last_name) {
      return `${admin.first_name || ''} ${admin.last_name || ''}`.trim();
    }
    return admin.email || 'Unnamed';
  };

  const isConfirmed = isSelf
    ? confirmation.toLowerCase() === CONFIRMATION_PHRASE
    : true;

  const handleRevoke = async () => {
    if (!admin || (isSelf && !isConfirmed)) return;

    setIsLoading(true);
    setError(null);

    const response = await revokeAdmin(admin.id);

    if (response.success) {
      onClose();
      if (response.data?.selfRevoked) {
        // Redirect to dashboard if user revoked their own access
        router.push('/plan');
      } else {
        router.refresh();
      }
    } else {
      setError(response.errors?.[0]?.message || 'Failed to revoke admin access');
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={!!admin} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isSelf ? 'Remove Your Admin Access' : 'Remove Admin Access'}
          </DialogTitle>
          <DialogDescription>
            {isSelf ? (
              <>
                You are about to remove your own admin access. This action cannot be undone
                by yourself - another admin will need to restore your access.
              </>
            ) : (
              <>
                Are you sure you want to remove admin access from <strong>{getName()}</strong>?
                They will no longer be able to access the admin dashboard.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {isSelf && (
          <div className="space-y-4 py-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Warning:</strong> After removing your access, you will be redirected
                to the business plan dashboard and will not be able to access admin features.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmation">
                Type <strong>{CONFIRMATION_PHRASE}</strong> to confirm
              </Label>
              <Input
                id="confirmation"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder={CONFIRMATION_PHRASE}
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRevoke}
            disabled={isLoading || (isSelf && !isConfirmed)}
          >
            {isLoading ? 'Removing...' : 'Remove Admin Access'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
