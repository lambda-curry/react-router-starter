import { describe, it, expect } from 'vitest';
import type { Todo, TodoFilter, TodoStore } from './types';

describe('Todo types', () => {
  it('should create a valid Todo object', () => {
    const todo: Todo = {
      id: '1',
      text: 'Test todo',
      completed: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    };

    expect(todo.id).toBe('1');
    expect(todo.text).toBe('Test todo');
    expect(todo.completed).toBe(false);
    expect(todo.createdAt).toBeInstanceOf(Date);
    expect(todo.updatedAt).toBeInstanceOf(Date);
  });

  it('should accept valid TodoFilter values', () => {
    const filters: TodoFilter[] = ['all', 'active', 'completed'];
    
    filters.forEach(filter => {
      expect(['all', 'active', 'completed']).toContain(filter);
    });
  });

  it('should define TodoStore interface correctly', () => {
    // This is a type-only test to ensure the interface compiles
    const mockStore: TodoStore = {
      todos: [],
      filter: 'all',
      addTodo: (text: string) => void 0,
      toggleTodo: (id: string) => void 0,
      deleteTodo: (id: string) => void 0,
      updateTodo: (id: string, text: string) => void 0,
      setFilter: (filter: TodoFilter) => void 0,
      clearCompleted: () => void 0
    };

    expect(mockStore.todos).toEqual([]);
    expect(mockStore.filter).toBe('all');
    expect(typeof mockStore.addTodo).toBe('function');
    expect(typeof mockStore.toggleTodo).toBe('function');
    expect(typeof mockStore.deleteTodo).toBe('function');
    expect(typeof mockStore.updateTodo).toBe('function');
    expect(typeof mockStore.setFilter).toBe('function');
    expect(typeof mockStore.clearCompleted).toBe('function');
  });
});
