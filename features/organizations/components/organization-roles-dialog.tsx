'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type PermissionMap = Record<string, string[]>;

type StatementEntry = {
  resource: string;
  actions: string[];
};

type OrganizationRolesDialogProps = {
  open: boolean;
  title: string;
  description: string;
  roleName: string;
  permissions: PermissionMap;
  statementEntries: StatementEntry[];
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleNameChange: (value: string) => void;
  onTogglePermission: (resource: string, action: string) => void;
  onSave: () => void;
};

const formatLabel = (value: string) =>
  value.replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

export function OrganizationRolesDialog({
  open,
  title,
  description,
  roleName,
  permissions,
  statementEntries,
  isSaving,
  onOpenChange,
  onRoleNameChange,
  onTogglePermission,
  onSave,
}: OrganizationRolesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] max-w-3xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="role-name" className="text-sm font-medium">
                Role name
              </label>
              <Input
                id="role-name"
                value={roleName}
                onChange={event => onRoleNameChange(event.target.value)}
                placeholder="warehouse-manager"
              />
            </div>

            <div className="space-y-4">
              {statementEntries.map(({ resource, actions }) => (
                <div key={resource} className="space-y-2 rounded-md border px-3 py-2">
                  <div className="text-sm font-semibold text-foreground">
                    {formatLabel(resource)}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {actions.map(action => {
                      const actionLabel = formatLabel(action);
                      const isChecked = Boolean(permissions[resource]?.includes(action));

                      return (
                        <label
                          key={`${resource}-${action}`}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => onTogglePermission(resource, action)}
                          />
                          <span>{actionLabel}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={onSave} disabled={!roleName.trim() || isSaving}>
            {isSaving ? 'Saving...' : 'Save Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
