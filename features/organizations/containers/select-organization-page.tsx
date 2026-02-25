'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface UserInvitation {
  id: string;
  status: 'pending' | 'accepted';
  email: string;
  role?: string;
  organizationId: string;
  organizationName: string;
}

function OrganizationList({
  organizations,
  isLoading,
  onSelect,
}: {
  organizations: { id: string; name: string }[];
  isLoading: boolean;
  onSelect: (id: string) => void;
}) {
  if (!organizations.length) return null;
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">Your Organizations</h2>
      <div className="grid gap-3">
        {organizations.map(org => (
          <Card key={org.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex-1 flex flex-row items-center justify-center">
                <CardTitle className="text-base">{org.name}</CardTitle>
                <Button onClick={() => onSelect(org.id)} disabled={isLoading} className="ml-auto">
                  Continue
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InvitationList({
  invitations,
  isLoading,
  onAccept,
  onDecline,
}: {
  invitations: UserInvitation[];
  isLoading: boolean;
  onAccept: (invitationId: string, organizationId: string) => void;
  onDecline: (invitationId: string) => void;
}) {
  if (!invitations.length) return null;
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">Pending Invitations</h2>
      <div className="grid gap-3">
        {invitations.map(invitation => (
          <Card key={invitation.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex-1">
                <CardTitle className="text-base">{invitation.organizationName}</CardTitle>
                <CardDescription>
                  You&apos;ve been invited to join this organization.
                </CardDescription>
              </div>
              {invitation.role && (
                <Badge variant="secondary" className="ml-2">
                  {invitation.role}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button
                onClick={() => onAccept(invitation.id, invitation.organizationId)}
                disabled={isLoading}
                className="flex-1"
              >
                Accept
              </Button>
              <Button
                onClick={() => onDecline(invitation.id)}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                Decline
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Loading...</h1>
        <p className="text-muted-foreground text-sm">
          Please wait while we prepare your organizations.
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">No Organizations</h1>
        <p className="text-muted-foreground text-sm">
          You don&apos;t have any organizations yet. Create one or wait for an invitation.
        </p>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create Organization</CardTitle>
            <CardDescription>Start with a new organization</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Create Organization
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return <div className="text-center text-destructive">{message}</div>;
}

export function SelectOrganizationPage() {
  const router = useRouter();
  // Extract orgSlug from subdomain (client-side only)
  let orgSlug = '';
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const parts = host.split('.');
    if (parts.length > 2) orgSlug = parts[0];
  }

  const searchParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const callbackURL = searchParams?.get('callbackURL') || '/admin';

  const { data: session, isPending: isSessionPending } = authClient.useSession();

  const {
    data: organizations,
    isPending: isOrgsPending,
    refetch: refetchOrganizations,
  } = authClient.useListOrganizations();

  // Refetch organizations when impersonation changes
  useEffect(() => {
    const currentUser = session?.user?.id;
    if (currentUser) {
      refetchOrganizations();
    }
  }, [session?.user?.id, session?.session?.impersonatedBy, refetchOrganizations]);

  const [isLoading, setIsLoading] = useState(false);
  const [invitations, setInvitations] = useState<UserInvitation[]>([]);
  const [isInvitesLoading, setIsInvitesLoading] = useState(false);
  const [invitesError, setInvitesError] = useState<string | null>(null);
  const autoSelectRef = useRef(false);

  const handleSelectOrganization = useCallback(
    async (organizationId: string, slug?: string) => {
      setIsLoading(true);
      try {
        await authClient.organization.setActive({ organizationId });
        // If orgSlug is present, redirect to subdomain
        const orgSubdomain = slug || orgSlug;
        if (orgSubdomain) {
          // Build the new URL with the org subdomain
          const currentHost = typeof window !== 'undefined' ? window.location.host : '';
          const domainParts = currentHost.split('.');
          // Remove existing subdomain if present
          if (domainParts.length > 2) domainParts.shift();
          const baseDomain = domainParts.join('.');
          const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
          const url = `${protocol}//${orgSubdomain}.${baseDomain}${callbackURL}`;
          window.location.href = url;
          return;
        }
        router.push(callbackURL);
      } catch (error) {
        const message =
          error && typeof error === 'object' && 'error' in error
            ? (error as { error?: { message?: string } }).error?.message
            : 'Failed to select organization';
        toast.error(message);
        setIsLoading(false);
      }
    },
    [router, callbackURL, orgSlug]
  );

  // Load invitations on mount
  useEffect(() => {
    let isActive = true;
    setIsInvitesLoading(true);
    setInvitesError(null);
    const loadInvitations = async () => {
      try {
        const { data, error } = await authClient.organization.listUserInvitations();
        if (!isActive) return;
        if (error) {
          setInvitesError(
            (error as { message?: string; error?: { message?: string } })?.error?.message ||
              (error as { message?: string }).message ||
              'Failed to load invitations'
          );
          setInvitations([]);
          return;
        }
        setInvitations((data as UserInvitation[]) ?? []);
      } catch {
        if (isActive) {
          setInvitesError('Failed to load invitations');
          setInvitations([]);
        }
      } finally {
        if (isActive) {
          setIsInvitesLoading(false);
        }
      }
    };
    void loadInvitations();
    return () => {
      isActive = false;
    };
  }, [session?.user.id, session?.session.impersonatedBy, isSessionPending]);

  // Auto-select organization if only one exists and no pending invites
  useEffect(() => {
    if (
      !isSessionPending &&
      organizations &&
      organizations.length === 1 &&
      invitations.length === 0 &&
      !autoSelectRef.current
    ) {
      autoSelectRef.current = true;
      Promise.resolve().then(() => {
        handleSelectOrganization(organizations[0].id);
      });
    }
  }, [organizations, isSessionPending, invitations.length, handleSelectOrganization]);

  const handleAcceptInvitation = async (invitationId: string, organizationId: string) => {
    setIsLoading(true);
    try {
      // Accept the invitation first
      await authClient.organization.acceptInvitation({ invitationId });
      // Then set it as active
      await authClient.organization.setActive({ organizationId });
      router.push(callbackURL);
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'error' in error
          ? (error as { error?: { message?: string } }).error?.message
          : 'Failed to accept invitation';
      toast.error(message);
      setIsLoading(false);
    }
  };

  const handleRejectInvitation = async (invitationId: string) => {
    try {
      await authClient.organization.rejectInvitation({ invitationId });
      toast.success('Invitation rejected');
      // Refetch could be here or use a different state management
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'error' in error
          ? (error as { error?: { message?: string } }).error?.message
          : 'Failed to reject invitation';
      toast.error(message);
    }
  };

  if (isSessionPending || isOrgsPending) return <LoadingState />;
  if (!organizations || organizations.length === 0) return <EmptyState />;

  // Use loaded invitations
  const invitationsToDisplay = invitations;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Select Organization</h1>
        <p className="text-muted-foreground text-sm">
          Choose an organization to access your workspace.
        </p>
      </div>
      <OrganizationList
        organizations={organizations}
        isLoading={isLoading}
        onSelect={id => {
          // Find the org slug from organizations list
          const org = organizations.find(o => o.id === id);
          handleSelectOrganization(id, org?.slug);
        }}
      />
      {isInvitesLoading ? (
        <div className="text-center text-muted-foreground">Loading invitations...</div>
      ) : invitesError ? (
        <ErrorState message={invitesError} />
      ) : (
        <InvitationList
          invitations={invitationsToDisplay}
          isLoading={isLoading}
          onAccept={handleAcceptInvitation}
          onDecline={handleRejectInvitation}
        />
      )}
    </div>
  );
}
