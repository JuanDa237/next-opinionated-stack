'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth/auth-client';
import { organizationStatements } from '@/lib/auth/permissions';

type PermissionMap = Record<string, string[]>;

type OrganizationRole = {
    id: string;
    organizationId: string;
    role: string;
    permission: Record<string, string[]>;
    createdAt: Date;
    updatedAt?: Date | undefined;
};

const systemRoleNames = new Set(['owner', 'admin', 'member']);

export function useOrganizationRoles() {

    // Load active organization and roles
    const { data: activeOrganization } = authClient.useActiveOrganization();

    const [roles, setRoles] = useState<OrganizationRole[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadRoles = useCallback(async () => {
        if (!activeOrganization?.id) {
            return;
        }

        setIsLoading(true);
        try {
            const result = await authClient.organization.listRoles({
                query: {
                    organizationId: activeOrganization.id,
                },
            });

            if (result?.data) {
                setRoles(result.data as OrganizationRole[]);
            } else {
                setRoles([]);
            }
        } catch (error) {
            const message =
                error && typeof error === 'object' && 'error' in error
                    ? (error as { error?: { message?: string } }).error?.message
                    : undefined;
            toast.error(message || 'Failed to load roles');
        } finally {
            setIsLoading(false);
        }
    }, [activeOrganization?.id]);

    useEffect(() => {
        if (!activeOrganization?.id) {
            setRoles([]);
            return;
        }

        loadRoles();
    }, [activeOrganization?.id, loadRoles]);


    const [busyRoleId, setBusyRoleId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<OrganizationRole | null>(null);
    const [roleName, setRoleName] = useState('');
    const [permissions, setPermissions] = useState<PermissionMap>({});

    const statementEntries = useMemo(
        () =>
            Object.entries(organizationStatements).reverse().map(([resource, actions]) => ({ resource, actions })),
        []
    );

    // Handlers for opening dialogs and managing form state
    const resetDialogState = useCallback(() => {
        setRoleName('');
        setPermissions({});
        setEditingRole(null);
    }, []);

    const openCreateDialog = useCallback(() => {
        resetDialogState();
        setDialogOpen(true);
    }, [resetDialogState]);

    const openEditDialog = useCallback((role: OrganizationRole) => {
        setEditingRole(role);
        setRoleName(role.role);
        setPermissions(role.permission);
        setDialogOpen(true);
    }, []);

    const handleDialogOpenChange = useCallback(
        (open: boolean) => {
            setDialogOpen(open);
            if (!open) {
                resetDialogState();
            }
        },
        [resetDialogState]
    );

    // Handler for toggling permissions in the form
    const togglePermission = useCallback((resource: string, action: string) => {
        setPermissions(current => {
            const next = { ...current } as PermissionMap;
            const updated = new Set(next[resource] ?? []);

            if (updated.has(action)) {
                updated.delete(action);
            } else {
                updated.add(action);
            }

            if (updated.size === 0) {
                delete next[resource];
            } else {
                next[resource] = Array.from(updated);
            }

            return next;
        });
    }, []);

    // Handlers for saving and deleting roles
    const handleDelete = useCallback(
        async (role: OrganizationRole) => {
            const roleNameValue = role.role;
            if (systemRoleNames.has(roleNameValue) || !activeOrganization?.id) {
                return;
            }

            setBusyRoleId(role.id ?? roleNameValue);
            try {
                await authClient.organization.deleteRole({
                    roleId: role.id ?? undefined,
                    roleName: role.id ? undefined : roleNameValue,
                    organizationId: activeOrganization.id,
                });
                toast.success('Role deleted');
                await loadRoles();
            } catch (error) {
                const message =
                    error && typeof error === 'object' && 'error' in error
                        ? (error as { error?: { message?: string } }).error?.message
                        : undefined;
                toast.error(message || 'Failed to delete role');
            } finally {
                setBusyRoleId(null);
            }
        },
        [activeOrganization?.id, loadRoles]
    );

    const handleSave = useCallback(async () => {
        const trimmedName = roleName.trim();
        if (!trimmedName || !activeOrganization?.id) {
            return;
        }

        setBusyRoleId(editingRole?.id ?? trimmedName);
        try {
            if (editingRole) {
                const existingName = editingRole.role;
                const editResponse = await authClient.organization.updateRole({
                    roleId: editingRole.id ?? undefined,
                    roleName: editingRole.id ? undefined : existingName,
                    organizationId: activeOrganization.id,
                    data: {
                        permission: permissions,
                        roleName: trimmedName !== existingName ? trimmedName : undefined,
                    },
                });

                if (editResponse.error) {
                    throw editResponse.error;
                }

                toast.success('Role updated');
            } else {
                const creationResponse = await authClient.organization.createRole({
                    role: trimmedName,
                    permission: permissions,
                    organizationId: activeOrganization.id,
                });

                if (creationResponse.error) {
                    throw creationResponse.error;
                }

                toast.success('Role created');
            }

            setDialogOpen(false);
            resetDialogState();
            await loadRoles();
        } catch (error) {
            const message =
                error && typeof error === 'object' && 'error' in error
                    ? (error as { error?: { message?: string } }).error?.message
                    : undefined;
            toast.error(message || 'Failed to save role');
        } finally {
            setBusyRoleId(null);
        }
    }, [activeOrganization?.id, editingRole, loadRoles, permissions, resetDialogState, roleName]);


    return {
        activeOrganization,
        roles,
        isLoading,
        busyRoleId,
        dialogOpen,
        editingRole,
        roleName,
        permissions,
        statementEntries,
        openCreateDialog,
        openEditDialog,
        togglePermission,
        handleDelete,
        handleSave,
        handleDialogOpenChange,
        setRoleName,
    };
}

export type { OrganizationRole, PermissionMap };
