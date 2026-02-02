import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { createMemoryRouter, type RouteObject, RouterProvider } from 'react-router-dom';

export interface RenderWithRouterOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Route path for initial entry. Default: '/' */
  initialEntries?: string[];
  /** Additional route config (e.g. for loaders/actions in integration tests). */
  routes?: RouteObject[];
}

/**
 * Renders a React component wrapped in React Router's MemoryRouter.
 * Use this for any component that depends on router context (e.g. Link, useNavigate, useFetcher, useHref).
 *
 * @example
 * ```tsx
 * renderWithRouter(<MyComponent />);
 * renderWithRouter(<Page />, { initialEntries: ['/contact'] });
 * ```
 */
export function renderWithRouter(ui: ReactElement, options: RenderWithRouterOptions = {}) {
  const { initialEntries = ['/'], routes, ...renderOptions } = options;

  const routeConfig: RouteObject[] =
    routes ?? [
      {
        path: '/',
        element: ui
      }
    ];

  const router = createMemoryRouter(routeConfig, { initialEntries });
  return render(<RouterProvider router={router} />, renderOptions);
}

/**
 * Creates a memory router for integration tests that need full route trees
 * (e.g. nested layouts, loaders, or multiple routes).
 */
export function createTestRouter(routes: RouteObject[], initialEntries: string[] = ['/']) {
  return createMemoryRouter(routes, { initialEntries });
}
