'use client';

import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { useTeamMembersStore } from '../stores/team-members';

type AddTeamMemberButtonProps = {
  teamId: string | null;
};

export function AddTeamMemberButton({ teamId }: AddTeamMemberButtonProps) {
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const [open, setOpen] = useState(false);
  const [pendingMemberId, setPendingMemberId] = useState<string | null>(null);

  const addTeamMember = useTeamMembersStore(state => state.addTeamMember);
  const clearError = useTeamMembersStore(state => state.clearError);
  const membersByTeamId = useTeamMembersStore(state => state.membersByTeamId);
  const fetchTeamMembers = useTeamMembersStore(state => state.fetchTeamMembers);

  const members = activeOrganization?.members ?? [];
  const canOpen = Boolean(teamId);

  const teamMembers = useMemo(
    () => (teamId ? (membersByTeamId[teamId] ?? []) : []),
    [teamId, membersByTeamId]
  );

  const existingMemberIds = useMemo(
    () => new Set(teamMembers.map(member => member.userId).filter(Boolean)),
    [teamMembers]
  );

  useEffect(() => {
    if (teamId && open) {
      fetchTeamMembers(teamId);
    }
  }, [teamId, open, fetchTeamMembers]);

  function addMember(userId: string) {
    if (!teamId) {
      toast.error('No team selected');
      return;
    }

    setPendingMemberId(userId);
    clearError(teamId);

    addTeamMember(teamId, userId).then(ok => {
      setPendingMemberId(null);

      if (!ok) {
        const currentError = useTeamMembersStore.getState().errorByTeamId[teamId];
        toast.error(currentError || 'Failed to add member');
        return;
      }

      toast.success('Member added');
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" disabled={!canOpen}>
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add team member</DialogTitle>
          <DialogDescription>Select organization members to add to this team.</DialogDescription>
        </DialogHeader>
        {!activeOrganization && (
          <div className="text-sm text-muted-foreground">
            Select an organization to view members.
          </div>
        )}
        {activeOrganization && members.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No members found for this organization.
          </div>
        )}
        {activeOrganization && members.length > 0 && (
          <div className="space-y-3">
            {members.map(member => {
              const memberId = member.userId ?? member.id ?? member.user?.email;

              const memberLabel =
                member.user?.name ?? member.user?.email ?? member.id ?? member.userId ?? 'Member';

              const memberRole = member.role ?? 'member';

              const isAlreadyMember = Boolean(memberId && existingMemberIds.has(memberId));

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
                      <div className="truncate text-xs text-muted-foreground">
                        {member.user.email}
                      </div>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => memberId && addMember(memberId)}
                    disabled={isAlreadyMember}
                  >
                    {pendingMemberId === memberId
                      ? 'Adding...'
                      : isAlreadyMember
                        ? 'Added'
                        : 'Add Member'}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
