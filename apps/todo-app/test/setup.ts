import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// React Router's useRemixForm calls useHref; wrap renders in a Router for components that need it.
// For tests that require Router context, prefer rendering the component within a MemoryRouter in the test itself.

afterEach(() => {
  cleanup();
});

