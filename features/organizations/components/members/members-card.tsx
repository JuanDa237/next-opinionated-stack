'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { UserAvatar } from '@/components/common/user-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { authClient } from '@/lib/auth/auth-client';
import { useTeamsStore } from '@/features/teams/stores/teams';
import { MoreVertical, Trash2, Shield, Users } from 'lucide-react';

type Member = {
  id: string;
  organizationId: string;
  role: 'member' | 'owner' | 'admin';
  createdAt: Date;
  userId: string;
  teamId?: string | undefined;
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | undefined;
  };
};

interface MembersCardProps {
  member: Member;
  openRolesDialog: (member: Member) => void;
  openTeamsDialog: (member: Member) => void;
  removeMember: (memberId: string) => void;
}

export function MembersCard({
  member,
  openRolesDialog,
  openTeamsDialog,
  removeMember,
}: MembersCardProps) {
  const { data: session } = authClient.useSession();
  const teams = useTeamsStore(state => state.organizationTeams);

  const memberId = member.id;
  const userId = member.userId;
  const memberLabel = member.user?.name ?? member.user?.email ?? 'Member';
  const memberRoles = Array.isArray(member.role)
    ? member.role
    : typeof member.role === 'string'
      ? [member.role]
      : ['member'];

  const isCurrentUser = member.userId === session?.user?.id;
  const isOwner = memberRoles.includes('owner');
  const canManage = !isCurrentUser && !isOwner;

  return (
    <Card key={member.id ?? member.userId ?? member.user?.email} className="p-4">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="h-10 w-10">
          <UserAvatar name={memberLabel} image={member.user?.image} />
        </div>

        {/* Member Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{memberLabel}</h3>
              {member.user?.email && (
                <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
              )}
            </div>

            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled={!canManage && !isCurrentUser}
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canManage && (
                  <>
                    <DropdownMenuItem onClick={() => openRolesDialog(member)}>
                      <Shield className="mr-2 h-4 w-4" />
                      Change Roles
                    </DropdownMenuItem>
                    {userId && teams.length > 0 && (
                      <DropdownMenuItem onClick={() => openTeamsDialog(member)}>
                        <Users className="mr-2 h-4 w-4" />
                        Manage Teams
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => memberId && removeMember(memberId)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Member
                    </DropdownMenuItem>
                  </>
                )}
                {isCurrentUser && !canManage && (
                  <DropdownMenuItem disabled>
                    <span className="text-muted-foreground">This is your account</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Roles Badges */}
          <div className="flex flex-wrap gap-1 mt-2">
            {memberRoles.map(role => (
              <Badge key={role} variant="secondary" className="text-xs">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
