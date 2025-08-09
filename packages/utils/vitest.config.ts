import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Default to jsdom for React + DOM/localStorage tests
    environment: 'jsdom',

    // Optional: run Node env for server-only utils tests
    environmentMatchGlobs: [
      ['packages/utils/**', 'node'],
    ],

    // Optional (we already import from 'vitest')
    // globals: true,
  },
});