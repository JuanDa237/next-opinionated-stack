import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-2 text-center">
      <h1 className="text-2xl font-bold">Your account is deleted</h1>
      <p className="text-muted-foreground text-sm">
        We are sorry to see you go. If you change your mind, you can create a new account at any
        time.
      </p>
      <Button className="mt-4" asChild>
        <Link href="/admin/signup">Create new account</Link>
      </Button>
    </div>
  );
}
