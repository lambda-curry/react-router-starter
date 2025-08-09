import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadFromStorage, saveToStorage, removeFromStorage } from '@todo-starter/utils';

const KEY = 'test/storage@v1';

// Save original env to restore between tests
const ORIGINAL_ENV = process.env.NODE_ENV;

describe('storage utils', () => {
  function ensureWindowWithLocalStorage() {
    if (typeof window === 'undefined') {
      Object.defineProperty(globalThis, 'window', {
        value: {} as unknown as Window & typeof globalThis,
        configurable: true
      });
    }
    if (!('localStorage' in window)) {
      const store = new Map<string, string>();
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: (k: string) => store.get(k) ?? null,
          setItem: (k: string, v: string) => {
            store.set(k, v);
          },
          removeItem: (k: string) => {
            store.delete(k);
          }
        },
        configurable: true
      });
    }
  }

  beforeEach(() => {
    ensureWindowWithLocalStorage();
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  });

  afterEach(() => {
    process.env.NODE_ENV = ORIGINAL_ENV;
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  });

  it('SSR/test guard disables storage (returns fallback in test env)', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ value: 123 }));
    const result = loadFromStorage(KEY, { value: 999 });
    expect(result).toEqual({ value: 999 });
  });

  it('Malformed JSON returns fallback', () => {
    process.env.NODE_ENV = 'development';
    ensureWindowWithLocalStorage();
    window.localStorage.setItem(KEY, '{not json');
    const result = loadFromStorage(KEY, { good: true });
    expect(result).toEqual({ good: true });
  });

  it('save/remove round-trip behavior works', () => {
    process.env.NODE_ENV = 'development';
    ensureWindowWithLocalStorage();

    const value = { a: 1, b: 'two' };
    saveToStorage(KEY, value);

    const loaded = loadFromStorage<typeof value | null>(KEY, null);
    expect(loaded).toEqual(value);

    removeFromStorage(KEY);
    const afterRemove = loadFromStorage<typeof value | null>(KEY, null);
    expect(afterRemove).toBeNull();
  });

  it('validate guard: rejects invalid shape and returns fallback', () => {
    process.env.NODE_ENV = 'development';
    ensureWindowWithLocalStorage();

    window.localStorage.setItem(KEY, JSON.stringify({ nope: true }));

    const fallback = { ok: true };
    const result = loadFromStorage(
      KEY,
      fallback,
      (v): v is typeof fallback =>
        typeof v === 'object' && v !== null && 'ok' in v && typeof (v as { ok: unknown }).ok === 'boolean'
    );
    expect(result).toEqual(fallback);
  });

  it('validate guard: accepts valid shape', () => {
    process.env.NODE_ENV = 'development';
    ensureWindowWithLocalStorage();

    const value = { ok: true };
    window.localStorage.setItem(KEY, JSON.stringify(value));

    const result = loadFromStorage(
      KEY,
      { ok: false },
      (v): v is typeof value =>
        typeof v === 'object' && v !== null && 'ok' in v && typeof (v as { ok: unknown }).ok === 'boolean'
    );
    expect(result).toEqual(value);
  });
});
