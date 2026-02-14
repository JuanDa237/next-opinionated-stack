export default function Page() {
  return (
    <div className="h-full relative overflow-hidden border bg-[radial-gradient(1100px_circle_at_10%_-10%,rgba(14,116,144,0.18),transparent_45%),radial-gradient(900px_circle_at_90%_10%,rgba(59,130,246,0.22),transparent_40%),linear-gradient(135deg,rgba(2,6,23,0.02),rgba(2,6,23,0.08))] p-6 sm:p-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-6 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-56 w-56 -translate-x-1/3 translate-y-1/3 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-foreground/70">
            Admin Workspace Example
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-5xl">
              Bienvenido a tu centro de control
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
              Revisa la actividad clave, organiza a tu equipo y avanza con claridad. Este panel esta
              diseñado para darte contexto rapido y decisiones seguras desde un solo lugar.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-lg shadow-foreground/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              href="/admin/organizations"
            >
              Ver organizaciones
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-foreground/15 bg-background/70 px-6 py-3 text-sm font-semibold text-foreground/80 transition hover:-translate-y-0.5 hover:border-foreground/30"
              href="/admin/users"
            >
              Gestionar usuarios
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Actividad diaria', value: '98%' },
              { label: 'Equipos activos', value: '24' },
              { label: 'Alertas abiertas', value: '3' },
            ].map(item => (
              <div
                key={item.label}
                className="animate-in rounded-2xl border border-foreground/10 bg-background/80 p-4 shadow-sm fade-in slide-in-from-bottom-4 duration-700"
              >
                <div className="text-xs uppercase tracking-[0.24em] text-foreground/50">
                  {item.label}
                </div>
                <div className="mt-2 text-2xl font-semibold text-foreground">{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <div className="animate-in rounded-3xl border border-foreground/10 bg-background/80 p-6 shadow-md fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-foreground/50">Hoy</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">Prioridades claras</h2>
              </div>
              <span className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs font-semibold text-foreground/70">
                3 focos
              </span>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-foreground/70">
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-foreground" />
                Revisar solicitudes pendientes y asignar responsables.
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-foreground/60" />
                Confirmar accesos de nuevos miembros del equipo.
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-foreground/40" />
                Monitorear el rendimiento de las automatizaciones.
              </li>
            </ul>
          </div>

          <div className="animate-in rounded-3xl border border-foreground/10 bg-[linear-gradient(140deg,rgba(15,118,110,0.12),rgba(2,6,23,0.02))] p-6 shadow-md fade-in slide-in-from-bottom-6 duration-700">
            <h3 className="text-lg font-semibold text-foreground">Acceso rapido</h3>
            <p className="mt-2 text-sm text-foreground/70">
              Atajos inteligentes para que llegues a lo importante en un clic.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Invitar miembros', href: '/admin/organizations' },
                { label: 'Ver reportes', href: '/admin' },
                { label: 'Seguridad', href: '/admin/profile' },
                { label: 'Ajustes', href: '/admin/profile' },
              ].map(item => (
                <a
                  key={item.label}
                  className="rounded-2xl border border-foreground/10 bg-background/80 px-4 py-3 text-sm font-medium text-foreground/80 transition hover:-translate-y-0.5 hover:border-foreground/30"
                  href={item.href}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
