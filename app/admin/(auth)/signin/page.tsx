import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { SigninForm } from '@/features/auth/containers/signin-form';
import { auth } from '@/lib/auth';
import { getSafeCallbackURL } from '@/features/auth/utils';

type PageProps = {
  searchParams?: {
    callbackURL?: string;
  };
};

export default async function Page({ searchParams }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const resolvedSearchParams = await searchParams;
  const callbackURL = getSafeCallbackURL(resolvedSearchParams?.callbackURL);

  if (session) {
    redirect(callbackURL);
  }

  return <SigninForm callbackURL={callbackURL} />;
}
