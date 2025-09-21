# Architecture Overview

- Monorepo (Turborepo + Bun)
- React Router 7 app in apps/* with file-based route modules
- Shared packages in packages/* with proper exports
- Styling via Tailwind; component patterns via shadcn/ui (optional)
- Testing via Vitest; lint via Biome; typechecking via tsc
- CI via GitHub Actions; see .github/workflows

