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
// import { canAccessRole, getSessionRole } from '@/lib/auth/roles';

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/admin/signin');
  }

  // const role = await getSessionRole(session);
  // if (!canAccessRole('admin', role)) {
  //   redirect('/');
  // }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        {children}
        <ImpersonationIndicator />
      </SidebarInset>
    </SidebarProvider>
  );
}
