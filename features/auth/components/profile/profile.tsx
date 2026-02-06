'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth/auth-client';

export function ProfileSection() {
  const { data } = authClient.useSession();

  const name = data?.user.name || '';
  const email = data?.user.email || '';

  return (
    <section
      id="profile"
      className="rounded-2xl border bg-background/80 p-6 shadow-sm backdrop-blur"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="text-sm text-muted-foreground">
            Keep your public identity fresh and recognizable.
          </p>
        </div>
        <Button variant="secondary">Edit avatar</Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-dashed px-4 py-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-base font-semibold">
          {name
            .split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase() ?? 'JD'}
        </div>
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" value={name} onChange={() => {}} placeholder="Alex Thompson" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="displayName">Display name</Label>
          <Input id="displayName" placeholder="alex.t" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={() => {}}
            placeholder="alex@email.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="Medellin, CO" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Input id="bio" placeholder="Product designer who loves systems and coffee." />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button>Save changes</Button>
        <Button variant="ghost">Cancel</Button>
      </div>
    </section>
  );
}
