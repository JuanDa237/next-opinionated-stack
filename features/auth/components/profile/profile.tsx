'use client';

// Components
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Libs
import { authClient } from '@/lib/auth/auth-client';

export function ProfileSection() {
  const { data } = authClient.useSession();

  const name = data?.user.name || '';
  const email = data?.user.email || '';

  const avatarImage = data?.user.image || '';
  const avatarFallback =
    name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase() ?? 'JD';

  // TODO: This form should save changes.

  return (
    <Card id="profile" className="bg-background/80 shadow-sm backdrop-blur">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl">Profile</CardTitle>
            <CardDescription>Keep your public identity fresh and recognizable.</CardDescription>
          </div>
          <Button variant="secondary">Edit avatar</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-dashed px-4 py-3">
          <Avatar>
            <AvatarImage src={avatarImage} alt={name} className="grayscale" />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
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
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-3">
        <Button>Save changes</Button>
        <Button variant="ghost">Cancel</Button>
      </CardFooter>
    </Card>
  );
}
