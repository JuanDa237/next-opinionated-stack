export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Next.js Opinionated Stack
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Ship faster with an AI-ready, opinionated Next.js starter
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            A production-ready template that removes boilerplate and gets you building immediately.
            Fork the repo, install dependencies, and focus on features—not setup.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Opinionated structure',
              body: 'Clear, scalable folder layout with proven patterns.',
            },
            {
              title: 'AI-ready',
              body: 'MCP config + documentation structure for better AI context.',
            },
            {
              title: 'Authentication',
              body: 'Better Auth preconfigured for modern auth flows.',
            },
            {
              title: 'UI system',
              body: 'shadcn/ui + Tailwind for accessible, composable UI.',
            },
            {
              title: 'TanStack suite',
              body: 'Form, Table, and Query ready for complex apps.',
            },
            {
              title: 'Quality tooling',
              body: 'Zod validation and Husky hooks to keep quality high.',
            },
          ].map(item => (
            <div
              key={item.title}
              className="rounded-xl border border-border/60 bg-card/40 p-5 shadow-sm"
            >
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/40 p-6">
          <h2 className="text-lg font-semibold">Quick start</h2>
          <div className="grid gap-2 text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-background/80 px-3 py-1 font-mono text-xs">
                pnpm install
              </span>
              <span className="rounded-md bg-background/80 px-3 py-1 font-mono text-xs">
                pnpm dev
              </span>
            </div>
            <p>
              Then open <span className="font-medium text-foreground">http://localhost:3000</span>{' '}
              and start building.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
