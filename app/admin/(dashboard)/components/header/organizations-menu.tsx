'use client';

import { useEffect } from 'react';
import { Building2, Check } from 'lucide-react';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

type OrganizationsMenuProps = {
  disabled?: boolean;
};

export function OrganizationsMenu({ disabled }: OrganizationsMenuProps) {
  const { data: sessionData } = authClient.useSession();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations = [], refetch: refetchOrganizations } =
    authClient.useListOrganizations();

  // Refetch organizations when impersonation changes
  useEffect(() => {
    const currentUser = sessionData?.user?.id;
    if (currentUser) {
      refetchOrganizations();
    }
  }, [sessionData?.user?.id, sessionData?.session?.impersonatedBy, refetchOrganizations]);

  const handleSelectOrganization = (organizationId: string) => {
    authClient.organization.setActive(
      { organizationId },
      {
        onError: error => {
          toast.error(error.error.message || 'Failed to switch organization');
        },
        onSuccess: async () => {
          await authClient.organization.setActiveTeam({ teamId: null });
          toast.success('Switched organization');
        },
      }
    );
  };

  if (!organizations || organizations.length === 0) {
    return null;
  }

  const shouldShowSubmenu = organizations.length > 5;

  if (shouldShowSubmenu) {
    return (
      <>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger disabled={disabled}>
            <Building2 className="mr-2 h-4 w-4" />
            Organizations
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-72">
              {organizations.map(organization => (
                <DropdownMenuItem
                  key={organization.id}
                  onSelect={() => handleSelectOrganization(organization.id)}
                  className="flex items-center justify-between"
                >
                  <span>{organization.name}</span>
                  {activeOrganization?.id === organization.id && <Check className="ml-2 h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </>
    );
  }

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Organizations</DropdownMenuLabel>
      {organizations.map(organization => (
        <DropdownMenuItem
          key={organization.id}
          onSelect={() => handleSelectOrganization(organization.id)}
          className="flex items-center justify-between"
          disabled={disabled}
        >
          <div className="flex items-center">
            <Building2 className="mr-2 h-4 w-4" />
            <span>{organization.name}</span>
          </div>
          {activeOrganization?.id === organization.id && <Check className="ml-2 h-4 w-4" />}
        </DropdownMenuItem>
      ))}
    </>
  );
}
