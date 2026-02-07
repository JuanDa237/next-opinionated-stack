'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

const formSchema = z.object({
  email: z.email('Enter a valid email.').min(1, 'Email is required.'),
  password: z.string().min(1, 'Password is required.'),
});

export function SigninForm({ className, ...props }: React.ComponentProps<'form'>) {
  const router = useRouter();
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
      setFormError(null);
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          callbackURL: '/admin',
        },
        {
          onError: error => {
            setFormError(error?.error?.message ?? 'We could not sign you in. Please try again.');
          },
          onSuccess: () => {
            router.push('/admin');
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
                    href="/admin/forgot-password"
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
          <SocialAuthButtons />
          <PasskeySigninButton />
          <FieldDescription className="text-center">
            Don&apos;t have an account?{' '}
            <Link href="/admin/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </AuthPageDescription>
    </form>
  );
}
