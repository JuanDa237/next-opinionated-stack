import Image from 'next/image';
import { JSX } from 'react';

export const SUPPORTED_OAUTH_PROVIDERS = ['google'] as const;
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export type OAuthProviderDetails = {
  name: string;
  Icon: () => JSX.Element;
};

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProvider,
  OAuthProviderDetails
> = {
  google: {
    name: 'Google',
    Icon: () => (
      <Image
        src="/google-icon.svg"
        alt="Google"
        width={24}
        height={24}
        style={{ width: 24, height: 24 }}
      />
    ),
  },
};
