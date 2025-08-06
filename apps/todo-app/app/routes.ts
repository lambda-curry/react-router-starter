import type { RouteConfig } from '@react-router/dev/routes';
import { index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('create-todo', 'routes/create-todo.tsx'),
] satisfies RouteConfig;
