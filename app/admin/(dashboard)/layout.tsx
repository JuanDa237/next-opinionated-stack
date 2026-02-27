import { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { headers as getHeaders } from 'next/headers';

// Components
import { AppSidebar } from './components/sidebar/app-sidebar';
import { DashboardHeader } from './components/header/dashboard-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

// Auth
import { auth } from '@/lib/auth';
import { ImpersonationIndicator } from '@/features/auth/components/impersionation-indicator';
import { AUTH_ROUTES, HEADER_KEYS, buildBaseDomainUrl } from '@/features/admin/helpers';

export default async function DashboardLayout({ children }: PropsWithChildren) {
  // --- Authentication and Organization Access Logic ---
  const headers = await getHeaders();

  const session = await auth.api.getSession({ headers });

  if (!session) {
    redirect(buildBaseDomainUrl(headers, AUTH_ROUTES.SIGNIN));
  }

  const organizations = await auth.api.listOrganizations({ headers });

  // if (!session.session.activeOrganizationId) {
  //   // No active organization, redirect to org selection page
  //   redirect(buildBaseDomainUrl(headers, AUTH_ROUTES.SELECT_ORGANIZATION));
  //   return;
  // }

  // --- Subdomain (org slug) validation and active org setting ---
  const orgSlug = headers.get(HEADER_KEYS.SUBDOMAIN);

  if (orgSlug) {
    const matchedOrg = organizations.find(org => org.slug === orgSlug);

    if (!matchedOrg) {
      // User does not have access to this org
      redirect(buildBaseDomainUrl(headers, AUTH_ROUTES.FORBIDDEN));
      return;
    }

    // Is REQUIRED that the active organization is set before accessing any admin route,
    // this ensures that the correct context is loaded for the user.
    // ---
    // This handles the case where a user might try to access an admin route directly without going through
    // the organization selection process first.
    // By enforcing that an active organization is set, we ensure a consistent experience and proper access control throughout
    // the admin interface.
    if (session && session.session.activeOrganizationId !== matchedOrg.id) {
      // TODO: If not already active, set as active without falling in a redirect loop
      // Example
      // await auth.api.setActiveOrganization({ ... })
      // redirect(getFullUrl(headers, AUTH_ROUTES.DASHBOARD));

      redirect(buildBaseDomainUrl(headers, AUTH_ROUTES.SELECT_ORGANIZATION));
      return;
    }
  }

  // --- END Authentication and Organization Access Logic ---

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-svh">
        <DashboardHeader />
        {children}
        <ImpersonationIndicator />
      </SidebarInset>
    </SidebarProvider>
  );
}
