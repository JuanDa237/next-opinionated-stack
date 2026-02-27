import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

// Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OrganizationsTable } from '@/features/organizations/components/organizations-table';
import { Building2 } from 'lucide-react';
import { CreateOrganizationButton } from '@/features/organizations/components/create-organization-button';
import { Organization } from 'better-auth/plugins';
import { parsePositiveInt } from '@/lib/helpers';

type PageProps = {
  searchParams?: {
    page?: string;
    limit?: string;
    q?: string;
  };
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  const limit = Math.min(100, parsePositiveInt(resolvedSearchParams?.limit, 10));
  const page = parsePositiveInt(resolvedSearchParams?.page, 1);
  const offset = (page - 1) * limit;
  const queryValue = resolvedSearchParams?.q?.trim();

  // Fetch all organizations
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  // Filter and paginate organizations
  const filteredOrganizations =
    organizations?.filter((org: Organization) => {
      if (!queryValue) return true;
      return (
        org.name.toLowerCase().includes(queryValue.toLowerCase()) ||
        org.slug.toLowerCase().includes(queryValue.toLowerCase())
      );
    }) ?? [];

  const total = filteredOrganizations.length;
  const paginatedOrganizations = filteredOrganizations.slice(offset, offset + limit);

  // For simplicity, we'll fetch member count for each organization
  const organizationsWithMemberCount = await Promise.all(
    paginatedOrganizations.map(async (org: Organization) => {
      try {
        const members = await auth.api.listMembers({
          headers: await headers(),
          query: {
            organizationId: org.id,
            limit: 1,
          },
        });
        return {
          ...org,
          membersCount: members.total ?? 0,
        };
      } catch {
        return {
          ...org,
          membersCount: 0,
        };
      }
    })
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6">
      <div>
        <div className="mb-4">
          <div>
            <div className="flex">
              <h1 className="flex items-center gap-2 text-lg font-semibold">
                <Building2 className="size-5" />
                Organizations ({total})
              </h1>
              <CreateOrganizationButton className="ml-auto" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Manage organizations.</p>
          </div>
          <form className="mt-4 flex flex-col gap-3 sm:flex-row" method="get">
            <Input
              name="q"
              placeholder="Search by name or slug"
              defaultValue={queryValue}
              className="sm:max-w-xs"
            />
            <div className="flex gap-2">
              <Button type="submit" variant="secondary">
                Search
              </Button>
              {queryValue ? (
                <Button type="submit" variant="ghost" name="q" value="">
                  Clear
                </Button>
              ) : null}
            </div>
          </form>
        </div>
        <OrganizationsTable
          organizations={organizationsWithMemberCount}
          total={total}
          limit={limit}
          offset={offset}
          query={{ q: queryValue }}
        />
      </div>
    </div>
  );
}
