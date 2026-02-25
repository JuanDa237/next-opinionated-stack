'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Libs
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import QrCode from 'react-qr-code';

// Components
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { authClient } from '@/lib/auth/auth-client';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { BackupCodesPanel } from './backup-codes-panel';

// Types
import { TwoFactorData } from '../types/two-factor-data';

// Icons
import { InfoIcon } from 'lucide-react';

const qrSchema = z.object({
  token: z.string().length(6, { message: 'Code must be 6 digits.' }),
});

export function QRCodeVerify({
  totpURI,
  backupCodes,
  onDone,
}: TwoFactorData & { onDone: () => void }) {
  const [successfullyEnabled, setSuccessfullyEnabled] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      token: '',
    },
    validators: {
      onSubmit: qrSchema,
    },
    onSubmit: async ({ value }) => {
      authClient.twoFactor.verifyTotp(
        {
          code: value.token,
        },
        {
          onError: result => {
            setFormError(result.error.message ?? 'Code is invalid. Please try again.');
          },
          onSuccess: () => {
            setSuccessfullyEnabled(true);
            router.refresh();
          },
        }
      );
    },
  });

  if (successfullyEnabled) {
    return <BackupCodesPanel backupCodes={backupCodes} onDone={onDone} />;
  }

  return (
    <>
      <div className="flex gap-2 flex-col items-center">
        <Alert>
          <InfoIcon />
          <AlertTitle>Use your authenticator app</AlertTitle>
          <AlertDescription>
            Scan the QR code with your authenticator app, then enter the 6-digit code to verify and
            finish setup.
          </AlertDescription>
        </Alert>
        <div className="p-4 bg-white w-fit">
          <QrCode size={256} value={totpURI}></QrCode>
        </div>
      </div>

      {formError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive mt-3">
          {formError}
        </div>
      ) : null}

      <form
        className="mt-3 flex flex-row gap-3 items-end"
        onSubmit={event => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field name="token">
          {field => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <div className="flex items-center">
                  <FieldLabel htmlFor={field.name}>Verification code</FieldLabel>
                </div>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
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

        <Field>
          <Button type="submit" variant="outline" disabled={form.state.isSubmitting}>
            {form.state.isSubmitting ? 'Submitting...' : 'Submit Code'}
          </Button>
        </Field>
      </form>
    </>
  );
}
