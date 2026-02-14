'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Check, ChevronsUpDown, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { useTeamsStore } from '@/features/teams/stores/teams';

export function TeamSwitcher() {
  const { data: session } = authClient.useSession();

  const teams = useTeamsStore(state => state.userTeams);
  const isLoading = useTeamsStore(state => state.isLoadingUserTeams);
  const error = useTeamsStore(state => state.error);
  const fetchUserTeams = useTeamsStore(state => state.fetchUserTeams);

  const selectedTeamId = session?.session.activeTeamId ?? null;

  const router = useRouter();

  useEffect(() => {
    fetchUserTeams();
  }, [fetchUserTeams]);

  const selectedTeam = teams.find(team => team.id === selectedTeamId) ?? null;
  const selectedLabel = selectedTeam?.name || selectedTeam?.id || 'Select team';

  async function handleSelectTeam(teamId: string) {
    try {
      await authClient.organization.setActiveTeam({ teamId });
      router.push('/admin');
      router.refresh();
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'error' in error
          ? (error as { error?: { message?: string } }).error?.message
          : undefined;
      toast.error(message || 'Failed to select team');
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Users className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">Team</span>
                <span className="truncate">{selectedLabel}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)" align="start">
            {isLoading && <DropdownMenuItem disabled>Loading teams...</DropdownMenuItem>}
            {!isLoading && error && <DropdownMenuItem disabled>{error}</DropdownMenuItem>}
            {!isLoading && !error && teams.length === 0 && (
              <DropdownMenuItem disabled>No teams available</DropdownMenuItem>
            )}
            {!isLoading &&
              !error &&
              teams.length > 0 &&
              teams.map(team => (
                <DropdownMenuItem key={team.id} onSelect={() => handleSelectTeam(team.id)}>
                  {team.name ?? team.id}
                  {team.id === selectedTeamId && <Check className="ml-auto" />}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
