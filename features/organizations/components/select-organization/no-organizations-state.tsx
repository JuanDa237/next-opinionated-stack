import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function NoOrganizationsState() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">No Organizations</h1>
        <p className="text-muted-foreground text-sm">
          You don&apos;t have any organizations yet. Subscribe to create one or wait for an
          invitation in your email.
        </p>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscribe</CardTitle>
            <CardDescription>
              Subscribe to our service to create and manage your organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Subscribe
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
