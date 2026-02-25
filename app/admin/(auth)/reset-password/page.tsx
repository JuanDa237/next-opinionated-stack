import { Suspense } from 'react';

import { ResetPasswordForm } from '@/features/auth/containers/reset-password-form';

export default async function Page() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
