'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Libs
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { authClient } from '@/lib/auth/auth-client';

// Components
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Icons
import { AlertCircleIcon } from 'lucide-react';

const backupSchema = z.object({
  backupCode: z.string().min(8, 'Enter a valid backup code.'),
});

export function BackupForm() {
  const router = useRouter();
  const [backupError, setBackupError] = useState<string | null>(null);

  const backupFormId = 'two-factor-backup-form';

  const backupForm = useForm({
    defaultValues: {
      backupCode: '',
    },
    validators: {
      onSubmit: backupSchema,
    },
    onSubmit: async ({ value }) => {
      setBackupError(null);
      await authClient.twoFactor.verifyBackupCode(
        { code: value.backupCode },
        {
          onError: result => {
            setBackupError(result.error.message ?? 'Invalid backup code. Please try again.');
          },
          onSuccess: () => {
            router.push('/admin');
            router.refresh();
          },
        }
      );
    },
  });

  return (
    <form
      id={backupFormId}
      className="flex flex-col gap-5"
      onSubmit={event => {
        event.preventDefault();
        event.stopPropagation();
        backupForm.handleSubmit();
      }}
    >
      {backupError && (
        <Alert variant="destructive" className="max-w-md">
          <AlertCircleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{backupError}</AlertDescription>
        </Alert>
      )}

      <backupForm.Field name="backupCode">
        {field => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Backup code</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                placeholder="XXXXX-XXXXX"
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={event => field.handleChange(event.target.value)}
                autoComplete="one-time-code"
                aria-invalid={isInvalid}
              />
              <FieldDescription>Each backup code can only be used once.</FieldDescription>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </backupForm.Field>

      <Field>
        <Button type="submit" form={backupFormId} disabled={backupForm.state.isSubmitting}>
          {backupForm.state.isSubmitting ? 'Verifying...' : 'Verify'}
        </Button>
      </Field>
    </form>
  );
}
