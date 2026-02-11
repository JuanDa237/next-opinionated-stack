'use client';

// Libs
import { Passkey } from '@better-auth/passkey';

// Components
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PasskeyDeleteButton } from './passkey-delete-button';

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
