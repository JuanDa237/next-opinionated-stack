'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth/auth-client';
import { Button } from '@/components/ui/button';
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
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Passkey } from '@better-auth/passkey';

type PasskeyListProps = {
  passkeys: Passkey[];
};

export function PasskeyList({ passkeys }: PasskeyListProps) {
  if (passkeys.length === 0) {
    return (
      <Card className="my-4">
        <CardHeader>
          <CardTitle>No passkeys yet</CardTitle>
          <CardDescription>
            Add your first passkey for secure, passwordless authentication.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="my-4">
      {passkeys.map(passkey => (
        <Card key={passkey.id}>
          <CardHeader className="flex items-center justify-between gap-2">
            <div className="space-y-1">
              <CardTitle>{passkey.name ?? 'Unnamed passkey'}</CardTitle>
              <CardDescription>
                Created {new Date(passkey.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <PasskeyDeleteButton passkeyId={passkey.id} passkeyName={passkey.name} />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function PasskeyDeleteButton({
  passkeyId,
  passkeyName,
}: {
  passkeyId: string;
  passkeyName?: string | null;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeletePasskey() {
    setIsDeleting(true);

    try {
      await authClient.passkey.deletePasskey(
        { id: passkeyId },
        {
          onError: error => {
            toast.error(
              error?.error?.message ?? 'We could not delete your passkey. Please try again.'
            );
          },
          onSuccess: () => {
            router.refresh();
          },
        }
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="text-red-500"
          aria-label={passkeyName ? `Delete ${passkeyName}` : 'Delete passkey'}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete passkey</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You will need to set up this passkey again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleDeletePasskey} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
