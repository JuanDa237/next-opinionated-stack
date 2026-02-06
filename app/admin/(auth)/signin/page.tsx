import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { SigninForm } from '@/features/auth/components/signin-form';
import { auth } from '@/lib/auth';

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect('/admin');
  }

  return <SigninForm />;
}
