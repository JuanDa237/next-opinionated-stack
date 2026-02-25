import { Input } from '@/components/ui/input';

interface MembersSearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  totalMembers: number;
  startIndex: number;
  pageSize: number;
}

export function MembersSearchBar({
  searchValue,
  onSearchChange,
  totalMembers,
  startIndex,
  pageSize,
}: MembersSearchBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
      <Input
        value={searchValue}
        onChange={event => onSearchChange(event.target.value)}
        placeholder="Filter by name or email"
        className="w-full sm:max-w-xs"
      />
      <span className="text-xs text-muted-foreground">
        {totalMembers === 0
          ? 'No matching members'
          : `Showing ${Math.min(totalMembers, startIndex + 1)}-${Math.min(
              totalMembers,
              startIndex + pageSize
            )} of ${totalMembers}`}
      </span>
    </div>
  );
}
