import { getOrganizationRouteClient } from "@/features/admin/helpers";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

export async function setActiveOrganization(organizationId: string, organizationSlug: string) {
    await authClient.organization.setActive(
        {
            organizationId,
            organizationSlug,
        },
        {
            onSuccess: async () => {
                await authClient.organization.setActiveTeam({
                    teamId: null
                });

                window.location.href = getOrganizationRouteClient(organizationSlug);
            },
            onError: error => {
                console.error('Error setting active organization:', error);
                toast.error('Failed to set active organization. Please try again.');
            },
        }
    );
}
