'use client';

import { OrganizationDashboard } from '@/features/organizations/containers/organization-dashboard';
import { GradientBackground } from '@/components/common/gradient-background';
import { authClient } from '@/lib/auth/auth-client';

export default function Page() {
  const { data: activeOrganization } = authClient.useActiveOrganization();

  return (
    <GradientBackground>
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Organizations
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Manage {activeOrganization?.name}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage your organization members, teams, invitations and roles.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-16">
        <OrganizationDashboard />
      </div>
    </GradientBackground>
  );
}
