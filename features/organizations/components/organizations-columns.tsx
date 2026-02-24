import type { CellContext, ColumnDef } from '@tanstack/react-table';

import { ManageOrganizationActions } from './manage-organization-actions';

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

export type OrganizationsTableRow = {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  createdAt?: string | Date | null;
  membersCount?: number;
};

export const columns = (): ColumnDef<OrganizationsTableRow>[] => [
  {
    accessorKey: 'name',
    header: 'Organization',
    cell: ({ row }: CellContext<OrganizationsTableRow, unknown>) => {
      const name = row.original.name ?? 'No name';
      const slug = row.original.slug ?? '';

      return (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{name}</span>
          <span className="text-xs text-muted-foreground">@{slug}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'membersCount',
    header: 'Members',
    cell: ({ row }: CellContext<OrganizationsTableRow, unknown>) => (
      <span className="text-sm">{row.original.membersCount ?? 0}</span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }: CellContext<OrganizationsTableRow, unknown>) => (
      <span className="text-sm">{formatDate(row.original.createdAt)}</span>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: CellContext<OrganizationsTableRow, unknown>) => (
      <ManageOrganizationActions organizationId={row.original.id} />
    ),
  },
];
