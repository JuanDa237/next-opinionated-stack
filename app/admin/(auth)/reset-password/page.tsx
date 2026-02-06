import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

import { ResetPasswordForm } from '@/features/auth/containers/reset-password-form';

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect('/admin');
  }

  return <ResetPasswordForm />;
}
