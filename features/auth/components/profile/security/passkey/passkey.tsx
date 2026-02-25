import { headers } from 'next/headers';

// Libs
import { auth } from '@/lib/auth';

// Sections
import { PasskeyList } from './passkey-list';
import { PasskeyCreateDialog } from './passkey-create-dialog';

export async function Passkey() {
  const passkeys = await auth.api.listPasskeys({ headers: await headers() });

  return (
    <div className="flex flex-col">
      <h3 className="text-sm font-semibold">Passkeys</h3>
      <p className="text-sm text-muted-foreground">
        Manage your passkey authentication methods for a secure and passwordless login experience.
      </p>
      <PasskeyList passkeys={passkeys} />
      <PasskeyCreateDialog />
    </div>
  );
}
