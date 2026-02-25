import { toast } from 'sonner';
import { authClient } from '@/lib/auth/auth-client';
import { useTeamMembersStore } from '@/features/teams/stores/team-members';

interface UseMemberOperationsOptions {
    organizationId?: string;
    onTeamMemberChange?: (teamId: string) => void;
}

export function useMemberOperations(options: UseMemberOperationsOptions = {}) {
    const { organizationId, onTeamMemberChange } = options;

    const updateMemberRole = async (memberId: string, roles: string[]) => {
        if (!organizationId) {
            toast.error('No active organization');
            return false;
        }

        try {
            await authClient.organization.updateMemberRole({
                role: roles,
                memberId,
                organizationId,
            });
            toast.success('Roles updated successfully');
            return true;
        } catch (error) {
            const message =
                error && typeof error === 'object' && 'error' in error
                    ? (error as { error?: { message?: string } }).error?.message
                    : undefined;
            toast.error(message || 'Failed to update roles');
            return false;
        }
    };

    const removeMember = async (memberId: string) => {
        return new Promise<boolean>(resolve => {
            authClient.organization.removeMember(
                { memberIdOrEmail: memberId },
                {
                    onError: error => {
                        toast.error(error.error.message || 'Failed to remove member');
                        resolve(false);
                    },
                    onSuccess: () => {
                        toast.success('Member removed');
                        resolve(true);
                    },
                }
            );
        });
    };

    const addMemberToTeam = async (userId: string, teamId: string) => {
        const addTeamMember = useTeamMembersStore.getState().addTeamMember;
        const success = await addTeamMember(teamId, userId);

        if (success) {
            toast.success('Added to team');
            onTeamMemberChange?.(teamId);
        } else {
            toast.error('Failed to add to team');
        }

        return success;
    };

    const removeMemberFromTeam = async (userId: string, teamId: string) => {
        const removeTeamMember = useTeamMembersStore.getState().removeTeamMember;
        const success = await removeTeamMember(teamId, userId);

        if (success) {
            toast.success('Removed from team');
            onTeamMemberChange?.(teamId);
        } else {
            toast.error('Failed to remove from team');
        }

        return success;
    };

    return {
        updateMemberRole,
        removeMember,
        addMemberToTeam,
        removeMemberFromTeam,
    };
}
