import type { CellContext, ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { ManageUserActions } from '../../../../features/users/components/manage-user-actions';

const formatRole = (value?: string | null) => {
  if (!value) {
    return 'user';
  }

  const roles = value
    .split(',')
    .map(role => role.trim())
    .filter(Boolean);

  if (roles.includes('tics')) {
    return 'tics';
  }

  if (roles.includes('admin')) {
    return 'admin';
  }

  return roles[0] ?? 'user';
};

const formatDate = (value?: string | Date | null) => {
  if (!value) {
    return 'Unknown';
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
};

export type UsersTableRow = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  createdAt?: string | Date | null;
  banned?: boolean | null;
};

export const columns = (selfId?: string): ColumnDef<UsersTableRow>[] => [
  {
    accessorKey: 'name',
    header: 'User',
    cell: ({ row }: CellContext<UsersTableRow, unknown>) => {
      const name = row.original.name ?? 'No name';
      const email = row.original.email ?? 'No email';

      return (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{name}</span>
          <span className="text-xs text-muted-foreground">{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }: CellContext<UsersTableRow, unknown>) => {
      const role = formatRole(row.original.role);
      const isElevated = role === 'admin' || role === 'tics';

      return (
        <Badge variant={isElevated ? 'default' : 'outline'} className="capitalize">
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }: CellContext<UsersTableRow, unknown>) => (
      <span className="text-sm">{formatDate(row.original.createdAt)}</span>
    ),
  },
  {
    accessorKey: 'banned',
    header: 'Status',
    cell: ({ row }: CellContext<UsersTableRow, unknown>) => {
      const banned = Boolean(row.original.banned);
      return (
        <Badge variant={banned ? 'destructive' : 'secondary'}>{banned ? 'Banned' : 'Active'}</Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: CellContext<UsersTableRow, unknown>) => (
      <ManageUserActions
        userId={row.original.id}
        isSelf={row.original.id === selfId}
        banned={Boolean(row.original.banned)}
      />
    ),
  },
];
