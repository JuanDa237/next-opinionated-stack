'use client';

// import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrganizationInvitationsList } from '@/features/organizations/components/invitations/organization-invitations-list';
import { authClient } from '@/lib/auth/auth-client';
import { TeamMembersList } from '../components/team-members-list';
import { AddTeamMemberButton } from '../components/add-team-member-button';
import { InviteMemberButton } from '@/features/organizations/components/invitations/invite-member-button';

export function TeamsDashboard() {
  const { data: session } = authClient.useSession();

  return (
    <div className="grid gap-8">
      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1.5">
                <CardTitle>Members</CardTitle>
                <CardDescription>View and manage team members.</CardDescription>
              </div>
              <AddTeamMemberButton teamId={session?.session.activeTeamId ?? null} />
            </CardHeader>
            <CardContent>
              <TeamMembersList teamId={session?.session.activeTeamId ?? null} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations">
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1.5">
                <CardTitle>Invitations</CardTitle>
                <CardDescription>Track pending invites for this team.</CardDescription>
              </div>
              <InviteMemberButton teamId={session?.session.activeTeamId ?? null} />
            </CardHeader>
            <CardContent>
              <OrganizationInvitationsList teamId={session?.session.activeTeamId ?? null} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
