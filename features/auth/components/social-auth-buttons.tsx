'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
} from '@/lib/auth/o-auth-providers';
import { getSafeCallbackURL } from '../utils';

type SocialAuthButtonsProps = {
  callbackURL?: string;
};

export function SocialAuthButtons({ callbackURL }: SocialAuthButtonsProps) {
  const safeCallbackURL = getSafeCallbackURL(callbackURL);

  return SUPPORTED_OAUTH_PROVIDERS.map(provider => {
    const IconComponent = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon;

    return (
      <Button
        type="button"
        variant="outline"
        key={provider}
        onClick={() => {
          return authClient.signIn.social({
            provider,
            callbackURL: safeCallbackURL,
          });
        }}
      >
        <IconComponent />
        {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
      </Button>
    );
  });
}
