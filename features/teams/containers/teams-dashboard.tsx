'use client';

// import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrganizationInvitationsList } from '@/features/organizations/components/organization-invitations-list';
import { authClient } from '@/lib/auth/auth-client';
import { TeamMembersList } from '../components/team-members-list';
import { InviteTeamMemberButton } from '../components/invite-team-member-button';
import { AddTeamMemberButton } from '../components/add-team-member-button';

export function TeamsDashboard() {
  // const [teamsRefreshKey, setTeamsRefreshKey] = useState(0);

  const { data: session } = authClient.useSession();

  return (
    // <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
    <div className="grid gap-8">
      {/* <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Workspace
          </p>
          <OrganizationSelect />
        </div>
        <CreateTeamButton />
      </div> */}

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
              <InviteTeamMemberButton teamId={session?.session.activeTeamId ?? null} />
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
