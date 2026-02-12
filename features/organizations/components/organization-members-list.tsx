'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';

export function OrganizationMembersList() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const members = activeOrganization?.members ?? [];

  const { data: session } = authClient.useSession();

  if (!activeOrganization) {
    return (
      <div className="text-sm text-muted-foreground">Select an organization to view members.</div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">No members found for this organization.</div>
    );
  }

  function removeMember(memberId: string) {
    authClient.organization.removeMember(
      { memberIdOrEmail: memberId },
      {
        onError: error => {
          toast.error(error.error.message || 'Failed to remove member');
        },
        onSuccess: () => {
          toast.success('Member removed');
        },
      }
    );
  }

  return (
    <div className="space-y-3">
      {members.map(member => {
        const memberId = member.userId ?? member.id ?? member.user?.email;
        const memberLabel =
          member.user?.name ?? member.user?.email ?? member.id ?? member.userId ?? 'Member';
        const memberRole = member.role ?? 'member';

        return (
          <div
            key={member.id ?? member.userId ?? member.user?.email}
            className="flex items-center justify-between gap-4 rounded-md border px-3 py-2"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-foreground">
                {memberLabel}
                <Badge className="ml-2" variant="secondary">
                  {String(memberRole)}
                </Badge>
              </div>
              {member.user?.email && member.user?.name ? (
                <div className="truncate text-xs text-muted-foreground">{member.user.email}</div>
              ) : null}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => memberId && removeMember(memberId)}
              disabled={!memberId || memberId === session?.user?.id || member.role === 'owner'}
            >
              Remove
            </Button>
          </div>
        );
      })}
    </div>
  );
}
