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
import { useRouter } from 'next/navigation';
import { useTeamsStore } from '../stores/teams';

const createTeamSchema = z.object({
  name: z.string().trim().min(1),
});

type CreateTeamForm = z.infer<typeof createTeamSchema>;

export function CreateTeamButton() {
  const { data: session } = authClient.useSession();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const [open, setOpen] = useState(false);
  const fetchOrganizationTeams = useTeamsStore(state => state.fetchOrganizationTeams);

  const router = useRouter();

  const formId = 'create-team-form';
  const form = useForm({
    defaultValues: {
      name: '',
    } as CreateTeamForm,
    validators: {
      onSubmit: createTeamSchema,
    },
    onSubmit: async ({ value }) => {
      await handleCreateTeam(value);
    },
  });

  async function handleCreateTeam(data: CreateTeamForm) {
    await authClient.organization.createTeam(data, {
      onError: error => {
        toast.error(error.error.message || 'Failed to create team');
      },
      onSuccess: async data => {
        await authClient.organization.addTeamMember(
          {
            teamId: data.data.id,
            userId: session?.user.id,
          },
          {
            onSuccess: () => {
              form.reset();
              setOpen(false);
              if (activeOrganization?.id) {
                fetchOrganizationTeams(activeOrganization.id);
              }
              router.refresh();
            },
          }
        );
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Team</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>Create a new team in this organization.</DialogDescription>
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
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="Team name"
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
              {form.state.isSubmitting ? 'Creating...' : 'Create Team'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
