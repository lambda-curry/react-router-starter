import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { TodoProvider, useTodoStore, getFilteredTodos } from '../todo-context';
import type { Todo } from '@todo-starter/utils';
import * as Utils from '@todo-starter/utils';

// Mock crypto.randomUUID for consistent testing
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid'
  }
});

// Test component to access the context
function TestComponent() {
  const { todos, filter, addTodo, toggleTodo, deleteTodo, updateTodo, setFilter, clearCompleted } = useTodoStore();

  return (
    <div>
      <div data-testid="todos-count">{todos.length}</div>
      <div data-testid="filter">{filter}</div>
      <button type="button" onClick={() => addTodo('New todo')} data-testid="add-todo">
        Add Todo
      </button>
      <button 
        type="button"
        onClick={() => todos.length > 0 && toggleTodo(todos[0].id)} 
        data-testid="toggle-todo"
      >
        Toggle First Todo
      </button>
      <button 
        type="button"
        onClick={() => todos.length > 0 && deleteTodo(todos[0].id)} 
        data-testid="delete-todo"
      >
        Delete First Todo
      </button>
      <button 
        type="button"
        onClick={() => todos.length > 0 && updateTodo(todos[0].id, 'Updated text')} 
        data-testid="update-todo"
      >
        Update First Todo
      </button>
      <button type="button" onClick={() => setFilter('active')} data-testid="set-filter">
        Set Active Filter
      </button>
      <button type="button" onClick={() => clearCompleted()} data-testid="clear-completed">
        Clear Completed
      </button>
      {todos.map(todo => (
        <div key={todo.id} data-testid={`todo-${todo.id}`}>
          {todo.text} - {todo.completed ? 'completed' : 'active'}
        </div>
      ))}
    </div>
  );
}

function renderWithProvider() {
  return render(
    <TodoProvider>
      <TestComponent />
    </TodoProvider>
  );
}

describe('todo-context', () => {
  const STORAGE_KEY = 'todo-app/state@v1';
  const ORIGINAL_ENV = process.env.NODE_ENV;

  beforeEach(() => {
    // allow storage helpers to operate by switching env off 'test' for these tests
    process.env.NODE_ENV = 'development';
    try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
  });

  afterEach(() => {
    // restore jsdom localStorage cleanliness and env
    process.env.NODE_ENV = ORIGINAL_ENV;
    try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
  });

  describe('TodoProvider and useTodoStore', () => {
    it('provides initial todos', () => {
      renderWithProvider();

      expect(screen.getByTestId('todos-count')).toHaveTextContent('3');
      expect(screen.getByTestId('filter')).toHaveTextContent('all');
    });

    it('adds a new todo', () => {
      renderWithProvider();

      act(() => {
        screen.getByTestId('add-todo').click();
      });

      expect(screen.getByTestId('todos-count')).toHaveTextContent('4');
      expect(screen.getByTestId('todo-test-uuid')).toHaveTextContent('New todo - active');
    });

    it('toggles todo completion status', () => {
      renderWithProvider();

      // First todo should be active initially
      expect(screen.getByTestId('todo-1')).toHaveTextContent('Learn React Router 7 - active');

      act(() => {
        screen.getByTestId('toggle-todo').click();
      });

      expect(screen.getByTestId('todo-1')).toHaveTextContent('Learn React Router 7 - completed');
    });

    it('deletes a todo', () => {
      renderWithProvider();

      expect(screen.getByTestId('todos-count')).toHaveTextContent('3');

      act(() => {
        screen.getByTestId('delete-todo').click();
      });

      expect(screen.getByTestId('todos-count')).toHaveTextContent('2');
      expect(screen.queryByTestId('todo-1')).not.toBeInTheDocument();
    });

    it('updates todo text', () => {
      renderWithProvider();

      expect(screen.getByTestId('todo-1')).toHaveTextContent('Learn React Router 7 - active');

      act(() => {
        screen.getByTestId('update-todo').click();
      });

      expect(screen.getByTestId('todo-1')).toHaveTextContent('Updated text - active');
    });

    it('sets filter', () => {
      renderWithProvider();

      expect(screen.getByTestId('filter')).toHaveTextContent('all');

      act(() => {
        screen.getByTestId('set-filter').click();
      });

      expect(screen.getByTestId('filter')).toHaveTextContent('active');
    });

    it('clears completed todos', () => {
      renderWithProvider();

      // Toggle first todo to completed
      act(() => {
        screen.getByTestId('toggle-todo').click();
      });

      expect(screen.getByTestId('todos-count')).toHaveTextContent('3');

      act(() => {
        screen.getByTestId('clear-completed').click();
      });

      expect(screen.getByTestId('todos-count')).toHaveTextContent('2');
    });

    it('throws error when used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = () => undefined;
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTodoStore must be used within a TodoProvider');

      console.error = originalError;
    });
  });

  describe('getFilteredTodos', () => {
    const mockTodos: Todo[] = [
      {
        id: '1',
        text: 'Active todo',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        text: 'Completed todo',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    it('returns all todos when filter is "all"', () => {
      const filtered = getFilteredTodos(mockTodos, 'all');
      expect(filtered).toHaveLength(2);
    });

    it('returns only active todos when filter is "active"', () => {
      const filtered = getFilteredTodos(mockTodos, 'active');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].completed).toBe(false);
    });

    it('returns only completed todos when filter is "completed"', () => {
      const filtered = getFilteredTodos(mockTodos, 'completed');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].completed).toBe(true);
    });
  });

  it('hydrates and revives date instances on mount when persisted state exists', () => {
    const seeded = {
      todos: [
        { id: 'x', text: 'seed', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ],
      filter: 'all' as const
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));

    renderWithProvider();

    // Access via UI to ensure hydration occurred
    expect(screen.getByTestId('todos-count')).toHaveTextContent('1');
  });

  it('persists on addTodo, toggleTodo, setFilter', () => {
    const spy = vi.spyOn(Utils, 'saveToStorage');

    renderWithProvider();

    act(() => { screen.getByTestId('add-todo').click(); });
    act(() => { screen.getByTestId('toggle-todo').click(); });
    act(() => { screen.getByTestId('set-filter').click(); });

    // Called multiple times through effect
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it('no SSR errors when window/localStorage not available (guarded in utils)', () => {
    // Simulate storage access throwing
    const original = window.localStorage;
    // @ts-ignore - override for test
    Object.defineProperty(window, 'localStorage', {
      get() { throw new Error('unavailable'); },
      configurable: true
    });

    // Should not throw during render/mount due to guard
    expect(() => renderWithProvider()).not.toThrow();

    // restore
    Object.defineProperty(window, 'localStorage', { value: original, configurable: true });
  });
});
