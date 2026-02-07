import { headers } from 'next/headers';

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { RevokeOtherSessionsButton } from './revoke-other-sessions';
import { SessionCard } from './session-card';

// Libs
import { auth } from '@/lib/auth';

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
