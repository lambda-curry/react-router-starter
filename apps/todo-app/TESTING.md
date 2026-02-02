# Testing Guide

This app uses **Vitest** and **React Testing Library** for unit, component, and integration tests.

## Running tests

```bash
npm run test        # watch mode
npm run test:run    # single run (CI)
npm run test:ci     # same as test:run
npm run test:ui     # Vitest UI (interactive)
```

Use `bun run test`, `bun run test:run`, etc. if using Bun.

Optional coverage (requires `@vitest/coverage-v8`):

```bash
npx vitest run --coverage
```

## Test layout

| Pattern | Location | Purpose |
|--------|----------|---------|
| **Unit** | `app/lib/__tests__/*.test.ts` | Pure utilities (e.g. `format.ts`, `todo-context` helpers). |
| **Component** | `app/components/__tests__/*.test.tsx` | UI components with router/context mocking. |
| **Integration** | `app/routes/__tests__/*.integration.test.tsx` | Full route + provider flows. |

Shared setup: `test/setup.ts` (jest-dom, cleanup). Shared helpers: `test/test-utils.tsx`.

## Unit test examples

- **App:** `app/lib/__tests__/format.test.ts` — tests `slugify()` and other pure helpers.
- **Packages:** `packages/utils` has `cn.test.ts` and `types.test.ts`; `packages/ui` has `button.test.tsx`. Run tests from repo root or each package.

## Component tests with React Router

Components that use `Link`, `useNavigate`, `useFetcher`, or `useHref` need router context. Use the shared helper:

```tsx
import { renderWithRouter } from '../../../test/test-utils';

it('renders and submits', () => {
  renderWithRouter(<MyComponent />);
  // or with custom route/entry:
  renderWithRouter(<Page />, { initialEntries: ['/contact'] });
});
```

`renderWithRouter` wraps the component in React Router’s `createMemoryRouter` + `RouterProvider`. See `test/test-utils.tsx` and `app/components/__tests__/add-todo.test.tsx` for examples.

## Integration test pattern

Integration tests render a full route with providers and assert user flows (e.g. add todo, see it in the list):

```tsx
import { renderWithRouter } from '../../../test/test-utils';
import { TodoProvider } from '../../lib/todo-context';
import Home from '../home';

renderWithRouter(
  <TodoProvider>
    <Home />
  </TodoProvider>
);
// then fire events and assert DOM/state
```

See `app/routes/__tests__/home.integration.test.tsx` (Todo flow: provider + AddTodo + filtered list). For full-route integration with `Link`/navigation, use the app router in E2E or a test environment that mounts the full app.

## Vitest config

`vitest.config.ts` sets:

- **include:** `app/**/*.{test,spec}.{ts,tsx}`
- **exclude:** `node_modules`, `build`, Storybook files
- **env:** `NODE_ENV=test`
- **setupFiles:** `test/setup.ts` (jest-dom, RTL cleanup)
- **coverage:** optional; enable with `--coverage` and `@vitest/coverage-v8` if needed
