'use client';

import { useEffect, useMemo, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const createInviteSchema = z.object({
  email: z.string().trim().email().min(1),
  role: z.string().trim().min(1),
});

type CreateInviteForm = z.infer<typeof createInviteSchema>;

export function InviteMemberButton() {
  const [open, setOpen] = useState(false);
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const [roleOptions, setRoleOptions] = useState<string[]>([]);

  const formId = 'invite-member-form';
  const form = useForm({
    defaultValues: {
      email: '',
      role: 'member',
    } as CreateInviteForm,
    validators: {
      onSubmit: createInviteSchema,
    },
    onSubmit: async ({ value }) => {
      await handleCreateInvite(value);
    },
  });

  async function handleCreateInvite(data: CreateInviteForm) {
    await authClient.organization.inviteMember(
      {
        email: data.email,
        role: data.role as 'member' | 'admin',
      },
      {
        onError: error => {
          toast.error(error.error.message || 'Failed to invite user');
        },
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );
  }

  useEffect(() => {
    if (!activeOrganization?.id) {
      return;
    }

    const loadRoles = async () => {
      try {
        const result = await authClient.organization.listRoles({
          query: {
            organizationId: activeOrganization.id,
          },
        });

        const dynamicRoles =
          result?.data
            ?.map(role => role.role)
            .filter((roleName): roleName is string => Boolean(roleName)) ?? [];

        setRoleOptions(Array.from(new Set(['member', 'admin', ...dynamicRoles])));
      } catch (error) {
        const message =
          error && typeof error === 'object' && 'error' in error
            ? (error as { error?: { message?: string } }).error?.message
            : undefined;
        toast.error(message || 'Failed to load roles');
        setRoleOptions(['member', 'admin']);
      }
    };

    loadRoles();
  }, [activeOrganization?.id]);

  const roleSelectItems = useMemo(
    () =>
      (roleOptions.length > 0 ? roleOptions : ['member', 'admin']).map(role => (
        <SelectItem key={role} value={role}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </SelectItem>
      )),
    [roleOptions]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Invite Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>Send an invitation to join this organization.</DialogDescription>
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
          <form.Field name="email">
            {field => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="name@company.com"
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
          <form.Field name="role">
            {field => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={value => field.handleChange(value as CreateInviteForm['role'])}
                  >
                    <SelectTrigger
                      id={field.name}
                      name={field.name}
                      aria-invalid={isInvalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>{roleSelectItems}</SelectContent>
                  </Select>
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
              {form.state.isSubmitting ? 'Sending...' : 'Send Invite'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
