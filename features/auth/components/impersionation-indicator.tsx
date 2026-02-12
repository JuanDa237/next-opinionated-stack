'use client';

import { authClient } from '@/lib/auth/auth-client';
import { UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function ImpersonationIndicator() {
  const router = useRouter();
  const { data, refetch } = authClient.useSession();

  if (data?.session.impersonatedBy == null) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() =>
          authClient.admin.stopImpersonating(undefined, {
            onSuccess: () => {
              router.push('/admin');
              refetch();
            },
          })
        }
        variant="destructive"
        size="sm"
      >
        <UserX className="size-4" />
      </Button>
    </div>
  );
}
