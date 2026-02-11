'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { ChangePasswordForm } from './change-password-form';

export function ChangePasswordDialog() {
  return (
    <div className="flex flex-col items-center md:flex-row md:justify-between">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">Change password</h3>
        <p className="text-sm text-muted-foreground">
          Update your password to keep your account secure.
        </p>
      </div>

      <Dialog>
        <div className="mt-2 flex flex-wrap items-center gap-3 md:mt-0">
          <DialogTrigger asChild>
            <Button>Change password</Button>
          </DialogTrigger>
        </div>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              Choose a strong password you do not use anywhere else.
            </DialogDescription>
          </DialogHeader>
          <ChangePasswordForm className="pt-2" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
