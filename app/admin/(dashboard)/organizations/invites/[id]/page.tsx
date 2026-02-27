import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Auth
import { auth } from '@/lib/auth/auth';
import { AUTH_ROUTES } from '@/features/admin/helpers';

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InviteInformation } from '@/features/organizations/components/invite-information';
import { GradientBackground } from '@/components/common/gradient-background';

export default async function InvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const invitation = await auth.api.getInvitation({
    headers: await headers(),
    query: { id },
  });

  if (!invitation) {
    redirect(AUTH_ROUTES.DASHBOARD);
  }

  return (
    <GradientBackground className="h-full">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-10 sm:px-6">
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
      </div>
    </GradientBackground>
  );
}
