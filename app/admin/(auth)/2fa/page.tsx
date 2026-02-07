import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { TwoFactorChallengeForm } from '@/features/auth/containers/two-factor-challenge-form';
import { auth } from '@/lib/auth';

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect('/admin');
  }

  return <TwoFactorChallengeForm />;
}
