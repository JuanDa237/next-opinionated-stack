import { create } from 'zustand';

import { authClient } from '@/lib/auth/auth-client';

type TeamMemberProfile = {
    id: string;
    userId: string;
    teamId: string;
    createdAt?: string | null;
    name?: string | null;
    email?: string | null;
};

type TeamMembersState = {
    membersByTeamId: Record<string, TeamMemberProfile[]>;
    isLoadingByTeamId: Record<string, boolean>;
    errorByTeamId: Record<string, string | null>;
    fetchTeamMembers: (teamId: string) => Promise<void>;
    addTeamMember: (teamId: string, userId: string) => Promise<boolean>;
    removeTeamMember: (teamId: string, userId: string) => Promise<boolean>;
    clearError: (teamId: string) => void;
};

export const useTeamMembersStore = create<TeamMembersState>((set, get) => ({
    membersByTeamId: {},
    isLoadingByTeamId: {},
    errorByTeamId: {},
    fetchTeamMembers: async (teamId: string) => {
        set(state => ({
            isLoadingByTeamId: { ...state.isLoadingByTeamId, [teamId]: true },
            errorByTeamId: { ...state.errorByTeamId, [teamId]: null },
        }));

        try {
            const response = await fetch(`/api/teams/members?teamId=${encodeURIComponent(teamId)}`);
            const payload = await response
                .json()
                .catch(() => ({ error: 'Failed to load members' }));

            if (!response.ok) {
                set(state => ({
                    membersByTeamId: { ...state.membersByTeamId, [teamId]: [] },
                    errorByTeamId: {
                        ...state.errorByTeamId,
                        [teamId]: payload?.error || 'Failed to load members',
                    },
                }));
                return;
            }

            const nextMembers = Array.isArray(payload?.members) ? payload.members : [];
            set(state => ({
                membersByTeamId: { ...state.membersByTeamId, [teamId]: nextMembers },
                errorByTeamId: { ...state.errorByTeamId, [teamId]: null },
            }));
        } catch {
            set(state => ({
                membersByTeamId: { ...state.membersByTeamId, [teamId]: [] },
                errorByTeamId: { ...state.errorByTeamId, [teamId]: 'Failed to load members' },
            }));
        } finally {
            set(state => ({
                isLoadingByTeamId: { ...state.isLoadingByTeamId, [teamId]: false },
            }));
        }
    },
    addTeamMember: async (teamId: string, userId: string) => {
        const { error } = await authClient.organization.addTeamMember({ teamId, userId });

        if (error) {
            set(state => ({
                errorByTeamId: {
                    ...state.errorByTeamId,
                    [teamId]: error.message || 'Failed to add member',
                },
            }));
            return false;
        }

        await get().fetchTeamMembers(teamId);
        return true;
    },
    removeTeamMember: async (teamId: string, userId: string) => {
        const { error } = await authClient.organization.removeTeamMember({ teamId, userId });

        if (error) {
            set(state => ({
                errorByTeamId: {
                    ...state.errorByTeamId,
                    [teamId]: error.message || 'Failed to remove member',
                },
            }));
            return false;
        }

        const currentMembers = get().membersByTeamId[teamId] ?? [];
        set(state => ({
            membersByTeamId: {
                ...state.membersByTeamId,
                [teamId]: currentMembers.filter(member => member.userId !== userId),
            },
            errorByTeamId: { ...state.errorByTeamId, [teamId]: null },
        }));

        return true;
    },
    clearError: (teamId: string) => {
        set(state => ({
            errorByTeamId: { ...state.errorByTeamId, [teamId]: null },
        }));
    },
}));
