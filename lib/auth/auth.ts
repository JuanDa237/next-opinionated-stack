import { betterAuth } from "better-auth";

// DB
import { db } from "@/lib/db/drizzle";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";
import { member } from "@/auth-schema";

// Plugins
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins/two-factor";
import { passkey } from "@better-auth/passkey"
import { admin } from "better-auth/plugins/admin";
import { organization } from "better-auth/plugins";
import { adminAccessControl, adminRoles, organizationAccessControl, organizationRoles } from "@/lib/auth/permissions";

// Hooks
import { createAuthMiddleware } from "better-auth/api";

// Allow all subdomains of the main domain (e.g., *.newexample.app)
const mainDomain = process.env.BETTER_AUTH_DOMAIN || process.env.VERCEL_PROJECT_PRODUCTION_URL;

const trustedOrigins = (request?: Request) => {
    const origins: string[] = [];

    if (process.env.VERCEL_BRANCH_URL) {
        origins.push(`https://${process.env.VERCEL_BRANCH_URL}`);
    }

    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        origins.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
    }

    if (mainDomain && request) {
        try {
            const origin = request.headers.get('origin') || '';

            // Allow any subdomain of the main domain
            const domainPattern = new RegExp(`^https?://([a-zA-Z0-9-]+\\.)*${mainDomain.replace(/^\\./, '').replace(/\\./g, '\\.')}(:\\d+)?$`);
            const isDevelopment = process.env.NODE_ENV === 'development';

            if (domainPattern.test(origin) || (isDevelopment && origin.startsWith('http://'))) {
                origins.push(origin);
            }
        } catch { }
    }

    return origins;
};

export const auth = betterAuth({
    appName: "Next Opinionated Stack",
    baseURL:
        process.env.BETTER_AUTH_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://local.dev:3000'),
    trustedOrigins,
    secret: process.env.BETTER_AUTH_SECRET,
    advanced: {
        crossSubDomainCookies: {
            enabled: true,
            domain: mainDomain,
        },
        defaultCookieAttributes: process.env.NODE_ENV === 'development' ? {
            secure: process.env.ENABLE_HTTPS === 'true',
            sameSite: "lax",
        } : undefined
    },
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            // TODO: Integrate with your email provider to send the reset password email
            console.log(`Send reset password email to ${user.email} with url: ${url}`);
        }
    },
    emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }) => {
            // TODO: Integrate with your email provider to send the verification email
            console.log(`Send verification email to ${user.email} with url: ${url}`);
        }
    },
    user: {
        changeEmail: {
            enabled: true,
            sendChangeEmailConfirmation: async ({ user, url, newEmail }) => {
                // TODO: Integrate with your email provider to send the change email email
                console.log(`Send change email email to ${user.email} with url: ${url} and new email: ${newEmail}.`);
            }
        },
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url }) => {
                // TODO: Integrate with your email provider to send the reset password email
                console.log(`Send delete account email to ${user.email} with url: ${url}.`);
            }
        },
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        cognito: {
            clientId: process.env.COGNITO_CLIENT_ID as string,
            domain: process.env.COGNITO_DOMAIN as string,
            region: process.env.COGNITO_REGION as string,
            userPoolId: process.env.COGNITO_USERPOOL_ID as string,
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60,
        }
    },
    hooks: {
        after: createAuthMiddleware(async ctx => {
            if (ctx.path.startsWith('/sign-up')) {
                const user = ctx.context.newSession?.user ?? {
                    name: ctx.body.name,
                    email: ctx.body.email,
                };

                if (user == null) return;

                // TODO: Integrate with your email provider to send the welcome email
                console.log(`Send welcome email to ${user.email}.`);
            }
        })
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user, _context) => ({
                    data: {
                        ...user,
                        role: user.role ?? "user",
                    }
                }),
            },
        },
        session: {
            create: {
                before: async userSession => {
                    // Find all organizations the user is a member of
                    const memberships = await db.query.member.findMany({
                        where: eq(member.userId, userSession.userId),
                        columns: { organizationId: true },
                    });

                    let activeOrganizationId: string | undefined = undefined;

                    if (memberships.length === 1) {
                        activeOrganizationId = memberships[0].organizationId;
                    }

                    return {
                        data: {
                            ...userSession,
                            activeOrganizationId,
                        }
                    }
                },
            }
        }
    },
    plugins: [
        nextCookies(),
        twoFactor({
            totpOptions: {
                // TODO: Adjust these options to default, this was need because work pc time offset issues
                period: 300,
            }
        }),
        passkey(),
        admin({
            ac: adminAccessControl,
            roles: adminRoles,
        }),
        organization({
            ac: organizationAccessControl,
            roles: organizationRoles,
            dynamicAccessControl: {
                enabled: true,
            },
            allowUserToCreateOrganization: async (_user) => {
                // TODO: Implement your logic to determine if the user can create an organization

                // const subscription = await getSubscription(user.id); 
                // return subscription.plan === "pro"; 
                return true;
            },
            sendInvitationEmail: async ({ email, organization, inviter, invitation }) => {
                // TODO: Integrate with your email provider to send the invitation email
                console.log(`${inviter.user.name} sended organization (${organization.name}) invitation email to ${email} with url: ${process.env.BETTER_AUTH_URL}/admin/organizations/invites/${invitation.id}.`);
            },
            teams: {
                enabled: true,
                allowRemovingAllTeams: true,
                defaultTeam: {
                    enabled: false,
                }
            }
        })
    ],
});