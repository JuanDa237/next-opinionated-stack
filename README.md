# Next.js Opinionated Stack

An opinionated Next.js starter template designed to eliminate boilerplate and accelerate development. Fork this repo and start building immediately with a production-ready setup.

## 🎯 Philosophy

This template is built with strong opinions about:

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

## 📂 Project Structure

```
next-opinionated-stack/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/                # Static assets
├── .vscode/
│   └── mcp.json           # Model Context Protocol settings
├── .docs/                 # Project documentation
│   └── architecture.md
└── ...config files        # ESLint, TypeScript, Tailwind, etc.
```

## 🤖 AI-Ready Features

This template is optimized for AI-assisted development:

- **MCP Configurations** - Pre-configured Model Context Protocol settings
- **Documentation Structure** - Clear docs for AI context understanding
- **Consistent Patterns** - Predictable code structure for better AI suggestions
- **Type Safety** - TypeScript helps AI understand your codebase

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Forms**: [TanStack Form](https://tanstack.com/form)
- **Tables**: [TanStack Table](https://tanstack.com/table)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Validation**: [Zod](https://zod.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Git Hooks**: [Husky](https://typicode.github.io/husky/)

## 📝 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
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
