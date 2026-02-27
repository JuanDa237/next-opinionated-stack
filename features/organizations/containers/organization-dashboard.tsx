'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Tabs
import { OrganizationInvitationsList } from '../components/invitations/organization-invitations-list';
import { OrganizationTeamsList } from '../components/teams/organization-teams-list';
import { OrganizationRolesList } from '../components/roles/organization-roles-list';
import { OrganizationMembersList } from '../components/members/organization-members-list';

// Buttons
import { InviteMemberButton } from '../components/invitations/invite-member-button';
import { CreateTeamButton } from '../../teams/components/create-team-button';

export function OrganizationDashboard() {
  return (
    <div className="grid gap-8">
      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>View and manage organization members.</CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationMembersList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="teams">
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1.5">
                <CardTitle>Teams</CardTitle>
                <CardDescription>View and manage organization teams.</CardDescription>
              </div>
              <CreateTeamButton />
            </CardHeader>
            <CardContent>
              <OrganizationTeamsList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invitations">
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1.5">
                <CardTitle>Invitations</CardTitle>
                <CardDescription>Track pending invites for this organization.</CardDescription>
              </div>
              <InviteMemberButton />
            </CardHeader>
            <CardContent>
              <OrganizationInvitationsList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Roles</CardTitle>
              <CardDescription>Manage custom roles and permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationRolesList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
