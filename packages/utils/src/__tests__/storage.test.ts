import { describe, it, expect, beforeEach, vi } from 'vitest';

import { loadFromStorage, type StorageLike } from '../storage';

// We'll provide a fake storage to bypass getStorage() SSR/test guard by injecting
// directly via stubbing global window.localStorage used by our helpers.

declare global {
  interface Window {
    __fakeStorage?: StorageLike;
  }
}

// Helper to temporarily lift the test guard by stubbing process.env and window
function withStorage<T>(fake: StorageLike, run: () => T): T {
  const origNodeEnv = process.env.NODE_ENV;
  const globalRef = globalThis as unknown as { window?: { localStorage: StorageLike } };
  const origWindow = globalRef.window;

  // Trick: temporarily change NODE_ENV so getStorage doesn't early-return
  process.env.NODE_ENV = 'production';
  globalRef.window = { localStorage: fake };

  try {
    return run();
  } finally {
    // restore
    process.env.NODE_ENV = origNodeEnv;
    if (origWindow === undefined) {
      // Avoid using delete operator per lint rules
      (globalThis as unknown as { window?: { localStorage: StorageLike } }).window = undefined;
    } else {
      globalRef.window = origWindow;
    }
  }
}

describe('storage helpers', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns parsed value when JSON is valid', () => {
    const fake: StorageLike = {
      getItem: (k: string) => (k === 'key' ? JSON.stringify({ a: 1 }) : null),
      setItem: () => undefined,
      removeItem: () => undefined,
    };

    const result = withStorage(fake, () =>
      loadFromStorage<{ a: number }>('key', { a: 0 })
    );

    expect(result).toEqual({ a: 1 });
  });

  it('falls back when JSON is malformed', () => {
    const fake: StorageLike = {
      getItem: (_: string) => '{"a":', // malformed
      setItem: () => undefined,
      removeItem: () => undefined,
    };

    const result = withStorage(fake, () =>
      loadFromStorage<{ a: number }>('key', { a: 0 })
    );

    expect(result).toEqual({ a: 0 });
  });

  it('uses fallback when validate guard rejects', () => {
    const fake: StorageLike = {
      getItem: (_: string) => JSON.stringify({ a: 'oops' }),
      setItem: () => undefined,
      removeItem: () => undefined,
    };

    const isNumberA = (v: unknown): v is { a: number } => {
      if (typeof v !== 'object' || v === null) return false;
      const obj = v as Record<string, unknown>;
      return typeof obj.a === 'number';
    };

    const result = withStorage(fake, () =>
      loadFromStorage('key', { a: 0 }, isNumberA)
    );

    expect(result).toEqual({ a: 0 });
  });
});
