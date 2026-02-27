'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from 'next-themes';

import { authClient } from '@/lib/auth/auth-client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { OrganizationsMenu } from './organizations-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AUTH_ROUTES, getClientMainDomainUrl } from '@/features/admin/helpers';

type UserMenuProps = {
  className?: string;
};

type UserInvitation = {
  id: string;
  organizationId: string;
  email: string;
  role: 'member' | 'admin' | 'owner';
  status: string;
  inviterId: string;
  expiresAt: Date;
  createdAt: Date;
  teamId?: string;
  organizationName: string;
};

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.split('@')[0]?.trim() || '';

  if (!source) {
    return 'U';
  }

  const parts = source
    .split(' ')
    .map(part => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  return parts.map(part => part[0].toUpperCase()).join('') || 'U';
}

export function UserMenu({ className }: UserMenuProps) {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [invitations, setInvitations] = useState<UserInvitation[]>([]);
  const [isInvitesLoading, setIsInvitesLoading] = useState(false);
  const [invitesError, setInvitesError] = useState<string | null>(null);

  const user = data?.user;
  const initials = useMemo(() => getInitials(user?.name, user?.email), [user?.name, user?.email]);
  const isLoading = isPending || isSigningOut;
  const hasPendingInvites = useMemo(
    () => invitations.some(invitation => invitation.status === 'pending'),
    [invitations]
  );

  useEffect(() => {
    let isActive = true;

    if (!user || isPending) {
      setInvitations([]);
      setInvitesError(null);
      return () => {
        isActive = false;
      };
    }

    const loadInvitations = async () => {
      setIsInvitesLoading(true);
      setInvitesError(null);

      try {
        const { data, error } = await authClient.organization.listUserInvitations();

        if (!isActive) {
          return;
        }

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
  }, [user, isPending]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut(undefined, {
        onSuccess: () => {
          router.refresh();
        },
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('rounded-full', className)}
          disabled={isLoading}
        >
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'User'} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            {hasPendingInvites ? (
              <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
            ) : null}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push(AUTH_ROUTES.PROFILE)} disabled={!user}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {invitations.length > 0 && (
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
            )}
            Invitations
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-72">
              {isInvitesLoading ? (
                <DropdownMenuItem disabled>Loading invitations...</DropdownMenuItem>
              ) : invitesError ? (
                <DropdownMenuItem disabled>{invitesError}</DropdownMenuItem>
              ) : invitations.length === 0 ? (
                <DropdownMenuItem disabled>No invitations</DropdownMenuItem>
              ) : (
                invitations.map(invitation => {
                  const label =
                    invitation.organizationName ||
                    invitation.organizationId ||
                    'Organization invitation';
                  const detail = invitation.role;
                  const invitationId = invitation.id ?? null;

                  return (
                    <DropdownMenuItem
                      key={invitation.id ?? `${label}-${detail}`}
                      onSelect={event => {
                        event.preventDefault();

                        if (invitationId) {
                          window.location.href = getClientMainDomainUrl(
                            `/${AUTH_ROUTES.INVITES}/${invitationId}`
                          );
                        }
                      }}
                      disabled={!invitationId}
                    >
                      <p className="text-sm">
                        Join <span className="font-medium">{label}</span> as{' '}
                        <span className="font-medium">{detail}</span>
                      </p>
                    </DropdownMenuItem>
                  );
                })
              )}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <OrganizationsMenu disabled={isLoading} />
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Sun className="mr-2 h-4 w-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                Light
                {theme === 'light' && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
                {theme === 'dark' && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="mr-2 h-4 w-4" />
                System
                {theme === 'system' && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSignOut} disabled={isLoading}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
