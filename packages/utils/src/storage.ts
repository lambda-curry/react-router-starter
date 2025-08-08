import type { Todo, TodoFilter } from './types';

export const STORAGE_KEY = 'todo-starter:state:v1';

export type PersistedState = {
  todos: Todo[];
  filter: TodoFilter;
};

// Define at top-level for performance
const ISO_DATE_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;

export function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !('localStorage' in window)) return false;
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function saveState(state: PersistedState): void {
  if (!isStorageAvailable()) return;
  const serialized = JSON.stringify(state, (_key, value) => {
    // Serialize Date objects as ISO strings
    if (value instanceof Date) return value.toISOString();
    return value;
  });
  window.localStorage.setItem(STORAGE_KEY, serialized);
}

export function loadState(): PersistedState | null {
  if (!isStorageAvailable()) return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw, (_key, value) => {
      // Revive ISO date strings back to Date objects
      if (typeof value === 'string' && ISO_DATE_REGEX.test(value)) {
        const d = new Date(value);
        if (!Number.isNaN(d.getTime())) return d;
      }
      return value;
    }) as PersistedState;
    return parsed;
  } catch {
    return null;
  }
}
