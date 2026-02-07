import { twoFactorClient } from "better-auth/plugins/two-factor"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [twoFactorClient({
        onTwoFactorRedirect: () => {
            window.location.href = '/admin/2fa';
        }
    })],
})