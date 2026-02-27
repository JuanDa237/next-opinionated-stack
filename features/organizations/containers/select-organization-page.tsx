'use client';

import { useEffect } from 'react';

// Libs
import { authClient } from '@/lib/auth/auth-client';

// Components
import { NoOrganizationsState } from '../components/select-organization/no-organizations-state';

// Helpers
import { OrganizationList } from '../components/select-organization/organization-list';
import { LoadingOrganizations } from '../components/select-organization/loading-organizations';
import { setActiveOrganization } from '@/features/auth/helpers';

interface Props {
  mainDomain: string | null;
}

export function SelectOrganizationPage({}: Props) {
  const { data: session } = authClient.useSession();

  const {
    data: organizations,
    isPending: isOrgsPending,
    refetch: refetchOrganizations,
  } = authClient.useListOrganizations();

  // Refetch organizations when impersonation changes
  useEffect(() => {
    if (session?.user?.id) {
      refetchOrganizations();
    }
  }, [session?.user?.id, session?.session?.impersonatedBy, refetchOrganizations]);

  if (!session || isOrgsPending) return <LoadingOrganizations />;

  if (!organizations || organizations.length === 0) return <NoOrganizationsState />;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Select Organization</h1>
        <p className="text-muted-foreground text-sm">
          Choose an organization to access your workspace.
        </p>
      </div>
      <OrganizationList organizations={organizations} onSelect={setActiveOrganization} />
    </div>
  );
}
