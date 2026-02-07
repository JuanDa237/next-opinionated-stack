'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from './mode-toggle';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';

export function DashboardHeader() {
  const router = useRouter();

  function handleSignOut() {
    authClient.signOut(undefined, {
      onSuccess: () => {
        router.refresh();
      },
    });
  }

  // This is sticky to the top of the page, but only on smaller screens. On larger screens, it becomes static and blends in with the background.
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur md:static md:z-auto md:bg-transparent md:backdrop-blur-none">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex gap-2 ml-auto">
        <ModeToggle />
        <Button size="icon" onClick={handleSignOut}>
          <LogOut />
        </Button>
      </div>
    </header>
  );
}
