'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth/auth-client';

import { TeamSwitcher } from './team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import Link from 'next/link';

// Define menu items with their required permissions
interface MenuItem {
  title: string;
  url: string;
  role?: string;
  permissions?: {
    [resource: string]: string[];
  };
}

interface NavSection {
  title: string;
  items: MenuItem[];
}

// This is sample data with permission requirements.
const menuData: NavSection[] = [
  {
    title: 'Settings',
    items: [
      {
        title: 'Users',
        url: '/admin/users',
        permissions: {
          user: ['list'],
        },
      },
      {
        title: 'Organization',
        url: '/admin/organizations',
        permissions: {
          organizations: ['list'],
        },
      },
      {
        title: 'Manage Organizations',
        url: '/admin/organizations/manage',
        role: 'admin',
      },
      {
        title: 'Teams',
        url: '/admin/teams',
        permissions: {
          team: ['list'],
        },
      },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        title: 'References',
        url: '/admin/reference',
        permissions: {
          reference: ['read'],
        },
      },
      {
        title: 'Warehouses',
        url: '/admin/warehouse',
        permissions: {
          warehouse: ['read'],
        },
      },
      {
        title: 'Vendors',
        url: '/admin/vendor',
        permissions: {
          vendor: ['read'],
        },
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [visibleItems, setVisibleItems] = React.useState<NavSection[]>([]);

  React.useEffect(() => {
    const filterMenuItems = async () => {
      if (!session?.user) {
        setVisibleItems([]);
        return;
      }

      console.log('Navbar rendering ...');
      const filteredSections: NavSection[] = [];

      for (const section of menuData) {
        const visibleMenuItems: MenuItem[] = [];

        for (const item of section.items) {
          if (!item.permissions && !item.role) {
            visibleMenuItems.push(item);
            continue;
          }

          // If item has a role, check if user has that role
          if (item.role && session.user?.role !== item.role) {
            continue;
          }

          if (!item.permissions) {
            visibleMenuItems.push(item);
            continue;
          }

          // Check if user has the required permissions
          try {
            const hasPermission = await authClient.admin.hasPermission({
              permissions: item.permissions,
            });

            // console.log(`Checking permissions for ${item.title}:`, hasPermission);
            if (hasPermission.data?.success) {
              visibleMenuItems.push(item);
            }
          } catch (error) {
            console.warn(`Failed to check permissions for ${item.title}:`, error);
          }
        }

        // Only add section if it has visible items
        if (visibleMenuItems.length > 0) {
          filteredSections.push({
            ...section,
            items: visibleMenuItems,
          });
        }
      }

      setVisibleItems(filteredSections);
    };

    filterMenuItems();
  }, [session]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {visibleItems.map(section => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
