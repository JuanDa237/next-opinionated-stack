'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Libs
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';

// Components
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type PasskeyCreateDialogProps = {
  triggerLabel?: string;
};

const formSchema = z.object({
  name: z.string().min(1, 'Passkey name is required.'),
});

export function PasskeyCreateDialog({ triggerLabel = 'New Passkey' }: PasskeyCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const formId = 'passkey-create-form';

  const form = useForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.passkey.addPasskey(
        {
          name: value.name,
        },
        {
          onError: error => {
            toast.error(
              error?.error?.message ?? 'We could not create your passkey. Please try again.'
            );
          },
          onSuccess: () => {
            setOpen(false);
            router.refresh();
          },
        }
      );
    },
  });

  return (
    <AlertDialog
      open={open}
      onOpenChange={opening => {
        if (opening) form.reset();

        setOpen(prev => !prev);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button className="mt-4">{triggerLabel}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a new passkey</AlertDialogTitle>
          <AlertDialogDescription>
            Give your passkey a name to help you recognize this device later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          id={formId}
          className="space-y-6"
          onSubmit={event => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field name="name">
            {field => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Passkey name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="MacBook Pro"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={event => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="webauthn"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button type="submit" form={formId} disabled={form.state.isSubmitting}>
                {form.state.isSubmitting ? 'Creating...' : 'Create passkey'}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
