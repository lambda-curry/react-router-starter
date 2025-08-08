import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AddTodo } from '../add-todo';
import { MemoryRouter } from 'react-router';

// Hoist regex to top-level to satisfy performance rule
const addRegex = /add/i;

describe('AddTodo', () => {
  it('renders input and button', () => {
    const mockOnAdd = vi.fn();
    render(
      <MemoryRouter>
        <AddTodo onAdd={mockOnAdd} />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: addRegex })).toBeInTheDocument();
  });

  it('calls onAdd when form is submitted with text', () => {
    const mockOnAdd = vi.fn();
    render(
      <MemoryRouter>
        <AddTodo onAdd={mockOnAdd} />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: addRegex });

    fireEvent.change(input, { target: { value: 'New todo' } });
    fireEvent.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith('New todo');
  });

  it('clears input after adding todo', () => {
    const mockOnAdd = vi.fn();
    render(
      <MemoryRouter>
        <AddTodo onAdd={mockOnAdd} />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Add a new todo...') as HTMLInputElement;
    const button = screen.getByRole('button', { name: addRegex });

    fireEvent.change(input, { target: { value: 'New todo' } });
    fireEvent.click(button);

    expect(input.value).toBe('');
  });

  it('does not call onAdd with empty text', () => {
    const mockOnAdd = vi.fn();
    render(
      <MemoryRouter>
        <AddTodo onAdd={mockOnAdd} />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: addRegex });
    fireEvent.click(button);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('trims whitespace from input', () => {
    const mockOnAdd = vi.fn();
    render(
      <MemoryRouter>
        <AddTodo onAdd={mockOnAdd} />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: addRegex });

    fireEvent.change(input, { target: { value: '  New todo  ' } });
    fireEvent.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith('New todo');
  });
});
