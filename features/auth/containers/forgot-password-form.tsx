'use client';

import { useState } from 'react';

import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { authClient } from '@/lib/auth/auth-client';
import { CountdownSubmitButton } from '@/components/common/countdown-submit-button';
import { AuthPageDescription } from '../components/auth-page-description';

const formSchema = z.object({
  email: z.email('Enter a valid email.').min(1, 'Email is required.'),
});

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<'form'>) {
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownKey, setCooldownKey] = useState(0);

  const formId = 'forgot-password-form';

  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (cooldownActive) {
        return;
      }

      setFormError(null);
      setFormSuccess(null);

      await authClient.requestPasswordReset(
        {
          email: value.email,
          redirectTo: '/admin/reset-password',
        },
        {
          onError: error => {
            setFormError(
              error?.error?.message ??
                'We could not send the password reset email. Please try again.'
            );
          },
          onSuccess: () => {
            setFormSuccess('We sent you a password reset email. Check your inbox.');
            setCooldownKey(current => current + 1);
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
        title="Reset your password"
        description="Enter your email below to reset your password"
        successTitle="Email Sent"
        errorMessage={formError}
        successMessage={formSuccess}
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
                  autoComplete="email"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <Field>
          <CountdownSubmitButton
            formId={formId}
            isSubmitting={form.state.isSubmitting}
            cooldownKey={cooldownKey}
            onCooldownChange={setCooldownActive}
          />
        </Field>
      </AuthPageDescription>
    </form>
  );
}
