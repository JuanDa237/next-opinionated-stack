import { EmailVerificationPage } from '@/features/auth/containers/email-verification-page';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense>
      <EmailVerificationPage />
    </Suspense>
  );
}
