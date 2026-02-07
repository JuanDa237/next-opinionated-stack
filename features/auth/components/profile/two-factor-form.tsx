'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { authClient } from '@/lib/auth/auth-client';
import { PasswordInput } from '@/components/common/password-input';
import { Input } from '@/components/ui/input';

import QrCode from 'react-qr-code';
import { useRouter } from 'next/navigation';
import { Copy, Download } from 'lucide-react';

const formSchema = z.object({
  password: z.string().min(1, 'Password is required.'),
});

type TwoFactorAuthForm = z.infer<typeof formSchema>;

type TwoFactorData = {
  totpURI: string;
  backupCodes: string[];
};

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
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive my-2">
          {formError}
        </div>
      ) : null}

      {!twoFactorData && (
        <form
          className="mt-3 flex flex-row gap-3 items-end"
          onSubmit={event => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
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

const qrSchema = z.object({
  token: z.string().length(6, { message: 'Code must be 6 digits.' }),
});

function QRCodeVerify({ totpURI, backupCodes, onDone }: TwoFactorData & { onDone: () => void }) {
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
      <div className="mt-8 flex gap-2 flex-col items-center">
        <p>
          Scan the QR code with your authenticator app, then enter the 6-digit code to verify and
          finish setup.
        </p>
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

function BackupCodesPanel({ backupCodes, onDone }: { backupCodes: string[]; onDone: () => void }) {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const backupCodesText = backupCodes.join('\n');

  const handleCopyCodes = async () => {
    try {
      await navigator.clipboard.writeText(backupCodesText);
      setCopySuccess('Backup codes copied.');
    } catch {
      setCopySuccess('Copy failed. Please select and copy manually.');
    }
  };

  const handleDownloadCodes = () => {
    const blob = new Blob([backupCodesText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'backup-codes.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8">
      <p className="mb-2">
        Save these backup codes in a safe place. You can use them to access your account.
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        <Button type="button" variant="outline" size="icon" onClick={handleCopyCodes}>
          <Copy />
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={handleDownloadCodes}>
          <Download />
        </Button>
        {copySuccess ? (
          <span className="text-xs text-muted-foreground self-center">{copySuccess}</span>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {backupCodes.map((code, index) => (
          <div key={index} className="font-mono text-sm">
            {code}
          </div>
        ))}
      </div>
      <Button variant="outline" onClick={onDone}>
        Done. I&apos;ve saved my backup codes.
      </Button>
    </div>
  );
}
