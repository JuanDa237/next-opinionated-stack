'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';

export function DangerZone() {
  function handleDeleteAccount() {
    authClient.deleteUser(
      {
        callbackURL: '/admin/deletion-confirmed',
      },
      {
        onSuccess: () => {
          toast.success('Account deletion initiated. Please check your email to confirm.');
        },
      }
    );
  }

  return (
    <Card id="danger-zone" className="border-destructive/40 bg-destructive/5 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-destructive">Danger zone</CardTitle>
        <CardDescription>These actions are irreversible. Proceed with caution.</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="mb-6" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Delete this account</p>
            <p className="text-xs text-muted-foreground">
              Permanently remove your data and revoke all access.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete account</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account and all associated data. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount}>Delete account</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
