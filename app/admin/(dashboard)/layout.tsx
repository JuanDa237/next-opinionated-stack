import { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

// Components
import { AppSidebar } from './components/sidebar/app-sidebar';
import { DashboardHeader } from './components/header/dashboard-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

// Auth
import { auth } from '@/lib/auth';
import { ImpersonationIndicator } from '@/features/auth/components/impersionation-indicator';
import { getSafeCallbackURL } from '@/features/auth/utils';

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    // Get the pathname from the proxy.ts
    const currentPath = requestHeaders.get('x-pathname') ?? '/admin';
    const callbackURL = getSafeCallbackURL(currentPath);
    redirect(`/admin/signin?callbackURL=${encodeURIComponent(callbackURL)}`);
  }

  // If user is not admin and has no active organization, redirect to org selector
  const isAdmin = session.user?.role === 'admin';
  const hasActiveOrg = !!session.session.activeOrganizationId;

  if (!isAdmin && !hasActiveOrg) {
    // Preserve the original destination as callbackURL
    const currentPath = requestHeaders.get('x-pathname') ?? '/admin';
    const callbackURL = getSafeCallbackURL(currentPath);
    redirect(`/admin/select-organization?callbackURL=${encodeURIComponent(callbackURL)}`);
  }

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
