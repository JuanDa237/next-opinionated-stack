'use client';

import { useState } from 'react';
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
import { toast } from 'sonner';

export function ChangeRolesDialog({
  open,
  onOpenChange,
  member,
  availableRoles,
  onUpdate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: { id: string; name: string; email: string; roles: string[] } | null;
  availableRoles: string[];
  onUpdate: (roles: string[]) => void;
}) {
  const [selectedRoles, setSelectedRoles] = useState(member?.roles ?? []);

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(item => item !== role) : [...prev, role]
    );
  };

  const handleSave = () => {
    if (selectedRoles.length === 0) {
      toast.error('At least one role is required');
      return;
    }
    onUpdate(selectedRoles);
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    console.log('ChangeRolesDialog open state changing to:', newOpen, member?.roles);
    if (newOpen && member) {
      setSelectedRoles(member.roles);
    }

    onOpenChange(newOpen);
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Roles</DialogTitle>
          <DialogDescription>Manage roles for {member.name || member.email}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {availableRoles.map(role => (
            <label key={role} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedRoles.includes(role)}
                onCheckedChange={() => toggleRole(role)}
              />
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </div>
              </div>
            </label>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={selectedRoles.length === 0}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
