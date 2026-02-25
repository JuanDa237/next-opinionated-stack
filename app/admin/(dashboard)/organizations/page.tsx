import { OrganizationDashboard } from '@/features/organizations/containers/organization-dashboard';
import { GradientBackground } from '@/components/common/gradient-background';

export default function Page() {
  return (
    <GradientBackground>
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Organizations
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Select an organization</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage your organization or switch to a different one to manage its members and
            invitations.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-16">
        <OrganizationDashboard />
      </div>
    </GradientBackground>
  );
}
