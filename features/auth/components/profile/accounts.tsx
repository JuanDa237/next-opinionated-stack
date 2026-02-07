'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function AccountsSection() {
  return (
    <Card id="accounts" className="bg-background/80 shadow-sm backdrop-blur">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">Connected accounts</CardTitle>
            <CardDescription>Control which providers can access your data.</CardDescription>
          </div>
          <Button variant="secondary">Add account</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Separator className="mb-6" />
        <div className="space-y-4 text-sm">
          {['Google · Connected', 'GitHub · Connected', 'Slack · Not connected'].map(account => (
            <div
              key={account}
              className="flex items-center justify-between rounded-xl border border-dashed px-4 py-3"
            >
              <span>{account}</span>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
