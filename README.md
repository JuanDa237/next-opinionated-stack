# Next.js Opinionated Stack

An opinionated Next.js starter template designed to eliminate boilerplate and accelerate development. Fork this repo and start building immediately with a production-ready setup.

## 🎯 Philosophy

This template is built around a few non-negotiables:

- **Project structure** - Organized, scalable folder architecture
- **Development experience** - Pre-configured tooling and dependencies
- **AI-ready** - Optimized for AI-assisted development with MCP configurations
- **Production-ready** - Battle-tested patterns and best practices

## ✨ Features

- **⚡ Next.js 16+**
- **📁 Opinionated Structure** - Clear separation of concerns
- **🤖 AI-Ready** - MCP (Model Context Protocol) configurations included
- **🔐 Better Auth** - Modern authentication setup included
- **🎨 shadcn/ui** - Beautiful, accessible UI components
- **🧩 TanStack Suite** - Form, Table, and Query preconfigured
- **✅ Zod** - Schema validation ready to use
- **🎯 Prettier** - Consistent code formatting
- **🧹 ESLint** - Code linting and quality checks
- **🪝 Husky** - Git hooks for consistent quality
- **🎯 Zero Boilerplate** - Start building features immediately

## 🚀 Quick Start

### 1. Fork or Clone

```bash
# Fork this repository on GitHub, then clone your fork
git clone https://github.com/JuanDa237/next-opinionated-stack
cd next-opinionated-stack
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## ✅ First Steps After Cloning

1. Update app metadata in `app/layout.tsx`
2. Configure authentication providers
3. Remove example features you don’t need
4. Start a new feature under `features/`

## 👥 Who This Is For

This starter is ideal if you:

- Prefer **feature-first architecture**
- Want **strong defaults** instead of endless setup decisions
- Build apps with **auth, dashboards, and forms**
- Use or plan to use **AI-assisted development**

This may not be for you if you:

- Prefer minimal, unopinionated starters
- Want Pages Router instead of App Router
- Dislike feature-based folder structures

## 📂 Project Structure (Opinionated)

This structure follows a **feature-first, route-light** philosophy:

- Routes stay thin and declarative
- Features own their UI, data, and logic
- Shared code lives only when it truly belongs everywhere

```
next-opinionated-stack/
├── app/                                # Next.js App Router (routes + layouts)
│   ├── globals.css                     # Global styles
│   ├── layout.tsx                      # Root layout
│   ├── (home)                          # Public-facing routes group
│   └── admin/                          # Admin area
│       ├── (auth)/                     # Auth routes group
│       │   ├── layout.tsx
│       │   ├── login/
│       │   │   ├── page.tsx
│       │   │   └── components/         # Route-scoped UI
│       │   └── signup/
│       │       ├── page.tsx
│       │       └── components/         # Route-scoped UI
│       └── (dashboard)/                # Dashboard routes group
│           ├── page.tsx
│           └── components/             # Route-scoped UI
├── components/                         # Shared, reusable UI
│   ├── common/                          # Brand/marketing components
│   └── ui/                              # shadcn/ui primitives
├── features/                           # Feature-first domains
│   └── auth/
│       ├── components/                 # Feature UI
│       ├── containers/                 # Feature smart components
│       ├── data/                       # Feature data access
│       ├── helpers/                    # Feature helpers
│       ├── hooks/                      # Feature hooks
│       ├── lib/                        # Feature libraries/dependencies
│       ├── models/                     # Feature types/models
│       ├── stores/                     # Feature state (client)
│       └── utils/                      # Feature utilities
├── hooks/                              # Shared app hooks
├── lib/                                # Shared utilities (server/client)
├── public/                             # Static assets
├── .docs/                              # Project documentation
├── .vscode/                            # MCP + editor settings
└── ...config files                     # ESLint, TypeScript, Tailwind, etc.
```

### Where Should Code Live?

- **app/** → routing, layouts, and route-level composition
- **features/** → business logic, domain UI, data access
- **components/** → reusable, app-agnostic UI only

## 🤖 AI-Ready Features

This template is optimized for AI-assisted development:

- **MCP Configurations** - Pre-configured Model Context Protocol settings
- **Documentation Structure** - Clear docs for AI context understanding
- **Consistent Patterns** - Predictable code structure for better AI suggestions
- **Type Safety** - TypeScript helps AI understand your codebase

Example:

- MCP configs expose feature boundaries clearly
- Predictable file naming improves AI refactors
- Zod schemas + TypeScript give AI strong type signals

## 🧱 Design Constraints

- App Router only
- Feature-first architecture
- TypeScript everywhere
- Client state kept local to features

## 🛠️ Tech Stack

- **Framework**: [Next.js 16+](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Forms**: [TanStack Form](https://tanstack.com/form)
- **Tables**: [TanStack Table](https://tanstack.com/table)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Validation**: [Zod](https://zod.dev/)
- **Formatting**: [Prettier](https://prettier.io/)
- **Linting**: [ESLint](https://eslint.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Git Hooks**: [Husky](https://typicode.github.io/husky/)

## 📝 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Run Prettier
```

## 🎨 Customization

This is an opinionated starter, but it's yours to customize:

1. Update `package.json` with your project details
2. Modify the folder structure to fit your needs
3. Add your preferred libraries and tools
4. Update this README with your project information

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

The easiest way to deploy is using [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for other hosting options.

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

Contributions are welcome! Open an issue to propose changes or submit a pull request from a feature branch. Template variants are encouraged (e.g., a `mongodb` branch with MongoDB preconfigured).

## 📄 License

MIT License - feel free to use this template for your projects.

---

**Ready to build?** Fork this repo and start shipping features instead of setting up boilerplate! 🚀
