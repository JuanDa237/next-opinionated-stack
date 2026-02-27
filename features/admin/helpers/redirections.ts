import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_ROUTES } from ".";


interface AuthRedirectsOptions {
    redirectToSignIn?: boolean;
    redirectToSelectOrganization?: boolean;
}

/**
 * Redirects authenticated users based on their session status.
 *
 * Usage:
 *   Call this function in a server action or page to ensure that
 *   if a user is already authenticated, they are redirected to select their organization or dashboard instead of seeing the signup/signin page.
 *   If the user is not authenticated, nothing happens.
 *
 * This function uses the current request headers to check the session.
 */
export async function authRedirects(options?: AuthRedirectsOptions) {
    const {
        redirectToSignIn,
        redirectToSelectOrganization = true,
    } = options || {};

    const session = await auth.api.getSession({ headers: await headers() });

    if (session && redirectToSelectOrganization) {
        console.log("User is authenticated, redirecting to select organization...", redirectToSelectOrganization);
        redirect(AUTH_ROUTES.SELECT_ORGANIZATION);
    }

    if (!session && redirectToSignIn === true) {
        redirect(AUTH_ROUTES.SIGNIN);
    }

    return;
}