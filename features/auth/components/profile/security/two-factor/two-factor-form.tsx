'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Libs
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

// Components
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { authClient } from '@/lib/auth/auth-client';
import { PasswordInput } from '@/components/common/password-input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

import { QRCodeVerify } from './qr-code-verify';

// Types
import { TwoFactorData } from '../types/two-factor-data';

const formSchema = z.object({
  password: z.string().min(1, 'Password is required.'),
});

type TwoFactorAuthForm = z.infer<typeof formSchema>;

export function TwoFactorForm({ isEnabled }: { isEnabled: boolean }) {
  const [formError, setFormError] = useState<string | null>(null);

  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null);

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      return isEnabled ? handleDisableTwoFactorAuth(value) : handleEnableTwoFactorAuth(value);
    },
  });

  async function handleDisableTwoFactorAuth(data: TwoFactorAuthForm) {
    setFormError(null);

    await authClient.twoFactor.disable(
      {
        password: data.password,
      },
      {
        onError: result => {
          setFormError(result.error.message ?? 'Failed to disable 2FA');
        },
        onSuccess: () => {
          form.reset();
          router.refresh();
        },
      }
    );
  }

  async function handleEnableTwoFactorAuth(data: TwoFactorAuthForm) {
    setFormError(null);

    await authClient.twoFactor.enable(
      {
        password: data.password,
      },
      {
        onError: result => {
          setFormError(result.error.message ?? 'We could not enable 2FA. Please try again.');
        },
        onSuccess: result => {
          console.log(result.data);
          setTwoFactorData(result.data);
          form.reset();
        },
      }
    );
  }

  return (
    <>
      {formError ? (
        <Alert variant="destructive" className="max-w-md">
          <AlertCircleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}

      {!twoFactorData && (
        <form
          className="flex flex-row gap-3 items-end"
          onSubmit={event => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
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
                    <FieldLabel htmlFor={field.name}>Current password</FieldLabel>
                  </div>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={event => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="current-password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <Field>
            <Button
              type="submit"
              variant={isEnabled ? 'destructive' : 'outline'}
              disabled={form.state.isSubmitting}
            >
              {form.state.isSubmitting
                ? isEnabled
                  ? 'Disabling...'
                  : 'Enabling...'
                : isEnabled
                  ? 'Disable 2FA'
                  : 'Enable 2FA'}
            </Button>
          </Field>
        </form>
      )}

      {twoFactorData && <QRCodeVerify {...twoFactorData} onDone={() => setTwoFactorData(null)} />}
    </>
  );
}
