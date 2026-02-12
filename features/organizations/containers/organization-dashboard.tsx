'use client';

import { CreateOrganizationButton } from '../components/create-organization-button';
import { InviteMemberButton } from '../components/invite-member-button';
import { OrganizationInvitationsList } from '../components/organization-invitations-list';
import { OrganizationMembersList } from '../components/organization-members-list';
import { OrganizationSelect } from '../components/organization-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function OrganizationDashboard() {
  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Workspace
          </p>
          <OrganizationSelect />
        </div>
        <CreateOrganizationButton />
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
