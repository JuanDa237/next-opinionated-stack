import { getOrganizationRoute, HEADER_KEYS } from '@/features/admin/helpers';
import { authRedirects } from '@/features/admin/helpers/redirections';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SelectOrganizationPage } from '@/features/organizations/containers/select-organization-page';

type PageProps = {
  searchParams?: {
    callbackURL?: string;
  };
};

export default async function Page({}: PageProps) {
  // TODO: Use callbackURL from search params to redirect after selecting organization

  await authRedirects({ redirectToSignIn: true, redirectToSelectOrganization: false });

  const hdrs = await headers();

  const organizations = await auth.api.listOrganizations({
    headers: hdrs,
  });

  if (organizations.length == 1) {
    // If the user only has one organization, we can redirect them directly to the dashboard for that organization
    const organization = organizations[0];
    redirect(getOrganizationRoute(hdrs, organization.slug));
  }

  const mainDomain = await hdrs.get(HEADER_KEYS.MAIN_DOMAIN);

  return <SelectOrganizationPage mainDomain={mainDomain} />;
}
