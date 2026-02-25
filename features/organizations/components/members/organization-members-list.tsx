'use client';

import { useState } from 'react';

import { ChangeRolesDialog } from './change-roles-dialog';
import { ManageTeamsDialog } from './manage-teams-dialog';
import { MembersCard } from './members-card';
import { MembersSearchBar } from './members-search-bar';
import { MembersPagination } from './members-pagination';
import { normalizeRoles } from '@/features/auth/utils';
import { useOrganizationMembers } from '@/features/organizations/hooks/use-organization-members';
import { useMemberOperations } from '@/features/organizations/hooks/use-member-operations';

export function OrganizationMembersList() {
  const {
    activeOrganization,
    members,
    pagedMembers,
    teams,
    roleOptions,
    searchValue,
    setSearchValue,
    currentPage,
    setCurrentPage,
    totalMembers,
    totalPages,
    pageSize,
    startIndex,
    isUserInTeam,
    fetchTeamMembers,
  } = useOrganizationMembers({ pageSize: 10 });

  const { updateMemberRole, removeMember, addMemberToTeam, removeMemberFromTeam } =
    useMemberOperations({
      organizationId: activeOrganization?.id,
      onTeamMemberChange: fetchTeamMembers,
    });

  // Modal states
  const [rolesDialogOpen, setRolesDialogOpen] = useState(false);
  const [teamsDialogOpen, setTeamsDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{
    id: string;
    userId: string;
    name: string;
    email: string;
    roles: string[];
  } | null>(null);

  // Open roles dialog
  const openRolesDialog = (member: (typeof members)[0]) => {
    const memberRoles = normalizeRoles(member.role, ['member']);

    setSelectedMember({
      id: member.id ?? '',
      userId: member.userId ?? '',
      name: member.user?.name ?? '',
      email: member.user?.email ?? '',
      roles: memberRoles,
    });
    setRolesDialogOpen(true);
  };

  // Open teams dialog
  const openTeamsDialog = (member: (typeof members)[0]) => {
    const memberRoles = normalizeRoles(member.role, ['member']);

    setSelectedMember({
      id: member.id ?? '',
      userId: member.userId ?? '',
      name: member.user?.name ?? '',
      email: member.user?.email ?? '',
      roles: memberRoles,
    });
    setTeamsDialogOpen(true);
  };

  // Early returns for empty states
  if (!activeOrganization) {
    return (
      <div className="text-sm text-muted-foreground">Select an organization to view members.</div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">No members found for this organization.</div>
    );
  }

  return (
    <>
      <MembersSearchBar
        searchValue={searchValue}
        onSearchChange={value => {
          setSearchValue(value);
          setCurrentPage(1);
        }}
        totalMembers={totalMembers}
        startIndex={startIndex}
        pageSize={pageSize}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pagedMembers.map(member => (
          <MembersCard
            key={member.id ?? member.userId ?? member.user?.email}
            member={member}
            openRolesDialog={openRolesDialog}
            openTeamsDialog={openTeamsDialog}
            removeMember={removeMember}
          />
        ))}
      </div>

      {totalMembers === 0 && (
        <div className="text-sm text-muted-foreground">No matching members.</div>
      )}

      <MembersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalMembers={totalMembers}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <ChangeRolesDialog
        key={selectedMember?.id}
        open={rolesDialogOpen}
        onOpenChange={setRolesDialogOpen}
        member={selectedMember}
        availableRoles={roleOptions}
        onUpdate={roles => {
          if (selectedMember?.id) {
            updateMemberRole(selectedMember.id, roles);
          }
        }}
      />

      <ManageTeamsDialog
        open={teamsDialogOpen}
        onOpenChange={setTeamsDialogOpen}
        member={selectedMember}
        teams={teams}
        isUserInTeam={isUserInTeam}
        onAddToTeam={async (userId, teamId) => {
          await addMemberToTeam(userId, teamId);
        }}
        onRemoveFromTeam={async (userId, teamId) => {
          await removeMemberFromTeam(userId, teamId);
        }}
      />
    </>
  );
}
