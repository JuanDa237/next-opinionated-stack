import { SelectOrganizationPage } from '@/features/organizations/containers/select-organization-page';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SelectOrganizationRoute() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/admin/signin');
  }

  return <SelectOrganizationPage />;
}
