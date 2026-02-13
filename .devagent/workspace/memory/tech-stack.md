# React Router Starter Tech Stack

## Context

This repo is a React Router 7 monorepo starter that demonstrates production‑ready patterns for routing, forms, UI components, Storybook, and testing.

## Core Stack

### Application Framework & Runtime
- App framework: React Router v7 (framework mode)
- Language: TypeScript 5.9.3 (root), 5.8.3 (apps/packages)
- Runtime: Node.js >= 20.11.0 (engines), Bun 1.2.19 (package manager)
- Package manager: Bun (workspaces enabled)

### Build & Development Tools
- Monorepo tooling: Turborepo 2.8.1
- Build tool: Vite 6.4.1 (root), 6.3.3 (todo-app + Storybook)
- Module system: ESM only
- Type generation: React Router auto-generated types in `.react-router/types/`

### Frontend
- UI framework: React 19.2.4 (root resolution; apps target ^19.1.0)
- Routing: React Router v7 Framework Mode (SSR/SPA hybrid)
- CSS framework: Tailwind CSS v4 toolchain (`tailwindcss`, `@tailwindcss/vite`)
- UI component library: shadcn/ui patterns + Radix UI primitives
- Icons: lucide-react
- Utilities: class-variance-authority, tailwind-merge, clsx

### Backend (SSR)
- Server framework: React Router v7 server runtime
- API style: Loader/action functions (no separate API layer in starter)
- Authentication: N/A (not included in starter)

### Data & State Management
- Forms & validation: `@lambdacurry/forms` + `remix-hook-form` + Zod
- State management: React Context + useReducer
- Data fetching: React Router loaders/actions
- Database: None (starter uses in-memory state)

### Testing & Quality
- Testing framework: Bun test (bun:test) + jsdom 26.1.0
- Component testing: @testing-library/react 16.1.0
- Linting: Biome 2.3.11
- Formatting: Biome 2.3.11
- Type checking: TypeScript + React Router generated types

### Documentation & UI Dev
- Storybook: v8 (`@storybook/react-vite`, `@storybook/addon-essentials`)

### Hosting & Infrastructure
- Application hosting: TBD (not included in starter)
- Database hosting: N/A
- CDN: TBD
- Asset storage: Local/static

### CI/CD & DevOps
- CI/CD platform: TBD
- Deployment trigger: TBD
- Environments: development, production

### AI & External Services
- AI/LLM: N/A for this starter
- Analytics: N/A
- Monitoring: N/A
- Email: N/A

## Product Capabilities

Key features this stack enables:
- React Router 7 SSR/SPA hybrid app foundation
- End‑to‑end form patterns with validation and accessibility
- Shared UI component library with shadcn/ui conventions
- Component documentation via Storybook
- Testing patterns for routes and components

## Constraints & Requirements

Technical or business constraints that shaped these choices:
- Must support React Router v7 framework mode
- Must demonstrate accessible, progressive enhancement form patterns
- Keep dependencies compatible with Bun workspaces
- Provide Storybook and testing examples out of the box

## Future Integrations (Roadmap)

Planned additions or changes:
- CI pipeline (lint/typecheck/test)
- Auth + database example (optional starter add‑on)
- Deployment template (Vercel or similar)

## Decision Rationale (Optional)

Why key technologies were chosen:
- **React Router v7**: First‑class SSR + data loading patterns
- **Tailwind v4**: CSS‑first theming with modern build pipeline
- **@lambdacurry/forms**: Type‑safe forms with progressive enhancement
- **Storybook**: Shared UI patterns and visual regression readiness

---

**Last Updated**: 2026-02-03
