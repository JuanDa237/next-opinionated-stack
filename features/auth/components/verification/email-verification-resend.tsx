'use client';

import { useState } from 'react';

import { CountdownSubmitButton } from '@/components/common/countdown-submit-button';
import { authClient } from '@/lib/auth/auth-client';

export function EmailVerificationResend({ email }: { email: string | null }) {
  const [cooldownKey, setCooldownKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <CountdownSubmitButton
      className="mt-4"
      variant="outline"
      type="button"
      disabled={!email}
      isSubmitting={isSubmitting}
      cooldownKey={cooldownKey}
      baseResendSeconds={30}
      initialCooldownSeconds={30}
      label="Resend Verification Email"
      cooldownLabel={seconds => `Resend available in ${seconds}s`}
      onClick={async () => {
        if (!email) {
          return;
        }

        setIsSubmitting(true);
        try {
          await authClient.sendVerificationEmail({
            email,
            callbackURL: '/admin/email-verification',
          });
          setCooldownKey(current => current + 1);
        } finally {
          setIsSubmitting(false);
        }
      }}
    />
  );
}
