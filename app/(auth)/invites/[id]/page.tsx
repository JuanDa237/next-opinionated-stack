import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Auth
import { auth } from '@/lib/auth/auth';
import { AUTH_ROUTES } from '@/features/admin/helpers';

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InviteInformation } from '@/features/organizations/components/invite-information';

export default async function InvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const invitation = await auth.api.getInvitation({
    headers: await headers(),
    query: { id },
  });

  if (!invitation) {
    redirect(AUTH_ROUTES.SELECT_ORGANIZATION);
  }

  return (
    <Card className="w-full border bg-background/80 shadow-xl shadow-black/5 backdrop-blur">
      <CardHeader className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Invitation
        </p>
        <CardTitle className="text-3xl font-semibold tracking-tight">
          Join {invitation.organizationName}
        </CardTitle>
        <CardDescription className="text-base">
          You have been invited to join as a{' '}
          <span className="text-foreground font-medium">{invitation.role}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InviteInformation invitation={invitation} />
      </CardContent>
    </Card>
  );
}
