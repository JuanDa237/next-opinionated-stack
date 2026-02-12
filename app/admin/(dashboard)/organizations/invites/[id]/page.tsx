import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InviteInformation } from '@/features/organizations/components/invite-information';

export default async function InvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) return redirect('/auth/login');

  const { id } = await params;

  const invitation = await auth.api
    .getInvitation({
      headers: await headers(),
      query: { id },
    })
    .catch(() => redirect('/'));

  return (
    <div className="relative overflow-hidden h-full">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_480px_at_10%_-10%,rgba(14,116,144,0.22),transparent),radial-gradient(900px_500px_at_90%_0%,rgba(244,114,182,0.18),transparent)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(120deg,rgba(255,255,255,0.08)_0%,transparent_35%,transparent_65%,rgba(255,255,255,0.08)_100%)]" />
      <div className="relative mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-10 sm:px-6">
        <Card className="w-full border bg-background/80 shadow-xl shadow-black/5 backdrop-blur">
          <CardHeader className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Invitation
            </p>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              Join {invitation.organizationName}
            </CardTitle>
            <CardDescription className="text-base">
              You have been invited to join as a {invitation.role}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InviteInformation invitation={invitation} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
