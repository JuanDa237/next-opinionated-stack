import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/auth';
import { SUPPORTED_OAUTH_PROVIDERS } from '@/lib/auth/o-auth-providers';
import { headers } from 'next/headers';
import { AccountCard } from './actions/account-card';

export async function AccountsSection() {
  const accounts = await auth.api.listUserAccounts({ headers: await headers() });

  const nonCredentialAccounts = accounts.filter(account => account.providerId !== 'credential');

  const accountsByProvider = new Map(
    nonCredentialAccounts.map(account => [account.providerId, account])
  );

  return (
    <Card id="accounts" className="bg-background/80 shadow-sm backdrop-blur">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">Connected accounts</CardTitle>
            <CardDescription>Control which providers can you log in with.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Separator className="mb-6" />
        <div className="space-y-4 text-sm">
          {SUPPORTED_OAUTH_PROVIDERS.map(providerId => (
            <AccountCard
              key={providerId}
              providerId={providerId}
              account={accountsByProvider.get(providerId)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
