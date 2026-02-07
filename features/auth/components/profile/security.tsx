import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { SetPasswordButton } from './actions/set-password-button';
import { ChangePasswordForm } from './change-password-form';
import { TwoFactorForm } from './two-factor-form';

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

        {havePassword ? <ChangePasswordForm /> : <SetPassword />}

        <Separator className="my-6" />

        <TwoFactorAuth />
      </CardContent>
    </Card>
  );
}

function SetPassword() {
  return (
    <div className="flex flex-col md:flex-row md:justify-between items-center">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">Set password</h3>
        <p className="text-sm text-muted-foreground">
          We will send you an email with the steps to continue.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-2 md:mt-0">
        <SetPasswordButton />
      </div>
    </div>
  );
}

async function TwoFactorAuth() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return null;

  return (
    <div className="flex flex-col">
      <h3 className="text-sm font-semibold">Security Note</h3>
      <p className="text-sm text-muted-foreground">
        Enable a 2FA app for an extra layer of protection.
        <br />
        This will require you to enter a code from your authenticator app each time you sign in.
      </p>
      <TwoFactorForm isEnabled={session.user.twoFactorEnabled ?? false} />
    </div>
  );
}
