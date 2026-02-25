'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Users } from 'lucide-react';

export function ManageTeamsDialog({
  open,
  onOpenChange,
  member,
  teams,
  isUserInTeam,
  onAddToTeam,
  onRemoveFromTeam,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: { id: string; userId: string; name: string; email: string; roles: string[] } | null;
  teams: Array<{ id: string; name?: string | null }>;
  isUserInTeam: (userId: string, teamId: string) => boolean;
  onAddToTeam: (userId: string, teamId: string) => Promise<void>;
  onRemoveFromTeam: (userId: string, teamId: string) => Promise<void>;
}) {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Teams</DialogTitle>
          <DialogDescription>
            Manage team membership for {member.name || member.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-[400px] overflow-y-auto py-4">
          {teams.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No teams available in this organization.
            </p>
          ) : (
            teams.map(team => {
              const inTeam = isUserInTeam(member.userId, team.id);
              return (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{team.name ?? team.id}</span>
                  </div>
                  {inTeam ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveFromTeam(member.userId, team.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddToTeam(member.userId, team.id)}
                    >
                      Add
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
