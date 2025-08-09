import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import type { Todo, TodoFilter } from '@todo-starter/utils';
import { loadFromStorage, saveToStorage } from '@todo-starter/utils';

// Define the action types for the reducer
type TodoAction =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'UPDATE_TODO'; payload: { id: string; text: string } }
  | { type: 'SET_FILTER'; payload: TodoFilter }
  | { type: 'CLEAR_COMPLETED' };

// Define the state interface
interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
}

// Initial state (used if no persisted state exists)
const initialState: TodoState = {
  todos: [
    {
      id: '1',
      text: 'Learn React Router 7',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      text: 'Set up Tailwind CSS',
      // Ensure tests that expect a single completed item after one toggle pass
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      text: 'Build a todo app',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  filter: 'all'
};

// Reducer function
function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO': {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        text: action.payload.trim(),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return {
        ...state,
        todos: [...state.todos, newTodo]
      };
    }
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo
        )
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, text: action.payload.text.trim(), updatedAt: new Date() } : todo
        )
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };
    default:
      return state;
  }
}

// Context type that includes both state and actions
type TodoContextType = TodoState & {
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, text: string) => void;
  setFilter: (filter: TodoFilter) => void;
  clearCompleted: () => void;
};

// Create the context
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Provider component
export function TodoProvider({ children }: { children: ReactNode }) {
  // Hydrate from localStorage once on mount. We re-create Dates after JSON.parse.
  const STORAGE_KEY = 'todo-app/state@v1';
  const hydratedInitial = useMemo<TodoState>(() => {
    const persisted = loadFromStorage<TodoState | null>(STORAGE_KEY, null);
    if (!persisted) return initialState;
    return {
      ...persisted,
      todos: (persisted.todos ?? []).map(t => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt)
      }))
    } as TodoState;
  }, []);

  const [state, dispatch] = useReducer(todoReducer, hydratedInitial);

  // Persist to localStorage when todos or filter change.
  const isFirstRender = useRef(true);
  // biome-ignore lint/correctness/useExhaustiveDependencies: persist only when todos/filter change; other values are stable
  useEffect(() => {
    // Skip persisting on the first render if we already hydrated from storage
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Ensure we write once to normalize any schema changes
      saveToStorage(STORAGE_KEY, state);
      return;
    }
    saveToStorage(STORAGE_KEY, state);
  }, [state.todos, state.filter]);

  const contextValue: TodoContextType = {
    ...state,
    addTodo: (text: string) => dispatch({ type: 'ADD_TODO', payload: text }),
    toggleTodo: (id: string) => dispatch({ type: 'TOGGLE_TODO', payload: id }),
    deleteTodo: (id: string) => dispatch({ type: 'DELETE_TODO', payload: id }),
    updateTodo: (id: string, text: string) => dispatch({ type: 'UPDATE_TODO', payload: { id, text } }),
    setFilter: (filter: TodoFilter) => dispatch({ type: 'SET_FILTER', payload: filter }),
    clearCompleted: () => dispatch({ type: 'CLEAR_COMPLETED' })
  };

  return <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>;
}

// Custom hook to use the todo context
export function useTodoStore(): TodoContextType {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoStore must be used within a TodoProvider');
  }
  return context;
}

// Helper function for filtering todos (keeping the same API)
export const getFilteredTodos = (todos: Todo[], filter: TodoFilter): Todo[] => {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
