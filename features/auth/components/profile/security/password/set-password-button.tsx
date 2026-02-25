'use client';

import { useState } from 'react';

// Components
import { CountdownSubmitButton } from '@/components/common/countdown-submit-button';

// Libs
import { authClient } from '@/lib/auth/auth-client';

export function SetPasswordButton() {
  const { data } = authClient.useSession();
  const email = data?.user.email;

  const [cooldownKey, setCooldownKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <CountdownSubmitButton
      variant="outline"
      type="button"
      disabled={!email}
      isSubmitting={isSubmitting}
      cooldownKey={cooldownKey}
      baseResendSeconds={30}
      label="Set Password Email"
      cooldownLabel={seconds => `Resend available in ${seconds}s`}
      onClick={async () => {
        if (!email) {
          return;
        }

        setIsSubmitting(true);
        try {
          await authClient.requestPasswordReset({
            email,
            redirectTo: '/admin/reset-password',
          });
          setCooldownKey(current => current + 1);
        } finally {
          setIsSubmitting(false);
        }
      }}
    />
  );
}
