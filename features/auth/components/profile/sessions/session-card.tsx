'use client';
import { useRouter } from 'next/navigation';

// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { authClient } from '@/lib/auth/auth-client';

// Libs
import { Session } from 'better-auth';
import { UAParser } from 'ua-parser-js';

// Icons
import { Monitor, Smartphone, Trash } from 'lucide-react';

export function SessionCard({
  session,
  isCurrent = false,
}: {
  session: Session;
  isCurrent?: boolean;
}) {
  const userAgentInfo = session.userAgent ? new UAParser(session.userAgent).getResult() : null;

  function getBrowserInformation() {
    if (userAgentInfo == null) return 'Unknown Device';
    if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null) {
      return 'Unknown Device';
    }

    if (userAgentInfo.browser.name == null) return userAgentInfo.os.name;
    if (userAgentInfo.os.name == null) return userAgentInfo.browser.name;

    return `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`;
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC',
    }).format(new Date(date));
  }

  const deviceType = userAgentInfo?.device?.type;
  const isMobileDevice = deviceType === 'mobile' || deviceType === 'tablet';
  const DeviceIcon = isMobileDevice ? Smartphone : Monitor;

  const router = useRouter();

  function revokeSession() {
    return authClient.revokeSession(
      {
        token: session.token,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  }

  return (
    <Card className="flex flex-row items-center justify-between gap-4 px-4 py-3 shadow-none">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted/30">
          <DeviceIcon className="size-4 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-medium">{getBrowserInformation()}</span>
            {isCurrent ? <Badge>Current</Badge> : null}
          </div>
          <div className="text-xs text-muted-foreground">
            <span>Expires {formatDate(session.expiresAt)}</span>
          </div>
        </div>
      </div>
      {!isCurrent && (
        <Button
          variant="outline"
          size="icon"
          className="text-red-500"
          onClick={() => revokeSession()}
        >
          <Trash />
        </Button>
      )}
    </Card>
  );
}
