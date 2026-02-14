'use client';

import { useEffect } from 'react';
import { TeamsDashboard } from '@/features/teams/containers/teams-dashboard';
import { authClient } from '@/lib/auth/auth-client';
import { useTeamsStore } from '@/features/teams/stores/teams';

export default function Page() {
  const { data: session } = authClient.useSession();
  const userTeams = useTeamsStore(state => state.userTeams);
  const fetchUserTeams = useTeamsStore(state => state.fetchUserTeams);

  useEffect(() => {
    fetchUserTeams();
  }, [fetchUserTeams]);

  const selectedTeamId = session?.session.activeTeamId ?? null;
  const selectedTeam = userTeams.find(team => team.id === selectedTeamId) ?? null;
  const teamName = selectedTeam?.name || selectedTeam?.id || 'team';

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_400px_at_10%_-10%,rgba(228,27,30,0.28),transparent),radial-gradient(900px_420px_at_85%_0%,rgba(252,67,70,0.18),transparent)]" />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Teams
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Manage {teamName} team</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage your team members and invitations.
          </p>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16">
        <TeamsDashboard />
      </div>
    </div>
  );
}
