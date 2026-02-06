'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function EmailVerificationSkeleton() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-2">
      <Skeleton className="h-7 w-3/4" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}
