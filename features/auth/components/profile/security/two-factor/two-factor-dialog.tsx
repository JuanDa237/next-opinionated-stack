'use client';

// Components
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { TwoFactorForm } from './two-factor-form';

type TwoFactorDialogProps = {
  isEnabled: boolean;
};

export function TwoFactorDialog({ isEnabled }: TwoFactorDialogProps) {
  const buttonLabel = isEnabled ? 'Manage 2FA' : 'Set up 2FA';
  const dialogDescription = isEnabled
    ? 'Manage or disable two-factor authentication for this account.'
    : 'Set up an authenticator app to protect your account.';

  return (
    <div className="flex flex-col items-center md:flex-row md:justify-between">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">Two-Factor Authentication</h3>
        <p className="text-sm text-muted-foreground">
          Enable a 2FA app for an extra layer of protection.
          <br />
          This will require you to enter a code from your authenticator app each time you sign in.
        </p>
      </div>

      <Dialog>
        <div className="mt-2 flex flex-wrap items-center gap-3 md:mt-0">
          <DialogTrigger asChild>
            <Button variant={isEnabled ? 'outline' : 'default'}>{buttonLabel}</Button>
          </DialogTrigger>
        </div>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Two-Factor Authentication</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <TwoFactorForm isEnabled={isEnabled} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
