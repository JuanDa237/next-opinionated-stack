'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold">Welcome {data?.user?.name}</h1>
      <Button
        className="mt-4"
        onClick={async () => {
          await authClient.signOut();
          router.push('/admin/signin');
        }}
      >
        Sign Out
      </Button>
    </>
  );
}
