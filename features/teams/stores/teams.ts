import { create } from 'zustand';

import { authClient } from '@/lib/auth/auth-client';
import { Team } from 'better-auth/plugins';

type TeamsStoreState = {
    userTeams: Team[];
    organizationTeams: Team[];
    isLoadingUserTeams: boolean;
    isLoadingOrganizationTeams: boolean;
    error: string | null;
    lastOrganizationId: string | null;
    fetchUserTeams: () => Promise<void>;
    fetchOrganizationTeams: (organizationId: string) => Promise<void>;
    removeTeam: (teamId: string) => Promise<boolean>;
    clearError: () => void;
};

export const useTeamsStore = create<TeamsStoreState>((set, get) => ({
    userTeams: [],
    organizationTeams: [],
    isLoadingUserTeams: false,
    isLoadingOrganizationTeams: false,
    error: null,
    lastOrganizationId: null,
    fetchUserTeams: async () => {
        set({ isLoadingUserTeams: true, error: null });

        const { data, error } = await authClient.organization.listUserTeams();

        if (error) {
            set({ userTeams: [], error: error.message || 'Failed to load user teams' });
        } else {
            set({ userTeams: data ?? [], error: null });
        }

        set({ isLoadingUserTeams: false });
    },
    fetchOrganizationTeams: async (organizationId: string) => {
        set({
            isLoadingOrganizationTeams: true,
            error: null,
            lastOrganizationId: organizationId,
        });

        const { data, error } = await authClient.organization.listTeams({
            query: {
                organizationId,
            },
        });

        if (error) {
            set({
                organizationTeams: [],
                error: error.message || 'Failed to load organization teams',
            });
        } else {
            set({ organizationTeams: data ?? [], error: null });
        }

        set({ isLoadingOrganizationTeams: false });
    },
    removeTeam: async (teamId: string) => {
        const { error } = await authClient.organization.removeTeam({ teamId });

        if (error) {
            const message =
                error && typeof error === 'object' && 'error' in error
                    ? (error as { error?: { message?: string } }).error?.message
                    : error.message;
            set({ error: message || 'Failed to remove team' });
            return false;
        }

        const { organizationTeams, userTeams } = get();
        set({
            organizationTeams: organizationTeams.filter(team => team.id !== teamId),
            userTeams: userTeams.filter(team => team.id !== teamId),
            error: null,
        });
        return true;
    },
    clearError: () => set({ error: null }),
}));
