import { AUTH_ROUTES, getClientMainDomainUrl, getOrganizationRouteClient } from "@/features/admin/helpers";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

export async function setActiveOrganization(organizationId: string, organizationSlug?: string) {
    await authClient.organization.setActive(
        {
            organizationId,
        },
        {
            onSuccess: async () => {
                await authClient.organization.setActiveTeam({
                    teamId: null
                });

                if (organizationSlug) {
                    window.location.href = getOrganizationRouteClient(organizationSlug);
                    return;
                }

                // try to get the organization slug to redirect to the correct subdomain
                const organization = await authClient.organization.list().then(({ data }) => {
                    return (data || []).find((org: { id: string }) => org.id === organizationId);
                });

                if (organization?.slug) {
                    window.location.href = getOrganizationRouteClient(organization.slug);
                } else {
                    window.location.href = getClientMainDomainUrl(AUTH_ROUTES.SELECT_ORGANIZATION);
                }
            },
            onError: error => {
                console.error('Error setting active organization:', error);
                toast.error('Failed to set active organization. Please try again.');
            },
        }
    );
}
