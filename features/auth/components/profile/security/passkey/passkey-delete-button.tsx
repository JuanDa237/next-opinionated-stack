'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Libs
import { toast } from 'sonner';
import { authClient } from '@/lib/auth/auth-client';

// Components
import { Trash2 } from 'lucide-react';
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

export function PasskeyDeleteButton({
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
