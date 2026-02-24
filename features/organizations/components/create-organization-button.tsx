'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RotateCcw } from 'lucide-react';
import { ButtonGroup } from '@/components/ui/button-group';
import { useRouter } from 'next/navigation';

const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .min(3, 'Slug must be at least 3 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),
});

type CreateOrganizationForm = z.infer<typeof createOrganizationSchema>;

export function CreateOrganizationButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const [suggestedSlug, setSuggestedSlug] = useState('');

  const router = useRouter();

  const formId = 'create-organization-form';
  const form = useForm({
    defaultValues: {
      name: '',
      slug: '',
    } as CreateOrganizationForm,
    validators: {
      onSubmit: createOrganizationSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await authClient.organization.create({
        name: value.name,
        slug: value.slug,
      });

      if (res.error) {
        toast.error(res.error.message || 'Failed to create organization');
        return;
      }

      form.reset();
      setOpen(false);
      setIsSlugManuallyEdited(false);
      toast.success('Organization created successfully');
      router.refresh();
    },
  });

  const handleNameChange = (name: string) => {
    form.setFieldValue('name', name);

    // Auto-generate slug from name only if user hasn't manually edited it
    const suggestedSlug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSuggestedSlug(suggestedSlug);

    if (!isSlugManuallyEdited) {
      form.setFieldValue('slug', suggestedSlug);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setIsSlugManuallyEdited(false);
    }
  };

  const handleSlugReset = () => {
    form.setFieldValue('slug', suggestedSlug);
    setIsSlugManuallyEdited(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={className}>Create Organization</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to collaborate with your team.
          </DialogDescription>
        </DialogHeader>
        <form
          id={formId}
          className="space-y-4"
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
                  <FieldLabel htmlFor={field.name}>Organization Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="Acme Inc"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={event => handleNameChange(event.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="slug">
            {field => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Subdomain Slug</FieldLabel>
                  <ButtonGroup>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder={suggestedSlug || 'acme-inc'}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={event => {
                        setIsSlugManuallyEdited(true);
                        field.handleChange(event.target.value);
                      }}
                      aria-invalid={isInvalid}
                    />
                    <Button variant="outline" type="button" onClick={() => handleSlugReset()}>
                      <RotateCcw />
                    </Button>
                  </ButtonGroup>
                  <p className="text-xs text-muted-foreground">
                    Used for your organization&apos;s subdomain and cannot be changed later.
                  </p>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <DialogFooter className="flex flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={form.state.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" form={formId} disabled={form.state.isSubmitting}>
              {form.state.isSubmitting ? 'Creating...' : 'Create Organization'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
