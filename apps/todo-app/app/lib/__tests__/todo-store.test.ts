import { describe, it, expect, beforeEach } from 'vitest';
import { useTodoStore, getFilteredTodos } from '../todo-store';
import type { Todo } from '@todo-starter/utils';

// Mock crypto.randomUUID for consistent testing
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid'
  }
});

describe('todo-store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTodoStore.setState({
      todos: [],
      filter: 'all'
    });
  });

  describe('addTodo', () => {
    it('adds a new todo', () => {
      const { addTodo } = useTodoStore.getState();

      addTodo('Test todo');

      const { todos } = useTodoStore.getState();
      expect(todos).toHaveLength(1);
      expect(todos[0].text).toBe('Test todo');
      expect(todos[0].completed).toBe(false);
      expect(todos[0].id).toBe('test-uuid');
    });

    it('trims whitespace from todo text', () => {
      const { addTodo } = useTodoStore.getState();

      addTodo('  Test todo  ');

      const { todos } = useTodoStore.getState();
      expect(todos[0].text).toBe('Test todo');
    });
  });

  describe('toggleTodo', () => {
    it('toggles todo completion status', () => {
      const { addTodo, toggleTodo } = useTodoStore.getState();

      addTodo('Test todo');
      const todoId = useTodoStore.getState().todos[0].id;

      toggleTodo(todoId);

      const { todos } = useTodoStore.getState();
      expect(todos[0].completed).toBe(true);

      toggleTodo(todoId);
      expect(useTodoStore.getState().todos[0].completed).toBe(false);
    });
  });

  describe('deleteTodo', () => {
    it('removes todo from list', () => {
      const { addTodo, deleteTodo } = useTodoStore.getState();

      addTodo('Test todo');
      const todoId = useTodoStore.getState().todos[0].id;

      deleteTodo(todoId);

      const { todos } = useTodoStore.getState();
      expect(todos).toHaveLength(0);
    });
  });

  describe('updateTodo', () => {
    it('updates todo text', () => {
      const { addTodo, updateTodo } = useTodoStore.getState();

      addTodo('Original text');
      const todoId = useTodoStore.getState().todos[0].id;

      updateTodo(todoId, 'Updated text');

      const { todos } = useTodoStore.getState();
      expect(todos[0].text).toBe('Updated text');
    });
  });

  describe('clearCompleted', () => {
    it('removes all completed todos', () => {
      const { addTodo, toggleTodo, clearCompleted } = useTodoStore.getState();

      addTodo('Todo 1');
      addTodo('Todo 2');
      addTodo('Todo 3');

      const todos = useTodoStore.getState().todos;
      toggleTodo(todos[0].id);
      toggleTodo(todos[2].id);

      clearCompleted();

      const remainingTodos = useTodoStore.getState().todos;
      expect(remainingTodos).toHaveLength(1);
      expect(remainingTodos[0].text).toBe('Todo 2');
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
