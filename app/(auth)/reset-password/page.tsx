import { ResetPasswordForm } from '@/features/auth/containers/reset-password-form';
import { Suspense } from 'react';

export default async function Page() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
