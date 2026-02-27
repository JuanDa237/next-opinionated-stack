// Libs
import { Organization } from 'better-auth/plugins';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface OrganizationListProps {
  organizations: Organization[];
  isLoading?: boolean;
  onSelect: (id: string, slug: string) => void;
}

export function OrganizationList({ organizations, isLoading, onSelect }: OrganizationListProps) {
  if (!organizations.length) return null;
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">Your Organizations</h2>
      <div className="grid gap-3">
        {organizations.map(org => (
          <Card key={org.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex-1 flex flex-row items-center justify-center">
                <CardTitle className="text-base">{org.name}</CardTitle>
                <Button
                  onClick={() => onSelect(org.id, org.slug)}
                  disabled={isLoading}
                  className="ml-auto"
                >
                  Continue
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
