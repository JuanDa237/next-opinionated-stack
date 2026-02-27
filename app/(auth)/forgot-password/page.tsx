import { ForgotPasswordForm } from '@/features/auth/containers/forgot-password-form';
import { authRedirects } from '@/features/admin/helpers/redirections';

export default async function Page() {
  await authRedirects();

  return <ForgotPasswordForm />;
}
