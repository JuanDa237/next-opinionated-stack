import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
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
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60, // 1 minute
        }
    },
    plugins: [nextCookies()],
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
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
    }
});