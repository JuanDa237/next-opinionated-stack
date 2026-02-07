'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { authClient } from '@/lib/auth/auth-client';
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SupportedOAuthProvider,
} from '@/lib/auth/o-auth-providers';
import { Account } from 'better-auth';
import { Shield, Unlink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AccountCard({
  providerId,
  account,
}: {
  providerId: SupportedOAuthProvider;
  account?: Account;
}) {
  const providerDetails = SUPPORTED_OAUTH_PROVIDER_DETAILS[providerId] ?? {
    name: providerId,
    Icon: () => <Shield className="size-4 text-muted-foreground" aria-hidden="true" />,
  };

  const router = useRouter();

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC',
    }).format(new Date(date));
  }

  async function linkAccount() {
    await authClient.linkSocial({
      provider: providerId as SupportedOAuthProvider,
      callbackURL: '/admin/profile',
    });
  }

  async function unlinkAccount() {
    if (!account) return;

    await authClient.unlinkAccount(
      {
        accountId: account.accountId,
        providerId,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  }

  const linkedAt = account?.createdAt ? formatDate(account.createdAt) : null;

  return (
    <Card className="flex flex-row items-center justify-between gap-4 px-4 py-3 shadow-none">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted/30">
          <providerDetails.Icon />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-medium">{providerDetails.name}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {linkedAt ? <span>Linked {linkedAt}</span> : <span>Not linked</span>}
          </div>
        </div>
      </div>
      {account ? (
        <Button variant="outline" size="sm" className="text-red-500" onClick={unlinkAccount}>
          <Unlink className="mr-2 size-4" aria-hidden="true" />
          Unlink
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={linkAccount}>
          Link
        </Button>
      )}
    </Card>
  );
}
