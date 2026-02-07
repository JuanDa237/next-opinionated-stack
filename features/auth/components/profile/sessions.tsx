import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { SessionCard } from './actions/session-card';
import { RevokeOtherSessionsButton } from './actions/revoke-other-sessions';

export async function SessionsSection() {
  const currentSession = await auth.api.getSession({ headers: await headers() });
  const currentToken = currentSession?.session.token;

  const sessions = await auth.api.listSessions({ headers: await headers() });

  const orderedSessions = currentToken
    ? [...sessions].sort(
        (a, b) => (a.token === currentToken ? -1 : 0) + (b.token === currentToken ? 1 : 0)
      )
    : sessions;

  return (
    <Card id="sessions" className="bg-background/80 shadow-sm backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Sessions</CardTitle>
            <CardDescription>See where you are logged in right now.</CardDescription>
          </div>
          <RevokeOtherSessionsButton />
        </div>
      </CardHeader>
      <CardContent>
        <Separator className="mb-6" />
        <div className="space-y-4 text-sm">
          {/* {[
            'MacBook Pro · Medellin · 2 minutes ago',
            'iPhone 15 · Bogota · 3 hours ago',
            'Chrome on Windows · Miami · Yesterday',
          ].map(session => (
            <div
              key={session}
              className="flex items-center justify-between rounded-xl border border-dashed px-4 py-3"
            >
              <span>{session}</span>
              <Button variant="ghost" size="sm">
                Revoke
              </Button>
            </div>
          ))} */}

          {orderedSessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              isCurrent={session.token === currentToken}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
