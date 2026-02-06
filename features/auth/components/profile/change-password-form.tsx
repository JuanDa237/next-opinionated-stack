'use client';

import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { PasswordInput } from '@/components/common/password-input';
import { authClient } from '@/lib/auth/auth-client';
import { useState } from 'react';

const formSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required.'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters.'),
  revokeOtherSessions: z.boolean(),
});

export function ChangePasswordForm({ className, ...props }: React.ComponentProps<'form'>) {
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const formId = 'change-password-form';

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      revokeOtherSessions: false,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      setFormSuccess(null);

      await authClient.changePassword(
        {
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
          revokeOtherSessions: value.revokeOtherSessions,
        },
        {
          onError: error => {
            setFormError(
              error?.error?.message ?? 'We could not update your password. Please try again.'
            );
          },
          onSuccess: () => {
            setFormSuccess('Your password has been updated.');
            form.reset();
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
      <FieldGroup>
        {formSuccess ? (
          <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
            {formSuccess}
          </div>
        ) : null}
        {formError ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {formError}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <form.Field name="currentPassword">
            {field => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center">
                    <FieldLabel htmlFor={field.name}>Current password</FieldLabel>
                  </div>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={event => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="newPassword">
            {field => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center">
                    <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                  </div>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={event => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="revokeOtherSessions">
            {field => {
              return (
                <Field className="items-center gap-3 md:col-span-2" orientation="horizontal">
                  <Checkbox
                    id={field.name}
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onCheckedChange={checked => field.handleChange(checked === true)}
                  />
                  <FieldLabel htmlFor={field.name} className="flex-none">
                    Revoke other sessions
                  </FieldLabel>
                </Field>
              );
            }}
          </form.Field>
        </div>
        <Field>
          <Button type="submit" form={formId} disabled={form.state.isSubmitting}>
            {form.state.isSubmitting ? 'Updating...' : 'Update password'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
