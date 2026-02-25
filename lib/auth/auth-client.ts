import { createAuthClient } from "better-auth/react"

// Plugins
import { twoFactorClient } from "better-auth/plugins/two-factor"
import { passkeyClient } from "@better-auth/passkey/client"
import { adminClient, organizationClient } from "better-auth/client/plugins"
import { adminAccessControl, adminRoles, organizationAccessControl } from "@/lib/auth/permissions"

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        twoFactorClient({
            onTwoFactorRedirect: () => {
                window.location.href = '/admin/2fa';
            }
        }),
        passkeyClient(),
        adminClient({
            ac: adminAccessControl,
            roles: adminRoles,
        }),
        organizationClient({
            ac: organizationAccessControl,
            dynamicAccessControl: {
                enabled: true,
            },
            teams: {
                enabled: true,
            }
        })
    ],
})