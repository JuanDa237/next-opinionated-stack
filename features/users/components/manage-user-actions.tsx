import { MoreHorizontal } from 'lucide-react';

import { authClient } from '@/lib/auth/auth-client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export type UsersTableRow = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  createdAt?: string | Date | null;
  banned?: boolean | null;
};

type ManageUserActionsProps = {
  userId: string;
  isSelf: boolean;
  banned: boolean;
};

export function ManageUserActions({ userId, isSelf, banned }: ManageUserActionsProps) {
  const router = useRouter();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const runAction = async (action: () => Promise<unknown>) => {
    setIsBusy(true);
    try {
      await action();
      router.refresh();
    } finally {
      setIsBusy(false);
    }
  };

  const handleImpersonate = () =>
    runAction(async () => {
      await authClient.admin.impersonateUser({ userId });
      router.push('/admin');
      router.refresh();
    });

  const handleRevokeSessions = () =>
    runAction(() => authClient.admin.revokeUserSessions({ userId }));

  const handleBanToggle = () =>
    runAction(() =>
      banned ? authClient.admin.unbanUser({ userId }) : authClient.admin.banUser({ userId })
    );

  const handleDelete = () =>
    runAction(async () => {
      await authClient.admin.removeUser({ userId });
      setIsDeleteOpen(false);
    });

  if (isSelf) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary" className="px-2 py-0.5 text-[11px]">
          You
        </Badge>
        <span>Signed-in user</span>
      </div>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" disabled={isBusy} className="gap-2">
            <MoreHorizontal className="size-4" />
            Manage
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onSelect={handleImpersonate} disabled={isBusy}>
            Impersonate
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleRevokeSessions} disabled={isBusy}>
            Revoke sessions
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleBanToggle} disabled={isBusy}>
            {banned ? 'Unban user' : 'Ban user'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={event => {
              event.preventDefault();
              setIsDeleteOpen(true);
            }}
            disabled={isBusy}
            className="text-destructive focus:text-destructive"
          >
            Delete user
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action permanently removes the user and all related data. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBusy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={event => {
                event.preventDefault();
                void handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isBusy}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
