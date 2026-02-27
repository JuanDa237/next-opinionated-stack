'use client';

import Link from 'next/link';
import { useState } from 'react';

// Libs
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth/auth-client';

// Components
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { SocialAuthButtons } from '../components/social-auth-buttons';
import { PasswordInput } from '@/components/common/password-input';
import { AuthPageDescription } from '../components/auth-page-description';
import { PasskeySigninButton } from '../components/signin/passkey-signin-button';
import { AUTH_ROUTES } from '@/features/admin/helpers';

const formSchema = z.object({
  email: z.email('Enter a valid email.').min(1, 'Email is required.'),
  password: z.string().min(1, 'Password is required.'),
});

type SigninFormProps = React.ComponentProps<'form'> & {
  callbackurl: string | null;
};

export function SigninForm({ className, ...props }: SigninFormProps) {
  // TODO: Use callbackURL from search params to redirect after signin
  const callbackURL =
    props.callbackurl != null ? props.callbackurl : AUTH_ROUTES.SELECT_ORGANIZATION;

  const [formError, setFormError] = useState<string | null>(null);

  const formId = 'signin-form';

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          callbackURL,
        },
        {
          onError: error => {
            setFormError(error?.error?.message ?? 'We could not sign you in. Please try again.');
          },
        }
      );
    },
  });

  return (
    <form
      id={formId}
      className={cn('flex flex-col gap-6', className)}
      onSubmit={event => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
      {...props}
    >
      <AuthPageDescription
        title="Sign in to your account"
        description="Enter your email below to sign in to your account"
        errorMessage={formError}
      >
        <form.Field name="email">
          {field => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="m@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={event => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="email webauthn"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="password">
          {field => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <div className="flex items-center">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Link
                    href={AUTH_ROUTES.FORGOT_PASSWORD}
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <PasswordInput
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={event => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="current-password webauthn"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <Field>
          <Button type="submit" form={formId} disabled={form.state.isSubmitting}>
            {form.state.isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <SocialAuthButtons callbackURL={callbackURL} />
          <PasskeySigninButton callbackURL={callbackURL} />
          <FieldDescription className="text-center">
            Don&apos;t have an account?{' '}
            <Link href={AUTH_ROUTES.SIGNUP} className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </AuthPageDescription>
    </form>
  );
}
