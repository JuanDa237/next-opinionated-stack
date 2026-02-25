'use client';

import * as React from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { columns, type OrganizationsTableRow } from './organizations-columns';

type OrganizationsTableProps = {
  organizations: OrganizationsTableRow[];
  total: number;
  limit: number;
  offset: number;
  query?: Record<string, string | undefined>;
};

export function OrganizationsTable({
  organizations,
  total,
  limit,
  offset,
  query,
}: OrganizationsTableProps) {
  const tableColumns = React.useMemo(() => columns(), []);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: organizations,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(totalPages, Math.floor(offset / limit) + 1);
  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });
    }
    return `/admin/organizations/manage?${params.toString()}`;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableColumns.length} className="h-24 text-center text-sm">
                  No organizations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div>
        <span className="text-sm text-muted-foreground">
          Showing {Math.min(total, offset + 1)}-{Math.min(total, offset + limit)} of {total}
        </span>
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={pageHref(currentPage - 1)} />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages })
                .map((_, i) => {
                  const page = i + 1;
                  const isActive = page === currentPage;
                  const isInRange =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1);

                  if (!isInRange) {
                    return null;
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink href={pageHref(page)} isActive={isActive}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })
                .filter(Boolean)}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext href={pageHref(currentPage + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
