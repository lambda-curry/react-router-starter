# Monorepo Cursor Rules

## Package Structure
- `apps/` - Applications (todo-app)
- `packages/` - Shared packages (ui, utils)
- Each package has its own package.json with proper exports

## Workspace Dependencies
- Use `workspace:*` for internal package dependencies
- Keep external dependencies in sync across packages
- Use peerDependencies for shared libraries like React

## Import Patterns
```tsx
// Import from workspace packages
import { Button } from '@todo-starter/ui';
import { cn, type Todo } from '@todo-starter/utils';

// Import from local files
import { TodoItem } from '~/components/todo-item';
import type { Route } from './+types/home';
```

## Package Naming
- Use scoped packages: `@todo-starter/package-name`
- Keep names descriptive and consistent
- Use kebab-case for package names

## Scripts and Tasks
- Define scripts at both root and package level
- Use Turbo for orchestrating build tasks
- Prefer package-specific scripts for development

## TypeScript Configuration
- Use Tailwind CSS v4's CSS-first configuration with `@theme` directive
- Use path mapping for workspace packages
- Keep tsconfig.json files minimal and focused

## Best Practices
- Keep packages focused and single-purpose
- Avoid circular dependencies between packages
- Use proper exports in package.json
- Document package APIs and usage patterns
