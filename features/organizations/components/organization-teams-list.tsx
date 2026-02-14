'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTeamsStore } from '@/features/teams/stores/teams';
import { authClient } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function OrganizationTeamsList() {
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const router = useRouter();
  const teams = useTeamsStore(state => state.organizationTeams);
  const isLoading = useTeamsStore(state => state.isLoadingOrganizationTeams);
  const error = useTeamsStore(state => state.error);
  const clearError = useTeamsStore(state => state.clearError);
  const fetchOrganizationTeams = useTeamsStore(state => state.fetchOrganizationTeams);
  const removeTeam = useTeamsStore(state => state.removeTeam);

  useEffect(() => {
    if (activeOrganization?.id) {
      fetchOrganizationTeams(activeOrganization.id);
    }
  }, [activeOrganization?.id, fetchOrganizationTeams]);

  const visibleTeams = activeOrganization?.id ? teams : [];
  const visibleTeamsError = activeOrganization?.id ? error : null;
  const visibleIsLoading = activeOrganization?.id ? isLoading : false;

  if (!activeOrganization) {
    return (
      <div className="text-sm text-muted-foreground">Select an organization to view teams.</div>
    );
  }

  if (visibleIsLoading) {
    return <div className="text-sm text-muted-foreground">Loading teams...</div>;
  }

  if (visibleTeamsError) {
    return <div className="text-sm text-destructive">{visibleTeamsError}</div>;
  }

  if (visibleTeams.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">No teams found for this organization.</div>
    );
  }

  async function handleRemoveTeam(teamId: string) {
    clearError();
    const ok = await removeTeam(teamId);

    if (!ok) {
      const currentError = useTeamsStore.getState().error;
      toast.error(currentError || 'Failed to remove team');
      return;
    }

    router.refresh();
    toast.success('Team removed');
  }

  async function manageTeam(teamId: string) {
    await authClient.organization
      .setActiveTeam({
        teamId: teamId,
      })
      .then(() => {
        router.push('/admin/teams');
      })
      .catch(error => {
        toast.error(error.error.message || 'Failed to select team');
      });
  }

  return (
    <div className="space-y-3">
      {visibleTeams.map(team => {
        const teamId = team.id;
        const teamLabel = team.name ?? team.id ?? 'Team';

        return (
          <div
            key={team.id}
            className="flex items-center justify-between gap-4 rounded-md border px-3 py-2"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-foreground">{teamLabel}</div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => teamId && manageTeam(teamId)}
              >
                Manage
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => teamId && handleRemoveTeam(teamId)}
              >
                Remove
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
