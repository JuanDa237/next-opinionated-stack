'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Fingerprint } from 'lucide-react';

import { authClient } from '@/lib/auth/auth-client';
import { getSafeCallbackURL } from '../../utils';

type PasskeySigninButtonProps = {
  callbackURL?: string;
};

export function PasskeySigninButton({ callbackURL }: PasskeySigninButtonProps) {
  const router = useRouter();
  const safeCallbackURL = getSafeCallbackURL(callbackURL);

  useEffect(() => {
    // TODO: This is automatic way is not working
    // if (
    //   !PublicKeyCredential.isConditionalMediationAvailable ||
    //   !PublicKeyCredential.isConditionalMediationAvailable()
    // ) {
    //   return;
    // }
    // try {
    //   authClient.signIn.passkey({ autoFill: true });
    // } catch (error) {
    //   console.warn('Error during automatic passkey sign-in:', error);
    // }
  }, []);

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        authClient.signIn.passkey(undefined, {
          onSuccess: () => {
            router.push(safeCallbackURL);
          },
        });
      }}
    >
      <Fingerprint />
      Passkey (Browser)
    </Button>
  );
}
