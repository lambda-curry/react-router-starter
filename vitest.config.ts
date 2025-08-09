import { defineConfig } from 'vitest/config';

// Root Vitest configuration for monorepo
// This enables running tests from the root with proper workspace support
export default defineConfig({
  test: {
    projects: [
      'apps/*/vitest.config.{ts,js}',
      'packages/*/vitest.config.{ts,js}',
    ],
  },
});
