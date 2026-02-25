'use client';

import { useSearchParams } from 'next/navigation';

import { authClient } from '@/lib/auth/auth-client';

import { EmailVerifiedRedirect } from '@/features/auth/components/verification/email-verified-redirect';
import { EmailVerificationResend } from '@/features/auth/components/verification/email-verification-resend';
import { EmailVerificationSkeleton } from '@/features/auth/components/verification/email-verification-skeleton';

export function EmailVerificationPage() {
  const { data, isPending } = authClient.useSession();
  const searchParams = useSearchParams();

  if (isPending) {
    return <EmailVerificationSkeleton />;
  }

  if (data?.user.emailVerified) {
    return <EmailVerifiedRedirect email={data.user.email} />;
  }

  const email = searchParams.get('email');

  return (
    <div className="mx-auto flex max-w-md flex-col gap-2 text-center">
      <h1 className="text-2xl font-bold">Verify your email</h1>
      <p className="text-muted-foreground text-sm">
        We sent a verification link to
        {email ? <span className="text-foreground font-medium"> {email}</span> : null}. Please check
        your inbox and click the link to finish setting up your account.
      </p>
      <EmailVerificationResend email={email} />
    </div>
  );
}
