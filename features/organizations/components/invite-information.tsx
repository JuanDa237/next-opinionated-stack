'use client';

import { Button } from '@/components/ui/button';
import { AUTH_ROUTES } from '@/features/admin/helpers';
import { setActiveOrganization } from '@/features/auth/helpers';
import { authClient } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function InviteInformation({
  invitation,
}: {
  invitation: { id: string; organizationId: string };
}) {
  const router = useRouter();

  function acceptInvite() {
    return authClient.organization.acceptInvitation(
      { invitationId: invitation.id },
      {
        onSuccess: async () => {
          setActiveOrganization(invitation.organizationId);
        },
        onError: () => {
          toast.error('Failed to accept the invitation. Please try again later.');
        },
      }
    );
  }

  function rejectInvite() {
    return authClient.organization.rejectInvitation(
      {
        invitationId: invitation.id,
      },
      {
        onSuccess: () => router.push(AUTH_ROUTES.SELECT_ORGANIZATION),
        onError: () => {
          toast.error('Failed to reject the invitation. Please try again later.');
        },
      }
    );
  }

  return (
    <div className="flex gap-4">
      <Button className="flex-grow" onClick={acceptInvite}>
        Accept
      </Button>
      <Button className="flex-grow" variant="destructive" onClick={rejectInvite}>
        Reject
      </Button>
    </div>
  );
}
