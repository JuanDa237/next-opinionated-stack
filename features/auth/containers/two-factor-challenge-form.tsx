'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth/auth-client';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useRouter } from 'next/navigation';

const totpSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits.'),
});

const backupSchema = z.object({
  backupCode: z.string().min(8, 'Enter a valid backup code.'),
});

export function TwoFactorChallengeForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [totpError, setTotpError] = useState<string | null>(null);
  const [backupError, setBackupError] = useState<string | null>(null);

  const totpFormId = 'two-factor-totp-form';
  const backupFormId = 'two-factor-backup-form';

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
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Two-factor verification</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter the code from your authenticator app or use a backup code.
          </p>
        </div>

        <Tabs defaultValue="totp">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="totp">Authenticator</TabsTrigger>
            <TabsTrigger value="backup">Backup code</TabsTrigger>
          </TabsList>

          <TabsContent value="totp">
            <form
              id={totpFormId}
              className="flex flex-col gap-5"
              onSubmit={event => {
                event.preventDefault();
                event.stopPropagation();
                totpForm.handleSubmit();
              }}
            >
              {totpError ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {totpError}
                </div>
              ) : null}

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
                        value={field.state.value}
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
          </TabsContent>

          <TabsContent value="backup">
            <form
              id={backupFormId}
              className="flex flex-col gap-5"
              onSubmit={event => {
                event.preventDefault();
                event.stopPropagation();
                backupForm.handleSubmit();
              }}
            >
              {backupError ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {backupError}
                </div>
              ) : null}

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
                        value={field.state.value}
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
          </TabsContent>
        </Tabs>
      </FieldGroup>
    </div>
  );
}
