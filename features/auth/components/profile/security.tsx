import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { SetPasswordButton } from './actions/set-password-button';
import { ChangePasswordForm } from './change-password-form';

export async function SecuritySection() {
  const accounts = await auth.api.listUserAccounts({ headers: await headers() });

  const havePassword = accounts.some(account => account.providerId === 'credential');

  return (
    <section
      id="security"
      className="rounded-2xl border bg-background/80 p-6 shadow-sm backdrop-blur"
    >
      <h2 className="text-xl font-semibold">Security</h2>
      <p className="text-sm text-muted-foreground">
        Strengthen access to keep your account protected.
      </p>
      <Separator className="my-6" />

      {havePassword ? <ChangePasswordForm /> : <SetPassword />}

      <Separator className="my-6" />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="securityNote">Security note</Label>
          <Input
            id="securityNote"
            placeholder="Enable a 2FA app for an extra layer of protection."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button variant="outline">Enable 2FA</Button>
      </div>
    </section>
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
