'use client';

import { useEffect } from 'react';
import { authClient } from '@/lib/auth/auth-client';
import { useTeamsStore } from '@/features/teams/stores/teams';
import { GradientBackground } from '@/components/common/gradient-background';

export default function Page() {
  const { data: session } = authClient.useSession();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const userTeams = useTeamsStore(state => state.userTeams);
  const fetchUserTeams = useTeamsStore(state => state.fetchUserTeams);

  useEffect(() => {
    fetchUserTeams();
  }, [fetchUserTeams]);

  const selectedTeamId = session?.session.activeTeamId ?? null;
  const selectedTeam = userTeams.find(team => team.id === selectedTeamId) ?? null;
  const teamName = selectedTeam?.name || selectedTeam?.id || null;

  if (teamName == null) {
    return (
      <GradientBackground>
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Vendor
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">
              Select a team to manage Vendors for {activeOrganization?.name}
            </h1>
          </div>
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Vendor
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Manage {teamName} Vendors For {activeOrganization?.name}
          </h1>
        </div>
      </div>
    </GradientBackground>
  );
}
