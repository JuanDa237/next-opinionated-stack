'use client';

import { cn } from '@/lib/utils';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TotpForm } from '../components/two-factor/totp-form';
import { BackupForm } from '../components/two-factor/backup-form';
import { AuthPageDescription } from '../components/auth-page-description';

export function TwoFactorChallengeForm({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <AuthPageDescription
        title="Two-factor verification"
        description="Enter the code from your authenticator app or use a backup code."
      >
        <Tabs defaultValue="totp">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="totp">Authenticator</TabsTrigger>
            <TabsTrigger value="backup">Backup code</TabsTrigger>
          </TabsList>

          <TabsContent value="totp">
            <TotpForm />
          </TabsContent>

          <TabsContent value="backup">
            <BackupForm />
          </TabsContent>
        </Tabs>
      </AuthPageDescription>
    </div>
  );
}
