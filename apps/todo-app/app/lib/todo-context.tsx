import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Todo, TodoFilter } from '@todo-starter/utils';

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

// Initial state
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
  const [state, dispatch] = useReducer(todoReducer, initialState);

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
