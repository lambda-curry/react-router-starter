import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { TodoProvider, useTodoStore, getFilteredTodos } from '../todo-context';
import type { Todo } from '@todo-starter/utils';

// Mock crypto.randomUUID for consistent testing
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid'
  }
});

// Test component to access the context
function TestComponent() {
  const {
    todos,
    filter,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    setFilter,
    clearCompleted
  } = useTodoStore();

  return (
    <div>
      <div data-testid="todos-count">{todos.length}</div>
      <div data-testid="filter">{filter}</div>
      <button onClick={() => addTodo('New todo')} data-testid="add-todo" type="button">
        Add Todo
      </button>
      <button 
        onClick={() => todos.length > 0 && toggleTodo(todos[0].id)} 
        data-testid="toggle-todo"
        type="button"
      >
        Toggle First Todo
      </button>
      <button 
        onClick={() => todos.length > 0 && deleteTodo(todos[0].id)} 
        data-testid="delete-todo"
        type="button"
      >
        Delete First Todo
      </button>
      <button 
        onClick={() => todos.length > 0 && updateTodo(todos[0].id, 'Updated text')} 
        data-testid="update-todo"
        type="button"
      >
        Update First Todo
      </button>
      <button onClick={() => setFilter('active')} data-testid="set-filter" type="button">
        Set Active Filter
      </button>
      <button onClick={() => clearCompleted()} data-testid="clear-completed" type="button">
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
      console.error = () => { /* intentionally noop for test */ };
      
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
});
