import { SignupForm } from '@/features/auth/containers/signup-form';
import { authRedirects } from '@/features/admin/helpers/redirections';

export default async function SignupPage() {
  await authRedirects();

  return <SignupForm />;
}
