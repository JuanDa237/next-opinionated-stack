# Cognito Setup for Better Auth (SPA)

This guide covers a minimal AWS Cognito setup for a SPA using Better Auth.

## Create the user pool

1. Open the AWS Console and search for **Cognito**.
2. Create a **User pool**.
3. Define your application as **SPA**.
4. Select **Email** as the sign-in identifier.
5. Add the return URL for development:
   - `http://localhost:3000/api/auth/callback/cognito`

## Configure the app client

1. Open your **App client**.
2. Go to the **Login pages** tab and edit it.
3. In **OpenID Connect scopes**, select:
   - `openid`
   - `email`
   - `profile`

## Collect required values

You will need these values for Better Auth configuration:

- **Client ID**: From the app client details.
- **Domain**: From **Branding** -> **Domain**.
- **User pool ID**: From the pool overview.
- **Region**: From the pool overview.

## Next step

Use the values above to configure the Cognito provider in your Better Auth setup.
