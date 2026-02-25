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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Icons
import { AlertCircleIcon } from 'lucide-react';

const totpSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits.'),
});

export function TotpForm() {
  const router = useRouter();

  const [totpError, setTotpError] = useState<string | null>(null);

  const totpFormId = 'two-factor-totp-form';

  const totpForm = useForm({
    defaultValues: {
      code: '',
    },
    validators: {
      onSubmit: totpSchema,
    },
    onSubmit: async ({ value }) => {
      setTotpError(null);
      await authClient.twoFactor.verifyTotp(
        { code: value.code },
        {
          onError: result => {
            setTotpError(result.error.message ?? 'Invalid code. Please try again.');
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
      id={totpFormId}
      className="flex flex-col gap-5"
      onSubmit={event => {
        event.preventDefault();
        event.stopPropagation();
        totpForm.handleSubmit();
      }}
    >
      {totpError && (
        <Alert variant="destructive" className="max-w-md">
          <AlertCircleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{totpError}</AlertDescription>
        </Alert>
      )}

      <totpForm.Field name="code">
        {field => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor="totp-code" className="w-full justify-center text-center">
                6-digit code
              </FieldLabel>
              <InputOTP
                id="totp-code"
                maxLength={6}
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={field.handleChange}
                inputMode="numeric"
                containerClassName="justify-center"
                aria-invalid={isInvalid}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription>
                This code refreshes every 30 seconds in your authenticator app.
              </FieldDescription>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </totpForm.Field>

      <Field>
        <Button type="submit" form={totpFormId} disabled={totpForm.state.isSubmitting}>
          {totpForm.state.isSubmitting ? 'Verifying...' : 'Verify'}
        </Button>
      </Field>
    </form>
  );
}
