# React Router 7 Todo Starter

A modern, full-featured todo application built with React Router 7, showcasing best practices for monorepo architecture, component design, and developer experience.

## 🚀 Features

- **React Router 7** - Latest routing with SSR support
- **Monorepo Architecture** - Organized with Turbo and workspaces
- **Tailwind CSS v4** - Modern styling with CSS variables
- **shadcn/ui Components** - Beautiful, accessible UI components
- **TypeScript** - Full type safety throughout
- **React Context + useReducer** - Built-in state management
- **Lambda Curry Forms** - Type-safe forms with Zod and React Hook Form ([FORMS_INTEGRATION.md](./FORMS_INTEGRATION.md))
- **Storybook** - Component development and documentation (port 6006)
- **Vitest** - Fast unit, component, and integration testing
- **Bun** - Fast package manager and runtime
- **Biome** - Linting and formatting
- **AI / Agent rules** - Beads issue tracking and Cursor rules ([AGENTS.md](./AGENTS.md))

## 📁 Project Structure

```
.
├── apps/
│   └── todo-app/           # Main todo application
├── packages/
│   ├── config/             # Shared configurations
│   ├── ui/                 # shadcn/ui component library
│   └── utils/              # Shared utilities and types
├── turbo.json              # Turbo build configuration
└── package.json            # Root workspace configuration
```

## 🛠️ Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0
- Node.js >= 20.11.0

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-router-starter
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📋 Usage Examples

From the **repo root** (uses Turbo):

```bash
bun dev                    # Start all dev servers
bun build                  # Build all packages and apps
bun test                   # Run all tests (watch from workspace)
bun run test:ci            # Run tests once (CI)
bun lint                   # Lint all packages
bun typecheck              # Type check all packages
```

From **apps/todo-app** (or `bun run --filter todo-app ...` from root):

```bash
cd apps/todo-app
bun dev                    # Start dev server (http://localhost:5173)
bun run storybook          # Start Storybook (http://localhost:6006)
bun run build-storybook    # Build static Storybook
bun test                   # Vitest watch mode
bun run test:run           # Vitest single run
bun run test:ui            # Vitest UI
```

Quick flows:

- **Add a todo:** Open app → type in the input → submit (or use the "Advanced Todo Form" route for the full form example).
- **Run tests:** From root `bun test`, or from `apps/todo-app`: `bun run test:run`.
- **Browse components:** From `apps/todo-app` run `bun run storybook` and open http://localhost:6006.

## 📦 Available Scripts

### Root level
- `bun dev` - Start all development servers
- `bun build` - Build all packages and apps
- `bun test` - Run all tests (Turbo)
- `bun run test:ci` - Run tests once (CI)
- `bun lint` - Lint all packages
- `bun format` - Format all code
- `bun typecheck` - Type check all packages

### App level (apps/todo-app)
- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun test` - Run tests (Vitest watch)
- `bun run test:run` - Run tests once
- `bun run test:ci` - Run tests once (CI)
- `bun run test:ui` - Run tests with Vitest UI
- `bun run storybook` - Start Storybook (port 6006)
- `bun run build-storybook` - Build static Storybook

## 🏗️ Architecture

### Monorepo Structure
This project uses a monorepo structure with the following packages:


- **@todo-starter/ui** - Component library based on shadcn/ui
- **@todo-starter/utils** - Shared utilities, types, and helpers

### State Management
The app uses React's built-in Context API with useReducer for state management with the following features:
- In-memory todo storage
- CRUD operations for todos
- Filtering (all, active, completed)
- Bulk operations (clear completed)
- Type-safe actions and state updates

### Component Architecture
Components are organized by feature and follow these principles:
- Single responsibility
- Composition over inheritance
- Proper TypeScript typing
- Accessible by default

## 🎨 Styling

This project uses **Tailwind CSS v4** with CSS-first configuration for modern, efficient styling.

### Tailwind v4 Configuration
- **CSS-first approach**: Theme configuration is defined directly in CSS using the `@theme` directive
- **No JavaScript config needed**: Tailwind v4 eliminates the need for `tailwind.config.js` files in most cases
- **Theme variables**: All design tokens (colors, spacing, etc.) are defined in `apps/todo-app/app/globals.css`
- **Dark mode support**: Uses `@custom-variant` and `@variant` directives for theme switching
- **shadcn/ui compatible**: Maintains full compatibility with shadcn/ui components

## 📖 Storybook

Component stories live in **apps/todo-app/app/components/** as `*.stories.tsx` (e.g. `add-todo.stories.tsx`, `todo-item.stories.tsx`, `todo-filters.stories.tsx`, `contact-form.stories.tsx`). Storybook is configured in `apps/todo-app/.storybook/`.

| Command | Description |
|--------|-------------|
| `bun run storybook` | Start Storybook dev server (from apps/todo-app) — http://localhost:6006 |
| `bun run build-storybook` | Build static Storybook output |

Use `npm run storybook` / `npm run build-storybook` if you prefer npm in that app.

## 🧪 Testing

The project uses **Vitest** and **React Testing Library** for unit, component, and integration tests. Full patterns and examples are in **[apps/todo-app/TESTING.md](./apps/todo-app/TESTING.md)**.

**Patterns:**

- **Unit** — Pure helpers in `app/lib/__tests__/*.test.ts`.
- **Component** — UI components in `app/components/__tests__/*.test.tsx`; use **`renderWithRouter`** from `test/test-utils.tsx` when components use `Link`, `useNavigate`, or other router APIs.
- **Integration** — Full route + provider flows in `app/routes/__tests__/*.integration.test.tsx`.

**Scripts (from apps/todo-app):**

| Script | Description |
|--------|-------------|
| `bun test` | Vitest watch mode |
| `bun run test:run` | Single run (CI) |
| `bun run test:ci` | Same as test:run |
| `bun run test:ui` | Vitest UI |

Shared setup: `test/setup.ts`. Shared helpers: `test/test-utils.tsx` (includes `renderWithRouter`).

## 🎨 Styling

### Tailwind CSS v4
The project uses Tailwind CSS v4 with:
- CSS variables for theming
- Custom design tokens
- Responsive design utilities
- Dark mode support (ready)

### Component Styling
- shadcn/ui components with Radix UI primitives
- Consistent design system
- Accessible color contrasts
- Responsive layouts

## 🔧 Development

### Adding New Components
1. Create component in `packages/ui/src/components/ui/`
2. Export from `packages/ui/src/index.ts`
3. Use in apps with `import { Component } from '@todo-starter/ui'`

### Adding New Utilities
1. Create utility in `packages/utils/src/`
2. Export from `packages/utils/src/index.ts`
3. Use in apps with `import { utility } from '@todo-starter/utils'`

### Code Quality
The project enforces code quality through:
- **Biome** for linting and formatting
- **TypeScript** for type checking
- **Pre-commit hooks** (when configured)
- **Consistent code style** across packages

## 🚀 Deployment

### Build for Production
```bash
bun build
```

### Start Production Server
```bash
bun start
```

The app supports:
- Server-side rendering (SSR)
- Static pre-rendering
- Progressive enhancement

## 📚 Documentation

- **[FORMS_INTEGRATION.md](./FORMS_INTEGRATION.md)** — Lambda Curry Forms setup, patterns, and examples
- **[apps/todo-app/TESTING.md](./apps/todo-app/TESTING.md)** — Testing guide (unit, component, integration, `renderWithRouter`)
- **[AGENTS.md](./AGENTS.md)** — Beads issue tracking and session workflow for agents

## 📚 Learn More

- [React Router 7 Documentation](https://reactrouter.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Context](https://react.dev/reference/react/useContext)
- [Vitest](https://vitest.dev/)
- [Turbo](https://turbo.build/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
