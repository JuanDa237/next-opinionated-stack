'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrganizationRolesDialog } from './organization-roles-dialog';
import { useOrganizationRoles } from '../hooks/use-organization-roles';

export function OrganizationRolesList() {
  const {
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
  } = useOrganizationRoles();

  if (!activeOrganization) {
    return (
      <div className="text-sm text-muted-foreground">Select an organization to view roles.</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Create custom roles and permissions for this organization.
        </div>
        <Button type="button" variant="outline" onClick={openCreateDialog}>
          Create Role
        </Button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading roles...</div>
      ) : roles.length === 0 ? (
        <div className="text-sm text-muted-foreground">No custom roles found.</div>
      ) : (
        <div className="space-y-3">
          {roles.map(role => {
            const displayName = role.role;
            const rolePermissions = role.permission;

            const permissionCount = Object.values(rolePermissions).reduce(
              (total, actions) => total + actions.length,
              0
            );
            const isSystemRole = ['owner', 'admin', 'member'].includes(displayName);
            const roleKey = role.id ?? displayName;
            const isBusy = busyRoleId === roleKey;

            return (
              <div
                key={roleKey}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">
                    {displayName}
                    <Badge className="ml-2" variant="secondary">
                      {permissionCount} permissions
                    </Badge>
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {Object.keys(rolePermissions).length
                      ? 'Custom permissions applied.'
                      : 'No permissions selected.'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(role)}
                    disabled={isBusy || isSystemRole}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(role)}
                    disabled={isBusy || isSystemRole}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <OrganizationRolesDialog
        open={dialogOpen}
        title={editingRole ? 'Edit Role' : 'Create Role'}
        description="Choose a role name and select permissions for each entity."
        roleName={roleName}
        permissions={permissions}
        statementEntries={statementEntries.map(entry => ({
          ...entry,
          actions: [...entry.actions],
        }))}
        isSaving={Boolean(busyRoleId)}
        onOpenChange={handleDialogOpenChange}
        onRoleNameChange={setRoleName}
        onTogglePermission={togglePermission}
        onSave={handleSave}
      />
    </div>
  );
}
