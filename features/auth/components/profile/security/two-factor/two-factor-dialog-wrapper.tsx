import { headers } from 'next/headers';

// Libs
import { auth } from '@/lib/auth';

// Components
import { TwoFactorDialog } from './two-factor-dialog';

export async function TwoFactorDialogWrapper() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return null;

  return <TwoFactorDialog isEnabled={session.user.twoFactorEnabled ?? false} />;
}
