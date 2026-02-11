import { Suspense } from 'react';

import { EmailVerificationSkeleton } from '@/features/auth/components/verification/email-verification-skeleton';
import { EmailVerificationPage } from '@/features/auth/containers/email-verification-page';

export default function Page() {
  return (
    <Suspense fallback={<EmailVerificationSkeleton />}>
      <EmailVerificationPage />
    </Suspense>
  );
}
