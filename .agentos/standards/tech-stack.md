# Lambda AgentOS — Tech Stack (Global Standard)

This standard defines our default stack used across projects and adopted by Lambda AgentOS.

- Language: TypeScript (strict), Node >= 20.11
- Frontend: React 19, React Router 7 (route modules, loaders/actions, +types)
- Styling: Tailwind CSS (utility-first), shadcn/ui where applicable
- Build/Workspace: Turborepo, Bun, Biome (or ESLint+Prettier), Vitest
- Data: Prisma + Postgres (where backend exists)
- Commerce: MedusaJS (modules, services, events, subscribers)
- API Contracts: OpenAPI (YAML) for server endpoints; contract-first where possible
- CI: GitHub Actions (lint, typecheck, build, tests, drift checks)

Non-negotiables
- Prefer framework primitives first (React Router loaders/actions; simple composition)
- Test-first order: contracts → integration/e2e → unit → source
- No direct DB from UI; UI consumes typed contracts
- Keep specs and docs close to code: see .agentos/specs and .agentos/product

