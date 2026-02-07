'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';

export function RevokeOtherSessionsButton() {
  const router = useRouter();

  function revokeOtherSessions() {
    return authClient.revokeOtherSessions(undefined, {
      onSuccess: () => {
        router.refresh();
      },
    });
  }

  return (
    <Button className="ml-2" variant="outline" onClick={revokeOtherSessions}>
      Sign out all
    </Button>
  );
}
