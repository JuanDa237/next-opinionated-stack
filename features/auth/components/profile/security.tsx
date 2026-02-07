import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <Card id="security" className="bg-background/80 shadow-sm backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl">Security</CardTitle>
        <CardDescription>Strengthen access to keep your account protected.</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="mb-6" />

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
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-3">
        <Button variant="outline">Enable 2FA</Button>
      </CardFooter>
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
