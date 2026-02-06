'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';

export function EmailVerificationResend({ email }: { email: string | null }) {
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [resendCount, setResendCount] = useState(0);

  const baseResendSeconds = 30;

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setCooldownSeconds(current => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldownSeconds]);

  return (
    <Button
      className="mt-4"
      variant="outline"
      disabled={!email || cooldownSeconds > 0}
      onClick={async () => {
        if (!email || cooldownSeconds > 0) {
          return;
        }

        await authClient.sendVerificationEmail({ email, callbackURL: '/admin/email-verification' });
        const nextCount = resendCount + 1;
        setResendCount(nextCount);
        setCooldownSeconds(baseResendSeconds * nextCount);
      }}
    >
      {cooldownSeconds > 0
        ? `Resend available in ${cooldownSeconds}s`
        : 'Resend Verification Email'}
    </Button>
  );
}
