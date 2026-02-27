'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTES } from '@/features/admin/helpers';

export function EmailVerifiedRedirect({
  email,
  initialSeconds = 5,
}: {
  email: string;
  initialSeconds?: number;
}) {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      router.replace(AUTH_ROUTES.SELECT_ORGANIZATION);
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft(current => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [router, secondsLeft]);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-2 text-center">
      <h1 className="text-2xl font-bold">Your email {email} was successfully verified.</h1>
      <p className="text-muted-foreground text-sm">Redirecting in {secondsLeft}...</p>
    </div>
  );
}
