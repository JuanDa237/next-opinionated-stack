import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';

// Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UsersTable } from '@/features/users/components/users-table';
import { Users } from 'lucide-react';

type PageProps = {
  searchParams?: {
    page?: string;
    limit?: string;
    q?: string;
  };
};

const parsePositiveInt = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.floor(parsed);
};

export default async function Page({ searchParams }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/admin/signin');
  }

  // Check if user has 'list' permission for 'user' resource, refer to lib\auth\admin-access.ts
  // Only tics role can list users
  const permission = await auth.api.userHasPermission({
    headers: await headers(),
    body: { permission: { user: ['list'] } },
  });

  if (!permission?.success) {
    redirect('/admin');
  }

  const resolvedSearchParams = await searchParams;

  const limit = Math.min(100, parsePositiveInt(resolvedSearchParams?.limit, 10));
  const page = parsePositiveInt(resolvedSearchParams?.page, 1);
  const offset = (page - 1) * limit;
  const queryValue = resolvedSearchParams?.q?.trim();

  const users = await auth.api.listUsers({
    headers: await headers(),
    query: {
      limit,
      offset,
      sortBy: 'createdAt',
      sortDirection: 'desc',
      ...(queryValue
        ? {
            searchValue: queryValue,
            searchField: 'email',
            searchOperator: 'contains',
          }
        : {}),
    },
  });

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6">
      <div>
        <div className="mb-4">
          <h1 className="flex items-center gap-2 text-lg font-semibold">
            <Users className="size-5" />
            Users ({users.total ?? 0})
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage user accounts, roles, and access.
          </p>
          <form className="mt-4 flex flex-col gap-3 sm:flex-row" method="get">
            <Input
              name="q"
              placeholder="Search by email"
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
        <UsersTable
          users={users.users ?? []}
          total={users.total ?? 0}
          limit={'limit' in users ? (users.limit ?? limit) : limit}
          offset={'offset' in users ? (users.offset ?? offset) : offset}
          selfId={session.user?.id}
          query={{ q: queryValue }}
        />
      </div>
    </div>
  );
}
