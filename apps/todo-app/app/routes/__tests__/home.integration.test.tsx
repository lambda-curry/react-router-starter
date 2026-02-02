import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AddTodo } from '../../components/add-todo';
import { TodoItem } from '../../components/todo-item';
import { getFilteredTodos, TodoProvider, useTodoStore } from '../../lib/todo-context';
import { renderWithRouter } from '../../../test/test-utils';

/**
 * Integration test: full flow combining TodoProvider, AddTodo, and filtered list.
 * Exercises multiple units together without requiring the full route tree (which uses Link from react-router and needs the app's router).
 */
function TodoFlow() {
  const { todos, filter, addTodo, toggleTodo, deleteTodo, updateTodo, setFilter } = useTodoStore();
  const filtered = getFilteredTodos(todos, filter);
  return (
    <div>
      <AddTodo onAdd={addTodo} />
      <button type="button" onClick={() => setFilter('active')} aria-label="Filter active">
        Active
      </button>
      {filtered.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />
      ))}
    </div>
  );
}

describe('Todo flow (integration)', () => {
  it('adds a todo and shows it in the list', () => {
    renderWithRouter(
      <TodoProvider>
        <TodoFlow />
      </TodoProvider>
    );

    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'Integration test todo' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Integration test todo')).toBeInTheDocument();
  });

  it('shows initial todos and allows filtering', () => {
    renderWithRouter(
      <TodoProvider>
        <TodoFlow />
      </TodoProvider>
    );

    expect(screen.getByText('Learn React Router 7')).toBeInTheDocument();
    expect(screen.getByText('Set up Tailwind CSS')).toBeInTheDocument();

    const activeFilter = screen.getByRole('button', { name: /filter active/i });
    fireEvent.click(activeFilter);

    expect(screen.getByText('Learn React Router 7')).toBeInTheDocument();
  });
});
