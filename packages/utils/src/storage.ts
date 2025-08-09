// Minimal localStorage helpers with safe JSON and SSR/test guards

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function getStorage(): StorageLike | null {
  // Allow tests to opt-in to real storage by setting a runtime flag
  const allowInTests =
    typeof globalThis !== 'undefined' &&
    // Use `unknown` and index signature to avoid `any`
    (globalThis as unknown as Record<string, unknown>).__ALLOW_STORAGE_IN_TESTS__ === true;
  // Disable in test environments unless explicitly allowed
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test' && !allowInTests) return null;
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadFromStorage<T>(key: string, fallback: T, validate?: (value: unknown) => value is T): T {
  const storage = getStorage();
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    if (validate && !validate(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write errors (quota, etc.)
  }
}

export function removeFromStorage(key: string): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    // ignore
  }
}
