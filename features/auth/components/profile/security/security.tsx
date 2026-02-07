import { headers } from 'next/headers';

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Libs
import { auth } from '@/lib/auth';

// Sections
import { ChangePasswordDialog } from './password/change-password-dialog';
import { SetPassword } from './password/set-password';
import { TwoFactorDialogWrapper } from './two-factor/two-factor-dialog-wrapper';
import { Passkey } from './passkey/passkey';

export async function SecuritySection() {
  const accounts = await auth.api.listUserAccounts({ headers: await headers() });

  const havePassword = accounts.some(account => account.providerId === 'credential');

  return (
    <Card id="security" className="bg-background/80 shadow-sm backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl">Security</CardTitle>
        <CardDescription>Strengthen access to keep your account protected.</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="mb-6" />

        {havePassword ? <ChangePasswordDialog /> : <SetPassword />}

        <Separator className="my-6" />

        <TwoFactorDialogWrapper />

        <Separator className="my-6" />

        <Passkey />
      </CardContent>
    </Card>
  );
}
