import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface MembersPaginationProps {
  currentPage: number;
  totalPages: number;
  totalMembers: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function MembersPagination({
  currentPage,
  totalPages,
  totalMembers,
  pageSize,
  onPageChange,
}: MembersPaginationProps) {
  if (totalMembers <= pageSize) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              onClick={event => {
                event.preventDefault();
                onPageChange(Math.max(1, currentPage - 1));
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive onClick={event => event.preventDefault()}>
              {currentPage}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={currentPage >= totalPages}
              className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
              onClick={event => {
                event.preventDefault();
                onPageChange(Math.min(totalPages, currentPage + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <span className="text-xs text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
