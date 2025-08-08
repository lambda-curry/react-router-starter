/**
 * Lightweight localStorage helpers with SSR guards and optional runtime validation.
 *
 * Example type guard for a Todo state shape:
 *
 *   interface Todo { id: string; text: string; completed: boolean; createdAt: string | Date; updatedAt: string | Date }
 *   type TodoFilter = 'all' | 'active' | 'completed'
 *   interface TodoState { todos: Todo[]; filter: TodoFilter }
 *
 *   const isTodoArray = (v: unknown): v is Todo[] => Array.isArray(v) && v.every(t =>
 *     t && typeof t === 'object' && typeof (t as any).id === 'string' && typeof (t as any).text === 'string'
 *   );
 *   const isTodoState = (v: unknown): v is TodoState => !!v && typeof v === 'object' &&
 *     isTodoArray((v as any).todos) && ['all', 'active', 'completed'].includes((v as any).filter);
 */

/** SSR-safe check for window.localStorage availability */
export function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/** Save a value to localStorage with JSON serialization. No-op if unavailable. */
export function saveToStorage<T>(key: string, value: T): void {
  if (!isStorageAvailable()) return;
  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
  } catch {
    // swallow errors – callers should treat storage as best-effort
  }
}

/**
 * Load a value from localStorage with JSON.parse and optional runtime validation.
 *
 * If JSON is malformed, storage is unavailable, or validation fails, returns the provided fallback.
 *
 * Acceptance Criteria: `loadFromStorage<T>(key: string, fallback: T, validate?: (v: unknown) => v is T): T`
 */
export function loadFromStorage<T>(
  key: string,
  fallback: T,
  validate?: (v: unknown) => v is T
): T {
  if (!isStorageAvailable()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;

    const parsed: unknown = JSON.parse(raw);

    // If a validator is provided and fails, return fallback
    if (validate && !validate(parsed)) return fallback;

    return parsed as T;
  } catch {
    return fallback; // malformed JSON or other errors → fallback
  }
}

