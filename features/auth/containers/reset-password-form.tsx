'use client';

import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

import { authClient } from '@/lib/auth/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PasswordInput } from '@/components/common/password-input';
import { AuthPageDescription } from '../components/auth-page-description';

const formSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
  });

export function ResetPasswordForm({ className, ...props }: React.ComponentProps<'form'>) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formError, setFormError] = useState<string | null>(null);
  const [redirectSeconds, setRedirectSeconds] = useState<number | null>(null);

  const formId = 'reset-password-form';

  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (!token) {
        setFormError('Invalid reset link. Please try resetting your password again.');
        return;
      }

      setFormError(null);
      await authClient.resetPassword(
        {
          newPassword: value.password,
          token: token,
        },
        {
          onError: error => {
            setFormError(
              error?.error?.message ?? 'We could not reset your password. Please try again.'
            );
          },
          onSuccess: () => {
            setRedirectSeconds(5);
          },
        }
      );
    },
  });

  useEffect(() => {
    if (redirectSeconds === null) {
      return;
    }

    if (redirectSeconds <= 0) {
      router.push('/admin/signin');
      return;
    }

    const timer = setTimeout(() => {
      setRedirectSeconds(current => (current === null ? null : current - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [redirectSeconds, router]);

  if (!token) {
    return (
      <AuthPageDescription
        title="Invalid Reset Link"
        description="The reset link is invalid or has expired. Please try resetting your password again."
      >
        <Button className="w-full" asChild>
          <Link href="/admin/forgot-password">Try Again</Link>
        </Button>
      </AuthPageDescription>
    );
  }

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
        title="Reset your password"
        description="Enter your new password below to reset your password"
        errorMessage={formError}
        successTitle="Password reset successful."
        successMessage={redirectSeconds !== null ? `Redirecting in ${redirectSeconds}s.` : null}
      >
        {/* Chrome autofill */}
        <input
          className="sr-only"
          type="text"
          name="username"
          autoComplete="username"
          tabIndex={-1}
          aria-hidden="true"
        />
        <form.Field name="password">
          {field => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <div className="flex items-center">
                  <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                </div>
                <PasswordInput
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={event => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="new-password"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="confirmPassword">
          {field => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <div className="flex items-center">
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                </div>
                <PasswordInput
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={event => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="new-password"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <Field>
          <Button type="submit" form={formId} disabled={form.state.isSubmitting}>
            {form.state.isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Field>
      </AuthPageDescription>
    </form>
  );
}
