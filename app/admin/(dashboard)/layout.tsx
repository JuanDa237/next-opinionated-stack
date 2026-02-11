import { PropsWithChildren } from 'react';
import { AppSidebar } from './components/sidebar/app-sidebar';
import { DashboardHeader } from './components/header/dashboard-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/admin/signin');
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
