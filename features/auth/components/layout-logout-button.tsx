'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LayoutLogoutButton() {
  const { data: session } = authClient.useSession();

  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut(undefined, {
      onSuccess: () => {
        router.refresh();
      },
    });
  };

  if (!session) return null;

  return (
    <Button className="ml-auto" onClick={handleSignOut}>
      <LogOut className="h-4 w-4" /> Logout
    </Button>
  );
}
