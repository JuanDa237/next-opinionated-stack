import { useEffect, useMemo, useState } from 'react';
import { authClient } from '@/lib/auth/auth-client';
import { useTeamsStore } from '@/features/teams/stores/teams';
import { useTeamMembersStore } from '@/features/teams/stores/team-members';

interface UseOrganizationMembersOptions {
    pageSize?: number;
}

export function useOrganizationMembers(options: UseOrganizationMembersOptions = {}) {
    const { pageSize = 10 } = options;

    const { data: activeOrganization } = authClient.useActiveOrganization();
    const members = useMemo(() => activeOrganization?.members ?? [], [activeOrganization?.members]);

    const teams = useTeamsStore(state => state.organizationTeams);
    const fetchOrganizationTeams = useTeamsStore(state => state.fetchOrganizationTeams);
    const membersByTeamId = useTeamMembersStore(state => state.membersByTeamId);
    const fetchTeamMembers = useTeamMembersStore(state => state.fetchTeamMembers);

    const [roleOptions, setRoleOptions] = useState<string[]>(['member', 'admin', 'owner']);
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Load available roles
    useEffect(() => {
        if (!activeOrganization?.id) {
            return;
        }

        const loadRoles = async () => {
            try {
                const result = await authClient.organization.listRoles({
                    query: {
                        organizationId: activeOrganization.id,
                    },
                });

                const dynamicRoles = result?.data?.map(role => role.role).filter(Boolean) ?? [];

                setRoleOptions(Array.from(new Set(['member', 'admin', 'owner', ...dynamicRoles])));
            } catch (error) {
                console.error('Failed to load roles:', error);
            }
        };

        loadRoles();
    }, [activeOrganization?.id]);

    // Load teams for the organization
    useEffect(() => {
        if (activeOrganization?.id) {
            fetchOrganizationTeams(activeOrganization.id);
        }
    }, [activeOrganization?.id, fetchOrganizationTeams]);

    // Load team members for all teams
    useEffect(() => {
        teams.forEach(team => {
            fetchTeamMembers(team.id);
        });
    }, [teams, fetchTeamMembers]);

    // Filter and search
    const normalizedSearch = searchValue.trim().toLowerCase();
    const filteredMembers = useMemo(() => {
        if (!normalizedSearch) {
            return members;
        }

        return members.filter(member => {
            const name = member.user?.name ?? '';
            const email = member.user?.email ?? '';
            return (
                name.toLowerCase().includes(normalizedSearch) ||
                email.toLowerCase().includes(normalizedSearch)
            );
        });
    }, [members, normalizedSearch]);

    // Pagination
    const totalMembers = filteredMembers.length;
    const totalPages = Math.max(1, Math.ceil(totalMembers / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const pagedMembers = filteredMembers.slice(startIndex, startIndex + pageSize);

    // Check if user is in a team
    const isUserInTeam = (userId: string, teamId: string): boolean => {
        const teamMembers = membersByTeamId[teamId] ?? [];
        return teamMembers.some(member => member.userId === userId);
    };

    return {
        activeOrganization,
        members,
        filteredMembers,
        pagedMembers,
        teams,
        roleOptions,
        membersByTeamId,
        searchValue,
        setSearchValue,
        currentPage: safePage,
        setCurrentPage,
        totalMembers,
        totalPages,
        pageSize,
        startIndex,
        isUserInTeam,
        fetchTeamMembers,
    };
}
