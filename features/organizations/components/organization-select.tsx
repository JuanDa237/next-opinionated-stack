'use client';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';

export function OrganizationSelect() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  if (organizations == null || organizations.length === 0) {
    return null;
  }

  function setActiveOrganization(organization: { id: string; name: string } | null) {
    if (!organization) {
      return;
    }
    authClient.organization.setActive(
      { organizationId: organization.id },
      {
        onError: error => {
          toast.error(error.error.message || 'Failed to switch organization');
        },
      }
    );
  }

  const selectedOrganization =
    organizations.find(organization => organization.id === activeOrganization?.id) ?? null;

  return (
    <Combobox
      items={organizations}
      value={selectedOrganization}
      onValueChange={setActiveOrganization}
      itemToStringLabel={organization => organization.name}
      itemToStringValue={organization => organization.id}
      isItemEqualToValue={(item, selected) => item.id === selected.id}
    >
      <ComboboxInput placeholder="Select an organization" showClear className="w-full" />
      <ComboboxContent className="w-full">
        <ComboboxEmpty>No organizations found.</ComboboxEmpty>
        <ComboboxList>
          {item => (
            <ComboboxItem key={item.id} value={item}>
              {item.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
