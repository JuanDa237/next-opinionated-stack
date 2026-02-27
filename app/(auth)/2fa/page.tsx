import { TwoFactorChallengeForm } from '@/features/auth/containers/two-factor-challenge-form';
import { authRedirects } from '@/features/admin/helpers/redirections';

export default async function Page() {
  await authRedirects();

  return <TwoFactorChallengeForm />;
}
