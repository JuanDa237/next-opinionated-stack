import { SigninForm } from '@/features/auth/containers/signin-form';
import { authRedirects } from '@/features/admin/helpers/redirections';

type PageProps = {
  searchParams?: {
    callbackURL?: string;
  };
};

export default async function Page({}: PageProps) {
  // TODO: Use callbackURL from search params to redirect after signin

  await authRedirects();

  return <SigninForm callbackurl={null} />;
}
