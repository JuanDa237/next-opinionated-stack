import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { SignupForm } from '@/features/auth/containers/signup-form';

import { auth } from '@/lib/auth';

export default async function SignupPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect('/admin');
  }

  return <SignupForm />;
}
