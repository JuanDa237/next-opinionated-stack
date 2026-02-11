import Link from 'next/link';

// Sections
import { AccountsSection } from '@/features/auth/components/profile/accounts/accounts';
import { DangerZone } from '@/features/auth/components/profile/danger-zone';
import { SecuritySection } from '@/features/auth/components/profile/security/security';
import { SessionsSection } from '@/features/auth/components/profile/sessions/sessions';
import { ProfileSection } from '@/features/auth/components/profile/profile';

export default function Page() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_400px_at_10%_-10%,rgba(228,27,30,0.28),transparent),radial-gradient(900px_420px_at_85%_0%,rgba(252,67,70,0.18),transparent)]" />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Profile center
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Your account, your rules</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Update your details, secure your access, and manage connected accounts in one place.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit rounded-2xl border bg-background/80 p-4 backdrop-blur lg:sticky lg:top-6 lg:max-h-[calc(100vh-4rem)] lg:overflow-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Settings
            </p>
            <nav className="mt-4 flex flex-col gap-1 text-sm">
              {[
                { label: 'Profile', href: '#profile' },
                { label: 'Security', href: '#security' },
                { label: 'Sessions', href: '#sessions' },
                { label: 'Accounts', href: '#accounts' },
                { label: 'Danger Zone', href: '#danger-zone' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-left font-medium transition hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          <div className="space-y-8">
            <ProfileSection />

            <SecuritySection />

            <section className="grid gap-6 lg:grid-cols-2">
              <SessionsSection />
              <AccountsSection />
            </section>

            <DangerZone />
          </div>
        </div>
      </div>
    </div>
  );
}
