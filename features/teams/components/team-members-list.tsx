'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useTeamMembersStore } from '../stores/team-members';

interface Props {
  teamId: string | null;
}

export function TeamMembersList({ teamId }: Props) {
  const membersByTeamId = useTeamMembersStore(state => state.membersByTeamId);
  const isLoadingByTeamId = useTeamMembersStore(state => state.isLoadingByTeamId);
  const errorByTeamId = useTeamMembersStore(state => state.errorByTeamId);
  const fetchTeamMembers = useTeamMembersStore(state => state.fetchTeamMembers);
  const removeTeamMember = useTeamMembersStore(state => state.removeTeamMember);

  const members = teamId ? (membersByTeamId[teamId] ?? []) : [];
  const isLoading = teamId ? (isLoadingByTeamId[teamId] ?? false) : false;
  const error = teamId ? (errorByTeamId[teamId] ?? null) : null;

  useEffect(() => {
    if (teamId) {
      fetchTeamMembers(teamId);
    }
  }, [teamId, fetchTeamMembers]);

  if (!teamId) {
    return <div className="text-sm text-muted-foreground">Select a team to view members.</div>;
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading members...</div>;
  }

  if (members.length === 0) {
    return <div className="text-sm text-muted-foreground">No members found for this team.</div>;
  }

  function removeMember(userId: string) {
    if (!teamId) {
      toast.error('No team selected');
      return;
    }

    removeTeamMember(teamId, userId).then(ok => {
      if (!ok) {
        const currentError = useTeamMembersStore.getState().errorByTeamId[teamId];
        toast.error(currentError || 'Failed to remove member');
        return;
      }
      toast.success('Member removed');
    });
  }

  return (
    <div className="space-y-3">
      {members.map(member => {
        const memberLabel = member.name || member.email || member.userId;
        const memberSubLabel = member.name && member.email ? member.email : undefined;

        return (
          <div
            key={member.id}
            className="flex items-center justify-between gap-4 rounded-md border px-3 py-2"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-foreground">{memberLabel}</div>
              {memberSubLabel && (
                <div className="truncate text-xs text-muted-foreground">{memberSubLabel}</div>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => member.userId && removeMember(member.userId)}
            >
              Remove
            </Button>
          </div>
        );
      })}
    </div>
  );
}
