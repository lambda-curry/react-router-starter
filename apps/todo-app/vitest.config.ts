import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths() as import('vitest/config').UserConfig['plugins'] extends (infer P)[] ? P : never],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['app/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'build', '**/*.stories.*', '.storybook'],
    env: { NODE_ENV: 'test' },
    // Optional: install @vitest/coverage-v8 and run vitest run --coverage
    testTimeout: 10_000
  }
});
