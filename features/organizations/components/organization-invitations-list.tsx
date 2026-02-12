'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';

export function OrganizationInvitationsList() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const pendingInvites =
    activeOrganization?.invitations?.filter(invite => invite.status === 'pending') ?? [];

  if (!activeOrganization) {
    return (
      <div className="text-sm text-muted-foreground">
        Select an organization to view invitations.
      </div>
    );
  }

  if (pendingInvites.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No pending invitations for this organization.
      </div>
    );
  }

  async function cancelInvitation(invitationId: string) {
    try {
      await authClient.organization.cancelInvitation({ invitationId });
      toast.success('Invitation canceled');
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'error' in error
          ? (error as { error?: { message?: string } }).error?.message
          : undefined;
      toast.error(message || 'Failed to cancel invitation');
    }
  }

  return (
    <div className="space-y-3">
      {pendingInvites.map(invite => {
        const inviteId = invite.id;
        const inviteLabel = invite.email ?? 'Invitation';
        const inviteRole = invite.role ?? 'member';

        return (
          <div
            key={invite.id}
            className="flex items-center justify-between gap-4 rounded-md border px-3 py-2"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-foreground">
                {inviteLabel}

                <Badge className="ml-2" variant="secondary">
                  {String(inviteRole)}
                </Badge>
              </div>
              {invite.createdAt ? (
                <div className="truncate text-xs text-muted-foreground">
                  Invited {new Date(invite.createdAt).toLocaleDateString()}
                </div>
              ) : null}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inviteId && cancelInvitation(inviteId)}
              disabled={!inviteId}
            >
              Cancel
            </Button>
          </div>
        );
      })}
    </div>
  );
}
